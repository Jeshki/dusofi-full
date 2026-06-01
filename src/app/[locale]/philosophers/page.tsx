import { getTranslations, setRequestLocale } from "next-intl/server";

import { BreadcrumbJsonLd, WebPageJsonLd } from "@/lib/jsonld";
import { buildPageMetadata } from "@/lib/metadata-helpers";
import PhilosophersListPage from "@/views/PhilosophersListPage.jsx";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo" });
  return buildPageMetadata({
    locale,
    pathname: "/philosophers",
    title: t("philosophers_page_title"),
    description: t("philosophers_page_description"),
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
          { name: tHeader("philosophers"), pathname: "/philosophers" },
        ]}
      />
      <WebPageJsonLd
        locale={locale}
        pathname="/philosophers"
        name={tSeo("philosophers_page_title")}
        description={tSeo("philosophers_page_description")}
        pageType="CollectionPage"
      />
      <PhilosophersListPage />
    </>
  );
}
