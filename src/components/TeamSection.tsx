import Link from "next/link";
import { SectionHeader } from "./SectionHeader";
import { Reveal } from "./Reveal";

type Member = {
  name: string;
  role: string;
  location: string;
  initials: string;
  gradient: string;
};

const members: Member[] = [
  // Founder card hidden for now, will be restored once we have a real photo and bio.
  {
    name: "Head of Operations, Nairobi",
    role: "On-the-ground property operations",
    location: "Westlands, Nairobi",
    initials: "N",
    gradient: "from-[#2b1a10] via-[#b07a3a] to-[#1c1c1c]",
  },
  {
    name: "Head of Operations, Accra",
    role: "On-the-ground property operations",
    location: "Cantonments, Accra",
    initials: "A",
    gradient: "from-[#4a2a1a] via-[#a8783e] to-[#1b3a2d]",
  },
  {
    name: "Guest Experience",
    role: "Short-stay · 24/7 support",
    location: "Remote · Nairobi",
    initials: "GE",
    gradient: "from-[#1f1a10] via-[#6b4a2d] to-[#1c1c1c]",
  },
];

export function TeamSection() {
  return (
    <section id="team" className="section bg-white/50">
      <div className="container-gs">
        <SectionHeader
          eyebrow="The team"
          title="Small team. Same team that picks up when you call."
          lede="No outsourced call centres. No agency middlemen. When you message Goldstay, you're speaking to someone who knows your property."
        />

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((m, i) => (
            <Reveal key={m.name} delay={i * 0.05}>
              <div className="group relative overflow-hidden rounded-3xl border border-charcoal/10 bg-cream transition-all duration-500 ease-premium hover:border-gold-500/40 hover:shadow-lift">
                <div className="relative aspect-[4/5] w-full">
                  <div className={`absolute inset-0 bg-gradient-to-br ${m.gradient}`} />
                  <div className="absolute inset-0 opacity-70 mix-blend-overlay grain" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-serif text-7xl italic text-cream/90">
                      {m.initials}
                    </span>
                  </div>
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent" />
                </div>
                <div className="p-5 sm:p-6">
                  <div className="font-serif text-xl">{m.name}</div>
                  <div className="mt-1 text-sm text-charcoal/70">{m.role}</div>
                  <div className="mt-3 font-mono text-[0.65rem] uppercase tracking-widest-xl text-gold-600">
                    {m.location}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-4 text-sm text-charcoal/60">
          <span>
            We&apos;re a small, deliberate team. Real names and faces shared on first call.
          </span>
          <Link
            href="/list-your-property"
            className="link-underline text-charcoal"
          >
            Meet the team →
          </Link>
        </div>
      </div>
    </section>
  );
}
