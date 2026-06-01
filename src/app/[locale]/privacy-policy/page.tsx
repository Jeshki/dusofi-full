import { getTranslations, setRequestLocale } from "next-intl/server";

import { BreadcrumbJsonLd, WebPageJsonLd } from "@/lib/jsonld";
import { buildPageMetadata } from "@/lib/metadata-helpers";
import PrivacyPolicy from "@/views/PrivacyPolicy.jsx";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo" });
  return buildPageMetadata({
    locale,
    pathname: "/privacy-policy",
    title: t("privacy_policy_title"),
    description: t("privacy_policy_description"),
  });
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tHeader = await getTranslations({ locale, namespace: "header" });
  const tFooter = await getTranslations({ locale, namespace: "footer" });
  const tSeo = await getTranslations({ locale, namespace: "seo" });

  return (
    <>
      <BreadcrumbJsonLd
        locale={locale}
        items={[
          { name: tHeader("home"), pathname: "/" },
          { name: tFooter("privacy_policy"), pathname: "/privacy-policy" },
        ]}
      />
      <WebPageJsonLd
        locale={locale}
        pathname="/privacy-policy"
        name={tSeo("privacy_policy_title")}
        description={tSeo("privacy_policy_description")}
        pageType="WebPage"
      />
      <PrivacyPolicy />
    </>
  );
}
