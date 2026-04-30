import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { PropertyForm } from "../../../../properties/PropertyForm";
import { createPropertyAction } from "../../../../properties/actions";

export default async function NewPropertyForOwnerPage({
  params,
}: {
  params: { id: string };
}) {
  const owner = await prisma.owner.findUnique({
    where: { id: params.id },
    select: { id: true, fullName: true, country: true },
  });
  if (!owner) notFound();

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <div>
        <Link
          href={`/admin/owners/${owner.id}`}
          className="text-sm text-stone-500 hover:text-stone-900"
        >
          ← {owner.fullName}
        </Link>
        <h2 className="mt-2 text-xl font-medium text-stone-900">
          Add property
        </h2>
        <p className="text-sm text-stone-500">
          New property under{" "}
          <span className="font-medium text-stone-700">{owner.fullName}</span>.
          Country is set to{" "}
          {owner.country === "KE" ? "Kenya" : "Ghana"} based on the owner.
          Status starts as <span className="font-medium text-stone-700">Onboarding</span>{" "}
          and flips to Active once you&rsquo;ve reviewed the paperwork
          and marked the property as verified.
        </p>
      </div>

      <div className="rounded-lg border border-stone-200 bg-white p-6">
        <PropertyForm
          action={createPropertyAction}
          ownerCountry={owner.country}
          defaults={{ ownerId: owner.id }}
          submitLabel="Create property"
        />
      </div>
    </div>
  );
}
