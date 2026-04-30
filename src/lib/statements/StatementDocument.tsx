// Server-rendered PDF template. Imported by the route handler and
// piped through `renderToStream`. Built with @react-pdf/renderer's
// primitives, NOT browser DOM components — using Tailwind classes or
// plain <div>s here will silently fail to render.
//
// Visual style intentionally mirrors the marketing site: stone palette,
// Helvetica (which is what react-pdf's default ships and matches the
// neutral GeistSans aesthetic at the small sizes used in a statement).

import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import type { Statement } from "./aggregate";
import { formatPeriod, type Period } from "./period";
import type { ShortTermPropertyRow } from "./short-term";

const colors = {
  ink: "#1c1917", // stone-900
  body: "#44403c", // stone-700
  muted: "#78716c", // stone-500
  faint: "#e7e5e4", // stone-200
  inflow: "#047857", // emerald-700
  outflow: "#b91c1c", // red-700
  bg: "#fafaf9", // stone-50
};

const styles = StyleSheet.create({
  page: {
    padding: 36,
    fontSize: 10,
    color: colors.body,
    fontFamily: "Helvetica",
  },
  brand: {
    fontSize: 18,
    color: colors.ink,
    marginBottom: 4,
    fontFamily: "Times-Roman",
  },
  brandDot: {
    color: colors.outflow,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.faint,
  },
  metaCol: {
    flexDirection: "column",
  },
  metaLabel: {
    fontSize: 8,
    color: colors.muted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  metaValue: {
    fontSize: 11,
    color: colors.ink,
  },
  sectionTitle: {
    fontSize: 12,
    color: colors.ink,
    marginTop: 18,
    marginBottom: 8,
  },
  totalsTable: {
    borderWidth: 1,
    borderColor: colors.faint,
    borderRadius: 4,
  },
  totalsHeader: {
    flexDirection: "row",
    backgroundColor: colors.bg,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.faint,
  },
  totalsRow: {
    flexDirection: "row",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.faint,
  },
  totalsRowLast: {
    borderBottomWidth: 0,
  },
  cellCurrency: {
    width: "20%",
    fontSize: 10,
    color: colors.ink,
  },
  cellNum: {
    width: "26.6%",
    textAlign: "right",
    fontSize: 10,
  },
  thLabel: {
    fontSize: 8,
    color: colors.muted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  inflow: { color: colors.inflow },
  outflow: { color: colors.outflow },
  net: { color: colors.ink },
  netNegative: { color: colors.outflow },

  propertyBlock: {
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.faint,
  },
  propertyName: {
    fontSize: 11,
    color: colors.ink,
    marginBottom: 6,
  },
  miniTotalsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 8,
    color: colors.muted,
  },
  miniTotal: {
    marginLeft: 14,
    fontSize: 9,
  },

  txTable: {
    marginTop: 4,
  },
  txHeader: {
    flexDirection: "row",
    paddingVertical: 4,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.faint,
  },
  txRow: {
    flexDirection: "row",
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  txDate: { width: "14%", fontSize: 9, color: colors.muted },
  txType: { width: "20%", fontSize: 9, color: colors.body },
  txDesc: { width: "40%", fontSize: 9, color: colors.body },
  txAmount: { width: "26%", textAlign: "right", fontSize: 9 },

  empty: {
    fontSize: 10,
    color: colors.muted,
    fontStyle: "italic",
    marginTop: 6,
  },

  footer: {
    position: "absolute",
    bottom: 24,
    left: 36,
    right: 36,
    textAlign: "center",
    fontSize: 8,
    color: colors.muted,
  },
});

const fmt = (n: number) =>
  n.toLocaleString("en-GB", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export function StatementDocument({
  period,
  owner,
  statement,
  shortTerm,
  generatedAt,
}: {
  period: Period;
  owner: { fullName: string; email: string; preferredCurrency: string };
  statement: Statement;
  shortTerm?: ShortTermPropertyRow[];
  generatedAt: Date;
}) {
  return (
    <Document
      title={`Goldstay statement ${formatPeriod(period)} — ${owner.fullName}`}
      author="Goldstay"
    >
      <Page size="A4" style={styles.page}>
        <Text style={styles.brand}>
          Goldstay<Text style={styles.brandDot}>.</Text>
        </Text>

        <View style={styles.metaRow}>
          <View style={styles.metaCol}>
            <Text style={styles.metaLabel}>Statement period</Text>
            <Text style={styles.metaValue}>{formatPeriod(period)}</Text>
          </View>
          <View style={styles.metaCol}>
            <Text style={styles.metaLabel}>Account</Text>
            <Text style={styles.metaValue}>{owner.fullName}</Text>
            <Text style={[styles.metaValue, { color: colors.muted }]}>
              {owner.email}
            </Text>
          </View>
          <View style={styles.metaCol}>
            <Text style={styles.metaLabel}>Generated</Text>
            <Text style={styles.metaValue}>
              {generatedAt.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Summary</Text>
        {statement.totalsByCurrency.length === 0 ? (
          <Text style={styles.empty}>
            No transactions recorded for this period.
          </Text>
        ) : (
          <View style={styles.totalsTable}>
            <View style={styles.totalsHeader}>
              <Text style={[styles.cellCurrency, styles.thLabel]}>
                Currency
              </Text>
              <Text style={[styles.cellNum, styles.thLabel]}>Inflow</Text>
              <Text style={[styles.cellNum, styles.thLabel]}>Outflow</Text>
              <Text style={[styles.cellNum, styles.thLabel]}>Net</Text>
            </View>
            {statement.totalsByCurrency.map((row, i) => {
              const isLast = i === statement.totalsByCurrency.length - 1;
              return (
                <View
                  key={row.currency}
                  style={[
                    styles.totalsRow,
                    isLast ? styles.totalsRowLast : {},
                  ]}
                >
                  <Text style={styles.cellCurrency}>{row.currency}</Text>
                  <Text style={[styles.cellNum, styles.inflow]}>
                    {fmt(row.inflow)}
                  </Text>
                  <Text style={[styles.cellNum, styles.outflow]}>
                    {fmt(row.outflow)}
                  </Text>
                  <Text
                    style={[
                      styles.cellNum,
                      row.net >= 0 ? styles.net : styles.netNegative,
                    ]}
                  >
                    {fmt(row.net)}
                  </Text>
                </View>
              );
            })}
          </View>
        )}

        {shortTerm && shortTerm.length > 0 ? (
          <>
            <Text style={styles.sectionTitle}>Short-term rentals</Text>
            {shortTerm.map((row) => (
              <View
                key={`${row.propertyId}-${row.currency}`}
                style={styles.propertyBlock}
              >
                <Text style={styles.propertyName}>
                  {row.propertyName}
                  {"  "}
                  <Text style={{ color: colors.muted, fontSize: 9 }}>
                    {row.bookings} bookings · {row.nights} nights ·{" "}
                    {row.currency}
                  </Text>
                </Text>
                <View style={styles.txTable}>
                  <ShortTermLine
                    label="Gross from guests"
                    amount={row.gross}
                    sign="+"
                  />
                  {row.otaFees > 0 ? (
                    <ShortTermLine
                      label="OTA fees (Airbnb / Booking.com / Vrbo)"
                      amount={row.otaFees}
                      sign="-"
                    />
                  ) : null}
                  {row.cleaning > 0 ? (
                    <ShortTermLine
                      label="Cleaning"
                      amount={row.cleaning}
                      sign="-"
                    />
                  ) : null}
                  {row.goldstayCommission > 0 ? (
                    <ShortTermLine
                      label={`Goldstay commission${
                        row.gross > 0
                          ? ` (${Math.round(
                              (row.goldstayCommission / row.gross) * 100,
                            )}%)`
                          : ""
                      }`}
                      amount={row.goldstayCommission}
                      sign="-"
                    />
                  ) : null}
                  <ShortTermLine
                    label="Net payout"
                    amount={row.payout}
                    sign="="
                    bold
                  />
                </View>
              </View>
            ))}
          </>
        ) : null}

        <Text style={styles.sectionTitle}>By property</Text>
        {statement.propertyGroups.length === 0 ? (
          <Text style={styles.empty}>No activity to break down.</Text>
        ) : (
          statement.propertyGroups.map((g) => (
            <View key={g.propertyId} style={styles.propertyBlock}>
              <Text style={styles.propertyName}>{g.propertyName}</Text>

              <View style={styles.miniTotalsRow}>
                {g.totalsByCurrency.map((row) => (
                  <Text key={row.currency} style={styles.miniTotal}>
                    {row.currency} net{" "}
                    <Text
                      style={
                        row.net >= 0 ? styles.net : styles.netNegative
                      }
                    >
                      {fmt(row.net)}
                    </Text>
                  </Text>
                ))}
              </View>

              <View style={styles.txTable}>
                <View style={styles.txHeader}>
                  <Text style={[styles.txDate, styles.thLabel]}>Date</Text>
                  <Text style={[styles.txType, styles.thLabel]}>Type</Text>
                  <Text style={[styles.txDesc, styles.thLabel]}>Detail</Text>
                  <Text style={[styles.txAmount, styles.thLabel]}>Amount</Text>
                </View>
                {g.transactions.map((t) => {
                  const amt =
                    typeof t.amount === "string"
                      ? Number(t.amount)
                      : t.amount;
                  return (
                    <View key={t.id} style={styles.txRow}>
                      <Text style={styles.txDate}>
                        {t.occurredOn.toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                        })}
                      </Text>
                      <Text style={styles.txType}>
                        {t.type.replace(/_/g, " ")}
                      </Text>
                      <Text style={styles.txDesc}>
                        {[t.description, t.tenantName, t.reference]
                          .filter(Boolean)
                          .join(" · ") || "—"}
                      </Text>
                      <Text
                        style={[
                          styles.txAmount,
                          t.direction === "INFLOW"
                            ? styles.inflow
                            : styles.outflow,
                        ]}
                      >
                        {t.direction === "INFLOW" ? "+" : "−"}
                        {fmt(amt)} {t.currency}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          ))
        )}

        <Text style={styles.footer}>
          Goldstay · Premium property management in Nairobi · Questions?
          hello@goldstay.co.ke
        </Text>
      </Page>
    </Document>
  );
}

function ShortTermLine({
  label,
  amount,
  sign,
  bold,
}: {
  label: string;
  amount: number;
  sign: "+" | "-" | "=";
  bold?: boolean;
}) {
  const isOut = sign === "-";
  const isTotal = sign === "=";
  return (
    <View style={styles.txRow}>
      <Text
        style={[
          styles.txDesc,
          bold ? { color: colors.ink } : {},
        ]}
      >
        {label}
      </Text>
      <Text
        style={[
          styles.txAmount,
          isTotal
            ? { color: colors.ink }
            : isOut
              ? styles.outflow
              : styles.inflow,
          bold ? { fontFamily: "Helvetica-Bold" } : {},
        ]}
      >
        {sign === "=" ? "= " : isOut ? "− " : "+ "}
        {fmt(amount)}
      </Text>
    </View>
  );
}
