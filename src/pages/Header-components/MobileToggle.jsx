// src/pages/Header-components/MobileToggle.jsx
import React from "react";
import { HiMenu, HiX } from "react-icons/hi";
import { useTranslation } from 'react-i18next';

export default function MobileToggle({ isOpen, setIsOpen, darkMode }) {
  const { t } = useTranslation();

  return (
    <button
      onClick={() => setIsOpen(!isOpen)}
      className={`md:hidden text-2xl p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-rose-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors`}
      aria-label={isOpen ? t('header.close_menu') : t('header.open_menu')}
      aria-expanded={isOpen}
      aria-controls="mobile-menu"
      type="button"
    >
      {isOpen ? <HiX /> : <HiMenu />}
    </button>
  );
}