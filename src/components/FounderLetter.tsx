import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "./Reveal";
import { waLink } from "@/lib/site";

export function FounderLetter() {
  return (
    <section id="letter" className="section bg-cream">
      <div className="container-gs">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <div className="eyebrow">A note from the founder</div>
            <h2 className="mt-5 font-serif text-display-md balance md:text-display-lg">
              Why Goldstay exists.
            </h2>
          </Reveal>

          <Reveal delay={0.05}>
            <div className="mt-10 space-y-6 font-serif text-xl text-charcoal/85 md:text-2xl leading-[1.55]">
              <p>
                I built Goldstay because my family kept losing money on property
                we couldn&apos;t see.
              </p>
              <p>
                We&apos;re a diaspora family. Our apartments were in
                Nairobi. We were in Dubai. Every property we owned
                was someone else&apos;s excuse to stop replying on WhatsApp.
              </p>
              <p>
                There was no company I could send a friend to and say,
                <em className="italic text-gold-700"> &nbsp;use these people, they&apos;ll treat your property like it&apos;s theirs.</em>
                So we built that company.
              </p>
              <p>
                Goldstay is not the cheapest manager you can hire, and we don&apos;t
                try to be. What we are is boring in the best ways:
                we pick up the phone, we send the statement on the 5th, we
                wire USD to your bank, and we tell you the truth when
                something goes wrong.
              </p>
              <p>
                If that&apos;s what you&apos;ve been looking for, let&apos;s talk.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-12 flex flex-col gap-6 border-t border-charcoal/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="font-serif text-2xl italic text-charcoal">
                  The Goldstay Founding Team
                </div>
                <div className="mt-1 font-mono text-[0.65rem] uppercase tracking-widest-xl text-charcoal/55">
                  Nairobi · Accra
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <a
                  href={waLink(
                    "Hi Goldstay, I read the founder letter and I'd like to talk",
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  WhatsApp the team
                  <ArrowRight className="h-4 w-4" />
                </a>
                <Link href="/list-your-property" className="btn-secondary">
                  Or send property details
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
