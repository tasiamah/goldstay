import Link from "next/link";
import { authors, type PostMeta } from "./_shared";
import {
  Callout,
  H2,
  H3,
  LI,
  Lede,
  OL,
  P,
  Pullquote,
  UL,
} from "@/components/ArticleProse";

export const meta: PostMeta = {
  slug: "kenya-mri-tax-diaspora-landlords",
  title:
    "Kenya's 7.5% MRI tax for diaspora landlords: the complete 2026 guide",
  description:
    "If you own residential property in Kenya from abroad, KRA is already counting on its 7.5%. A plain-English breakdown of what MRI is, who pays it, the actual filing mechanic, and the three mistakes diaspora landlords make every year.",
  publishedAt: "2026-04-22",
  readingMinutes: 9,
  author: authors.poonam,
  tags: ["Kenya", "Tax", "Diaspora", "MRI", "KRA", "Compliance"],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt: "Nairobi skyline at dusk, Kenyan tax explainer for diaspora landlords",
};

export default function Article() {
  return (
    <>
      <Lede>
        If you own residential property in Kenya and live abroad, the Kenya
        Revenue Authority is already counting on its 7.5% of your monthly
        rent. Whether you have ever filed a return or not. Whether your
        agent has ever mentioned it or not. Here is exactly how Monthly
        Rental Income tax works, who pays it, when, and the three mistakes
        diaspora landlords make every single year.
      </Lede>

      <H2 id="what-is-mri">What MRI actually is</H2>

      <P>
        Monthly Rental Income tax (&ldquo;MRI&rdquo;) is the simplified
        residential rental income regime introduced by the Finance Act
        2015 and amended by the Finance Act 2023. It applies to{" "}
        <strong>resident landlords earning gross residential rent up to
        KES 15 million a year</strong>, replacing the regular income tax
        regime for that bracket. The current rate is{" "}
        <strong>7.5% of gross rent collected</strong>, down from 10%
        before the 2023 amendment.
      </P>

      <P>
        The two words that matter in that sentence are{" "}
        <em>residential</em> and <em>gross</em>. MRI applies to homes,
        apartments and other residential lettings. It does not apply to
        commercial property; that is taxed under the regular income tax
        regime. The 7.5% is applied to gross rent, not net. You cannot
        deduct service charge, land rates or repair costs from the
        figure you tax.
      </P>

      <Callout title="What changed in 2023">
        Until December 2023, the rate was 10% and the threshold was KES
        288,000 to KES 15,000,000 per year. The Finance Act 2023 cut
        the rate to 7.5% and removed the lower threshold, so MRI now
        applies from the first shilling of rent. Anyone collecting any
        residential rent in Kenya is in scope.
      </Callout>

      <H2 id="do-i-qualify-as-resident">
        &ldquo;But I live in London. Am I really a resident landlord?&rdquo;
      </H2>

      <P>
        This is the question we get most. The wrinkle is that{" "}
        <strong>tax residency for the property is not the same as your
        personal tax residency</strong>. KRA looks at where the rental
        income is sourced. Property in Kenya generates Kenyan-source
        income, full stop, and that income is taxable in Kenya
        regardless of where the owner happens to live.
      </P>

      <P>
        What your personal residency does change is:
      </P>

      <UL>
        <LI>
          Whether the regular Pay-As-You-Earn or non-resident
          withholding regime applies in addition to MRI.
        </LI>
        <LI>
          Whether a double-taxation agreement between Kenya and your
          country of residence (UK, UAE, India, Germany, Canada, USA)
          gives you a credit on the Kenyan tax against your home-country
          liability.
        </LI>
        <LI>
          The PIN registration process. Diaspora landlords need a KRA
          PIN to file MRI; we register clients remotely against their
          passport and proof of ownership in roughly a week.
        </LI>
      </UL>

      <Pullquote>
        Property in Kenya generates Kenyan-source income, full stop.
        Your personal residency in Dubai or Toronto does not change
        that.
      </Pullquote>

      <H2 id="how-mri-is-actually-filed">How MRI is actually filed</H2>

      <P>
        The mechanic is straightforward, even if it gets reported as
        complicated:
      </P>

      <OL>
        <LI>
          By the <strong>20th of every month</strong>, file an MRI return
          on iTax for the previous month&rsquo;s rent collected.
        </LI>
        <LI>
          Generate a payment slip on iTax. Pay the 7.5% via M-Pesa
          PayBill 222222 or any partner bank.
        </LI>
        <LI>
          Keep the e-slip and the bank or M-Pesa confirmation. KRA can
          and does request these in audit.
        </LI>
        <LI>
          A nil return is required even in months where the property
          was vacant. Failing to file the nil return triggers a KES
          2,000 penalty per month.
        </LI>
      </OL>

      <P>
        That is it. There are no input deductions, no allowances for
        depreciation, no offsets for service charge. The tax is
        deliberately simplified at the cost of being a slightly worse
        deal in years where you had a major repair bill.
      </P>

      <H3 id="example-calculation">A worked example</H3>

      <P>
        Take a 2-bedroom apartment in Kilimani let at KES 180,000 per
        month. Service charge is KES 25,000 per month, paid by the
        landlord. Land rates and SRA levies come to roughly KES 35,000
        a year.
      </P>

      <UL>
        <LI>
          Monthly gross rent: <strong>KES 180,000</strong>.
        </LI>
        <LI>
          Monthly MRI at 7.5%: <strong>KES 13,500</strong>, due to KRA
          by the 20th of the following month.
        </LI>
        <LI>
          Service charge and rates: paid in addition, from the
          remaining rent collected. They do not reduce the MRI bill.
        </LI>
      </UL>

      <P>
        Annual MRI on the same unit, assuming full occupancy: KES
        162,000, or about USD 1,260 at current rates. Roughly the cost
        of one month&rsquo;s rent.
      </P>

      <H2 id="three-mistakes">
        Three mistakes we see diaspora landlords make
      </H2>

      <H3 id="mistake-one">1. Assuming &ldquo;my agent handles tax&rdquo;</H3>

      <P>
        Many traditional Kenyan property agents charge a management
        fee, collect rent, and stop there. KRA filings are not part of
        the contract. The landlord finds out, sometimes years later,
        that no return has ever been filed in their name and the
        accumulated penalties are now larger than a year&rsquo;s rent. We have
        taken over enough of these properties to know it is the
        single most common silent failure in diaspora property.
      </P>

      <P>
        Before signing with anyone, ask one specific question:{" "}
        <em>&ldquo;Do you file my MRI returns each month, in my name, on
        my KRA PIN, and send me the e-slip?&rdquo;</em> If the answer is
        anything other than &ldquo;yes&rdquo;, you are filing them yourself or
        not at all.
      </P>

      <H3 id="mistake-two">
        2. Treating service charge as a deduction
      </H3>

      <P>
        Service charge, repairs and management fees are not deductible
        under MRI. They reduce your real-world net cash, but they do
        not reduce the 7.5% bill. Landlords sometimes file MRI on net
        rent and end up under-declaring; KRA has no problem
        back-assessing this with interest.
      </P>

      <P>
        If your repair bills are consistently large enough that the
        7.5% on gross genuinely hurts, you can elect into the regular
        income tax regime by writing to your KRA station. It is rarely
        the right call for a single residential unit, but it exists.
      </P>

      <H3 id="mistake-three">
        3. Skipping the nil return on vacant months
      </H3>

      <P>
        The KES 2,000 monthly penalty for a missed nil return looks
        small. It compounds. We have onboarded landlords whose
        accumulated nil-return penalties were enough to wipe out a
        full year of profit. The fix is trivial. iTax accepts a
        nil return in under a minute. It just has to be done every
        month, on time, vacant or not.
      </P>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        For every property we manage, MRI is part of the basic service
        and not a paid extra. Each month we:
      </P>

      <UL>
        <LI>
          File the return on iTax in your name, on your KRA PIN, before
          the 20th.
        </LI>
        <LI>
          Withhold the 7.5% from your collected rent and remit it to
          KRA the same day.
        </LI>
        <LI>
          Attach the e-slip and the KRA receipt to your monthly
          statement, alongside every other expense and the USD wire
          confirmation.
        </LI>
        <LI>
          File the nil return automatically in any month where the
          unit is vacant.
        </LI>
      </UL>

      <P>
        If you do not have a KRA PIN, we register one on your behalf
        before your first remittance. Passport scan and proof of
        ownership, no visit to Kenya required, live in roughly a week.
      </P>

      <Callout title="Adjacent compliance, while we are here">
        MRI is one line on the statement. The full bundle a Nairobi
        residential landlord owes also includes: annual land rates to
        Nairobi City County, service charge to the apartment&rsquo;s
        management committee, any SRA levy on Karen or Westlands
        properties, and the single business permit / TRA registration
        when the unit is run as a short-stay. We pay all of them from
        your collected rent and itemise every payment on your monthly
        statement.
      </Callout>

      <H2 id="when-you-should-still-get-a-tax-advisor">
        When you should still hire a tax advisor
      </H2>

      <P>
        Three situations where the 7.5% MRI line is not the whole
        story and you genuinely want a Kenyan tax professional looking
        at your file:
      </P>

      <UL>
        <LI>
          Your residential portfolio is approaching the KES 15 million
          gross rent ceiling. Above that you exit MRI and re-enter the
          regular regime, which is materially more complex.
        </LI>
        <LI>
          You also own commercial property in Kenya. That income is
          not under MRI and creates joint-filing complications.
        </LI>
        <LI>
          You expect to sell. Capital Gains Tax (CGT) at 15% on the
          gain is a separate, one-time exposure that MRI does not
          touch and that should be planned years in advance.
        </LI>
      </UL>

      <P>
        For everyone else, MRI is a solved problem the moment a
        competent manager is filing it for you on the 20th every
        month, in your name, with the receipts on the statement.
      </P>

      <H2 id="next-step">If you are not sure whether you are compliant</H2>

      <P>
        Send us your KRA PIN and the property address on{" "}
        <Link
          href="/list-your-property"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          this form
        </Link>{" "}
        or on WhatsApp. We will pull your iTax history, confirm
        whether returns have been filed in your name, calculate any
        outstanding balance and walk you through bringing the file
        current. There is no charge for that diagnostic and no
        obligation to switch managers afterwards.
      </P>

      <P>
        If you also want to see what the same property would actually
        net you under our management once MRI, service charge and
        rates are paid, the{" "}
        <Link
          href="/yield-calculator"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          yield calculator
        </Link>{" "}
        is the fastest way to get a number.
      </P>
    </>
  );
}
