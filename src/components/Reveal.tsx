"use client";

import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";
import clsx from "./clsx";

// Lightweight scroll-triggered reveal. The previous implementation used
// framer-motion's whileInView, which pulled ~35 kB gzipped into the
// shared bundle on every page. This version uses IntersectionObserver
// plus two CSS classes from globals.css (.reveal and .reveal-in) to do
// the same fade-up for free. Honours prefers-reduced-motion via CSS.
export function Reveal({
  children,
  delay = 0,
  y = 16,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // If IntersectionObserver is unsupported (ancient browser) or the
    // element is already in view on mount (above the fold), just show it.
    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            obs.disconnect();
            return;
          }
        }
      },
      { rootMargin: "0px 0px -60px 0px", threshold: 0.01 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const style: CSSProperties = {
    // Custom props consumed by the .reveal CSS class so the same static
    // class can drive variable delays / offsets per call site.
    ["--reveal-delay" as string]: `${delay}s`,
    ["--reveal-y" as string]: `${y}px`,
  };

  return (
    <div
      ref={ref}
      style={style}
      className={clsx("reveal", shown && "reveal-in", className)}
    >
      {children}
    </div>
  );
}
