import type { Metadata } from "next";

import { absoluteUrl, buildAlternatesMetadata } from "@/lib/hreflang";
import { routing } from "@/i18n/routing";

const OPEN_GRAPH_LOCALES: Record<string, string> = {
  en: "en_US",
  lt: "lt_LT",
  fr: "fr_FR",
  de: "de_DE",
  es: "es_ES",
  it: "it_IT",
};

const KEYWORDS = [
  "DuSofi",
  "philosophy",
  "philosophers",
  "philosophy quotes",
  "wisdom",
  "ethics",
  "ideas",
];

function openGraphLocale(locale: string) {
  return OPEN_GRAPH_LOCALES[locale] ?? locale;
}

export function buildPageMetadata({
  locale,
  pathname,
  title,
  description,
}: {
  locale: string;
  pathname: string;
  title: string;
  description: string;
}): Metadata {
  const pageUrl = absoluteUrl(pathname, locale);
  const alternateLocales = routing.locales.filter((l) => l !== locale);

  return {
    title,
    description,
    keywords: KEYWORDS,
    authors: [{ name: "DuSofi", url: absoluteUrl("/", locale) }],
    creator: "DuSofi",
    publisher: "DuSofi",
    referrer: "origin-when-cross-origin",
    alternates: buildAlternatesMetadata(pathname, locale),
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      type: "website",
      title,
      description,
      url: pageUrl,
      siteName: "DuSofi",
      locale: openGraphLocale(locale),
      alternateLocale: alternateLocales.map(openGraphLocale),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    applicationName: "DuSofi",
    category: "philosophy",
  };
}
