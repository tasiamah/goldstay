// React-PDF template for the executed Goldstay management agreement.
// Mirrors the HTML view at /owner/agreements/[id] section-for-section,
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
import type { AgreementSection } from "./text";

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
  ownerName: string;
  ownerEmail: string;
  propertyDisplayName: string;
  governingLaw: string;
  termMonths: number;
  commissionPct: string;
  noticePeriodDays: number;
  earlyExitFeeFormatted: string;
  sections: AgreementSection[];
  signedAt: Date;
  signedByName: string;
  signedByIp: string | null;
  signedByUserAgent: string | null;
};

export function AgreementDocument(input: AgreementPdfInput) {
  return (
    <Document
      title={`Goldstay management agreement — ${input.propertyDisplayName}`}
      author="Goldstay"
      subject="Property management agreement"
    >
      <Page size="A4" style={styles.page}>
        <Text style={styles.brand}>
          Goldstay<Text style={styles.brandDot}>.</Text>
        </Text>
        <Text style={styles.title}>Property management agreement</Text>
        <Text style={styles.subtitle}>
          {input.propertyDisplayName} · governed by {input.governingLaw}
        </Text>

        <View style={styles.termsRow}>
          <Term label="Term" value={`${input.termMonths} months`} />
          <Term label="Commission" value={input.commissionPct} />
          <Term label="Notice" value={`${input.noticePeriodDays} days`} />
          <Term label="Early-exit fee" value={input.earlyExitFeeFormatted} />
        </View>

        {input.sections.map((s) => (
          <View key={s.heading} wrap={false}>
            <Text style={styles.sectionHeading}>{s.heading}</Text>
            {s.body.map((p, i) => (
              <Text key={i} style={styles.sectionBody}>
                {p}
              </Text>
            ))}
          </View>
        ))}

        <Text style={styles.footer}>
          Goldstay · Premium property management ·
          hello@goldstay.co.ke
        </Text>
      </Page>

      <Page size="A4" style={styles.signaturePage}>
        <Text style={styles.brand}>
          Goldstay<Text style={styles.brandDot}>.</Text>
        </Text>
        <Text style={styles.sigTitle}>Signatures</Text>

        <View style={styles.sigBlock}>
          <Text style={styles.forensicLabel}>For Goldstay</Text>
          <Text style={styles.sigName}>Goldstay Limited</Text>
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
          <Text style={styles.forensicLabel}>For the Owner</Text>
          <Text style={styles.sigName}>{input.signedByName}</Text>
          <Text style={styles.sigCaption}>
            Click-to-accept signature captured through the Goldstay
            portal at{" "}
            {input.signedAt.toLocaleString("en-GB", {
              dateStyle: "long",
              timeStyle: "short",
              timeZone: "UTC",
            })}{" "}
            UTC.
          </Text>
        </View>

        <Text style={styles.forensicLabel}>Account email</Text>
        <Text style={styles.forensicValue}>{input.ownerEmail}</Text>

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
          This electronic signature record is admissible under the Kenya
          Business Laws (Amendment) Act and the Ghana Electronic
          Transactions Act 2008. Both parties consent to its use as
          evidence of agreement.
        </Text>

        <Text style={styles.footer}>
          Goldstay · Premium property management ·
          hello@goldstay.co.ke
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
