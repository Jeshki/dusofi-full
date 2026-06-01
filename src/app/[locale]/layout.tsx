import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { Playfair_Display, Cinzel } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { Analytics } from "@vercel/analytics/react";

import SiteChromeWrapper from "@/components/site/SiteChromeWrapper";
import { OrganizationJsonLd } from "@/lib/jsonld";
import { routing } from "@/i18n/routing";
import { getAdSenseClient } from "@/lib/adsense";
import { getSiteUrl } from "@/lib/site";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-playfair",
  display: "swap",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-cinzel",
  display: "swap",
});

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const adSenseClient = getAdSenseClient();

  return (
    <html
      lang={locale}
      className={`h-full ${playfair.variable} ${cinzel.variable}`}
      suppressHydrationWarning
    >
      {adSenseClient ? (
        <head>
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adSenseClient}`}
            crossOrigin="anonymous"
          />
        </head>
      ) : null}
      <body
        className={`${cinzel.className} min-h-screen bg-white text-gray-800 antialiased transition-colors duration-300 dark:bg-black dark:text-gray-200`}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <OrganizationJsonLd />
          <SiteChromeWrapper>{children}</SiteChromeWrapper>
          <Analytics />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

export const metadata = {
  metadataBase: new URL(getSiteUrl()),
  manifest: "/site.webmanifest",
};
