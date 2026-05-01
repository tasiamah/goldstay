import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { formatPropertyDisplayName } from "@/lib/format-property";
import {
  formatOwnerDisplayName,
  formatOwnerSecondaryName,
} from "@/lib/format-owner";
import { Breadcrumbs } from "@/components/admin/Breadcrumbs";
import { NotesPanel } from "@/components/admin/notes/NotesPanel";
import { TasksPanel } from "@/components/admin/tasks/TasksPanel";
import { ActivityTimeline } from "@/components/admin/ActivityTimeline";
import { CommsTab } from "@/components/admin/comms/CommsTab";
import { OwnerForm } from "../OwnerForm";
import { updateOwnerAction } from "../actions";
import { ResendWelcomeButton } from "./ResendWelcomeButton";
import { ImpersonateButton } from "@/components/admin/ImpersonateButton";
import { PayoutMethodsCard } from "./payouts/PayoutMethodsCard";
import { OwnerDocumentsCard } from "./documents/OwnerDocumentsCard";

export const dynamic = "force-dynamic";

export default async function OwnerDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const owner = await prisma.owner.findUnique({
    where: { id: params.id },
    include: {
      properties: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!owner) notFound();

  const boundUpdate = updateOwnerAction.bind(null, owner.id);

  return (
    <div className="space-y-8">
      <div>
        <Breadcrumbs
          items={[
            { label: "Owners", href: "/admin/owners" },
            { label: formatOwnerDisplayName(owner) },
          ]}
        />
        <div className="mt-2 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-medium text-stone-900">
              {formatOwnerDisplayName(owner)}
            </h2>
            {/* Personal name is the natural-person we hold the
                relationship with; promote it to a sub-header so an
                operator can glance and know who's behind a corporate
                holding without opening the form. */}
            {formatOwnerSecondaryName(owner) ? (
              <p className="text-sm text-stone-700">
                {formatOwnerSecondaryName(owner)}
              </p>
            ) : null}
            <p className="text-sm text-stone-500">
              {owner.email} · {owner.country === "KE" ? "Kenya" : "Ghana"} ·{" "}
              {owner.preferredCurrency}
            </p>
            <p className="mt-2 flex flex-wrap items-center gap-2">
              <ResendWelcomeButton ownerId={owner.id} />
              <ImpersonateButton ownerId={owner.id} />
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Link
              href={`/admin/owners/${owner.id}/payouts/record`}
              className="inline-flex items-center rounded-md border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50"
            >
              Record payout
            </Link>
            <Link
              href={`/admin/owners/${owner.id}/properties/new`}
              className="inline-flex items-center rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-800"
            >
              Add property
            </Link>
          </div>
        </div>
      </div>

      <section className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-lg border border-stone-200 bg-white p-6">
          <h3 className="text-base font-medium text-stone-900">Details</h3>
          <p className="mt-1 text-sm text-stone-500">
            Updates apply immediately and are visible to the owner on next
            page load.
          </p>
          <div className="mt-5">
            <OwnerForm
              action={boundUpdate}
              defaults={{
                email: owner.email,
                fullName: owner.fullName,
                phone: owner.phone,
                companyName: owner.companyName,
                country: owner.country,
                preferredCurrency: owner.preferredCurrency,
              }}
              submitLabel="Save changes"
            />
          </div>
        </div>

        <div className="rounded-lg border border-stone-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-medium text-stone-900">Properties</h3>
            <span className="text-xs uppercase tracking-wider text-stone-500">
              {owner.properties.length}{" "}
              {owner.properties.length === 1 ? "asset" : "assets"}
            </span>
          </div>

          {owner.properties.length === 0 ? (
            <p className="mt-6 text-sm text-stone-500">
              No properties yet. Use{" "}
              <Link
                href={`/admin/owners/${owner.id}/properties/new`}
                className="text-stone-900 underline"
              >
                Add property
              </Link>{" "}
              above to attach the first one.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-stone-100">
              {owner.properties.map((p) => (
                <li
                  key={p.id}
                  className="flex items-start justify-between py-3"
                >
                  <div>
                    <Link
                      href={`/admin/properties/${p.id}`}
                      className="font-medium text-stone-900 hover:underline"
                    >
                      {formatPropertyDisplayName(p.name, p.unitNumber)}
                    </Link>
                    <p className="text-xs text-stone-500">
                      {p.neighbourhood ? `${p.neighbourhood}, ` : ""}
                      {p.city} ·{" "}
                      {p.propertyType === "SHORT_TERM"
                        ? "Short-term"
                        : "Long-term"}
                    </p>
                  </div>
                  <span className="text-xs uppercase tracking-wider text-stone-500">
                    {p.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-2">
        <PayoutMethodsCard
          ownerId={owner.id}
          preferredCurrency={owner.preferredCurrency}
        />
        <OwnerDocumentsCard ownerId={owner.id} />
      </section>

      <section className="grid gap-8 lg:grid-cols-2">
        <NotesPanel
          entity="OWNER"
          entityId={owner.id}
          returnPath={`/admin/owners/${owner.id}`}
        />
        <TasksPanel
          entity="OWNER"
          entityId={owner.id}
          returnPath={`/admin/owners/${owner.id}`}
        />
      </section>
      <CommsTab
        ownerId={owner.id}
        returnPath={`/admin/owners/${owner.id}`}
      />
      <ActivityTimeline
        entity="OWNER"
        entityId={owner.id}
        ownerId={owner.id}
      />
    </div>
  );
}
