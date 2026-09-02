// React-PDF template for the executed Goldstay management agreement.
// Mirrors the HTML view at /client/agreements/[id] section-for-section,
// then appends a signature page with the captured forensic record.
//
// Style notes: same stone palette and Times-Roman / Helvetica pairing
// as StatementDocument so the two documents look like they came from
// the same company. Page break is automatic; @react-pdf reflows on
// overflow.

import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import type { SigningCapacity } from "@prisma/client";
import type { AgreementSection } from "./text";
import {
  SIGNING_CAPACITY_ATTESTATION,
  SIGNING_CAPACITY_LABEL,
} from "@/lib/signing-capacity";
import { MANAGER, MANAGER_SIGNING_NAME } from "./manager";

const colors = {
  ink: "#1c1917",
  body: "#44403c",
  muted: "#78716c",
  faint: "#e7e5e4",
  bg: "#fafaf9",
  accent: "#b91c1c",
};

const styles = StyleSheet.create({
  page: {
    padding: 48,
    paddingBottom: 56,
    fontSize: 10.5,
    color: colors.body,
    fontFamily: "Helvetica",
    lineHeight: 1.5,
  },
  brand: {
    fontSize: 18,
    color: colors.ink,
    fontFamily: "Times-Roman",
    marginBottom: 4,
  },
  brandDot: { color: colors.accent },
  title: {
    fontSize: 18,
    color: colors.ink,
    fontFamily: "Times-Roman",
    marginTop: 18,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 11,
    color: colors.muted,
    marginBottom: 18,
  },

  termsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    borderWidth: 1,
    borderColor: colors.faint,
    borderRadius: 4,
    backgroundColor: colors.bg,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 22,
  },
  termCell: {
    width: "25%",
    paddingRight: 8,
  },
  termLabel: {
    fontSize: 8,
    color: colors.muted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  termValue: {
    fontSize: 11,
    color: colors.ink,
    fontFamily: "Times-Roman",
  },

  sectionHeading: {
    fontSize: 11,
    color: colors.ink,
    marginTop: 12,
    marginBottom: 4,
    fontFamily: "Helvetica-Bold",
  },
  sectionBody: {
    fontSize: 10,
    color: colors.body,
    marginBottom: 6,
  },

  // Schedule tables. Bordered rows rather than a full grid so a
  // Schedule 1 row whose detail runs to four lines still reads as one
  // item, and so a page break through the table doesn't orphan a
  // header row.
  scheduleRow: {
    flexDirection: "row",
    borderTopWidth: 0.5,
    borderTopColor: colors.faint,
    paddingVertical: 6,
  },
  scheduleLabel: {
    width: "32%",
    paddingRight: 10,
    fontSize: 9.5,
    color: colors.ink,
    fontFamily: "Helvetica-Bold",
  },
  scheduleValue: {
    width: "68%",
    fontSize: 9.5,
    color: colors.body,
  },
  bulletRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  bulletGlyph: {
    width: 12,
    fontSize: 10,
    color: colors.muted,
  },
  bulletText: {
    flex: 1,
    fontSize: 10,
    color: colors.body,
  },

  signaturePage: {
    padding: 48,
    fontSize: 10.5,
    color: colors.body,
    fontFamily: "Helvetica",
  },
  sigTitle: {
    fontSize: 14,
    color: colors.ink,
    fontFamily: "Times-Roman",
    marginBottom: 12,
  },
  sigBlock: {
    borderWidth: 1,
    borderColor: colors.faint,
    padding: 16,
    borderRadius: 4,
    marginBottom: 18,
  },
  sigName: {
    fontSize: 18,
    color: colors.ink,
    fontFamily: "Times-Italic",
    marginBottom: 4,
  },
  sigCaption: {
    fontSize: 9,
    color: colors.muted,
  },

  forensicLabel: {
    fontSize: 8,
    color: colors.muted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  forensicValue: {
    fontSize: 10,
    color: colors.body,
    marginBottom: 8,
  },

  footer: {
    position: "absolute",
    bottom: 24,
    left: 48,
    right: 48,
    textAlign: "center",
    fontSize: 8,
    color: colors.muted,
  },
});

export type AgreementPdfInput = {
  agreementId: string;
  clientName: string;
  clientEmail: string;
  propertyDisplayName: string;
  governingLaw: string;
  termMonths: number;
  commissionPct: string;
  noticePeriodDays: number;
  earlyExitFeeFormatted: string;
  sections: AgreementSection[];
  // Which contract this is, and the exact clause-set version it was
  // accepted under. Clause 12.3 of the short-let agreement requires
  // the acceptance record to identify the version, and it is what lets
  // us prove later which words the client actually saw.
  title: string;
  templateVersion: string;
  reference: string | null;
  // Printed under the client's signature so the executed copy records
  // the capacity they accepted in, not just their name.
  signingCapacity: SigningCapacity;
  signedAt: Date;
  signedByName: string;
  signedByIp: string | null;
  signedByUserAgent: string | null;
  acceptedByUserId: string | null;
  acceptanceReference: string | null;
};

export function AgreementDocument(input: AgreementPdfInput) {
  return (
    <Document
      title={`GoldStay ${input.title.toLowerCase()}: ${input.propertyDisplayName}`}
      author={MANAGER_SIGNING_NAME}
      subject={input.title}
    >
      <Page size="A4" style={styles.page}>
        <Text style={styles.brand}>
          Goldstay<Text style={styles.brandDot}>.</Text>
        </Text>
        <Text style={styles.title}>{input.title}</Text>
        <Text style={styles.subtitle}>
          {input.propertyDisplayName} · governed by {input.governingLaw}
          {input.reference ? ` · ${input.reference}` : ""}
        </Text>

        <View style={styles.termsRow}>
          <Term label="Term" value={`${input.termMonths} months`} />
          <Term label="Commission" value={input.commissionPct} />
          <Term label="Notice" value={`${input.noticePeriodDays} days`} />
          <Term label="Early-exit fee" value={input.earlyExitFeeFormatted} />
        </View>

        {input.sections.map((s) => (
          // wrap={false} keeps a clause on one page where it fits.
          // Schedules are the exception: Schedule 1 is taller than an
          // A4 page, so forcing it to stay whole would push it off the
          // document entirely.
          <View key={s.heading} wrap={Boolean(s.rows?.length)}>
            <Text style={styles.sectionHeading}>{s.heading}</Text>
            {s.body.map((p, i) => (
              <Text key={i} style={styles.sectionBody}>
                {p}
              </Text>
            ))}
            {s.rows?.map((row) => (
              <View key={row.label} style={styles.scheduleRow} wrap={false}>
                <Text style={styles.scheduleLabel}>{row.label}</Text>
                <View style={styles.scheduleValue}>
                  {row.value.map((line, i) => (
                    <Text key={i}>{line}</Text>
                  ))}
                </View>
              </View>
            ))}
            {s.bullets?.map((b, i) => (
              <View key={i} style={styles.bulletRow} wrap={false}>
                <Text style={styles.bulletGlyph}>•</Text>
                <Text style={styles.bulletText}>{b}</Text>
              </View>
            ))}
          </View>
        ))}

        <Text style={styles.footer}>
          {MANAGER_SIGNING_NAME} · hello@goldstay.co.ke
        </Text>
      </Page>

      <Page size="A4" style={styles.signaturePage}>
        <Text style={styles.brand}>
          Goldstay<Text style={styles.brandDot}>.</Text>
        </Text>
        <Text style={styles.sigTitle}>Execution</Text>

        <View style={styles.sigBlock}>
          <Text style={styles.forensicLabel}>For the Manager</Text>
          <Text style={styles.sigName}>{MANAGER_SIGNING_NAME}</Text>
          <Text style={styles.sigCaption}>
            Company no. {MANAGER.companyNumber} ·{" "}
            {MANAGER.registeredOffice}
          </Text>
          <Text style={styles.sigCaption}>
            Authorised representative · countersigned electronically on
            {" "}
            {input.signedAt.toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </Text>
        </View>

        <View style={styles.sigBlock}>
          <Text style={styles.forensicLabel}>For the Client</Text>
          <Text style={styles.sigName}>{input.signedByName}</Text>
          <Text style={styles.sigCaption}>
            Accepted through the GoldStay platform at{" "}
            {input.signedAt.toLocaleString("en-GB", {
              dateStyle: "long",
              timeStyle: "short",
              timeZone: "UTC",
            })}{" "}
            UTC.
          </Text>
        </View>

        <Text style={styles.sigTitle}>Platform acceptance record</Text>

        <Text style={styles.forensicLabel}>Client capacity</Text>
        <Text style={styles.forensicValue}>
          {SIGNING_CAPACITY_LABEL[input.signingCapacity]}
        </Text>
        <Text style={styles.sigCaption}>
          Confirmed on acceptance: “
          {SIGNING_CAPACITY_ATTESTATION[input.signingCapacity]}”
        </Text>

        <Text style={styles.forensicLabel}>Agreement version</Text>
        <Text style={styles.forensicValue}>
          {input.templateVersion}
          {input.reference ? ` · ${input.reference}` : ""}
        </Text>

        <Text style={styles.forensicLabel}>Account email</Text>
        <Text style={styles.forensicValue}>{input.clientEmail}</Text>

        {input.acceptedByUserId ? (
          <>
            <Text style={styles.forensicLabel}>Account user ID</Text>
            <Text style={styles.forensicValue}>{input.acceptedByUserId}</Text>
          </>
        ) : null}

        {input.acceptanceReference ? (
          <>
            <Text style={styles.forensicLabel}>
              Acceptance receipt reference
            </Text>
            <Text style={styles.forensicValue}>
              {input.acceptanceReference}
            </Text>
          </>
        ) : null}

        <Text style={styles.forensicLabel}>Agreement ID</Text>
        <Text style={styles.forensicValue}>{input.agreementId}</Text>

        {input.signedByIp ? (
          <>
            <Text style={styles.forensicLabel}>Originating IP address</Text>
            <Text style={styles.forensicValue}>{input.signedByIp}</Text>
          </>
        ) : null}

        {input.signedByUserAgent ? (
          <>
            <Text style={styles.forensicLabel}>User agent</Text>
            <Text style={styles.forensicValue}>{input.signedByUserAgent}</Text>
          </>
        ) : null}

        <Text style={styles.sectionBody}>
          The Client accepted this Agreement through the GoldStay
          platform while authenticated to the account shown above. This
          electronic acceptance record is admissible under the Kenya
          Business Laws (Amendment) Act and the Ghana Electronic
          Transactions Act 2008. Both parties consent to its use as
          evidence of agreement.
        </Text>

        <Text style={styles.footer}>
          {MANAGER_SIGNING_NAME} · hello@goldstay.co.ke
        </Text>
      </Page>
    </Document>
  );
}

function Term({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.termCell}>
      <Text style={styles.termLabel}>{label}</Text>
      <Text style={styles.termValue}>{value}</Text>
    </View>
  );
}
