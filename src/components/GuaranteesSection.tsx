import {
  Clock,
  ShieldCheck,
  Wallet,
  FileSearch,
  BadgeCheck,
  HandCoins,
} from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { Reveal } from "./Reveal";

type Promise = {
  icon: typeof Clock;
  heading: string;
  body: string;
  clause: string;
};

const promises: Promise[] = [
  {
    icon: Clock,
    heading: "48-hour response, or you stop paying us",
    body: "Every tenant issue, landlord question or maintenance request gets an acknowledgement within 48 hours. If we miss that window on any request, we waive our management fee for that property for the month.",
    clause: "Written into every management contract",
  },
  {
    icon: Wallet,
    heading: "Paid on the 5th, in USD, without chasing",
    body: "Your rental net payout clears to your overseas account on the 5th of every month. If a bank holiday pushes the wire, we cover the delay charges. No reminders, no calls, no excuses.",
    clause: "Applies from your first full rental month",
  },
  {
    icon: FileSearch,
    heading: "Full cost transparency",
    body: "Every expense over USD 50 arrives in your statement with a photo receipt and a vendor reference. Every expense above USD 250 is pre-approved by you in writing before we spend.",
    clause: "No exceptions, no surprise deductions",
  },
  {
    icon: ShieldCheck,
    heading: "Tenant-vetting insurance",
    body: "Every long-term tenant is employment-verified, referenced and ID-checked. If a tenant we placed defaults in their first six months, we replace them and absorb the placement cost ourselves.",
    clause: "Applies to long-term management clients",
  },
  {
    icon: BadgeCheck,
    heading: "No kickbacks. Ever.",
    body: "We don't take commissions from contractors, cleaners or listing platforms. Our fee comes from you, and that is the only money we make. You see every invoice we pay.",
    clause: "Codified in our operating principles",
  },
  {
    icon: HandCoins,
    heading: "Cancel anytime, keep everything",
    body: "30 days' notice, that's it. No claw-back, no exit fee, no hostage-taking of deposits or tenant relationships. We'll hand you a full onboarding pack for whoever takes over.",
    clause: "Your property, your call, always",
  },
];

export function GuaranteesSection() {
  return (
    <section id="guarantees" className="section bg-forest-700 text-cream">
      <div className="container-gs">
        <SectionHeader
          eyebrow="What we guarantee"
          title="Promises, in writing. Enforceable."
          lede="Everything below is written into our standard management agreement. If a clause matters to you and isn't there, we'll add it before you sign."
          variant="light"
        />

        <div className="mt-16 grid gap-8 md:grid-cols-2 md:gap-10 lg:grid-cols-3">
          {promises.map((p, i) => (
            <Reveal key={p.heading} delay={i * 0.04}>
              <div className="relative h-full rounded-3xl border border-cream/10 bg-cream/[0.04] p-7 backdrop-blur-sm transition-all duration-500 ease-premium hover:border-gold-500/40 hover:bg-cream/[0.06]">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-gold-500/40 bg-gold-500/10 text-gold-400">
                  <p.icon className="h-5 w-5" strokeWidth={1.8} />
                </div>
                <h3 className="mt-6 font-serif text-2xl text-cream">
                  {p.heading}
                </h3>
                <p className="mt-4 text-sm text-cream/75">{p.body}</p>
                <div className="mt-6 border-t border-cream/10 pt-4 font-mono text-[0.65rem] uppercase tracking-widest-xl text-gold-400">
                  {p.clause}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
