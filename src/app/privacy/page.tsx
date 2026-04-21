import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How Goldstay handles your personal data.",
};

export default function Page() {
  return (
    <section className="section pt-40">
      <div className="container-gs max-w-3xl">
        <div className="eyebrow">Privacy</div>
        <h1 className="mt-4 font-serif text-display-md">Privacy notice</h1>
        <div className="prose prose-lg mt-10 max-w-none text-charcoal/80">
          <p>
            Goldstay is a brand of TADCO. This notice explains how we collect and
            use personal data when you use our website or enquire about our
            services.
          </p>
          <h2 className="font-serif">What we collect</h2>
          <p>
            Contact information you give us (name, email, phone), details about
            the property you own, and basic analytics data from your visit to
            the site. We use cookies only to understand how visitors use the
            site and to improve it.
          </p>
          <h2 className="font-serif">How we use it</h2>
          <p>
            To reply to your enquiry, to arrange a property assessment, and —
            where you&apos;ve consented — to send occasional updates. We never
            sell your data and we don&apos;t share it with advertisers.
          </p>
          <h2 className="font-serif">Your rights</h2>
          <p>
            You can ask us to delete your data at any time by emailing
            hello@goldstay.com.
          </p>
        </div>
      </div>
    </section>
  );
}
