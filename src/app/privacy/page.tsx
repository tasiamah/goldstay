import type { Metadata } from "next";
import Link from "next/link";
import { getServerCity } from "@/lib/getServerCity";
import { emailFor, offices, site } from "@/lib/site";

// The privacy notice is the single public-facing document that answers
// "what are you doing with my data and under what law?". It is surfaced
// from every form the site collects (landlord enquiries, tenant
// applications, tenant waitlist) and every consent checkbox, so the
// language has to be concrete and enforceable, not marketing filler.
//
// We render it domain-aware so a visitor on goldstay.co.ke sees a
// Kenya-only notice governed by the Kenya Data Protection Act 2019
// (KDPA) and the Office of the Data Protection Commissioner (ODPC),
// a visitor on goldstay.com.gh sees a Ghana-only notice governed by
// the Data Protection Act 2012 and the Data Protection Commission
// (DPC), and a visitor on the neutral .com sees the dual-jurisdiction
// version. The same code paths apply to the consent copy in forms.

export function generateMetadata(): Metadata {
  const city = getServerCity();
  const regulator =
    city === "nairobi"
      ? "Kenya Data Protection Act 2019"
      : city === "accra"
        ? "Ghana Data Protection Act 2012"
        : "Kenya Data Protection Act 2019 and Ghana Data Protection Act 2012";
  return {
    title: "Privacy notice",
    description: `How Goldstay collects, uses, shares and protects your personal data under the ${regulator}.`,
    alternates: { canonical: "/privacy" },
    robots: { index: true, follow: true },
  };
}

const EFFECTIVE_DATE = "1 November 2026";

