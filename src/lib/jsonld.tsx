import type { StaticImageData } from "next/image";

import { absoluteUrl } from "@/lib/hreflang";
import { routing } from "@/i18n/routing";
import { getSiteUrl } from "@/lib/site";
import type { Ideology } from "@/types/ideology";
import type { Philosopher } from "@/types/philosopher";

const ORGANIZATION_ID_SUFFIX = "#organization";

export function organizationId(): string {
  return `${getSiteUrl()}${ORGANIZATION_ID_SUFFIX}`;
}

function absoluteImageUrl(img: Philosopher["img"]): string | undefined {
  const site = getSiteUrl();
  const raw =
    typeof img === "object" && img !== null && "src" in img
      ? String((img as StaticImageData).src)
      : String(img);
  if (!raw) return undefined;
  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
  const path = raw.startsWith("/") ? raw : `/${raw}`;
  return `${site}${path}`;
}

function ideologyDisplayName(ideology: Ideology, locale: string): string {
  const localized = ideology[`name_${locale}` as keyof Ideology];
  if (typeof localized === "string" && localized.trim() !== "") {
    return localized;
  }
  if (typeof ideology.name === "string" && ideology.name.trim() !== "") {
    return ideology.name;
  }
  return String(ideology.id);
}

function plainText(value: unknown, maxLength = 240): string | undefined {
  if (typeof value !== "string") return undefined;
  const text = value
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[#*_`>~[\]()]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!text) return undefined;
  return text.length > maxLength ? `${text.slice(0, maxLength - 1).trim()}...` : text;
}

function localizedPhilosopherDescription(philosopher: Philosopher, locale: string) {
  const localized =
    philosopher[`bio_${locale}`] ??
    philosopher[`about_${locale}`] ??
    philosopher[`biography_${locale}`] ??
    philosopher.bio ??
    philosopher.about ??
    philosopher.biography ??
    philosopher.years;

  return plainText(localized);
}

export function OrganizationJsonLd() {
  const site = getSiteUrl();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": organizationId(),
    name: "DuSofi",
    url: site,
    logo: `${site}/icon`,
    availableLanguage: routing.locales,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function BreadcrumbJsonLd({
  locale,
  items,
}: {
  locale: string;
  items: { name: string; pathname: string }[];
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.pathname, locale),
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function WebPageJsonLd({
  locale,
  pathname,
  name,
  description,
  pageType = "WebPage",
}: {
  locale: string;
  pathname: string;
  name: string;
  description: string;
  pageType?: "WebPage" | "AboutPage" | "CollectionPage";
}) {
  const url = absoluteUrl(pathname, locale);
  const site = getSiteUrl();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": pageType,
    "@id": url,
    url,
    name,
    description,
    inLanguage: locale,
    isPartOf: {
      "@type": "WebSite",
      name: "DuSofi",
      url: site,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function IdeologyItemListJsonLd({
  locale,
  ideologies,
  listName,
}: {
  locale: string;
  ideologies: Ideology[];
  listName: string;
}) {
  const pageUrl = absoluteUrl("/ideologies", locale);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: listName,
    url: pageUrl,
    numberOfItems: ideologies.length,
    itemListElement: ideologies.map((ideology, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Thing",
        name: ideologyDisplayName(ideology, locale),
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function PersonJsonLd({
  philosopher,
  locale,
  pathname,
}: {
  philosopher: Philosopher;
  locale: string;
  pathname: string;
}) {
  const url = absoluteUrl(pathname, locale);
  const image = absoluteImageUrl(philosopher.img);
  const description = localizedPhilosopherDescription(philosopher, locale);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: philosopher.name,
    ...(description ? { description } : {}),
    url,
    ...(image ? { image } : {}),
    memberOf: {
      "@id": organizationId(),
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function WebSiteJsonLd({ locale }: { locale: string }) {
  const site = getSiteUrl();
  const pageUrl = absoluteUrl("/", locale);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "DuSofi",
    url: pageUrl,
    inLanguage: locale,
    publisher: {
      "@id": organizationId(),
    },
    potentialAction: {
      "@type": "ReadAction",
      target: pageUrl,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
