// src/pages/Header-components/MobileNav.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import { BsSunFill, BsMoonStarsFill } from "react-icons/bs";
import { useTranslation } from 'react-i18next';
import DonateButton from "./Donate.jsx";

export default function MobileNav({ isOpen, setIsOpen, darkMode, setDarkMode }) {
  const { t, i18n } = useTranslation();
  const activeClassName = "text-rose-900 dark:text-rose-700";
  const inactiveClassName = "hover:text-rose-900 dark:hover:text-rose-700 transition-colors";
  const closeMenu = () => setIsOpen(false);

  const toggleDarkModeAndCloseMenu = () => {
    setDarkMode(!darkMode);
    closeMenu();
  };

  return (
    <nav
      id="mobile-menu"
      className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"}`}
      aria-label={t('header.main_nav_mobile')}
    >
      <div className="max-h-[calc(100vh-200px)] overflow-y-auto pb-10">
        <ul className="flex flex-col gap-4 px-6 pt-2 text-lg font-medium uppercase tracking-wide text-gray-700 dark:text-gray-300" style={{ fontFamily: "'Cinzel', serif" }}>
          <li><NavLink to="/" onClick={closeMenu} className={({ isActive }) => isActive ? activeClassName : inactiveClassName} end>{t('header.home')}</NavLink></li>
          <li><NavLink to="/philosophers" onClick={closeMenu} className={({ isActive }) => isActive ? activeClassName : inactiveClassName}>{t('header.philosophers')}</NavLink></li>
          <li><NavLink to="/ideologies" onClick={closeMenu} className={({ isActive }) => isActive ? activeClassName : inactiveClassName}>{t('header.ideologies')}</NavLink></li>
          <li><NavLink to="/quotes" onClick={closeMenu} className={({ isActive }) => isActive ? activeClassName : inactiveClassName}>{t('header.quotes')}</NavLink></li>
          <li><NavLink to="/about" onClick={closeMenu} className={({ isActive }) => isActive ? activeClassName : inactiveClassName}>{t('header.about')}</NavLink></li>
          
          {/* Add Donate Button */}
          <li className="mt-1">
            <DonateButton onMenuClose={closeMenu} />
          </li>

          {/* Dark Mode Toggle */}
          <li className="mt-2">
            <button
              onClick={toggleDarkModeAndCloseMenu}
              className="w-12 h-6 rounded-full flex items-center px-1 transition-all duration-300 bg-zinc-300 dark:bg-zinc-700"
              aria-label={darkMode ? t('header.activate_light_mode') : t('header.activate_dark_mode')}
              type="button"
            >
              <div className={`transform transition-transform duration-300 ${darkMode ? "translate-x-6" : "translate-x-0"}`}>
                {darkMode ? (
                  <BsSunFill className="text-yellow-400 w-4 h-4" />
                ) : (
                  <BsMoonStarsFill className="text-gray-800 w-4 h-4" />
                )}
              </div>
            </button>
          </li>

          {/* Language Selection */}
          <li className="flex gap-2 mt-2">
            <button
              onClick={() => { i18n.changeLanguage('en'); closeMenu(); }}
              className={`px-3 py-1 rounded-md text-sm font-medium ${i18n.language === 'en' ? 'bg-rose-900 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
              aria-label={t('header.change_lang_en')}
              type="button"
            >
              EN
            </button>
            <button
              onClick={() => { i18n.changeLanguage('lt'); closeMenu(); }}
              className={`px-3 py-1 rounded-md text-sm font-medium ${i18n.language === 'lt' ? 'bg-rose-900 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
              aria-label={t('header.change_lang_lt')}
              type="button"
            >
              LT
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
