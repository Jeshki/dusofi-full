// src/PhilosopherCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Tailwind CSS stiliaus konstantos mygtukams
const buttonStyle = "w-full text-center px-3 py-1.5 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-stone-950 transition-colors duration-200 text-xs sm:text-sm font-medium min-w-[60px]";
const primaryButtonStyle = `${buttonStyle} bg-black text-white dark:bg-white dark:text-black hover:bg-gray-700 dark:hover:bg-gray-300 focus:ring-black dark:focus:ring-white`;
const secondaryButtonStyle = `${buttonStyle} bg-white text-black border border-black dark:bg-stone-800 dark:text-white dark:border-stone-600 hover:bg-gray-200 dark:hover:bg-stone-700 focus:ring-gray-500 dark:focus:ring-gray-400`;

// PhilosopherCard komponentas, skirtas filosofo informacijai atvaizduoti kortelės pavidalu.
// Priima 'philosopher' objektą, 'onClick' funkciją (modalui) ir 'linkToDetail' boolean'ą.
export default function PhilosopherCard({ philosopher, onClick, linkToDetail = false }) {
  const { t, i18n } = useTranslation();

  // Grąžina null, jei filosofo objektas nėra perduotas (apsauga)
  if (!philosopher) return null;

  // Funkcija, skirta gauti lokalizuotą citatą
  const getLocalizedQuote = () => {
    const localizedQuoteKey = `quote_${i18n.language}`;
    return philosopher[localizedQuoteKey] || philosopher.quote;
  };

  // Kortelės turinys, apgaubtas React fragmentu.
  // Tai leidžia lengvai apgaubti jį <Link> komponentu, jei reikia.
  const cardContent = (
    <>
      {/* Paveikslėlio konteineris */}
      <div className="w-full aspect-[4/3] bg-white dark:bg-zinc-900 flex items-center justify-center overflow-hidden border-b border-gray-200 dark:border-stone-800">
        <img
          src={philosopher.img}
          className="w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
          alt={philosopher.name}
          loading="lazy"
          onError={(e) => { e.target.onerror = null; e.target.src = '/placeholder-image.jpg'; }}
        />
      </div>

      {/* Turinio konteineris (vardas, metai, citata, mygtukai) */}
      <div className="px-4 sm:px-5 pb-4 pt-3 text-center flex flex-col flex-grow">
        {/* Filosofo vardas */}
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1 truncate" title={philosopher.name}>
          {philosopher.name}
        </h3>
        {/* Filosofo gyvenimo metai */}
        <p className="text-xs text-gray-500 dark:text-gray-400">{philosopher.years}</p>

        {/* Cituojama filosofo citata (jei yra) */}
        <p className="mt-2 italic text-sm text-gray-600 dark:text-gray-300 text-left relative flex-grow min-h-[3em]">
          {getLocalizedQuote() ? `“${getLocalizedQuote()}”` : <span className="text-gray-400 dark:text-gray-500">{t('philosopher_card.no_quote_available')}</span>}
        </p>

        {/* Mygtukai rodomi tik tada, jei 'linkToDetail' yra false (t.y., kai kortelė skirta modalui) */}
        {!linkToDetail && onClick && (
          <div className="flex flex-col gap-2 mt-4 mt-auto">
            <div className="grid grid-cols-2 gap-2">
              {/* Mygtukas "Biography" */}
              {(philosopher.biography || philosopher.bio || philosopher.about) && (
                <button onClick={() => onClick(philosopher, 'biography')} className={secondaryButtonStyle} aria-label={`Biography of ${philosopher.name}`} title={`Show biography of ${philosopher.name}`}>{t('philosopher_page.biography')}</button>
              )}
              {/* Mygtukas "Short Story" */}
              {philosopher.shortStory && (
                <button onClick={() => onClick(philosopher, 'shortStory')} className={secondaryButtonStyle} aria-label={`Short Story of ${philosopher.name}`} title={`Show short story of ${philosopher.name}`}>{t('philosopher_page.short_story')}</button>
              )}
            </div>
            {/* Mygtukas "Quotes" - dabar juodas ir užima visą plotį */}
            {philosopher.quotes && philosopher.quotes.length > 0 && (
              <button onClick={() => onClick(philosopher, 'quotes')} className={`${primaryButtonStyle} w-full`} aria-label={`Quotes by ${philosopher.name}`} title={`Show quotes by ${philosopher.name}`}>{t('philosopher_page.quotes')}</button>
            )}
          </div>
        )}
        {/* "View Details" tekstas rodomas, jei kortelė yra nuoroda į detalų puslapį */}
        {linkToDetail && (
          <div className="mt-4 text-center mt-auto">
            <span className="text-xs font-medium text-rose-900 dark:text-rose-700 group-hover:underline">
              {t('philosopher_card.view_details')}
            </span>
          </div>
        )}
      </div>
    </>
  );

  if (linkToDetail) {
    return (
      <Link
        to={`/philosopher/${philosopher.id}`}
        className="bg-gray-100 dark:bg-stone-950 rounded-lg shadow-lg overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 group border border-gray-300 dark:border-stone-700 flex flex-col no-underline"
      >
        {cardContent}
      </Link>
    );
  }

  return (
    <div
      className="bg-gray-100 dark:bg-stone-950 rounded-lg shadow-lg overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 group border border-gray-300 dark:border-stone-700 flex flex-col"
    >
      {cardContent}
    </div>
  );
}