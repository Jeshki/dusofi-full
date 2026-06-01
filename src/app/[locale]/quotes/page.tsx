import { getTranslations, setRequestLocale } from "next-intl/server";

import { BreadcrumbJsonLd, WebPageJsonLd } from "@/lib/jsonld";
import { buildPageMetadata } from "@/lib/metadata-helpers";
import QuotesPage from "@/views/Quotes.jsx";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo" });
  return buildPageMetadata({
    locale,
    pathname: "/quotes",
    title: t("quotes_page_title"),
    description: t("quotes_page_description"),
  });
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tHeader = await getTranslations({ locale, namespace: "header" });
  const tSeo = await getTranslations({ locale, namespace: "seo" });

  return (
    <>
      <BreadcrumbJsonLd
        locale={locale}
        items={[
          { name: tHeader("home"), pathname: "/" },
          { name: tHeader("quotes"), pathname: "/quotes" },
        ]}
      />
      <WebPageJsonLd
        locale={locale}
        pathname="/quotes"
        name={tSeo("quotes_page_title")}
        description={tSeo("quotes_page_description")}
        pageType="CollectionPage"
      />
      <QuotesPage />
    </>
  );
}
