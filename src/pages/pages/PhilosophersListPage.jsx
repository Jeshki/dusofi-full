// src/pages/PhilosophersListPage.jsx
import React from 'react';
import Filters from '../Filters.jsx';
import PhilosopherCard from '../PhilosopherCard.jsx';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO.jsx'; // Importuojame SEO komponentą

export default function PhilosophersListPage({
  filteredPhilosophers,
  selectedGroup,
  setSelectedGroup,
  selectedRegion,
  setSelectedRegion,
  sortBy,
  setSortBy,
  selectedChronologicalOrder,
  setSelectedChronologicalOrder,
  handleClearAllFilters
}) {
  const { t } = useTranslation();

  return (
    <>
      <SEO
        title={t('seo.philosophers_page_title')}
        description={t('seo.philosophers_page_description')}
      />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-8">
         <h1 className="text-4xl font-bold mb-8 text-center uppercase text-gray-900 dark:text-gray-100">
           {t('philosophers_list_page.title')}
         </h1>
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
        <div className="flex justify-center mt-4">
          <button
            onClick={handleClearAllFilters}
            className="px-5 py-2 bg-rose-700 text-white rounded-lg shadow-md hover:bg-rose-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-rose-700 focus:ring-offset-2 dark:focus:ring-offset-stone-900"
          >
            {t('filters.reset_all')}
          </button>
        </div>
      </section>

      <section id="philosophers-list" className="max-w-7xl mx-auto px-4 sm:px-6 mt-12">
        {filteredPhilosophers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPhilosophers.map((p) => (
              <PhilosopherCard
                key={p.id}
                philosopher={p}
                linkToDetail={true}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 text-lg mt-8">
            {t('philosophers_list_page.no_philosophers_found')}
          </p>
        )}
      </section>
    </>
  );
}