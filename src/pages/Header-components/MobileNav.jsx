// src/pages/Header-components/MobileNav.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import { BsSunFill, BsMoonStarsFill } from "react-icons/bs";
import { useTranslation } from 'react-i18next';

export default function MobileNav({ isOpen, setIsOpen, darkMode, setDarkMode }) {
  const { t, i18n } = useTranslation();
  const activeClassName = "text-rose-900 dark:text-rose-700";
  const inactiveClassName = "hover:text-rose-900 dark:hover:text-rose-700 transition-colors";
  const closeMenu = () => setIsOpen(false);

  // Funkcija kalbos perjungimui
  const toggleDarkModeAndCloseMenu = () => {
    setDarkMode(!darkMode);
    closeMenu();
  };

  return (
    <div id="mobile-menu" className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out transform ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
      <ul className="flex flex-col gap-4 px-6 pb-6 pt-2 text-lg font-medium uppercase tracking-wide text-gray-700 dark:text-gray-300" style={{ fontFamily: "'Cinzel', serif" }}>
        <li><NavLink to="/" onClick={closeMenu} className={({ isActive }) => isActive ? activeClassName : inactiveClassName} end>{t('header.home')}</NavLink></li>
        <li><NavLink to="/philosophers" onClick={closeMenu} className={({ isActive }) => isActive ? activeClassName : inactiveClassName}>{t('header.philosophers')}</NavLink></li>
        <li><NavLink to="/Ideologies" onClick={closeMenu} className={({ isActive }) => isActive ? activeClassName : inactiveClassName}>{t('header.ideologies')}</NavLink></li>
        <li><NavLink to="/Quotes" onClick={closeMenu} className={({ isActive }) => isActive ? activeClassName : inactiveClassName}>{t('header.quotes')}</NavLink></li>
        <li><NavLink to="/about" onClick={closeMenu} className={({ isActive }) => isActive ? activeClassName : inactiveClassName}>{t('header.about')}</NavLink></li>
        <li className="mt-2">
          <button onClick={toggleDarkModeAndCloseMenu} className="w-12 h-6 rounded-full flex items-center px-1 transition-all duration-300 bg-zinc-300 dark:bg-zinc-700" aria-label="Toggle dark mode">
            <div className={`transform transition-transform duration-300 ${darkMode ? "translate-x-6" : "translate-x-0"}`}>
              {darkMode ? <BsSunFill className="text-white" /> : <BsMoonStarsFill className="text-gray-800" />}
            </div>
          </button>
        </li>
        {/* Kalbos perjungimo mygtukai */}
        <li className="flex gap-2 mt-2">
          <button
            onClick={() => { i18n.changeLanguage('en'); closeMenu(); }}
            className={`px-3 py-1 rounded-md text-sm font-medium ${i18n.language === 'en' ? 'bg-rose-900 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
          >
            EN
          </button>
          <button
            onClick={() => { i18n.changeLanguage('lt'); closeMenu(); }}
            className={`px-3 py-1 rounded-md text-sm font-medium ${i18n.language === 'lt' ? 'bg-rose-900 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
          >
            LT
          </button>
        </li>
      </ul>
    </div>
  );
}