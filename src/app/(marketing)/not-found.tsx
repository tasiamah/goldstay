import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section pt-40">
      <div className="container-gs max-w-2xl text-center">
        <div className="eyebrow">404</div>
        <h1 className="mt-4 font-serif text-display-md">Page not found</h1>
        <p className="mt-5 text-charcoal/70">
          The page you&apos;re looking for has either moved or never existed.
        </p>
        <Link href="/" className="btn-primary mt-10 inline-flex">
          Back home
        </Link>
      </div>
    </section>
  );
}
