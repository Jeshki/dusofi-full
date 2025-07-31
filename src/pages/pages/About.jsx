// src/pages/About.jsx
import React from "react";
// Importuokite reikiamas piktogramas iš Heroicons
import { SparklesIcon, ChatBubbleLeftRightIcon, BookOpenIcon } from "@heroicons/react/24/solid"; // Galite naudoti „outline“ piktogramas, jei pageidaujate
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO.jsx'; // Importuojame SEO komponentą

export default function About() {
  const { t } = useTranslation();

  return (
    <section className="bg-white dark:bg-very-dark-gray text-gray-800 dark:text-gray-300 py-16 px-6 sm:px-12 lg:px-24 transition-colors duration-300 uppercase">
      <SEO
        title={t('seo.about_page_title')}
        description={t('seo.about_page_description')}
      />
      <h2 className="text-4xl sm:text-4xl font-bold mb-8 text-center font-serif">
        {t('about_page.title')}
      </h2>
      <div className="max-w-4xl mx-auto space-y-8 text-lg leading-relaxed font-serif">
        <p className="flex items-start gap-4">
          <SparklesIcon className="mt-1 text-rose-900 dark:text-rose-700 text-xl shrink-0 h-6 w-6" /> {/* Pakeista FaRegLightbulb */}
          {t('about_page.p1')}
        </p>
        <p className="flex items-start gap-4">
          <ChatBubbleLeftRightIcon className="mt-1 text-rose-900 dark:text-rose-700 text-xl shrink-0 h-6 w-6" /> {/* Pakeista FaQuoteLeft */}
          {t('about_page.p2')}
        </p>
        <p className="flex items-start gap-4">
          <BookOpenIcon className="mt-1 text-rose-900 dark:text-rose-700 text-xl shrink-0 h-6 w-6" /> {/* Pakeista FaFeatherAlt */}
          {t('about_page.p3')}
        </p>

        <p className="text-gray-700 dark:text-gray-300">
          {t('about_page.p4')}
        </p>

        <p className="text-gray-700 dark:text-gray-300">
          {t('about_page.p5')}
        </p>
      </div>
    </section>
  );
}
