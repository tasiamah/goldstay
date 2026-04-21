import clsx from "./clsx";
import { Reveal } from "./Reveal";

export function SectionHeader({
  eyebrow,
  title,
  lede,
  align = "left",
  variant = "dark",
}: {
  eyebrow?: string;
  title: string;
  lede?: string;
  align?: "left" | "center";
  variant?: "dark" | "light";
}) {
  const text = variant === "light" ? "text-cream" : "text-charcoal";
  const muted = variant === "light" ? "text-cream/70" : "text-charcoal/70";
  return (
    <div
      className={clsx(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
      )}
    >
      <Reveal>
        {eyebrow ? <div className="eyebrow">{eyebrow}</div> : null}
        <h2
          className={clsx(
            "mt-4 font-serif text-display-lg balance",
            text,
          )}
        >
          {title}
        </h2>
        {lede ? (
          <p className={clsx("mt-5 text-lg pretty md:text-xl", muted)}>
            {lede}
          </p>
        ) : null}
      </Reveal>
    </div>
  );
}
