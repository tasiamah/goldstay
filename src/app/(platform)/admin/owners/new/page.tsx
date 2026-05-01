import Link from "next/link";
import { OwnerForm } from "../OwnerForm";
import { createOwnerAction } from "../actions";

export default function NewOwnerPage() {
  return (
    <div className="mx-auto w-full max-w-xl space-y-6">
      <div>
        <Link
          href="/admin/owners"
          className="text-sm text-stone-500 hover:text-stone-900"
        >
          ← Owners
        </Link>
        <h2 className="mt-2 text-xl font-medium text-stone-900">Add owner</h2>
        <p className="text-sm text-stone-500">
          Create an owner record. They will be able to sign in with this
          email address as soon as they request a magic link.
        </p>
      </div>

      <div className="rounded-lg border border-stone-200 bg-white p-6">
        <OwnerForm action={createOwnerAction} submitLabel="Create owner" />
      </div>
    </div>
  );
}
