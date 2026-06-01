import type { MetadataRoute } from "next";

import { routing } from "@/i18n/routing";
import { philosophers } from "@/data/philosophers";
import { localizedPath } from "@/lib/hreflang";
import { getSiteUrl } from "@/lib/site";

const STATIC_PATHS = ["/", "/philosophers", "/quotes", "/ideologies", "/about", "/privacy-policy"];

function languageAlternatesForPath(pathname: string, site: string): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) {
    languages[locale] = `${site}${localizedPath(pathname, locale)}`;
  }
  languages["x-default"] = `${site}${localizedPath(pathname, routing.defaultLocale)}`;
  return languages;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const site = getSiteUrl();
  const lastModified = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const pathname of STATIC_PATHS) {
    for (const locale of routing.locales) {
      entries.push({
        url: `${site}${localizedPath(pathname, locale)}`,
        lastModified,
        changeFrequency: "weekly",
        priority: pathname === "/" ? 1 : 0.85,
        alternates: {
          languages: languageAlternatesForPath(pathname, site),
        },
      });
    }
  }

  for (const p of philosophers) {
    const pathname = `/philosopher/${p.id}`;
    for (const locale of routing.locales) {
      entries.push({
        url: `${site}${localizedPath(pathname, locale)}`,
        lastModified,
        changeFrequency: "monthly",
        priority: 0.75,
        alternates: {
          languages: languageAlternatesForPath(pathname, site),
        },
      });
    }
  }

  return entries;
}
