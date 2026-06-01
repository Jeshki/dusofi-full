// src/BioModal.jsx
"use client";

import React, { useCallback, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { FaCopy } from "react-icons/fa";

import { getPhilosopherLocalizedContent } from "@/lib/philosopher-content";
import { copyToClipboard } from "./utils/copyToClipboard";

export default function BioModal({ philosopher, contentType, onClose }) {
  const t = useTranslations();
  const locale = useLocale();
  const [copyFeedback, setCopyFeedback] = useState(null);

  if (!philosopher) {
    return null;
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getLocalizedContent = (key) => getPhilosopherLocalizedContent(philosopher, locale, key);

  const getBiographyContent = () => {
    return getLocalizedContent("biography") || t("philosopher_page.no_detailed_biography_available");
  };

  const getShortStoryContent = () => {
    return getLocalizedContent("shortStory") || t("philosopher_page.no_short_story_available");
  };

  const getQuotesContent = () => {
    return getLocalizedContent("quotes");
  };

  const quotes = useMemo(() => {
    const q = getQuotesContent();
    if (!Array.isArray(q)) return [];
    return q.filter((x) => typeof x === "string" && x.trim() !== "");
  }, [philosopher, locale, contentType]);

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
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fadeIn"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="bg-white dark:bg-very-dark-gray text-gray-900 dark:text-gray-100 rounded-xl shadow-2xl max-w-2xl w-full max-h-[85vh] p-6 md:p-8 relative overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-700 dark:scrollbar-track-rounded-full"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 text-3xl leading-none transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-very-dark-gray rounded-full w-8 h-8 flex items-center justify-center"
          aria-label="Close modal"
        >
          ×
        </button>

        <h3 id="modal-title" className="text-3xl font-bold mb-1 text-gray-800 dark:text-gray-50 pr-8">
          {philosopher.name}
        </h3>
        <p className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 mb-4 capitalize">
          {contentType === "biography"
            ? t("philosopher_page.biography")
            : contentType === "shortStory"
              ? t("philosopher_page.short_story")
              : t(`philosopher_page.${contentType}`)}
        </p>
        {philosopher.years && <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{philosopher.years}</p>}

        <div className="prose dark:prose-invert max-w-none mt-4 text-base leading-relaxed space-y-4">
          {contentType === "biography" &&
            getBiographyContent()
              .split("\n")
              .map((paragraph, index) => paragraph.trim() && <p key={index}>{paragraph.trim()}</p>)}
          {contentType === "shortStory" &&
            getShortStoryContent()
              .split("\n")
              .map((paragraph, index) => paragraph.trim() && <p key={index}>{paragraph.trim()}</p>)}
          {contentType === "quotes" && quotes.length > 0 ? (
            <ul className="space-y-4 pl-0 list-none">
              {quotes.map((quote, index) => {
                const quoteId = `${philosopher.id}-${index}`;
                return (
                  <li
                    key={quoteId}
                    className="p-4 border-l-4 border-rose-900 bg-gray-100 dark:bg-stone-800 rounded-r-lg shadow-sm flex flex-col gap-3"
                  >
                    <p className="italic text-lg text-gray-800 dark:text-gray-200 leading-relaxed">"{quote}"</p>

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
            contentType === "quotes" && <p>{t("philosopher_page.no_quotes_available")}</p>
          )}
        </div>
      </div>
    </div>
  );
}
