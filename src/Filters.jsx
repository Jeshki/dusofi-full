// src/Filters.jsx
import React from 'react'; // Būtinai importuojame React
import { useTranslation } from 'react-i18next'; // <--- Importuokite useTranslation
import { IdeologicalGroups, GeographicalOrderEnum, ChronologicalOrderEnum } from './enums'; // Importuojame reikalingus enums

// Atskiri filtrų komponentai
export function GeoFilter({ selectedRegion, setSelectedRegion }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col">
      <label htmlFor="region" className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">{t('filters.geographical_region')}</label>
      <select
        id="region"
        value={selectedRegion}
        onChange={(e) => setSelectedRegion(e.target.value)}
        className="p-2 rounded-xl border border-gray-300 focus:outline-none focus:ring focus:ring-blue-300 dark:bg-gray-800 dark:border-gray-600 dark:text-white h-[42px]"
      >
        <option value="">{t('filters.all_regions')}</option>
        {Object.entries(GeographicalOrderEnum).map(([key, value]) => (
          <option key={key} value={value}>{t(`geographical_regions.${key}`)}</option>
        ))}
      </select>
    </div>
  );
}

export function ChronologicalFilter({ selectedChronologicalOrder, setSelectedChronologicalOrder }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col">
      <label htmlFor="chronological-order" className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">{t('filters.chronological_order')}</label>
      <select
        id="chronological-order"
        value={selectedChronologicalOrder}
        onChange={(e) => setSelectedChronologicalOrder(e.target.value)}
        className="p-2 rounded-xl border border-gray-300 focus:outline-none focus:ring focus:ring-orange-300 dark:bg-gray-800 dark:border-gray-600 dark:text-white h-[42px]"
      >
        <option value="">{t('filters.all_periods')}</option>
        {Object.entries(ChronologicalOrderEnum).map(([key, value]) => (
          <option key={key} value={value}>{t(`chronological_periods.${key}`)}</option>
        ))}
      </select>
    </div>
  );
}

export function GroupFilter({ selectedGroup, setSelectedGroup }) {
    const { t } = useTranslation();
    return (
      <div className="flex flex-col">
        <label htmlFor="group" className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">{t('filters.ideological_group')}</label>
        <select
          id="group"
          value={selectedGroup}
          onChange={(e) => setSelectedGroup(e.target.value)}
          className="p-2 rounded-xl border border-gray-300 focus:outline-none focus:ring focus:ring-rose-600 dark:bg-gray-800 dark:border-gray-600 dark:text-white h-[42px]"
        >
          <option value="">{t('filters.all_groups')}</option>
          {IdeologicalGroups && typeof IdeologicalGroups === 'object' && Object.keys(IdeologicalGroups).map((groupKey) => (
            <option key={groupKey} value={groupKey}>{t(`ideological_groups_display.${groupKey}`)}</option>
          ))}
        </select>
      </div>
    );
}

// Pagrindinis Filters komponentas, apjungiantis visus filtrus ir eksportuojamas kaip default
export default function Filters({
  selectedGroup,
  setSelectedGroup,
  selectedRegion,
  setSelectedRegion,
  sortBy,
  setSortBy,
  selectedChronologicalOrder,
  setSelectedChronologicalOrder,
}) {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      <GroupFilter selectedGroup={selectedGroup} setSelectedGroup={setSelectedGroup} />
      <GeoFilter selectedRegion={selectedRegion} setSelectedRegion={setSelectedRegion} />
      <ChronologicalFilter selectedChronologicalOrder={selectedChronologicalOrder} setSelectedChronologicalOrder={setSelectedChronologicalOrder} />

      {/* Rūšiavimo filtras */}
      <div className="flex flex-col">
        <label htmlFor="sort-by" className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">{t('filters.sort_by')}</label>
        <select
          id="sort-by"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="p-2 rounded-xl border border-gray-300 focus:outline-none focus:ring focus:ring-purple-300 dark:bg-gray-800 dark:border-gray-600 dark:text-white h-[42px]"
        >
          <option value="oldest_first">{t('filters.oldest_first')}</option>
          <option value="youngest_first">{t('filters.youngest_first')}</option>
        </select>
      </div>
    </div>
  );
}