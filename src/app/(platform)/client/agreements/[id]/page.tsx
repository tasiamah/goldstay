// /client/agreements/[id] — review and accept the GoldStay management
// agreement for a single property. Linked from the dashboard banner
// and the property detail card. Read-only after acceptance (the same
// route renders the executed copy and a download link).
//
// Which contract renders is decided by the agreement row's stored
// template, not by the property's current country/type, so an accepted
// agreement always reprints as the text that was accepted.
//
// Authorisation: scoped via client.properties; a landlord can only
// load an agreement for a property they own. We return notFound()
// rather than 403 to avoid leaking the existence of agreements
// belonging to other landlords.

import Link from "next/link";
import { notFound } from "next/navigation";
import { requireClient } from "@/lib/auth";
import { readImpersonationCookie } from "@/lib/admin/impersonation";
import { prisma } from "@/lib/db";
import { AgreementSectionBody } from "@/components/AgreementSectionBody";
import {
  AGREEMENT_TEMPLATE_TITLE,
  renderAgreement,
} from "@/lib/agreements/template";
import {
  AGREEMENT_STATUS_CLASSES,
  AGREEMENT_STATUS_LABEL,
  agreementTermSummary,
  formatCommissionPct,
  formatMoney,
} from "@/lib/agreements/format";
import { signAgreementAction } from "./actions";
import { SignAgreementForm } from "./SignAgreementForm";
import { formatPropertyDisplayName } from "@/lib/format-property";

export const dynamic = "force-dynamic";

export default async function ClientAgreementPage({
  params,
}: {
  params: { id: string };
}) {
  const { client } = await requireClient();

  const agreement = await prisma.managementAgreement.findFirst({
    where: { id: params.id, property: { clientId: client.id } },
    include: {
      property: {
        select: {
          id: true,
          name: true,
          unitNumber: true,
          city: true,
          address: true,
          propertyType: true,
          bedrooms: true,
          maxOccupancy: true,
          launchedAt: true,
        },
      },
    },
  });
  if (!agreement) notFound();

  const isShortTerm = agreement.property.propertyType === "SHORT_TERM";
  const currency = agreement.earlyExitFeeCurrency;
  const money = (value: typeof agreement.startupCostsBudget) =>
    value === null ? null : formatMoney(value.toString(), currency);

  const earlyExitFeeFormatted = formatMoney(
    agreement.earlyExitFee.toString(),
    currency,
  );
  const commissionPct = formatCommissionPct(agreement.commissionRate.toString());
  const propertyDisplayName = formatPropertyDisplayName(
    agreement.property.name,
    agreement.property.unitNumber,
  );
  const agreementTitle = AGREEMENT_TEMPLATE_TITLE[agreement.template];

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
    propertyAddress: agreement.property.address,
    propertyCity: agreement.property.city,
    bedrooms: agreement.property.bedrooms,
    maxOccupancy: agreement.property.maxOccupancy,
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
    // The Start Date is when the agreement went out, not when it is
    // being read, so a client revisiting the page next week still sees
    // the date the contract was actually issued on.
    startDate: agreement.sentAt ?? agreement.generatedAt,
    launchDate: agreement.property.launchedAt,
  });

  const isSigned = agreement.status === "SIGNED";
  const boundSign = signAgreementAction.bind(null, agreement.id);
  const impersonation = await readImpersonationCookie();

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <Link
          href={`/client/properties/${agreement.property.id}`}
          className="text-sm text-stone-500 hover:text-stone-900"
        >
          ← {propertyDisplayName}
        </Link>
        <div className="mt-2 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-serif text-stone-900">
              {agreementTitle}
            </h1>
            <p className="mt-1 text-sm text-stone-500">
              {propertyDisplayName} · {agreement.property.city}
              {agreement.reference ? ` · ${agreement.reference}` : ""}
            </p>
          </div>
          <span
            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-wider ${AGREEMENT_STATUS_CLASSES[agreement.status]}`}
          >
            {AGREEMENT_STATUS_LABEL[agreement.status]}
          </span>
        </div>
      </div>

      <section className="rounded-lg border border-stone-200 bg-white p-6">
        <h2 className="text-base font-medium text-stone-900">
          Commercial terms
        </h2>
        <p className="mt-1 text-sm text-stone-500">
          Snapshot of the terms specific to this property.
        </p>
        <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4 text-sm sm:grid-cols-4">
          {agreementTermSummary({
            template: agreement.template,
            termMonths: agreement.termMonths,
            commissionPct,
            noticePeriodDays: agreement.noticePeriodDays,
            earlyExitFeeFormatted,
          }).map((t) => (
            <Term key={t.label} label={t.label} value={t.value} />
          ))}
        </dl>
      </section>

      <section className="rounded-lg border border-stone-200 bg-white p-8">
        <article className="max-w-none text-stone-800">
          {sections.map((s) => (
            <AgreementSectionBody key={s.heading} section={s} />
          ))}
        </article>
      </section>

      {isSigned ? (
        <section className="rounded-lg border border-emerald-200 bg-emerald-50 p-6">
          <h2 className="text-base font-medium text-emerald-900">
            Accepted and on file
          </h2>
          <p className="mt-2 text-sm text-emerald-900/80">
            Accepted by{" "}
            <span className="font-medium">{agreement.signedByName}</span> on{" "}
            {agreement.signedAt?.toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
            . A countersigned PDF copy is available below.
          </p>
          {agreement.acceptanceReference ? (
            <p className="mt-2 text-sm text-emerald-900/80">
              Acceptance receipt{" "}
              <span className="font-mono text-xs font-medium">
                {agreement.acceptanceReference}
              </span>
            </p>
          ) : null}
          <div className="mt-4">
            <a
              href={`/client/agreements/${agreement.id}/pdf`}
              className="inline-flex items-center rounded-md border border-emerald-300 bg-white px-3 py-1.5 text-sm font-medium text-emerald-900 hover:bg-emerald-100"
            >
              Download signed PDF
            </a>
          </div>
        </section>
      ) : agreement.status === "CANCELLED" ? (
        <section className="rounded-lg border border-stone-200 bg-stone-50 p-6 text-sm text-stone-700">
          This agreement was cancelled by GoldStay. We will issue a fresh
          copy shortly. Email{" "}
          <a
            href="mailto:hello@goldstay.co.ke"
            className="text-stone-900 underline-offset-2 hover:underline"
          >
            hello@goldstay.co.ke
          </a>{" "}
          if you need it sooner.
        </section>
      ) : impersonation ? (
        // Matches the guard in signAgreementAction. Showing the button
        // and failing on click would just look like a bug.
        <section className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
          You are viewing this portal as{" "}
          <span className="font-medium">{impersonation.clientLabel}</span>.
          Only the client can accept their own agreement, so the accept
          button is hidden here. Stop impersonating to return to your
          admin session.
        </section>
      ) : (
        <SignAgreementForm
          action={boundSign}
          clientName={
            client.companyName
              ? `${client.companyName} (${client.fullName})`
              : client.fullName
          }
          propertyDisplayName={propertyDisplayName}
          agreementTitle={agreementTitle}
          reference={agreement.reference}
        />
      )}
    </div>
  );
}

function Term({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wider text-stone-500">
        {label}
      </dt>
      <dd className="mt-1 font-serif text-base text-stone-900">{value}</dd>
    </div>
  );
}
