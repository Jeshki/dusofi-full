import { getTranslations, setRequestLocale } from "next-intl/server";

import { WebPageJsonLd, WebSiteJsonLd } from "@/lib/jsonld";
import { buildPageMetadata } from "@/lib/metadata-helpers";
import HomePage from "@/views/HomePage.jsx";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo" });
  return buildPageMetadata({
    locale,
    pathname: "/",
    title: t("home_page_title"),
    description: t("home_page_description"),
  });
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tSeo = await getTranslations({ locale, namespace: "seo" });

  return (
    <>
      <WebSiteJsonLd locale={locale} />
      <WebPageJsonLd
        locale={locale}
        pathname="/"
        name={tSeo("home_page_title")}
        description={tSeo("home_page_description")}
        pageType="WebPage"
      />
      <HomePage />
    </>
  );
}
