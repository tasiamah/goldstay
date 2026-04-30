import type { Metadata } from "next";
import Link from "next/link";
import { getServerCity } from "@/lib/getServerCity";
import { emailFor, site } from "@/lib/site";

// Website terms of use. These govern use of the public site only: the
// services themselves (management, sourcing, tenant placement) are
// governed by a separate signed management or sourcing agreement, which
// this document repeatedly defers to. The intention is that nothing on
// the website can, on its own, create a service obligation. That always
// happens through the bilateral agreement with our lawyers in the loop.

export function generateMetadata(): Metadata {
  const city = getServerCity();
  const jurisdiction =
    city === "nairobi"
      ? "Kenya"
      : city === "accra"
        ? "Ghana"
        : "Kenya and Ghana";
  return {
    title: "Terms of use",
    description: `Terms governing the use of the Goldstay website, under the laws of ${jurisdiction}.`,
    alternates: { canonical: "/terms" },
    robots: { index: true, follow: true },
  };
}

const EFFECTIVE_DATE = "1 November 2026";

export default function Page() {
  const city = getServerCity();
  const contactEmail = emailFor(city ?? undefined);

  const isKenya = city === "nairobi";
  const isGhana = city === "accra";

  const governingLaw = isKenya
    ? "the laws of the Republic of Kenya"
    : isGhana
      ? "the laws of the Republic of Ghana"
      : "the laws of the Republic of Kenya (for disputes arising in connection with the Kenyan market) or the laws of the Republic of Ghana (for disputes arising in connection with the Ghanaian market)";

  const forum = isKenya
    ? "the competent courts sitting in Nairobi, Kenya"
    : isGhana
      ? "the competent courts sitting in Accra, Ghana"
      : "the competent courts sitting in Nairobi, Kenya or Accra, Ghana, as applicable to the transaction giving rise to the dispute";

  return (
    <section className="section pt-40">
      <div className="container-gs max-w-3xl">
        <div className="eyebrow">Terms</div>
        <h1 className="mt-4 font-serif text-display-md">Terms of use</h1>
        <p className="mt-4 text-sm text-charcoal/55">
          Effective {EFFECTIVE_DATE}
        </p>

        <div className="prose prose-lg mt-10 max-w-none text-charcoal/80">
          <p>
            These terms govern your use of the {site.name} website and any
            information, tools or forms made available through it. By using
            the site you agree to these terms. If you do not agree, please do
            not use the site.
          </p>
          <p>
            The site is operated by <strong>{site.name}</strong>, a brand of{" "}
            <strong>{site.parent}</strong>. You can contact us at{" "}
            <a
              href={`mailto:${contactEmail}`}
              className="text-gold-700 underline"
            >
              {contactEmail}
            </a>
            .
          </p>

          <h2 className="font-serif">1. What this website is, and what it is not</h2>
          <p>
            The site exists to describe {site.name}&apos;s property management,
            property sourcing and tenant placement services, to let you
            request a conversation about those services, and to give rough
            estimates of rental economics in our operating markets. It is a
            marketing and enquiry tool. It is not itself a contract for
            services, and nothing on this site binds either party to a
            management or sourcing engagement.
          </p>
          <p>
            Engagement for any {site.name} service is governed by a separate
            written agreement (the &quot;Management Agreement&quot;, the
            &quot;Property Sourcing Agreement&quot; or the &quot;Tenant
            Placement Agreement&quot; as applicable), executed by both parties
            in writing or electronically. In the event of any conflict between
            this website and that signed agreement, the signed agreement
            governs.
          </p>

          <h2 className="font-serif">2. Illustrative figures and no guarantee of yield</h2>
          <p>
            Rent ranges, yield percentages, occupancy assumptions and the
            output of any calculator on the site (including the Yield
            Calculator and the Illustrative Economics section on the Airbnb
            Management page) are representative of the neighbourhoods in
            which we operate at the time of writing. They are not guarantees.
            Actual rental income and short-stay revenue depend on the specific
            property, its condition, the furnishing, the wider market at the
            time, tenant behaviour, and factors outside {site.name}&apos;s
            control.
          </p>
          <p>
            You should not make an investment or purchase decision based
            solely on the numbers shown on this site. We will give you a
            specific, property-level estimate on request, and any figure that
            ends up in a signed agreement is the one that governs.
          </p>

          <h2 className="font-serif">3. Information you submit through the site</h2>
          <p>
            When you submit a form, you agree that the information you provide
            is true to the best of your knowledge, that you are entitled to
            provide it (for example, that you are the landlord or authorised
            representative of the property), and that you consent to being
            contacted about your enquiry. How we handle that information is
            described in our{" "}
            <Link href="/privacy" className="text-gold-700 underline">
              Privacy notice
            </Link>
            . Submitting a form does not create a service contract by itself.
          </p>

          <h2 className="font-serif">4. Intellectual property</h2>
          <p>
            All copy, photography, branding, logos, calculators and underlying
            code on this site are owned by {site.parent} or licensed to us.
            You may read, share and link to the content. You may not copy,
            reproduce or republish substantial portions of the site, reuse
            our branding for your own services, or scrape the site for
            commercial use, without our prior written permission.
          </p>

          <h2 className="font-serif">5. Third-party links and tools</h2>
          <p>
            The site links to third-party destinations (for example WhatsApp,
            Airbnb, Booking.com, our analytics provider) for your convenience.
            We do not control those destinations and we are not responsible
            for their content or practices. Use of them is subject to their
            own terms.
          </p>

          <h2 className="font-serif">6. Availability of the site</h2>
          <p>
            We take reasonable steps to keep the site available and accurate,
            but we make no warranty that it will be uninterrupted, error-free,
            or that all information is complete at any given moment. We can
            modify or withdraw parts of the site without notice. Planned
            changes that affect active clients are communicated directly
            through the channel set out in the signed agreement.
          </p>

          <h2 className="font-serif">7. Limitation of liability</h2>
          <p>
            To the maximum extent permitted by applicable law, our liability
            arising out of or in connection with your use of this website
            (separate from any signed Management or Sourcing Agreement) is
            limited to direct loss that is the reasonably foreseeable
            consequence of our breach, and we are not liable for:
          </p>
          <ul>
            <li>
              Loss of rent, revenue or anticipated profit based on
              illustrative figures on the site.
            </li>
            <li>
              Investment decisions made solely on the basis of the site,
              without written confirmation from us.
            </li>
            <li>
              Indirect or consequential losses, including reputational loss.
            </li>
            <li>
              Events outside our reasonable control, including regulatory
              change, bank or payment-rail disruption, internet or hosting
              outages, and force majeure events.
            </li>
          </ul>
          <p>
            Nothing in these terms excludes or limits liability that cannot
            lawfully be excluded or limited under applicable law, including
            liability for fraud or gross negligence.
          </p>

          <h2 className="font-serif">8. Fair use and acceptable behaviour</h2>
          <p>
            You agree not to use this site to submit false enquiries, to
            probe, scan or test our systems without authorisation, to
            introduce malware, to harass our team, or to collect personal
            data of other users. We can block access where we reasonably
            believe the site is being misused.
          </p>

          <h2 className="font-serif">9. Governing law and forum</h2>
          <p>
            These terms are governed by {governingLaw}. You agree to the
            exclusive jurisdiction of {forum} for the resolution of any
            dispute arising out of or in connection with these terms,
            subject to any mandatory rules that give you a right to bring a
            claim in the courts of your country of residence.
          </p>

          <h2 className="font-serif">10. Changes</h2>
          <p>
            We update this page when our practices change. The effective
            date at the top tells you when the current version was
            published. Continued use of the site after a change means you
            accept the updated terms.
          </p>

          <h2 className="font-serif">11. Contact</h2>
          <p>
            Questions about these terms:{" "}
            <a
              href={`mailto:${contactEmail}`}
              className="text-gold-700 underline"
            >
              {contactEmail}
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
