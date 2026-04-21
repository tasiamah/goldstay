import Link from "next/link";
import clsx from "./clsx";

export function Logo({
  className,
  variant = "dark",
}: {
  className?: string;
  variant?: "dark" | "light";
}) {
  const colour = variant === "light" ? "text-cream" : "text-charcoal";
  return (
    <Link
      href="/"
      aria-label="Goldstay, home"
      className={clsx("group inline-flex items-baseline gap-1.5", className)}
    >
      <span
        className={clsx(
          "font-serif text-2xl tracking-tight transition-colors duration-300",
          colour,
        )}
      >
        Goldstay
      </span>
      <span
        aria-hidden
        className="h-1.5 w-1.5 translate-y-[-2px] rounded-full bg-gold-500 transition-transform duration-500 ease-premium group-hover:scale-125"
      />
    </Link>
  );
}
