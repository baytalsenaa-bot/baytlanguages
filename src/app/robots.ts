import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Verification pages are meant to be reached only via a specific QR
        // scan or reference code, never crawled/indexed or listed anywhere.
        disallow: ["/admin", "/api", "/*/verify"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
