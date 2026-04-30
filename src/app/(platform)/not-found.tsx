import Link from "next/link";

export default function PlatformNotFound() {
  return (
    <div className="mx-auto flex min-h-screen max-w-md items-center justify-center px-6 py-10">
      <div className="rounded-lg border border-stone-200 bg-white p-8 text-center shadow-sm">
        <p className="text-xs uppercase tracking-wider text-stone-500">404</p>
        <h1 className="mt-2 text-2xl font-serif text-stone-900">
          Page not found
        </h1>
        <p className="mt-3 text-sm text-stone-600">
          The page you tried to open does not exist or you do not have
          access to it.
        </p>
        <Link
          href="/owner"
          className="mt-6 inline-flex rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700"
        >
          Back to portal
        </Link>
      </div>
    </div>
  );
}
