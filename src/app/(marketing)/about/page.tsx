import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Languages, Building2 } from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";
import { Reveal } from "@/components/Reveal";
import { CTABanner } from "@/components/CTABanner";
import { waLink, site, alternateLanguagesFor } from "@/lib/site";
import { getServerCity } from "@/lib/getServerCity";

// The About page is an SEO-visible page, so we generate city-scoped
// metadata the same way the root layout does. On .co.ke we talk about
// Nairobi and Poonam, on .com.gh we'll talk about Accra and whoever
// is on the ground there (TBD). On the neutral .com we keep it
// dual-market.
export function generateMetadata(): Metadata {
  const city = getServerCity();
  const isNairobi = city === "nairobi";
  const isAccra = city === "accra";

  const title = "About Goldstay";
  const description = isNairobi
    ? "Meet the team managing diaspora-owned property in Nairobi. One team, one standard, USD remittances on the 5th."
    : isAccra
      ? "Meet the team managing diaspora-owned property in Accra. One team, one standard, USD remittances on the 5th."
      : "Meet the team behind Goldstay. Premium property management in Nairobi and Accra, built for diaspora landlords.";

  return {
    title,
    description,
    alternates: {
      canonical: "/about",
      languages: alternateLanguagesFor("/about"),
    },
    openGraph: {
      title: `${title} | ${site.name}`,
      description,
      type: "website",
    },
  };
}

export default function AboutPage() {
  const city = getServerCity();
  const showNairobi = city !== "accra";
  const showAccra = city !== "nairobi";

  return (
    <>
      <Hero city={city} />
      <Thesis city={city} />
      <Principles />
      <TeamGrid showNairobi={showNairobi} showAccra={showAccra} />
      <ParentCompany />
      <CTABanner
        headline="Ready to hand the keys to a team that picks up?"
        subheadline={
          city === "nairobi"
            ? "We manage property for diaspora landlords across Europe, the UAE and North America with homes in Nairobi."
            : city === "accra"
              ? "We manage property for diaspora landlords across Europe, the UAE and North America with homes in Accra."
              : "Join diaspora landlords across Europe, the UAE and North America who trust Goldstay."
        }
        city={city ?? undefined}
      />
    </>
  );
}