export default function Page() {
  const city = getServerCity();
  const contactEmail = emailFor(city ?? undefined);
  const dpoEmail = `privacy${contactEmail.slice(contactEmail.indexOf("@"))}`;

  const isKenya = city === "nairobi";
  const isGhana = city === "accra";
  const isNeutral = !isKenya && !isGhana;

  const lawName = isKenya
    ? "Kenya Data Protection Act 2019"
    : isGhana
      ? "Ghana Data Protection Act 2012 (Act 843)"
      : "Kenya Data Protection Act 2019 (for Kenyan residents and Kenyan properties) and the Ghana Data Protection Act 2012 (for Ghanaian residents and Ghanaian properties)";

  const regulator = isKenya
    ? {
        name: "Office of the Data Protection Commissioner (ODPC)",
        website: "https://www.odpc.go.ke",
        complaintsPath: "https://complaints.odpc.go.ke",
      }
    : isGhana
      ? {
          name: "Data Protection Commission (DPC)",
          website: "https://dataprotection.org.gh",
          complaintsPath: "https://dataprotection.org.gh/contact",
        }
      : null;

  const office = offices.nairobi;
  const controllerAddress =
    isKenya || isNeutral
      ? office
        ? `${office.building}, ${office.street}, ${office.locality}, ${office.city}, ${office.country}`
        : "Nairobi, Kenya"
      : "Accra, Ghana";

  return (
    <section className="section pt-40">
      <div className="container-gs max-w-3xl">
        <div className="eyebrow">Privacy</div>
        <h1 className="mt-4 font-serif text-display-md">Privacy notice</h1>
        <p className="mt-4 text-sm text-charcoal/55">
          Effective {EFFECTIVE_DATE} · Governed by the {lawName}
        </p>

        <div className="prose prose-lg mt-10 max-w-none text-charcoal/80">
          <p>
            This notice explains how {site.name} (a brand of TADCO) collects,
            uses, stores, shares and protects personal data when you visit this
            website, contact us, submit a property enquiry, apply to rent a
            property, or engage us to manage or buy a property on your behalf.
          </p>
          <p>
            We have written it in plain language on purpose. If anything below
            is unclear, email us at{" "}
            <a href={`mailto:${dpoEmail}`} className="text-gold-700 underline">
              {dpoEmail}
            </a>{" "}
            and a human will reply.
          </p>

          <h2 className="font-serif">1. Who we are (the data controller)</h2>
          <p>
            The data controller responsible for your personal data is{" "}
            <strong>{site.name}</strong>, a brand operated by{" "}
            <strong>{site.parent}</strong>. Registered correspondence address:{" "}
            {controllerAddress}.
          </p>
          <p>
            For privacy questions or to exercise any of the rights listed in
            section 7, contact our Data Protection Office at{" "}
            <a href={`mailto:${dpoEmail}`} className="text-gold-700 underline">
              {dpoEmail}
            </a>
            .
          </p>

          <h2 className="font-serif">2. What personal data we collect</h2>
          <p>We only collect what we need to deliver the service you asked for:</p>
          <ul>
            <li>
              <strong>Contact details</strong>: name, email, phone / WhatsApp
              number, country of residence.
            </li>
            <li>
              <strong>Property information</strong>: address, neighbourhood,
              bedrooms, furnishing, availability, photographs, any notes you
              choose to share.
            </li>
            <li>
              <strong>Tenant application data</strong> (only if you apply to
              rent a property through us): employment and income details,
              previous landlord references, a copy of your government ID or
              passport, and optionally a recent bank or M-Pesa statement. This
              category is treated as more sensitive and is described in more
              detail in section 6.
            </li>
            <li>
              <strong>Financial and settlement data</strong> (only for active
              landlord clients): bank account details for USD remittance,
              identity documents required by our banking partners for
              know-your-customer checks, and transaction records.
            </li>
            <li>
              <strong>Website usage data</strong>: pages visited, referrer,
              device and browser information, approximate location from IP
              address. This is the ordinary analytics data every website
              collects; we do not use it to build advertising profiles.
            </li>
          </ul>
          <p>
            We do not knowingly collect data from anyone under the age of 18.
            If you believe a minor has submitted data to us, contact the
            address above and we will delete it.
          </p>

          <h2 className="font-serif">3. Why we collect it and our lawful basis</h2>
          <p>
            Under the {lawName} we can only process personal data if we have a
            lawful basis. Ours are:
          </p>
          <ul>
            <li>
              <strong>Your consent</strong>: when you submit a form and tick
              the consent box, or subscribe to any updates. You can withdraw
              this consent at any time (see section 7).
            </li>
            <li>
              <strong>Performance of a contract</strong>: when you sign a
              management agreement with us, or when you apply to rent a
              property we operate, we process what is necessary to deliver that
              agreement (rent collection, remittance, statements, maintenance,
              licensing, tenant vetting).
            </li>
            <li>
              <strong>Compliance with a legal obligation</strong>: tax
              reporting (KRA in Kenya, GRA in Ghana), anti-money-laundering
              checks required by our banking partners, rental income reporting,
              and lawful responses to court orders or regulator requests.
            </li>
            <li>
              <strong>Our legitimate interests</strong>: replying to your
              enquiry, preventing fraud, securing our systems, and improving
              the service. Where we rely on this basis we balance it against
              your rights and only use the minimum data necessary.
            </li>
          </ul>

          <h2 className="font-serif">4. Who we share your data with</h2>
          <p>
            We never sell your data and we do not share it with advertisers.
            We share only what is necessary, only with the parties listed
            below, and only under written contracts that require them to
            protect your data to at least the same standard:
          </p>
          <ul>
            <li>
              <strong>Our service providers (sub-processors).</strong> Vercel
              Inc. (website hosting, United States), Airtable Inc. (CRM
              database, United States), Resend (transactional email, United
              States), our analytics provider when enabled, and our payment,
              FX and banking partners in Kenya {isNeutral ? "and Ghana " : ""}
              that handle rent collection and USD remittance.
            </li>
            <li>
              <strong>Legal and professional advisers.</strong> Our Kenyan
              {isNeutral ? " and Ghanaian" : isGhana ? "" : ""} property
              lawyers, auditors and accountants, bound by professional
              confidentiality.
            </li>
            <li>
              <strong>Landlords and tenants you are transacting with.</strong>{" "}
              If you are a tenant applying for a specific property, we share
              your verified application with that landlord only after you have
              consented. If you are a landlord, we share the tenant&apos;s
              verified file with you before you sign the lease.
            </li>
            <li>
              <strong>Tax and regulatory authorities</strong>: KRA
              {isNeutral || isGhana ? " and GRA" : ""}, county or municipal
              authorities, the {regulator?.name ?? "relevant data protection regulator"},
              and any court where we are legally required to do so.
            </li>
          </ul>

          <h2 className="font-serif">5. International transfers</h2>
          <p>
            Some of our sub-processors store data outside{" "}
            {isKenya ? "Kenya" : isGhana ? "Ghana" : "Kenya and Ghana"} (for
            example, Vercel, Airtable and Resend are based in the United
            States). When we transfer personal data outside the country of
            origin we do so under the safeguards permitted by the {lawName},
            which in practice means either the data subject&apos;s explicit
            consent, contractual safeguards with the processor, or where the
            transfer is necessary for the performance of your contract with us.
          </p>

          <h2 className="font-serif">6. Sensitive data on the tenant application</h2>
          <p>
            The tenant application form at{" "}
            <Link href="/apply" className="text-gold-700 underline">
              /apply
            </Link>{" "}
            collects more sensitive categories: a copy of your passport or
            national ID, employment verification details, previous landlord
            references and (optionally) a recent bank or M-Pesa statement. We
            treat this data with stricter controls:
          </p>
          <ul>
            <li>
              We only ever collect it from tenants we have personally invited
              by sharing a private link. It is not a public form.
            </li>
            <li>
              Access inside Goldstay is restricted to the small team that does
              tenant vetting. Our Head of Operations reviews access monthly.
            </li>
            <li>
              The data is retained for 24 months after your application
              concludes (placed or declined) so we can defend any dispute about
              the placement, then deleted.
            </li>
            <li>
              If you are not placed, you can ask us to delete your file
              immediately, and we will within 30 days.
            </li>
          </ul>

          <h2 className="font-serif">7. Your rights</h2>
          <p>
            Under the {lawName} you have the following rights in relation to
            the personal data we hold about you:
          </p>
          <ul>
            <li>
              The right to be informed about how we use your data (this notice).
            </li>
            <li>
              The right of access: ask us for a copy of what we hold.
            </li>
            <li>
              The right to rectification: ask us to correct anything wrong.
            </li>
            <li>
              The right to erasure (to be forgotten): ask us to delete your
              data, unless we are legally required to keep it.
            </li>
            <li>
              The right to restrict or object to our processing.
            </li>
            <li>
              The right to data portability: receive your data in a commonly
              used machine-readable format.
            </li>
            <li>
              The right to withdraw your consent at any time, where consent is
              our lawful basis.
            </li>
            <li>
              The right not to be subject to decisions made solely by
              automated processing that significantly affect you. (We do not
              make such decisions; tenant grading, for example, is reviewed by
              a human before it is acted on.)
            </li>
          </ul>
          <p>
            To exercise any of these rights, email{" "}
            <a href={`mailto:${dpoEmail}`} className="text-gold-700 underline">
              {dpoEmail}
            </a>
            . We respond within 30 days, as required by the {lawName}, and in
            most cases within 72 hours.
          </p>

          <h2 className="font-serif">8. How long we keep your data</h2>
          <ul>
            <li>
              <strong>Enquiry data (landlord leads, general contact)</strong>:
              retained for 24 months from last contact, then deleted or
              anonymised.
            </li>
            <li>
              <strong>Tenant application data</strong>: retained for 24 months
              after the application concludes, then deleted.
            </li>
            <li>
              <strong>Active management clients</strong>: retained for the
              duration of the management agreement plus seven years after
              termination, to meet Kenyan
              {isNeutral || isGhana ? " and Ghanaian" : ""} tax record-keeping
              obligations.
            </li>
            <li>
              <strong>Website analytics data</strong>: retained for 26
              months at the aggregate level, never used to identify you
              personally.
            </li>
          </ul>

          <h2 className="font-serif">9. How we protect your data</h2>
          <p>
            Access to systems that hold personal data is restricted to staff
            who need it, protected by unique accounts and two-factor
            authentication. Data in transit is encrypted over HTTPS. Backups
            are encrypted at rest. We review access quarterly and revoke it
            promptly when staff leave. If we ever suffer a personal-data
            breach that is likely to result in risk to your rights, we will
            notify the{" "}
            {regulator ? regulator.name : "relevant data protection regulator"}{" "}
            within 72 hours and, where the risk is high, notify you directly.
          </p>

          <h2 className="font-serif">10. Cookies</h2>
          <p>
            We use strictly necessary cookies to keep the site working, and
            (if and when enabled in Vercel) one analytics cookie to understand
            which pages are useful. We do not place advertising cookies and we
            do not share cookie data with ad networks.
          </p>

          <h2 className="font-serif">11. Changes to this notice</h2>
          <p>
            We will update this page when our practices change. The effective
            date at the top tells you when the current version was published.
            If a change materially affects your rights, we will contact you by
            email before it takes effect.
          </p>

          <h2 className="font-serif">12. How to complain</h2>
          {regulator ? (
            <p>
              We would rather hear from you first so we can fix a problem, but
              you have the right to complain directly to the{" "}
              <a
                href={regulator.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold-700 underline"
              >
                {regulator.name}
              </a>{" "}
              at any time. Complaint portal:{" "}
              <a
                href={regulator.complaintsPath}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold-700 underline"
              >
                {regulator.complaintsPath}
              </a>
              .
            </p>
          ) : (
            <p>
              We would rather hear from you first so we can fix a problem, but
              you have the right to complain directly to the relevant data
              protection regulator at any time. In Kenya that is the{" "}
              <a
                href="https://www.odpc.go.ke"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold-700 underline"
              >
                Office of the Data Protection Commissioner
              </a>
              . In Ghana that is the{" "}
              <a
                href="https://dataprotection.org.gh"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold-700 underline"
              >
                Data Protection Commission
              </a>
              .
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
