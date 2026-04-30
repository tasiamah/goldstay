import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { BookingForm } from "../../../../bookings/BookingForm";
import { createBookingAction } from "../../../../bookings/actions";

export const dynamic = "force-dynamic";

export default async function NewBookingPage({
  params,
}: {
  params: { id: string };
}) {
  const property = await prisma.property.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      name: true,
      country: true,
      propertyType: true,
      owner: { select: { preferredCurrency: true } },
    },
  });
  if (!property) notFound();

  // Manual booking entry only makes sense for short-term properties.
  // Long-term properties get sent back to the lease flow.
  if (property.propertyType !== "SHORT_TERM") {
    redirect(`/admin/properties/${property.id}/leases/new`);
  }

  const defaultCurrency =
    property.country === "KE"
      ? "KES"
      : property.country === "GH"
        ? "GHS"
        : (property.owner.preferredCurrency ?? "USD");

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <div>
        <Link
          href={`/admin/properties/${property.id}`}
          className="text-sm text-stone-500 hover:text-stone-900"
        >
          ← {property.name}
        </Link>
        <h2 className="mt-2 text-xl font-medium text-stone-900">
          Add booking
        </h2>
        <p className="text-sm text-stone-500">
          Manual entry for a stay at{" "}
          <span className="font-medium text-stone-700">{property.name}</span>.
          Bookings synced via Hostaway land here automatically.
        </p>
      </div>

      <div className="rounded-lg border border-stone-200 bg-white p-6">
        <BookingForm
          action={createBookingAction}
          defaults={{ propertyId: property.id, currency: defaultCurrency }}
          defaultCurrency={defaultCurrency}
          submitLabel="Create booking"
        />
      </div>
    </div>
  );
}
