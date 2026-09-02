import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { PropertyForm } from "../../../../properties/PropertyForm";
import { createPropertyAction } from "../../../../properties/actions";
import { formatClientDisplayName } from "@/lib/format-client";

export default async function NewPropertyForClientPage({
  params,
}: {
  params: { id: string };
}) {
  const client = await prisma.client.findUnique({
    where: { id: params.id },
    select: { id: true, fullName: true, companyName: true, country: true },
  });
  if (!client) notFound();
  const clientLabel = formatClientDisplayName(client);

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <div>
        <Link
          href={`/admin/clients/${client.id}`}
          className="text-sm text-stone-500 hover:text-stone-900"
        >
          ← {clientLabel}
        </Link>
        <h2 className="mt-2 text-xl font-medium text-stone-900">
          Add property
        </h2>
        <p className="text-sm text-stone-500">
          New property under{" "}
          <span className="font-medium text-stone-700">{clientLabel}</span>.
          Country is set to{" "}
          {client.country === "KE" ? "Kenya" : "Ghana"} based on the client.
          Status starts as <span className="font-medium text-stone-700">Onboarding</span>{" "}
          and flips to Active once you&rsquo;ve reviewed the paperwork
          and marked the property as verified.
        </p>
      </div>

      <div className="rounded-lg border border-stone-200 bg-white p-6">
        <PropertyForm
          action={createPropertyAction}
          clientCountry={client.country}
          defaults={{ clientId: client.id }}
          submitLabel="Create property"
        />
      </div>
    </div>
  );
}
