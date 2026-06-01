import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { philosophers } from "@/data/philosophers";
import { BreadcrumbJsonLd, PersonJsonLd } from "@/lib/jsonld";
import { buildPageMetadata } from "@/lib/metadata-helpers";
import PhilosopherDetailView from "@/views/PhilosopherDetailView.jsx";

export function generateStaticParams() {
  return philosophers.map((p) => ({ id: String(p.id) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const t = await getTranslations({ locale, namespace: "seo" });
  const philosopher = philosophers.find((p) => p.id === parseInt(id, 10));

  if (!philosopher) {
    return buildPageMetadata({
      locale,
      pathname: `/philosopher/${id}`,
      title: t("philosopher_not_found_title"),
      description: t("philosopher_not_found_description"),
    });
  }

  const name = philosopher.name ?? "";
  const years = philosopher.years ?? "";

  return buildPageMetadata({
    locale,
    pathname: `/philosopher/${id}`,
    title: t("philosopher_page_title_dynamic", { philosopherName: name, years }),
    description: t("philosopher_page_description_dynamic", {
      philosopherName: name,
      years,
    }),
  });
}

export default async function Page({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const numericId = parseInt(id, 10);
  if (Number.isNaN(numericId)) {
    notFound();
  }
  const philosopher = philosophers.find((p) => p.id === numericId);
  if (!philosopher) {
    notFound();
  }

  const pathname = `/philosopher/${id}`;
  const tHeader = await getTranslations({ locale, namespace: "header" });

  return (
    <>
      <BreadcrumbJsonLd
        locale={locale}
        items={[
          { name: tHeader("home"), pathname: "/" },
          { name: tHeader("philosophers"), pathname: "/philosophers" },
          { name: philosopher.name ?? "", pathname },
        ]}
      />
      <PersonJsonLd philosopher={philosopher} locale={locale} pathname={pathname} />
      <PhilosopherDetailView philosopherId={id} />
    </>
  );
}
