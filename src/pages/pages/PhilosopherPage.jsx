// src/pages/PhilosopherPage.jsx
import React, { useState } from 'react';
import { useParams } from "react-router-dom";
import { philosophers } from "../data";
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO.jsx';

// Helper component to render content with paragraphs
const RenderContentWithFallback = ({ content, fallbackMessage }) => {
  if (!content) {
    return <p>{fallbackMessage}</p>;
  }
  return content.split('\n').map((paragraph, index) => (
    paragraph.trim() && <p key={index}>{paragraph.trim()}</p>
  ));
};

export default function PhilosopherPage() {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('biography');

  const philosopher = philosophers.find(p => p.id === parseInt(id, 10));

  if (!philosopher) {
    return (
      <>
        <SEO
          title={t('seo.philosopher_not_found_title')}
          description={t('seo.philosopher_not_found_description')}
        />
        <div className="max-w-3xl mx-auto px-6 py-12 text-center text-xl text-gray-600 dark:text-gray-400">
          {t('philosopher_page.philosopher_not_found')}
        </div>
      </>
    );
  }

  const getLocalizedContent = (key) => {
    const localizedKey = `${key}_${i18n.language}`;
    return philosopher[localizedKey] || philosopher[key];
  };

  const getBiographyContent = () => {
    return getLocalizedContent('biography');
  };

  const getShortStoryContent = () => {
    return getLocalizedContent('shortStory');
  };

  const getQuotesContent = () => {
    return getLocalizedContent('quotes');
  };

  return (
    <section className="max-w-3xl mx-auto px-6 py-12">
      <SEO
        title={t('seo.philosopher_page_title_dynamic', { philosopherName: philosopher.name })}
        description={t('seo.philosopher_page_description_dynamic', { philosopherName: philosopher.name, years: philosopher.years })}
      />
      {/* Pakeista į h1 */}
      <h1 className="text-4xl font-bold mb-2 text-center text-gray-900 dark:text-gray-100">{philosopher.name}</h1>
      <p className="text-lg text-gray-500 dark:text-gray-400 mb-6 text-center">{philosopher.years}</p>

      <div className="w-full flex justify-center mb-8">
        <img
          src={philosopher.img}
          alt={philosopher.name}
          className="w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] lg:w-[512px] lg:h-[512px] object-cover rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
          loading="lazy"
        />
      </div>

      <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-8">
        {getBiographyContent() && (
          <button
            onClick={() => setActiveTab('biography')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'biography' ? 'bg-rose-900 text-white shadow-md' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {t('philosopher_page.biography')}
          </button>
        )}
        {getShortStoryContent() && (
          <button
            onClick={() => setActiveTab('shortStory')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'shortStory' ? 'bg-rose-900 text-white shadow-md' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {t('philosopher_page.short_story')}
          </button>
        )}
        {getQuotesContent() && getQuotesContent().length > 0 && (
          <button
            onClick={() => setActiveTab('quotes')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'quotes' ? 'bg-rose-900 text-white shadow-md' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {t('philosopher_page.quotes')}
          </button>
        )}
      </div>

      <div className="text-lg leading-relaxed text-gray-800 dark:text-gray-300 space-y-4 prose dark:prose-invert max-w-none">
        {activeTab === 'biography' && (
          <RenderContentWithFallback
            content={getBiographyContent()}
            fallbackMessage={t('philosopher_page.no_detailed_biography_available')}
          />
        )}

        {activeTab === 'shortStory' && (
          <RenderContentWithFallback
            content={getShortStoryContent()}
            fallbackMessage={t('philosopher_page.no_short_story_available')}
          />
        )}

        {activeTab === 'quotes' && getQuotesContent() && getQuotesContent().length > 0 ? (
          <ul className="list-disc pl-5 space-y-2">
            {getQuotesContent().map((quote, index) => (
              <li key={index} className="">"{quote}"</li>
            ))}
          </ul>
        ) : (
          activeTab === 'quotes' && <p>{t('philosopher_page.no_quotes_available')}</p>
        )}
      </div>
    </section>
  );
}