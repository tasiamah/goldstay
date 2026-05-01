// /owner/agreements/[id] — review and sign the Goldstay management
// agreement for a single property. Linked from the dashboard banner
// and the property detail card. Read-only after signing (the same
// route renders the executed copy and a download link).
//
// Authorisation: scoped via owner.properties; a landlord can only
// load an agreement for a property they own. We return notFound()
// rather than 403 to avoid leaking the existence of agreements
// belonging to other landlords.

import Link from "next/link";
import { notFound } from "next/navigation";
import { requireOwner } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { buildAgreementSections } from "@/lib/agreements/text";
import {
  AGREEMENT_STATUS_CLASSES,
  AGREEMENT_STATUS_LABEL,
  formatCommissionPct,
  formatMoney,
} from "@/lib/agreements/format";
import { signAgreementAction } from "./actions";
import { SignAgreementForm } from "./SignAgreementForm";

export const dynamic = "force-dynamic";

export default async function OwnerAgreementPage({
  params,
}: {
  params: { id: string };
}) {
  const { owner } = await requireOwner();

  const agreement = await prisma.managementAgreement.findFirst({
    where: { id: params.id, property: { ownerId: owner.id } },
    include: {
      property: {
        select: {
          id: true,
          name: true,
          city: true,
          address: true,
          propertyType: true,
        },
      },
    },
  });
  if (!agreement) notFound();

  const isShortTerm = agreement.property.propertyType === "SHORT_TERM";
  const earlyExitFeeFormatted = formatMoney(
    agreement.earlyExitFee.toString(),
    agreement.earlyExitFeeCurrency,
  );
  const commissionPct = formatCommissionPct(agreement.commissionRate.toString());
  const sections = buildAgreementSections({
    ownerName: owner.fullName,
    ownerCompany: owner.companyName,
    propertyName: agreement.property.name,
    propertyAddress: agreement.property.address,
    propertyCity: agreement.property.city,
    governingLaw: agreement.governingLaw,
    termMonths: agreement.termMonths,
    commissionPct,
    earlyExitFeeFormatted,
    noticePeriodDays: agreement.noticePeriodDays,
    isShortTerm,
  });

  const isSigned = agreement.status === "SIGNED";
  const boundSign = signAgreementAction.bind(null, agreement.id);

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <Link
          href={`/owner/properties/${agreement.property.id}`}
          className="text-sm text-stone-500 hover:text-stone-900"
        >
          ← {agreement.property.name}
        </Link>
        <div className="mt-2 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-serif text-stone-900">
              Goldstay management agreement
            </h1>
            <p className="mt-1 text-sm text-stone-500">
              {agreement.property.name} · {agreement.property.city}
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
          <Term label="Term" value={`${agreement.termMonths} months`} />
          <Term label="Commission" value={commissionPct} />
          <Term label="Notice period" value={`${agreement.noticePeriodDays} days`} />
          <Term label="Early-exit fee" value={earlyExitFeeFormatted} />
        </dl>
      </section>

      <section className="rounded-lg border border-stone-200 bg-white p-8">
        <article className="prose prose-stone max-w-none text-stone-800">
          {sections.map((s) => (
            <section key={s.heading} className="mb-6">
              <h3 className="text-base font-semibold text-stone-900">
                {s.heading}
              </h3>
              {s.body.map((p, i) => (
                <p key={i} className="mt-2 text-sm leading-6">
                  {p}
                </p>
              ))}
            </section>
          ))}
        </article>
      </section>

      {isSigned ? (
        <section className="rounded-lg border border-emerald-200 bg-emerald-50 p-6">
          <h2 className="text-base font-medium text-emerald-900">
            Signed and on file
          </h2>
          <p className="mt-2 text-sm text-emerald-900/80">
            Signed by{" "}
            <span className="font-medium">{agreement.signedByName}</span> on{" "}
            {agreement.signedAt?.toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
            . A countersigned PDF copy lives in your{" "}
            <Link
              href={`/owner/properties/${agreement.property.id}`}
              className="underline underline-offset-2 hover:text-emerald-700"
            >
              property documents
            </Link>
            .
          </p>
          <div className="mt-4">
            <a
              href={`/owner/agreements/${agreement.id}/pdf`}
              className="inline-flex items-center rounded-md border border-emerald-300 bg-white px-3 py-1.5 text-sm font-medium text-emerald-900 hover:bg-emerald-100"
            >
              Download signed PDF
            </a>
          </div>
        </section>
      ) : agreement.status === "CANCELLED" ? (
        <section className="rounded-lg border border-stone-200 bg-stone-50 p-6 text-sm text-stone-700">
          This agreement was cancelled by Goldstay. We will issue a fresh
          copy shortly. Email{" "}
          <a
            href="mailto:hello@goldstay.co.ke"
            className="text-stone-900 underline-offset-2 hover:underline"
          >
            hello@goldstay.co.ke
          </a>{" "}
          if you need it sooner.
        </section>
      ) : (
        <SignAgreementForm
          action={boundSign}
          ownerName={owner.fullName}
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
