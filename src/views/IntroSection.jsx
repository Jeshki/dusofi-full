// src/views/IntroSection.jsx
"use client";

import React from "react";
import { ChatBubbleLeftRightIcon, PencilSquareIcon, LightBulbIcon } from "@heroicons/react/24/solid";
import { useTranslations } from "next-intl";

export default function IntroSection() {
  const t = useTranslations();

  return (
    <section className="bg-white dark:bg-very-dark-gray text-gray-800 dark:text-gray-300 py-16 px-6 sm:px-12 lg:px-24 transition-colors duration-300 uppercase">
      <h2 className="text-4xl sm:text-4xl font-bold mb-8 text-center font-serif">{t("intro_section.title")}</h2>
      <div className="max-w-4xl mx-auto space-y-8 text-lg leading-relaxed font-serif">
        <p className="flex items-start gap-4">
          <ChatBubbleLeftRightIcon className="mt-1 text-rose-900 dark:text-rose-700 text-xl shrink-0 h-6 w-6" />
          {t("intro_section.p1")}
        </p>
        <p className="flex items-start gap-4">
          <PencilSquareIcon className="mt-1 text-rose-900 dark:text-rose-700 text-xl shrink-0 h-6 w-6" />
          {t("intro_section.p2")}
        </p>
        <p className="flex items-start gap-4">
          <LightBulbIcon className="mt-1 text-rose-900 dark:text-rose-700 text-xl shrink-0 h-6 w-6" />
          {t("intro_section.p3")}
        </p>
      </div>
    </section>
  );
}
