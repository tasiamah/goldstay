import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/apply", "/apply/", "/api/"],
      },
    ],
    sitemap: "https://goldstay.com/sitemap.xml",
  };
}
