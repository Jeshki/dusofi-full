import type { Metadata } from "next";
import { routing } from "@/i18n/routing";
import { getSiteUrl } from "@/lib/site";

type LanguageAlternate = Record<string, string>;

export function localizedPath(pathname: string, locale: string) {
  const p = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `/${locale}${p === "/" ? "" : p}`;
}

export function absoluteUrl(pathname: string, locale: string) {
  const site = getSiteUrl();
  return `${site}${localizedPath(pathname, locale)}`;
}

export function languageAlternates(pathname: string): LanguageAlternate {
  const languages: LanguageAlternate = {};
  for (const locale of routing.locales) {
    languages[locale] = absoluteUrl(pathname, locale);
  }
  languages["x-default"] = absoluteUrl(pathname, routing.defaultLocale);
  return languages;
}

export function buildAlternatesMetadata(
  pathname: string,
  locale: string
): NonNullable<Metadata["alternates"]> {
  return {
    canonical: absoluteUrl(pathname, locale),
    languages: languageAlternates(pathname),
  };
}
