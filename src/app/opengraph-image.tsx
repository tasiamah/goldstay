import { ImageResponse } from "next/og";
import { getServerCity } from "@/lib/getServerCity";

export const alt = "Goldstay — premium property management for diaspora landlords";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Dynamic OG card. Runs on the server at request time so it is city-aware:
// goldstay.co.ke unfurls with the Nairobi headline, goldstay.com.gh unfurls
// with Accra, and the neutral goldstay.com unfurls dual-market. Uses the
// same brand palette as the favicon and the navbar so the WhatsApp/LinkedIn
// preview feels like a continuation of the site, not a stock unfurl.
//
// We intentionally avoid pulling custom fonts here: ImageResponse serialises
// fonts into the PNG and shipping a webfont adds ~100-200KB per render.
// Georgia falls back gracefully and reads "serif/premium" at this size, the
// exact voice of the Instrument Serif wordmark on the site.
export default function OpengraphImage() {
  const city = getServerCity();

  const location =
    city === "nairobi"
      ? "Nairobi"
      : city === "accra"
        ? "Accra"
        : "Nairobi  ·  Accra";

  const pitch =
    city === "nairobi"
      ? "Premium property management for diaspora landlords in Nairobi. Rent collected in KES, remitted in USD on the 5th."
      : city === "accra"
        ? "Premium property management for diaspora landlords in Accra. Rent collected in GHS, remitted in USD on the 5th."
        : "Premium property management for diaspora landlords in Nairobi and Accra. Rent collected locally, remitted in USD on the 5th.";

  const domain =
    city === "nairobi"
      ? "goldstay.co.ke"
      : city === "accra"
        ? "goldstay.com.gh"
        : "goldstay.com";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "#1C1C1C",
          backgroundImage:
            "radial-gradient(circle at 85% 15%, rgba(201, 168, 76, 0.18) 0%, rgba(28, 28, 28, 0) 55%)",
          color: "#FAF8F3",
          fontFamily: "Georgia, 'Times New Roman', serif",
        }}
      >
        {/* Top row: wordmark + gold dot, matching the site navbar logo. */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <div
            style={{
              fontSize: 44,
              letterSpacing: "-0.01em",
              color: "#FAF8F3",
            }}
          >
            Goldstay
          </div>
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: 999,
              background: "#C9A84C",
              marginBottom: 8,
            }}
          />
        </div>

        {/* Headline block. Italic for the city name echoes the site hero. */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 28,
            maxWidth: 900,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              fontSize: 22,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "#C9A84C",
            }}
          >
            <div
              style={{
                width: 54,
                height: 2,
                background: "#C9A84C",
              }}
            />
            <div>{location}</div>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 72,
              fontStyle: "italic",
              lineHeight: 1.05,
              color: "#FAF8F3",
              letterSpacing: "-0.01em",
            }}
          >
            Forget about your property.
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 26,
              lineHeight: 1.35,
              color: "rgba(250, 248, 243, 0.78)",
              maxWidth: 880,
              fontStyle: "normal",
            }}
          >
            {pitch}
          </div>
        </div>

        {/* Bottom row: domain + parent line. */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            color: "rgba(250, 248, 243, 0.55)",
            fontSize: 20,
            letterSpacing: "0.08em",
          }}
        >
          <div
            style={{
              display: "flex",
              textTransform: "uppercase",
              fontSize: 18,
              letterSpacing: "0.28em",
              color: "#C9A84C",
            }}
          >
            {domain}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 18,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(250, 248, 243, 0.5)",
            }}
          >
            A TADCO company
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
