// src/views/Quotes.jsx
"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useLocale, useTranslations } from "next-intl";
import { FaCopy } from "react-icons/fa";

import { philosophers } from "@/data/philosophers";
import Filters from "@/Filters.jsx";
import { IdeologicalGroups } from "@/enums.jsx";
import { getStartYear, getEndYear } from "@/lib/years.js";
import { copyToClipboard } from "@/utils/copyToClipboard";
import { Link } from "@/i18n/navigation";

const QUOTES_PER_PAGE = 10;

const highlightSearchTerm = (text, term) => {
  if (!term) return text;
  const parts = text.split(new RegExp(`(${term})`, "gi"));
  return (
    <span>
      {parts.map((part, i) =>
        new RegExp(term, "i").test(part) ? (
          <mark key={i} className="bg-rose-200 dark:bg-rose-700 text-black dark:text-white rounded px-0.5">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </span>
  );
};

export default function QuotesPage() {
  const t = useTranslations();
  const locale = useLocale();

  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [sortBy, setSortBy] = useState("oldest_first");
  const [selectedChronologicalOrder, setSelectedChronologicalOrder] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [copyFeedback, setCopyFeedback] = useState(null);

  const allQuotes = useMemo(() => {
    const quotes = [];
    philosophers
      .filter((p) => p && typeof p.name === "string" && p.name.trim() !== "")
      .map((p) => ({
        ...p,
        startYear: getStartYear(p.years),
        endYear: getEndYear(p.years),
      }))
      .forEach((p) => {
        const localizedQuotesKey = `quotes_${locale}`;
        const philosopherQuotes = p[localizedQuotesKey] || p.quotes;

        if (philosopherQuotes && Array.isArray(philosopherQuotes) && philosopherQuotes.length > 0) {
          philosopherQuotes.forEach((quote, index) => {
            if (typeof quote === "string" && quote.trim() !== "") {
              quotes.push({
                quote,
                author: p.name,
                philosopherId: p.id,
                id: `${p.id}-${index}`,
                IdeologicalOrder: p.IdeologicalOrder,
                geographicalOrder: p.geographicalOrder,
                ChronologicalOrder: p.ChronologicalOrder,
                startYear: p.startYear,
                endYear: p.endYear,
              });
            }
          });
        }
      });
    return quotes;
  }, [locale]);

  const handleCopyQuote = useCallback(async (quoteText, quoteAuthor, quoteId) => {
    const fullQuote = `"${quoteText}" — ${quoteAuthor}`;
    const ok = await copyToClipboard(fullQuote);
    if (!ok) return;

    setCopyFeedback(quoteId);
    setTimeout(() => setCopyFeedback(null), 2000);
  }, []);

  const getFilteredAndSortedQuotes = useMemo(() => {
    let result = [...allQuotes];

    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      result = result.filter(
        (item) =>
          (item.quote && item.quote.toLowerCase().includes(lowerCaseSearchTerm)) ||
          (item.author && item.author.toLowerCase().includes(lowerCaseSearchTerm))
      );
    }

    if (selectedGroup) {
      const groupIdeologies = IdeologicalGroups[selectedGroup];
      if (groupIdeologies && Array.isArray(groupIdeologies)) {
        result = result.filter((q) => q.IdeologicalOrder && groupIdeologies.includes(q.IdeologicalOrder));
      }
    }

    if (selectedRegion) {
      result = result.filter((q) => q.geographicalOrder === selectedRegion);
    }

    if (selectedChronologicalOrder) {
      result = result.filter((q) => q.ChronologicalOrder === selectedChronologicalOrder);
    }

    if (sortBy === "oldest_first") {
      result.sort((a, b) => a.startYear - b.startYear);
    } else if (sortBy === "youngest_first") {
      result.sort((a, b) => b.startYear - a.startYear);
    } else {
      result.sort((a, b) => {
        const nameA = a.author || "";
        const nameB = b.author || "";
        return nameA.localeCompare(nameB);
      });
    }

    return result;
  }, [allQuotes, searchTerm, selectedGroup, selectedRegion, selectedChronologicalOrder, sortBy]);

  const showRandomQuote = useCallback(() => {
    if (getFilteredAndSortedQuotes.length > 0) {
      const randomIndex = Math.floor(Math.random() * getFilteredAndSortedQuotes.length);
      const randomQuote = getFilteredAndSortedQuotes[randomIndex];
      setDisplayedQuotes([randomQuote]);
      setCurrentPage(1);
    } else {
      setDisplayedQuotes([]);
    }
  }, [getFilteredAndSortedQuotes]);

  const [displayedQuotes, setDisplayedQuotes] = useState([]);

  useEffect(() => {
    const startIndex = (currentPage - 1) * QUOTES_PER_PAGE;
    const endIndex = startIndex + QUOTES_PER_PAGE;
    setDisplayedQuotes(getFilteredAndSortedQuotes.slice(startIndex, endIndex));
  }, [currentPage, getFilteredAndSortedQuotes]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedGroup, selectedRegion, selectedChronologicalOrder, sortBy, locale]);

  const totalPages = useMemo(() => {
    return Math.ceil(getFilteredAndSortedQuotes.length / QUOTES_PER_PAGE);
  }, [getFilteredAndSortedQuotes]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const handleClearAllFilters = useCallback(() => {
    setSelectedGroup("");
    setSelectedRegion("");
    setSelectedChronologicalOrder("");
    setSortBy("oldest_first");
    setSearchTerm("");
    setCurrentPage(1);
  }, []);

  return (
    <section className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-4 text-center text-gray-900 dark:text-gray-100 font-serif uppercase">
        {t("quotes_page.title")}
      </h1>
      <p className="text-center text-gray-600 dark:text-gray-400 mb-8 text-lg">{t("quotes_page.subtitle")}</p>

      <div className="mb-12 p-4 bg-gray-100 dark:bg-stone-900 rounded-lg shadow-md flex flex-col gap-4 items-center">
        <input
          type="text"
          placeholder={t("quotes_page.search_placeholder")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-2/3 p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring focus:ring-rose-400 dark:bg-gray-800 dark:border-gray-600 dark:text-white placeholder-gray-500"
        />

        <Filters
          selectedGroup={selectedGroup}
          setSelectedGroup={setSelectedGroup}
          selectedRegion={selectedRegion}
          setSelectedRegion={setSelectedRegion}
          sortBy={sortBy}
          setSortBy={setSortBy}
          selectedChronologicalOrder={selectedChronologicalOrder}
          setSelectedChronologicalOrder={setSelectedChronologicalOrder}
        />

        <div className="flex flex-wrap justify-center gap-3 mt-2 w-full">
          <button
            type="button"
            onClick={showRandomQuote}
            className="px-5 py-2 bg-rose-900 text-white rounded-lg shadow-md hover:bg-rose-950 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-rose-900 focus:ring-offset-2 dark:focus:ring-offset-stone-900"
          >
            {t("quotes_page.show_random_quote")}
          </button>
          <button
            type="button"
            onClick={handleClearAllFilters}
            className="px-5 py-2 bg-rose-700 text-white rounded-lg shadow-md hover:bg-rose-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-rose-700 focus:ring-offset-2 dark:focus:ring-offset-stone-900"
          >
            {t("quotes_page.clear_all_filters")}
          </button>
        </div>
      </div>

      {displayedQuotes.length > 0 ? (
        <>
          <div className="space-y-8">
            {displayedQuotes.map((item) => (
              <blockquote
                key={item.id}
                className="p-6 border-l-4 border-rose-900 bg-gray-100 dark:bg-stone-800 rounded-r-lg shadow-md transition-shadow duration-300 hover:shadow-lg flex flex-col"
              >
                <p className="italic text-xl text-gray-800 dark:text-gray-200 leading-relaxed mb-4 flex-grow">
                  "{highlightSearchTerm(item.quote, searchTerm)}"
                </p>

                <div className="flex justify-between items-end mt-4">
                  <footer className="text-sm text-gray-600 dark:text-gray-400">
                    —{" "}
                    <Link
                      href={`/philosopher/${item.philosopherId}`}
                      className="font-semibold text-rose-900 dark:text-rose-500 hover:underline"
                    >
                      {highlightSearchTerm(item.author, searchTerm)}
                    </Link>
                  </footer>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopyQuote(item.quote, item.author, item.id)}
                      className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-rose-900 focus:ring-offset-2 dark:focus:ring-offset-stone-800"
                      aria-label="Copy quote"
                      title="Copy quote"
                    >
                      <FaCopy />
                    </button>
                    {copyFeedback === item.id && (
                      <span className="ml-2 text-sm text-rose-700 animate-fadeIn flex items-center">
                        {t("quotes_page.copied")}
                      </span>
                    )}
                  </div>
                </div>
              </blockquote>
            ))}
          </div>

          {getFilteredAndSortedQuotes.length > QUOTES_PER_PAGE && displayedQuotes.length > 1 && (
            <div className="flex justify-center items-center gap-4 mt-12">
              <button
                type="button"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg shadow hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t("quotes_page.previous")}
              </button>
              <span className="text-lg font-medium text-gray-700 dark:text-gray-300">
                {t("quotes_page.page")} {currentPage} {t("quotes_page.of")} {totalPages}
              </span>
              <button
                type="button"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg shadow hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t("quotes_page.next")}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center p-8 bg-gray-100 dark:bg-stone-900 rounded-lg shadow-md mt-8">
          <p className="text-center text-gray-500 dark:text-gray-400 text-2xl font-semibold mb-4">
            {t("quotes_page.no_quotes_found")}
          </p>
          <button
            type="button"
            onClick={handleClearAllFilters}
            className="px-6 py-3 bg-rose-900 text-white rounded-lg shadow-md hover:bg-rose-950 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-rose-900 focus:ring-offset-2 dark:focus:ring-offset-stone-900"
          >
            {t("quotes_page.clear_all_filters")}
          </button>
        </div>
      )}
    </section>
  );
}
