import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const site = getSiteUrl();
  let host: string | undefined;
  try {
    host = new URL(site).host;
  } catch {
    host = undefined;
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    host,
    sitemap: `${site}/sitemap.xml`,
  };
}
