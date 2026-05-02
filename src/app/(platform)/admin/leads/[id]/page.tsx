// /admin/leads/[id] — single lead, all the context, all the buttons
// to advance it. Convert renders inline rather than as a separate
// route so the operator can see the lead facts and the owner-create
// form side-by-side on the same screen.

import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import {
  LEAD_SOURCE_LABEL,
  LEAD_STATUS_CLASSES,
  LEAD_STATUS_LABEL,
} from "@/lib/leads";
import { Breadcrumbs } from "@/components/admin/Breadcrumbs";
import { ActivityTimeline } from "@/components/admin/ActivityTimeline";
import { NotesPanel } from "@/components/admin/notes/NotesPanel";
import { LeadActions } from "./LeadActions";
import { ConvertLeadForm } from "./ConvertLeadForm";

export const dynamic = "force-dynamic";

export default async function LeadDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const lead = await prisma.lead.findUnique({
    where: { id: params.id },
    include: {
      ownerAdmin: { select: { fullName: true, email: true } },
    },
  });

  if (!lead) notFound();

  // Already converted: short-circuit to the resulting owner. No
  // useful action remains on a CONVERTED lead.
  if (lead.status === "CONVERTED" && lead.convertedOwnerId) {
    redirect(`/admin/owners/${lead.convertedOwnerId}`);
  }

  return (
    <div className="space-y-8">
      <div>
        <Breadcrumbs
          items={[
            { label: "Leads", href: "/admin/leads" },
            { label: lead.fullName },
          ]}
        />
        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-medium text-stone-900">
              {lead.fullName}
            </h2>
            <p className="text-sm text-stone-500">
              {lead.email ?? (
                <span className="italic text-stone-400">No email</span>
              )}{" "}
              · {lead.phone}
            </p>
            <p className="mt-1 text-xs text-stone-500">
              {LEAD_SOURCE_LABEL[lead.source]} · submitted{" "}
              {lead.createdAt.toLocaleString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <span
            className={`inline-flex items-center self-start rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-wider ${LEAD_STATUS_CLASSES[lead.status]}`}
          >
            {LEAD_STATUS_LABEL[lead.status]}
          </span>
        </div>
      </div>

      <section className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-lg border border-stone-200 bg-white p-6">
          <h3 className="text-base font-medium text-stone-900">
            Lead details
          </h3>
          <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
            <Term label="Residence country" value={lead.residenceCountry} />
            <Term
              label="Property country"
              value={
                lead.country === "KE"
                  ? "Kenya"
                  : lead.country === "GH"
                    ? "Ghana"
                    : null
              }
            />
            <Term label="City" value={lead.city} />
            <Term label="Neighbourhood" value={lead.neighbourhood} />
            <Term label="Property type" value={lead.propertyType} />
            <Term label="Bedrooms" value={lead.bedrooms} />
            <Term label="Furnished" value={lead.furnished} />
            <Term label="Service interest" value={lead.serviceInterest} />
            <Term label="Availability" value={lead.availability} />
            <Term
              label="Owner"
              value={
                lead.ownerAdmin
                  ? `${lead.ownerAdmin.fullName} (${lead.ownerAdmin.email})`
                  : null
              }
            />
          </dl>
          {lead.notes ? (
            <div className="mt-5 border-t border-stone-100 pt-4">
              <p className="text-xs uppercase tracking-wider text-stone-500">
                Notes from the lead
              </p>
              <p className="mt-2 whitespace-pre-line text-sm text-stone-700">
                {lead.notes}
              </p>
            </div>
          ) : null}

          <div className="mt-6 border-t border-stone-100 pt-4">
            <LeadActions
              leadId={lead.id}
              status={lead.status}
              hasContactedAt={Boolean(lead.contactedAt)}
              hasQualifiedAt={Boolean(lead.qualifiedAt)}
            />
          </div>

          {lead.status === "LOST" && lead.lostReason ? (
            <p className="mt-4 rounded-md border border-stone-200 bg-stone-50 p-3 text-sm text-stone-600">
              <span className="font-medium text-stone-900">Lost: </span>
              {lead.lostReason}
            </p>
          ) : null}
        </div>

        <div className="space-y-6">
          {lead.status === "LOST" ? (
            <div className="rounded-lg border border-stone-200 bg-white p-6 text-sm text-stone-600">
              This lead is closed. If they come back, log a new lead from
              the Leads list.
            </div>
          ) : (
            <div className="rounded-lg border border-stone-200 bg-white p-6">
              <h3 className="text-base font-medium text-stone-900">
                Convert to owner
              </h3>
              <p className="mt-1 text-sm text-stone-500">
                Creates an Owner row, sends the welcome email with a magic
                sign-in link, and stamps this lead as CONVERTED.
              </p>
              <div className="mt-5">
                <ConvertLeadForm
                  leadId={lead.id}
                  defaults={{
                    fullName: lead.fullName,
                    email: lead.email ?? "",
                    phone: lead.phone,
                    country:
                      lead.country ?? (lead.city === "Accra" ? "GH" : "KE"),
                  }}
                />
              </div>
            </div>
          )}

          <p className="text-xs text-stone-500">
            <Link
              href="/admin/leads"
              className="hover:text-stone-900"
            >
              ← Back to leads
            </Link>
          </p>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-lg border border-stone-200 bg-white p-6">
          <NotesPanel
            entity="LEAD"
            entityId={lead.id}
            returnPath={`/admin/leads/${lead.id}`}
          />
        </div>
        <div className="rounded-lg border border-stone-200 bg-white p-6">
          <ActivityTimeline entity="LEAD" entityId={lead.id} />
        </div>
      </section>
    </div>
  );
}

function Term({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wider text-stone-500">{label}</dt>
      <dd className="mt-1 text-stone-900">
        {value && value.trim() !== "" ? (
          value
        ) : (
          <span className="italic text-stone-400">Not provided</span>
        )}
      </dd>
    </div>
  );
}
