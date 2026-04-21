import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms",
  description: "Terms of use for the Goldstay website.",
};

export default function Page() {
  return (
    <section className="section pt-40">
      <div className="container-gs max-w-3xl">
        <div className="eyebrow">Terms</div>
        <h1 className="mt-4 font-serif text-display-md">Terms of use</h1>
        <div className="prose prose-lg mt-10 max-w-none text-charcoal/80">
          <p>
            This website is provided for information only. Management services
            are governed by a separate written management agreement executed
            between Goldstay and the landlord.
          </p>
          <p>
            Yields and figures shown are illustrative. No representation is
            made that your property will achieve any specific occupancy, rent
            or revenue.
          </p>
        </div>
      </div>
    </section>
  );
}
