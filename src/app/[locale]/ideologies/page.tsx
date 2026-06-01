import { getTranslations, setRequestLocale } from "next-intl/server";

import { ideologies } from "@/data/ideologies";
import { BreadcrumbJsonLd, IdeologyItemListJsonLd, WebPageJsonLd } from "@/lib/jsonld";
import { buildPageMetadata } from "@/lib/metadata-helpers";
import IdeologiesPage from "@/views/Ideologies.jsx";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo" });
  return buildPageMetadata({
    locale,
    pathname: "/ideologies",
    title: t("ideologies_page_title"),
    description: t("ideologies_page_description"),
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
          { name: tHeader("ideologies"), pathname: "/ideologies" },
        ]}
      />
      <WebPageJsonLd
        locale={locale}
        pathname="/ideologies"
        name={tSeo("ideologies_page_title")}
        description={tSeo("ideologies_page_description")}
        pageType="CollectionPage"
      />
      <IdeologyItemListJsonLd locale={locale} ideologies={ideologies} listName={tSeo("ideologies_page_title")} />
      <IdeologiesPage />
    </>
  );
}