function Hero({ city }: { city: "nairobi" | "accra" | null }) {
  const eyebrow =
    city === "nairobi"
      ? "About Goldstay · Nairobi"
      : city === "accra"
        ? "About Goldstay · Accra"
        : "About Goldstay";
  return (
    <section className="relative overflow-hidden bg-cream pt-36 pb-20 sm:pt-44 sm:pb-28">
      <div className="container-gs">
        <div className="max-w-4xl">
          <Reveal>
            <div className="eyebrow">{eyebrow}</div>
            <h1 className="mt-6 font-serif text-display-xl balance">
              Built so you can <em className="italic text-gold-700">forget</em>{" "}
              about your property.
            </h1>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="mt-8 max-w-2xl text-lg text-charcoal/75 pretty md:text-xl">
              Goldstay exists because owning property abroad should feel as
              simple as owning a fund share. One team picks up the phone. One
              statement lands on the 5th. One person shows up when the boiler
              breaks. That is the whole product.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Thesis({ city }: { city: "nairobi" | "accra" | null }) {
  const locationLine =
    city === "nairobi"
      ? "In Nairobi that means Lavington, Kilimani, Westlands, Karen, Runda and Muthaiga."
      : city === "accra"
        ? "In Accra that means Airport Residential, Cantonments, Labone, East Legon and Ridge."
        : "In Nairobi that means Lavington, Kilimani, Westlands, Karen, Runda and Muthaiga. In Accra it means Airport Residential, Cantonments, Labone, East Legon and Ridge.";

  return (
    <section className="section bg-white/60">
      <div className="container-gs">
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeader
              eyebrow="Our thesis"
              title="The most expensive asset most diaspora families own is the one they cannot see."
            />
          </div>
          <div className="lg:col-span-7">
            <Reveal>
              <div className="space-y-6 text-lg text-charcoal/80 pretty md:text-xl">
                <p>
                  We are a diaspora family ourselves. We know what it feels
                  like to own an apartment on the other side of the world and
                  have no idea whether the tenant paid, whether the boiler
                  was fixed, or whether the service charge was actually paid
                  into the building association.
                </p>
                <p>
                  That is the gap Goldstay was built to close. Not a listing
                  site. Not a software platform. A real, small, senior team
                  on the ground that treats your property the way we wish
                  someone had treated ours.
                </p>
                <p>{locationLine}</p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function Principles() {
  const pillars = [
    {
      title: "Owner-first accounting",
      body: "Every statement lands on the 5th of the month. Rent collected in local currency, remitted in USD. No surprise deductions, no padded line items, ever.",
    },
    {
      title: "One team, no middlemen",
      body: "No outsourced call centres. No junior agent chain. When you WhatsApp Goldstay, you reach someone who knows the name of your tenant and the address of your property.",
    },
    {
      title: "Real humans, real phones",
      body: "We publish direct numbers, not ticket queues. Tenants have one WhatsApp. Landlords have another. Both are monitored by real operators, not bots.",
    },
    {
      title: "Built for absentee ownership",
      body: "Remote video walk-throughs. Photographed handovers. Signed-off maintenance. Everything recorded, nothing on your word vs. theirs.",
    },
  ];

  return (
    <section className="section bg-cream">
      <div className="container-gs">
        <SectionHeader
          eyebrow="How we work"
          title="Boring in the best ways."
          lede="We are not the cheapest manager in Nairobi or Accra. We do not try to be. We try to be the one you can stop worrying about."
        />
        <div className="mt-16 grid gap-5 sm:grid-cols-2">
          {pillars.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.05}>
              <div className="card h-full">
                <div className="font-serif text-2xl">{p.title}</div>
                <p className="mt-4 text-charcoal/75">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

type TeamMember = {
  name: string;
  role: string;
  location: string;
  gradient: string;
  initials: string;
  bio: string[];
  meta?: Array<{ icon: "location" | "lang" | "role"; label: string }>;
  photo?: { src: string; alt: string };
};

function TeamGrid({
  showNairobi,
  showAccra,
}: {
  showNairobi: boolean;
  showAccra: boolean;
}) {
  // Poonam is the real, public-facing Nairobi lead. Her bio is pulled
  // from direct work history and intentionally understated: we lead
  // with what she does at Goldstay, then cite the credentials that
  // back it up. Phone is deliberately not exposed on the public web
  // to avoid spam; tenants and landlords reach her through the
  // Goldstay WhatsApp surfaces, which route to her on the ops side.
  const poonam: TeamMember = {
    name: "Poonam Arora",
    role: "General Manager, Nairobi",
    location: "Parklands, Nairobi",
    gradient: "from-[#2b1a10] via-[#b07a3a] to-[#1c1c1c]",
    initials: "PA",
    bio: [
      "Poonam leads Goldstay's on-the-ground operations in Nairobi. Every property we manage in Kenya is run day-to-day by her team, from tenant handovers to plumbing emergencies to the monthly reconciliation before the 5th.",
      "She joined Goldstay after more than a decade in senior customer operations at Wananchi Group (Zuku, one of Kenya's largest ISPs) and a general manager role running sales, marketing and delivery at a Nairobi real-estate firm. She works in English, Kiswahili, Hindi and Gujarati, which means our Asian-Kenyan landlords do not have to switch languages to talk to the person managing their property.",
    ],
    meta: [
      { icon: "role", label: "GM background in Nairobi real estate" },
      { icon: "lang", label: "English · Kiswahili · Hindi · Gujarati" },
      { icon: "location", label: "Based in Parklands, Nairobi" },
    ],
    photo: {
      src: "/images/team/poonam.png",
      alt: "Poonam Arora, General Manager for Goldstay in Nairobi",
    },
  };

  const accraLead: TeamMember = {
    name: "Head of Operations, Accra",
    role: "On-the-ground property operations",
    location: "Cantonments, Accra",
    gradient: "from-[#4a2a1a] via-[#a8783e] to-[#1b3a2d]",
    initials: "A",
    bio: [
      "We are in the process of appointing our senior on-ground operator for Accra. Full name and photo will be published here before we take on our first landlord in Ghana.",
    ],
    meta: [{ icon: "location", label: "Accra, Ghana" }],
  };

  const members: TeamMember[] = [];
  if (showNairobi) members.push(poonam);
  if (showAccra) members.push(accraLead);

  return (
    <section id="team" className="section bg-white/60">
      <div className="container-gs">
        <SectionHeader
          eyebrow="The team"
          title="Small team. Same team that picks up when you call."
          lede="No outsourced call centres. No agency middlemen. The people whose names are on this page are the people who answer the phone."
        />
        <div className="mt-16 grid gap-10 lg:gap-12">
          {members.map((m, i) => (
            <TeamCard key={m.name} member={m} flip={i % 2 === 1} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TeamCard({ member, flip }: { member: TeamMember; flip: boolean }) {
  return (
    <Reveal>
      <article
        className={`grid gap-8 rounded-3xl border border-charcoal/10 bg-cream p-4 shadow-soft sm:p-6 lg:grid-cols-5 lg:gap-10 lg:p-8 ${
          flip ? "lg:[&>div:first-child]:order-2" : ""
        }`}
      >
        <div className="relative overflow-hidden rounded-2xl lg:col-span-2">
          <div className="relative aspect-[4/5] w-full">
            {member.photo ? (
              <>
                <Image
                  src={member.photo.src}
                  alt={member.photo.alt}
                  fill
                  sizes="(min-width: 1024px) 320px, (min-width: 640px) 45vw, 90vw"
                  className="object-cover"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-charcoal/40 via-transparent to-transparent" />
              </>
            ) : (
              <>
                <div className={`absolute inset-0 bg-gradient-to-br ${member.gradient}`} />
                <div className="absolute inset-0 opacity-70 mix-blend-overlay grain" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-serif text-7xl italic text-cream/90">
                    {member.initials}
                  </span>
                </div>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent" />
              </>
            )}
          </div>
        </div>
        <div className="lg:col-span-3">
          <div className="eyebrow">{member.role}</div>
          <h3 className="mt-3 font-serif text-3xl sm:text-4xl">
            {member.name}
          </h3>
          <div className="mt-4 space-y-4 text-charcoal/80 md:text-lg">
            {member.bio.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          {member.meta ? (
            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm text-charcoal/70">
              {member.meta.map((m) => (
                <li key={m.label} className="flex items-center gap-2">
                  {m.icon === "location" ? (
                    <MapPin className="h-4 w-4 text-gold-600" />
                  ) : m.icon === "lang" ? (
                    <Languages className="h-4 w-4 text-gold-600" />
                  ) : (
                    <Building2 className="h-4 w-4 text-gold-600" />
                  )}
                  <span>{m.label}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </article>
    </Reveal>
  );
}

function ParentCompany() {
  return (
    <section className="section bg-cream">
      <div className="container-gs">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <div className="eyebrow">Parent company</div>
            <h2 className="mt-5 font-serif text-display-md balance md:text-display-lg">
              Goldstay is a TADCO company.
            </h2>
            <p className="mt-6 text-lg text-charcoal/75 pretty md:text-xl">
              Goldstay operates under the TADCO group, a family-owned holding
              company with interests across real estate, manufacturing and
              consumer brands. Landlord funds are held in segregated client
              accounts, never co-mingled with operating capital.
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link href="/list-your-property" className="btn-secondary">
                List your property
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={waLink(
                  "Hi Goldstay, I'd like to talk to someone on your team",
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                WhatsApp us
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
