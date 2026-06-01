import { getTranslations, setRequestLocale } from "next-intl/server";

import { BreadcrumbJsonLd, WebPageJsonLd } from "@/lib/jsonld";
import { buildPageMetadata } from "@/lib/metadata-helpers";
import About from "@/views/About.jsx";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo" });
  return buildPageMetadata({
    locale,
    pathname: "/about",
    title: t("about_page_title"),
    description: t("about_page_description"),
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
          { name: tHeader("about"), pathname: "/about" },
        ]}
      />
      <WebPageJsonLd
        locale={locale}
        pathname="/about"
        name={tSeo("about_page_title")}
        description={tSeo("about_page_description")}
        pageType="AboutPage"
      />
      <About />
    </>
  );
}
