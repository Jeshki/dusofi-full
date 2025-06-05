// src/pages/IntroSection.jsx
import React from "react";
import { FaQuoteLeft, FaFeatherAlt, FaRegLightbulb } from "react-icons/fa";
import { useTranslation } from 'react-i18next'; // <--- Importuokite useTranslation

export default function IntroSection() {
  const { t } = useTranslation(); // <--- Inicijuokite useTranslation

  return (
    // Using very-dark-gray for section background
    <section className="bg-white dark:bg-very-dark-gray text-gray-800 dark:text-gray-300 py-16 px-6 sm:px-12 lg:px-24 transition-colors duration-300 uppercase">
      <h2 className="text-4xl sm:text-4xl font-bold mb-8 text-center font-serif">
        {t('intro_section.title')} {/* <--- Naudokite t() funkciją */}
      </h2>
      <div className="max-w-4xl mx-auto space-y-8 text-lg leading-relaxed font-serif">
        <p className="flex items-start gap-4">
          <FaQuoteLeft className="mt-1 text-rose-900 dark:text-rose-700 text-xl shrink-0" />
          {t('intro_section.p1')} {/* <--- Naudokite t() funkciją */}
        </p>
        <p className="flex items-start gap-4">
          <FaFeatherAlt className="mt-1 text-rose-900 dark:text-rose-700 text-xl shrink-0" />
          {t('intro_section.p2')} {/* <--- Naudokite t() funkciją */}
        </p>
        <p className="flex items-start gap-4">
          <FaRegLightbulb className="mt-1 text-rose-900 dark:text-rose-700 text-xl shrink-0" />
          {t('intro_section.p3')} {/* <--- Naudokite t() funkciją */}
        </p>
      </div>
    </section>
  );
}