import Link from "next/link";
import { ClientForm } from "../ClientForm";
import { createClientAction } from "../actions";

export default function NewClientPage() {
  return (
    <div className="mx-auto w-full max-w-xl space-y-6">
      <div>
        <Link
          href="/admin/clients"
          className="text-sm text-stone-500 hover:text-stone-900"
        >
          ← Clients
        </Link>
        <h2 className="mt-2 text-xl font-medium text-stone-900">Add client</h2>
        <p className="text-sm text-stone-500">
          Create a client record. They will be able to sign in with this
          email address as soon as they request a magic link.
        </p>
      </div>

      <div className="rounded-lg border border-stone-200 bg-white p-6">
        <ClientForm action={createClientAction} submitLabel="Create client" />
      </div>
    </div>
  );
}
