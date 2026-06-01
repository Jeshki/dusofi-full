// src/components/CookieConsent.jsx
"use client";

import React from "react";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";

export default function CookieConsent({ onAccept, onDecline }) {
  const t = useTranslations();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 dark:bg-stone-950 text-white p-4 shadow-lg z-50 flex flex-col sm:flex-row items-center justify-between text-sm sm:text-base">
      <p className="text-center sm:text-left mb-3 sm:mb-0">
        {t("cookie_consent.text")}{" "}
        <Link href="/privacy-policy" className="text-rose-400 hover:underline">
          {t("cookie_consent.privacy_policy")}
        </Link>
        .
      </p>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onAccept}
          className="px-4 py-2 bg-rose-700 text-white rounded-md hover:bg-rose-800 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-700 focus:ring-offset-2 dark:focus:ring-offset-stone-950"
        >
          {t("cookie_consent.accept")}
        </button>
        <button
          type="button"
          onClick={onDecline}
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 dark:focus:ring-offset-stone-950"
        >
          {t("cookie_consent.decline")}
        </button>
      </div>
    </div>
  );
}
