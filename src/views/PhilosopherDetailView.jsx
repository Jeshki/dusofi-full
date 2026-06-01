"use client";

import React, { useCallback, useMemo, useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { FaCopy } from "react-icons/fa";

import { philosophers } from "@/data/philosophers";
import { getPhilosopherLocalizedContent } from "@/lib/philosopher-content";
import { copyToClipboard } from "@/utils/copyToClipboard";

const RenderContentWithFallback = ({ content, fallbackMessage }) => {
  if (!content) {
    return <p>{fallbackMessage}</p>;
  }
  return content.split("\n").map((paragraph, index) => (
    paragraph.trim() && <p key={index}>{paragraph.trim()}</p>
  ));
};

export default function PhilosopherDetailView({ philosopherId }) {
  const t = useTranslations();
  const locale = useLocale();
  const idStr = Array.isArray(philosopherId) ? philosopherId[0] : philosopherId;
  const [activeTab, setActiveTab] = useState("biography");
  const [copyFeedback, setCopyFeedback] = useState(null);

  const philosopher = philosophers.find((p) => p.id === parseInt(String(idStr), 10));

  if (!philosopher) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-12 text-center text-xl text-gray-600 dark:text-gray-400">
        {t("philosopher_page.philosopher_not_found")}
      </div>
    );
  }

  const getLocalizedContent = (key) => getPhilosopherLocalizedContent(philosopher, locale, key);

  const getBiographyContent = () => getLocalizedContent("biography");
  const getShortStoryContent = () => getLocalizedContent("shortStory");
  const getQuotesContent = () => getLocalizedContent("quotes");

  const quotes = useMemo(() => {
    const q = getQuotesContent();
    if (!Array.isArray(q)) return [];
    return q.filter((x) => typeof x === "string" && x.trim() !== "");
  }, [philosopher, locale]);

  const handleCopyQuote = useCallback(
    async (quoteText, quoteId) => {
      const fullQuote = `"${quoteText}" — ${philosopher.name}`;
      const ok = await copyToClipboard(fullQuote);
      if (!ok) return;

      setCopyFeedback(quoteId);
      setTimeout(() => setCopyFeedback(null), 2000);
    },
    [philosopher?.name]
  );

  return (
    <section className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-2 text-center text-gray-900 dark:text-gray-100">
        {philosopher.name}
      </h1>
      <p className="text-lg text-gray-500 dark:text-gray-400 mb-6 text-center">{philosopher.years}</p>

      <div className="mb-8 flex w-full justify-center">
        <div className="relative h-[300px] w-[300px] sm:h-[400px] sm:w-[400px] lg:h-[512px] lg:w-[512px]">
          <Image
            src={philosopher.img}
            alt={philosopher.name}
            fill
            className="rounded-xl border border-gray-200 object-cover shadow-lg dark:border-gray-700"
            sizes="(max-width: 640px) 300px, (max-width: 1024px) 400px, 512px"
          />
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-8">
        {getBiographyContent() && (
          <button
            type="button"
            onClick={() => setActiveTab("biography")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "biography"
                ? "bg-rose-900 text-white shadow-md"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            {t("philosopher_page.biography")}
          </button>
        )}
        {getShortStoryContent() && (
          <button
            type="button"
            onClick={() => setActiveTab("shortStory")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "shortStory"
                ? "bg-rose-900 text-white shadow-md"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            {t("philosopher_page.short_story")}
          </button>
        )}
        {quotes.length > 0 && (
          <button
            type="button"
            onClick={() => setActiveTab("quotes")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "quotes"
                ? "bg-rose-900 text-white shadow-md"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            {t("philosopher_page.quotes")}
          </button>
        )}
      </div>

      <div className="text-lg leading-relaxed text-gray-800 dark:text-gray-300 space-y-4 prose dark:prose-invert max-w-none">
        {activeTab === "biography" && (
          <RenderContentWithFallback
            content={getBiographyContent()}
            fallbackMessage={t("philosopher_page.no_detailed_biography_available")}
          />
        )}

        {activeTab === "shortStory" && (
          <RenderContentWithFallback
            content={getShortStoryContent()}
            fallbackMessage={t("philosopher_page.no_short_story_available")}
          />
        )}

        {activeTab === "quotes" && quotes.length > 0 ? (
          <ul className="space-y-4">
            {quotes.map((quote, index) => {
              const quoteId = `${philosopher.id}-${index}`;
              return (
                <li
                  key={quoteId}
                  className="p-4 border-l-4 border-rose-900 bg-gray-100 dark:bg-stone-800 rounded-r-lg shadow-sm flex flex-col gap-3"
                >
                  <p className="italic text-lg text-gray-800 dark:text-gray-200 leading-relaxed">
                    "{quote}"
                  </p>

                  <div className="flex items-center justify-between gap-3">
                    <footer className="text-sm text-gray-600 dark:text-gray-400">— {philosopher.name}</footer>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleCopyQuote(quote, quoteId)}
                        className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-rose-900 focus:ring-offset-2 dark:focus:ring-offset-stone-800"
                        aria-label={`Copy quote by ${philosopher.name}`}
                        title="Copy quote"
                      >
                        <FaCopy />
                      </button>
                      {copyFeedback === quoteId && (
                        <span className="text-sm text-rose-700 animate-fadeIn">{t("quotes_page.copied")}</span>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          activeTab === "quotes" && <p>{t("philosopher_page.no_quotes_available")}</p>
        )}
      </div>
    </section>
  );
}
