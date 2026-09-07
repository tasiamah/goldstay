// /agreements/shared/[token] — a read-only copy of one management
// agreement, for somebody who is not the client.
//
// Built for the case where a client asks us to let their advocate read
// the contract before they accept it. See the AgreementShare comment
// in prisma/schema.prisma for why that could not simply be a second
// email on the account: the client's own agreement email carries a
// magic link that signs the clicker in as them, so copying an address
// on it would grant the whole portal and the accept button, and
// acceptance is session-based precisely so the record evidences who
// accepted.
//
// So this route deliberately has no accept path. It renders the same
// contract text from the same stored template as the client's own
// page, and stops. There is no form, no action imported, and no link
// into /client. The only write it performs is the view counter.
//
// The token is the only credential. It is scoped to one agreement,
// expires, and is revocable, and the route is noindex via the layout
// and excluded in robots.ts.

import { notFound } from "next/navigation";
import { AgreementSectionBody } from "@/components/AgreementSectionBody";
import {
  AGREEMENT_TEMPLATE_TITLE,
  renderAgreement,
} from "@/lib/agreements/template";
import {
  AGREEMENT_STATUS_LABEL,
  agreementTermSummary,
  formatCommissionPct,
  formatMoney,
} from "@/lib/agreements/format";
import {
  consumeShareToken,
  findShareForDisplay,
  shareUsability,
} from "@/lib/agreements/share";
import { formatPropertyDisplayName } from "@/lib/format-property";

export const dynamic = "force-dynamic";

