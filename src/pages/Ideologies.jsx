// src/pages/Ideologies.jsx
import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ideologies } from '../ideologiesData';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO.jsx'; // Importuojame SEO komponentą

export default function IdeologiesPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const ideologyRefs = useRef({});

  const scrollToSection = (id) => {
    const element = ideologyRefs.current[id];
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const handleViewPhilosophers = (ideologyId) => {
    navigate(`/philosophers?group=${ideologyId}`);
  };

  const getLocalizedContent = (item, key) => {
    const localizedKey = `${key}_${i18n.language}`;
    return item[localizedKey] || item[key];
  };

  return (
    <section className="max-w-4xl mx-auto px-6 py-12 relative">
      <SEO
        title={t('seo.ideologies_page_title')}
        description={t('seo.ideologies_page_description')}
      />
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-900 dark:text-gray-100 uppercase font-serif">
        {t('ideologies_page.title')}
      </h1>

      <nav className="mb-12 p-4 bg-gray-100 dark:bg-stone-900 rounded-lg shadow-inner">
        <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200"></h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-4">
          {ideologies.map((ideology) => (
            <li key={ideology.id}>
              <button
                onClick={() => scrollToSection(ideology.id)}
                className="flex flex-col items-center justify-center text-rose-900 dark:text-rose-700 hover:underline text-center py-2 w-full font-medium p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-stone-700 transition-colors"
              >
                {ideology.image && (
                  <img
                    src={ideology.image}
                    alt={getLocalizedContent(ideology, 'name')}
                    title={getLocalizedContent(ideology, 'name')}
                    className="w-full h-56 object-contain rounded-md mb-2 border border-gray-300 dark:border-gray-600"
                    loading="lazy"
                    decoding="async"
                  />
                )}
                <span className="flex-grow pt-1">{getLocalizedContent(ideology, 'name')}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="space-y-12">
        {ideologies.map((ideology) => (
          <div
            key={ideology.id}
            ref={(el) => (ideologyRefs.current[ideology.id] = el)}
            className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm bg-gray-50 dark:bg-stone-800 transition-all duration-300 ease-in-out hover:shadow-lg"
          >
            <h2 className="text-3xl font-semibold mb-4 text-rose-900 dark:text-rose-700 font-serif">
              {getLocalizedContent(ideology, 'name')}
            </h2>

            <p className="text-gray-700 dark:text-gray-300 mb-6 prose dark:prose-invert">
              {getLocalizedContent(ideology, 'description').split('\n').map((paragraph, index) => (
                paragraph.trim() && <p key={index}>{paragraph.trim()}</p>
              ))}
            </p>

            {ideology.subSections && ideology.subSections.length > 0 && (
              <div className="mt-6 space-y-4">
                {ideology.subSections.map((sub, idx) => (
                  <div key={idx} className="bg-gray-100 dark:bg-stone-700 p-4 rounded-md border border-gray-200 dark:border-gray-600">
                    <h4 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-2 font-serif">
                      {getLocalizedContent(sub, 'title')}
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300 prose dark:prose-invert">
                      {getLocalizedContent(sub, 'content').split('\n').map((paragraph, index) => (
                        paragraph.trim() && <p key={index}>{paragraph.trim()}</p>
                      ))}
                    </p>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-6 text-center">
              <button
                onClick={() => handleViewPhilosophers(ideology.id)}
                className="px-6 py-2 bg-rose-900 text-white rounded-lg shadow-md hover:bg-rose-900 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-rose-800 focus:ring-offset-2 dark:focus:ring-offset-stone-800"
              >
                {t('ideologies_page.view_philosophers_in_this_group')}
              </button>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-8 text-center text-gray-500 dark:text-gray-400">
        {t('ideologies_page.page_description')}
      </p>
    </section>
  );
}