// Branded one-page yield report PDF. Same react-pdf primitives used
// in StatementDocument, same colour palette, so a landlord who later
// becomes an owner sees a continuous visual identity from lead-magnet
// to monthly statement. Keeps the trust ladder consistent.

import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import { formatUsd, type CalcResult } from "./calc";

const colors = {
  ink: "#1c1917",
  body: "#44403c",
  muted: "#78716c",
  faint: "#e7e5e4",
  inflow: "#1B3A2D", // Goldstay forest
  outflow: "#9b1c1c",
  bg: "#FAF8F3", // Goldstay cream
  gold: "#C9A84C",
};

const styles = StyleSheet.create({
  page: {
    padding: 36,
    fontSize: 10,
    color: colors.body,
    fontFamily: "Helvetica",
    backgroundColor: colors.bg,
  },
  brand: {
    fontSize: 22,
    color: colors.ink,
    fontFamily: "Times-Roman",
  },
  brandDot: { color: colors.gold },
  eyebrow: {
    fontSize: 8,
    color: colors.gold,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginTop: 4,
  },
  h1: {
    fontSize: 18,
    color: colors.ink,
    marginTop: 18,
    fontFamily: "Times-Roman",
  },
  meta: { marginTop: 6, color: colors.muted },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.faint,
    marginVertical: 16,
  },
  twoCol: { flexDirection: "row", gap: 12, marginTop: 6 },
  card: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.faint,
  },
  cardTitle: { fontSize: 11, color: colors.ink, marginBottom: 8 },
  big: { fontSize: 22, color: colors.ink, fontFamily: "Times-Roman" },
  bigGood: { fontSize: 22, color: colors.inflow, fontFamily: "Times-Roman" },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  rowLabel: { color: colors.muted },
  rowVal: { color: colors.body },
  upliftBox: {
    marginTop: 18,
    padding: 16,
    backgroundColor: colors.inflow,
    color: "#ffffff",
    borderRadius: 4,
  },
  upliftLabel: { color: "#dfe9e3", fontSize: 9 },
  upliftAmount: {
    fontSize: 28,
    color: "#ffffff",
    fontFamily: "Times-Roman",
    marginTop: 4,
  },
  small: { fontSize: 8, color: colors.muted, marginTop: 4 },
  footer: {
    position: "absolute",
    left: 36,
    right: 36,
    bottom: 24,
    fontSize: 8,
    color: colors.muted,
    textAlign: "center",
  },
});

type Props = {
  result: CalcResult;
  recipientName?: string;
  neighbourhood?: string;
  generatedAt?: Date;
};

function row(label: string, amount: number) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowVal}>−{formatUsd(amount)}</Text>
    </View>
  );
}

function ScenarioCard({
  title,
  scenario,
  showOta,
  showMgmt,
  netHighlight,
}: {
  title: string;
  scenario: CalcResult["selfManaged"];
  showOta: boolean;
  showMgmt: boolean;
  netHighlight?: boolean;
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      <View style={styles.row}>
        <Text style={styles.rowLabel}>Gross collected</Text>
        <Text style={styles.rowVal}>{formatUsd(scenario.grossCollectedMonthly)}</Text>
      </View>
      {showOta && row("OTA fees (Airbnb etc.)", scenario.otaFees)}
      {showMgmt && row("Goldstay fee", scenario.managementFee)}
      {row("Operating costs", scenario.operatingCosts)}
      {row("Tax", scenario.tax)}
      <View style={[styles.row, { marginTop: 10 }]}>
        <Text style={[styles.rowLabel, { color: colors.ink }]}>
          Net to you / month
        </Text>
        <Text style={netHighlight ? styles.bigGood : styles.big}>
          {formatUsd(scenario.netMonthly)}
        </Text>
      </View>
      <Text style={styles.small}>
        Annualised: {formatUsd(scenario.netAnnual)}
      </Text>
    </View>
  );
}

export function YieldReportDocument({
  result,
  recipientName,
  neighbourhood,
  generatedAt,
}: Props) {
  const cityName = result.city === "nairobi" ? "Nairobi" : "Accra";
  const strategyName =
    result.strategy === "long-term" ? "Long-term let" : "Short-stay / Airbnb";
  const generated = generatedAt ?? new Date();
  const showOta = result.strategy === "short-stay";

  return (
    <Document
      title={`Goldstay yield report — ${cityName}`}
      author="Goldstay"
    >
      <Page size="A4" style={styles.page}>
        <View>
          <Text style={styles.brand}>
            Goldstay<Text style={styles.brandDot}>.</Text>
          </Text>
          <Text style={styles.eyebrow}>Diaspora landlord yield report</Text>
        </View>

        <Text style={styles.h1}>
          {recipientName ? `${recipientName}'s ` : "Your "}
          {result.bedrooms}-bed
          {neighbourhood ? ` in ${neighbourhood}` : ""}, {cityName}
        </Text>
        <Text style={styles.meta}>
          {strategyName} · Indicative monthly market rent:{" "}
          {formatUsd(result.monthlyMarketRentUsd)} · Generated{" "}
          {generated.toISOString().slice(0, 10)}
        </Text>

        <View style={styles.divider} />

        <View style={styles.twoCol}>
          <ScenarioCard
            title="Self-managed today"
            scenario={result.selfManaged}
            showOta={showOta}
            showMgmt={false}
          />
          <ScenarioCard
            title="With Goldstay"
            scenario={result.goldstayManaged}
            showOta={showOta}
            showMgmt={true}
            netHighlight
          />
        </View>

        <View style={styles.upliftBox}>
          <Text style={styles.upliftLabel}>
            Estimated annual uplift with Goldstay
          </Text>
          <Text style={styles.upliftAmount}>
            +{formatUsd(result.annualUplift)} / year
          </Text>
          <Text style={[styles.small, { color: "#dfe9e3", marginTop: 6 }]}>
            That&apos;s {formatUsd(result.monthlyUplift)} more in your pocket
            every single month, after our fee, after tax, after every cost.
          </Text>
        </View>

        <View style={styles.divider} />

        <Text style={[styles.cardTitle, { fontSize: 10 }]}>How we modelled this</Text>
        <Text style={styles.small}>
          Long-term self-managed assumes 85% occupancy and 13% leakage from
          caretaker shrinkage and undocumented repairs. Long-term Goldstay
          assumes 95% occupancy, 5% transparent operating costs, and our 10%
          management fee. Short-stay self-managed assumes 45% occupancy with
          18% operating drag from amateur cleaning and supplies. Short-stay
          Goldstay assumes 65% occupancy with 8% operating drag and our 20%
          management fee. Tax is applied to gross collected at the statutory
          rate ({result.city === "nairobi" ? "7.5% MRI in Kenya" : "8% withholding in Ghana"}).
        </Text>
        <Text style={[styles.small, { marginTop: 8 }]}>
          Numbers are indicative and not a guarantee. Real performance depends
          on the property, the season and the operator. We are happy to share
          the live numbers from comparable units in our managed portfolio on
          a 20-minute call.
        </Text>

        <Text style={styles.footer}>
          Goldstay · A TADCO Company · leads@goldstay.co.ke · goldstay.co.ke
        </Text>
      </Page>
    </Document>
  );
}
