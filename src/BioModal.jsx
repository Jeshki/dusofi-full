// src/BioModal.jsx
import React from "react";
import { useTranslation } from 'react-i18next'; //

export default function BioModal({ philosopher, contentType, onClose }) {
  const { t, i18n } = useTranslation(); //

  if (!philosopher) {
    return null;
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose(); //
    }
  };

  // Funkcija, skirta gauti versto turinio lauką
  const getLocalizedContent = (key) => {
    const localizedKey = `${key}_${i18n.language}`; //
    return philosopher[localizedKey] || philosopher[key]; //
  };

  const getBiographyContent = () => {
    return getLocalizedContent('biography') || t('philosopher_page.no_detailed_biography_available'); //
  };

  const getShortStoryContent = () => {
    return getLocalizedContent('shortStory') || t('philosopher_page.no_short_story_available'); //
  };

  const getQuotesContent = () => {
    return getLocalizedContent('quotes'); //
  };

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
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 text-3xl leading-none transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-very-dark-gray rounded-full w-8 h-8 flex items-center justify-center"
          aria-label="Close modal"
        >
          &times;
        </button>

        <h3 id="modal-title" className="text-3xl font-bold mb-1 text-gray-800 dark:text-gray-50 pr-8">
          {philosopher.name}
        </h3>
        <p className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 mb-4 capitalize">
          {contentType === 'biography' ? t('philosopher_page.biography') : t(`philosopher_page.${contentType}`)} {/* Naudojame lokalizuotus raktus */}
        </p>
        {philosopher.years && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            {philosopher.years}
          </p>
        )}

        <div className="prose dark:prose-invert max-w-none mt-4 text-base leading-relaxed space-y-4">
          {contentType === 'biography' && getBiographyContent().split('\n').map((paragraph, index) => (
            // Tikriname, ar paragraph.trim() yra ne tuščia eilutė, kad nepridėtų tuščių <p> tagų
            paragraph.trim() && <p key={index}>{paragraph.trim()}</p>
          ))}
          {contentType === 'shortStory' && getShortStoryContent().split('\n').map((paragraph, index) => (
            // Tikriname, ar paragraph.trim() yra ne tuščia eilutė, kad nepridėtų tuščių <p> tagų
            paragraph.trim() && <p key={index}>{paragraph.trim()}</p>
          ))}
          {contentType === 'quotes' && getQuotesContent() && getQuotesContent().length > 0 ? (
            <ul className="list-disc pl-5 space-y-2">
              {getQuotesContent().map((quote, index) => (
                <li key={index} className="">"{quote}"</li>
              ))}
            </ul>
          ) : (
            contentType === 'quotes' && <p>{t('philosopher_page.no_quotes_available')}</p> // Naudojame lokalizuotą tekstą
          )}
           {/* Pranešimas, jei pasirinktam skirtukui trūksta turinio */}
           {(contentType === 'biography' && !getLocalizedContent('biography')) && (
            <p>{t('philosopher_page.no_detailed_biography_available')}</p> // Naudojame lokalizuotą tekstą
          )}
           {(contentType === 'shortStory' && !getLocalizedContent('shortStory')) && (
            <p>{t('philosopher_page.no_short_story_available')}</p> // Naudojame lokalizuotą tekstą
          )}
        </div>
      </div>
    </div>
  );
}