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
import { splitByPayoutDirection, type Statement } from "./aggregate";
import type { PayoutInPreferred } from "./assemble";
import { formatPeriod, type Period } from "./period";
import type { ShortTermPropertyRow } from "./short-term";
import {
  formatClientDisplayName,
  formatClientSecondaryName,
} from "@/lib/format-client";

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

  // The payout, stated once at the top in the size it deserves. It is
  // the only figure the owner opened the file for, and it used to be
  // the last thing on the page, reached by reading down a column of
  // deductions. Same number, read first instead of last.
  heroBox: {
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.faint,
    borderRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 6,
  },
  heroLabel: {
    fontSize: 8,
    color: colors.muted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  heroAmount: {
    fontSize: 22,
    color: colors.ink,
    fontFamily: "Times-Roman",
  },
  heroRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  heroOwed: {
    fontSize: 9,
    color: colors.outflow,
    marginTop: 4,
  },
  heroConverted: {
    fontSize: 10,
    color: colors.body,
    marginTop: 3,
  },

  // Deductions are grouped by who actually took the money. Listed flat
  // in one column, Airbnb's 24% and our 20% read as a single ~50% bite
  // by the manager, which is not what happened.
  groupLabel: {
    fontSize: 8,
    color: colors.muted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: 8,
    marginBottom: 2,
    paddingHorizontal: 4,
  },
  groupNote: {
    fontSize: 8,
    color: colors.muted,
    paddingHorizontal: 4,
    marginTop: 1,
    marginBottom: 2,
  },
  subTotalRow: {
    flexDirection: "row",
    paddingVertical: 4,
    paddingHorizontal: 4,
    borderTopWidth: 1,
    borderTopColor: colors.faint,
    marginTop: 2,
  },
  payoutRow: {
    flexDirection: "row",
    paddingVertical: 7,
    paddingHorizontal: 4,
    borderTopWidth: 1.5,
    borderTopColor: colors.ink,
    marginTop: 4,
  },

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
  client,
  statement,
  shortTerm,
  payoutInPreferred,
  generatedAt,
}: {
  period: Period;
  client: {
    fullName: string;
    companyName?: string | null;
    email: string;
    preferredCurrency: string;
  };
  statement: Statement;
  shortTerm?: ShortTermPropertyRow[];
  payoutInPreferred?: PayoutInPreferred | null;
  generatedAt: Date;
}) {
  const clientPrimary = formatClientDisplayName(client);
  const clientSecondary = formatClientSecondaryName(client);
  const { paid: payoutCurrencies, owed: owedCurrencies } =
    splitByPayoutDirection(statement.totalsByCurrency);
  return (
    <Document
      title={`Goldstay statement ${formatPeriod(period)} — ${clientPrimary}`}
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
            <Text style={styles.metaValue}>{clientPrimary}</Text>
            {clientSecondary ? (
              <Text style={[styles.metaValue, { color: colors.body }]}>
                {clientSecondary}
              </Text>
            ) : null}
            <Text style={[styles.metaValue, { color: colors.muted }]}>
              {client.email}
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

        {/* The answer, before the working. Everything below this is
            the owner checking a number they have already been told,
            which is a different and much calmer act than totting up
            deductions to discover it. */}
        {statement.totalsByCurrency.length > 0 ? (
          <View style={styles.heroBox}>
            <Text style={styles.heroLabel}>
              {payoutCurrencies.length > 0
                ? `Your payout for ${formatPeriod(period)}`
                : `${formatPeriod(period)}`}
            </Text>
            {payoutCurrencies.map((row) => (
              <View key={row.currency} style={styles.heroRow}>
                <Text style={styles.heroAmount}>
                  {row.currency} {fmt(row.net)}
                </Text>
              </View>
            ))}

            {/* The same money in the currency their account is set
                to, with the rate used spelled out. We carry the
                spread on this conversion, so the rate is ours — and
                therefore has to be visible rather than implied. */}
            {payoutInPreferred ? (
              <Text style={styles.heroConverted}>
                {payoutInPreferred.currency} {fmt(payoutInPreferred.amount)}{" "}
                at {payoutInPreferred.rates.map((r) => r.label).join(", ")}
              </Text>
            ) : null}
            {/* A currency the property earned nothing in nets
                negative: costs we paid in shillings on a unit that
                bills guests in dollars. Printing that as "your payout
                — KES −6,000" is alarming and untrue. It is a balance
                to settle, so it says so. */}
            {owedCurrencies.map((row) => (
              <Text key={row.currency} style={styles.heroOwed}>
                Plus {row.currency} {fmt(Math.abs(row.net))} to settle
                {payoutCurrencies.length > 0
                  ? " — costs we paid in " + row.currency
                  : ""}
              </Text>
            ))}
          </View>
        ) : null}

        {/* Short-stay first. It is the section shaped like the
            question the client is asking — what am I being paid —
            running gross down through each deduction to the net
            payout in bold. The inflow/outflow summary below it is
            the bookkeeping view, which is the right detail to offer
            second rather than the first thing they read. */}
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
                    label="Guest payments"
                    amount={row.gross}
                    sign="+"
                  />

                  {/* Airbnb's cut is taken at source: it never reaches
                      a Goldstay account. Saying so, and showing what
                      did arrive, is the difference between a fee the
                      owner can place and one they assume is ours. */}
                  {row.otaFees > 0 ? (
                    <>
                      <Text style={styles.groupLabel}>Taken by Airbnb</Text>
                      <ShortTermLine
                        label="Host service fee & tax withheld at source"
                        amount={row.otaFees}
                        sign="-"
                      />
                      <ShortTermSubTotal
                        label="Received from Airbnb"
                        amount={row.gross - row.otaFees}
                      />
                    </>
                  ) : null}

                  {row.cleaning > 0 || row.expenseItems.length > 0 ? (
                    <>
                      <Text style={styles.groupLabel}>
                        Running the property
                      </Text>
                      {row.cleaning > 0 ? (
                        <ShortTermLine
                          label={
                            row.bookings > 0
                              ? `Cleaning (${row.bookings} ${
                                  row.bookings === 1 ? "turnover" : "turnovers"
                                })`
                              : "Cleaning"
                          }
                          amount={row.cleaning}
                          sign="-"
                        />
                      ) : null}
                      {/* One line per cost, named. A lump sum labelled
                          "Costs on the property" tells the owner money
                          left without saying what for. */}
                      {row.expenseItems.map((item, i) => (
                        <ShortTermLine
                          key={`${item.label}-${i}`}
                          label={item.label}
                          amount={item.amount}
                          sign="-"
                        />
                      ))}
                      {row.expenseItems.length > 0 ? (
                        <Text style={styles.groupNote}>
                          Billed at what we were charged. We add no markup.
                        </Text>
                      ) : null}
                    </>
                  ) : null}

                  {row.goldstayCommission > 0 ? (
                    <>
                      <Text style={styles.groupLabel}>Goldstay</Text>
                      <ShortTermLine
                        label={`Management fee${
                          row.gross > 0
                            ? ` (${Math.round(
                                (row.goldstayCommission / row.gross) * 100,
                              )}% of guest payments)`
                            : ""
                        }`}
                        amount={row.goldstayCommission}
                        sign="-"
                      />
                    </>
                  ) : null}

                  <ShortTermPayout label="Your payout" amount={row.payout} />
                </View>
              </View>
            ))}
          </>
        ) : null}

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
                          .join(" · ") || "No description"}
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

// What actually landed, after the channel took its cut and before
// anyone at Goldstay touched it.
function ShortTermSubTotal({
  label,
  amount,
}: {
  label: string;
  amount: number;
}) {
  return (
    <View style={styles.subTotalRow}>
      <Text style={[styles.txDesc, { color: colors.ink }]}>{label}</Text>
      <Text style={[styles.txAmount, { color: colors.ink }]}>
        {fmt(amount)}
      </Text>
    </View>
  );
}

function ShortTermPayout({
  label,
  amount,
}: {
  label: string;
  amount: number;
}) {
  return (
    <View style={styles.payoutRow}>
      <Text
        style={[
          styles.txDesc,
          { color: colors.ink, fontFamily: "Helvetica-Bold", fontSize: 11 },
        ]}
      >
        {label}
      </Text>
      <Text
        style={[
          styles.txAmount,
          { color: colors.ink, fontFamily: "Helvetica-Bold", fontSize: 11 },
        ]}
      >
        {fmt(amount)}
      </Text>
    </View>
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