export default async function SharedAgreementPage({
  params,
}: {
  params: { token: string };
}) {
  const share = await consumeShareToken(params.token);

  // Not usable, but we may still be able to say why. A recipient
  // whose link has expired should be told to ask the client for a
  // fresh one rather than shown a 404 that reads like our mistake.
  // An unrecognised token gets notFound(), because there is nothing
  // to explain and no reason to confirm that some other token exists.
  if (!share) {
    const known = await findShareForDisplay(params.token);
    if (!known) notFound();
    const reason = shareUsability(known);
    return (
      <ClosedLink
        reason={reason.usable ? "expired" : reason.reason}
        clientName={known.agreement.property.client.fullName}
      />
    );
  }

  const { agreement } = share;
  const { property } = agreement;
  const { client } = property;

  const isShortTerm = property.propertyType === "SHORT_TERM";
  const currency = agreement.earlyExitFeeCurrency;
  const money = (value: typeof agreement.startupCostsBudget) =>
    value === null ? null : formatMoney(value.toString(), currency);

  const earlyExitFeeFormatted = formatMoney(
    agreement.earlyExitFee.toString(),
    currency,
  );
  const commissionPct = formatCommissionPct(agreement.commissionRate.toString());
  const propertyDisplayName = formatPropertyDisplayName(
    property.name,
    property.unitNumber,
  );
  const agreementTitle = AGREEMENT_TEMPLATE_TITLE[agreement.template];

  // Same call, same arguments, same stored template as the client's
  // own page. The recipient has to be reading the identical document
  // for their advice on it to be worth anything.
  const sections = renderAgreement({
    template: agreement.template,
    clientName: client.fullName,
    clientCompany: client.companyName,
    clientIdNumber: client.companyName
      ? client.companyRegistrationNumber
      : client.idNumber,
    clientKraPin: client.kraPin,
    clientAddress: client.address,
    propertyName: propertyDisplayName,
    propertyAddress: property.address,
    propertyCity: property.city,
    bedrooms: property.bedrooms,
    maxOccupancy: property.maxOccupancy,
    isShortTerm,
    signingCapacity: agreement.signingCapacity,
    governingLaw: agreement.governingLaw,
    termMonths: agreement.termMonths,
    commissionPct,
    earlyExitFeeFormatted,
    noticePeriodDays: agreement.noticePeriodDays,
    payoutCurrency: client.preferredCurrency,
    startupCostsBudgetFormatted: money(agreement.startupCostsBudget),
    operatingReserveFormatted: money(agreement.operatingReserve),
    reference: agreement.reference,
    startDate: agreement.sentAt ?? agreement.generatedAt,
    launchDate: property.launchedAt,
  });

  const recipient = share.recipientName || share.recipientEmail;
  const isSigned = agreement.status === "SIGNED";

  return (
    <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8">
      <header>
        <p className="font-serif text-lg">
          Goldstay<span className="text-gold-700">.</span>
        </p>
        <h1 className="mt-8 font-serif text-2xl sm:text-3xl">
          {agreementTitle}
        </h1>
        <p className="mt-2 text-sm text-charcoal/60">
          {propertyDisplayName} · {property.city}
          {agreement.reference ? ` · ${agreement.reference}` : ""}
        </p>
      </header>

      {/* States plainly who this was shared with, what they can do
          with it, and who cannot be reached through it. The recipient
          is a professional reading a contract for a client: the first
          thing they need to know is whether this is the executed copy
          or a draft, and whether they are being asked to sign it. */}
      <section className="mt-8 rounded-lg border border-gold-500/40 bg-gold-500/5 p-5">
        <p className="text-sm text-charcoal/85">
          <span className="font-medium">{client.fullName}</span> asked us
          to share this agreement with{" "}
          <span className="font-medium">{recipient}</span>
          {share.recipientRelationship
            ? ` (${share.recipientRelationship})`
            : ""}{" "}
          for review. This is a read-only copy of the agreement as it
          currently stands.
        </p>
        <p className="mt-3 text-sm text-charcoal/70">
          {isSigned
            ? `It was accepted by ${agreement.signedByName ?? client.fullName} and is the executed contract.`
            : `It has not been accepted yet. Only ${client.fullName} can accept it, and only from their own signed-in Goldstay portal, so there is nothing to sign on this page.`}
        </p>
        <p className="mt-3 text-xs text-charcoal/50">
          Status {AGREEMENT_STATUS_LABEL[agreement.status].toLowerCase()} ·
          link valid until{" "}
          {share.expiresAt.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
          . {client.fullName} can withdraw access at any time.
        </p>
      </section>

      <section className="mt-8 rounded-lg border border-charcoal/10 bg-white p-6">
        <h2 className="text-base font-medium">Commercial terms</h2>
        <p className="mt-1 text-sm text-charcoal/55">
          The terms specific to this property.
        </p>
        <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4 text-sm sm:grid-cols-4">
          {agreementTermSummary({
            template: agreement.template,
            termMonths: agreement.termMonths,
            commissionPct,
            noticePeriodDays: agreement.noticePeriodDays,
            earlyExitFeeFormatted,
          }).map((t) => (
            <div key={t.label}>
              <dt className="text-xs uppercase tracking-wider text-charcoal/50">
                {t.label}
              </dt>
              <dd className="mt-1 font-serif text-base">{t.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-8 rounded-lg border border-charcoal/10 bg-white p-6 sm:p-8">
        <article className="max-w-none text-charcoal/90">
          {sections.map((s) => (
            <AgreementSectionBody key={s.heading} section={s} />
          ))}
        </article>
      </section>

      {isSigned ? (
        <section className="mt-8 rounded-lg border border-charcoal/10 bg-white p-6">
          <h2 className="text-base font-medium">Executed copy</h2>
          <p className="mt-2 text-sm text-charcoal/70">
            Accepted by{" "}
            <span className="font-medium">
              {agreement.signedByName ?? client.fullName}
            </span>{" "}
            on{" "}
            {agreement.signedAt?.toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
            {agreement.acceptanceReference
              ? `, acceptance receipt ${agreement.acceptanceReference}`
              : ""}
            .
          </p>
          <div className="mt-4">
            <a
              href={`/agreements/shared/${params.token}/pdf`}
              className="inline-flex items-center rounded-md border border-charcoal/20 bg-white px-3 py-1.5 text-sm font-medium hover:bg-charcoal/5"
            >
              Download signed PDF
            </a>
          </div>
        </section>
      ) : null}

      <footer className="mt-10 border-t border-charcoal/10 pt-6 text-sm text-charcoal/60">
        <p>
          Questions on any clause? Reply to the email that brought you
          here, or write to{" "}
          <a
            href="mailto:hello@goldstay.co.ke"
            className="underline underline-offset-2 hover:text-charcoal"
          >
            hello@goldstay.co.ke
          </a>
          . We answer within one business day.
        </p>
        <p className="mt-4 text-xs text-charcoal/45">
          Goldstay · Property management in Nairobi and Accra
        </p>
      </footer>
    </div>
  );
}

function ClosedLink({
  reason,
  clientName,
}: {
  reason: "expired" | "revoked";
  clientName: string;
}) {
  return (
    <div className="mx-auto max-w-lg px-5 py-20 sm:px-8">
      <p className="font-serif text-lg">
        Goldstay<span className="text-gold-700">.</span>
      </p>
      <h1 className="mt-8 font-serif text-2xl">
        {reason === "revoked"
          ? "This link has been withdrawn"
          : "This link has expired"}
      </h1>
      <p className="mt-4 text-charcoal/75">
        {reason === "revoked"
          ? `${clientName} withdrew access to this agreement. If you still need to review it, ask them to share it again.`
          : `Shared agreement links stay open for a limited period and this one has closed. ${clientName} can send a fresh one whenever you need it.`}
      </p>
      <p className="mt-6 text-sm text-charcoal/55">
        If you think this is a mistake, write to{" "}
        <a
          href="mailto:hello@goldstay.co.ke"
          className="underline underline-offset-2 hover:text-charcoal"
        >
          hello@goldstay.co.ke
        </a>
        .
      </p>
    </div>
  );
}
