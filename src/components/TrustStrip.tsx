"use client";

import { useEffect, useRef, useState } from "react";
import { Reveal } from "./Reveal";

type Stat = {
  value: number;
  suffix?: string;
  prefix?: string;
  display?: string;
  label: string;
  note?: string;
};

// Service commitments, not made-up inventory numbers. Everything here is a
// promise we operate against, which means it's defensible in front of any
// diaspora landlord who asks us to prove it.
const stats: Stat[] = [
  { value: 48, suffix: "h", label: "Response SLA", note: "Anything urgent, same day" },
  { value: 5, suffix: "th", label: "Paid on the", note: "Of every month, without fail" },
  { display: "USD", value: 0, label: "Wired directly", note: "EUR · GBP · AED on request" },
  { value: 2, label: "Cities, on the ground", note: "Nairobi · Accra" },
];

function useCountUp(target: number, trigger: boolean, duration = 1400) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let raf = 0;
    const start = performance.now();
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setVal(Math.round(target * ease(t)));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, trigger, duration]);
  return val;
}

function StatBlock({ stat, inView }: { stat: Stat; inView: boolean }) {
  const n = useCountUp(stat.value, inView && !stat.display);
  return (
    <div className="relative">
      <div className="font-serif text-5xl text-charcoal md:text-6xl">
        {stat.display ? (
          stat.display
        ) : (
          <>
            {stat.prefix ?? ""}
            {n}
            {stat.suffix ?? ""}
          </>
        )}
      </div>
      <div className="mt-3 text-sm text-charcoal/75">{stat.label}</div>
      {stat.note ? (
        <div className="mt-1 font-mono text-[0.7rem] uppercase tracking-widest-xl text-gold-600">
          {stat.note}
        </div>
      ) : null}
    </div>
  );
}

export function TrustStrip() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setInView(true);
        });
      },
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="border-y border-charcoal/10 bg-cream py-16 md:py-20">
      <div ref={ref} className="container-gs">
        <Reveal>
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="eyebrow">How we operate</div>
              <h2 className="mt-4 max-w-xl font-serif text-3xl md:text-4xl">
                Four promises we run the business against.
              </h2>
            </div>
            <p className="max-w-sm text-sm text-charcoal/60">
              Not marketing. These are the operational standards every landlord
              contract is written to. If we miss, you hear it from us first.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 gap-10 border-t border-charcoal/10 pt-10 md:grid-cols-4 md:gap-8">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.05}>
              <StatBlock stat={s} inView={inView} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
