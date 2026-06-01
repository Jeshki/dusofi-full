"use client";

import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";

export default function LocaleNotFound() {
  const t = useTranslations("not_found");

  return (
    <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center px-6 py-16 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-rose-900 dark:text-rose-600">404</p>
      <h1 className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-100">{t("title")}</h1>
      <p className="mt-3 text-gray-600 dark:text-gray-400">{t("description")}</p>
      <Link
        href="/"
        className="mt-8 inline-flex rounded-lg bg-rose-900 px-5 py-2.5 text-sm font-medium text-white shadow hover:bg-rose-950"
      >
        {t("cta")}
      </Link>
    </div>
  );
}
