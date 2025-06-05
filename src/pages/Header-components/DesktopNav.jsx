// src/pages/Header-components/DesktopNav.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import { BsSunFill, BsMoonStarsFill } from "react-icons/bs";
import { useTranslation } from 'react-i18next';

export default function DesktopNav({ darkMode, setDarkMode }) {
  const { t, i18n } = useTranslation();
  const activeClassName = "text-rose-900 dark:text-rose-700";
  const inactiveClassName = "hover:text-rose-900 dark:hover:text-rose-700 transition-colors";

  return (
    <ul
      className="hidden md:flex gap-6 items-center text-lg font-medium uppercase tracking-wide text-gray-700 dark:text-gray-300"
      style={{ fontFamily: "'Cinzel', serif" }}
    >
      <li><NavLink to="/" className={({ isActive }) => isActive ? activeClassName : inactiveClassName} end>{t('header.home')}</NavLink></li>
      <li><NavLink to="/philosophers" className={({ isActive }) => isActive ? activeClassName : inactiveClassName}>{t('header.philosophers')}</NavLink></li>
      <li><NavLink to="/Ideologies" className={({ isActive }) => isActive ? activeClassName : inactiveClassName}>{t('header.ideologies')}</NavLink></li>
      <li><NavLink to="/Quotes" className={({ isActive }) => isActive ? activeClassName : inactiveClassName}>{t('header.quotes')}</NavLink></li>
      <li><NavLink to="/about" className={({ isActive }) => isActive ? activeClassName : inactiveClassName}>{t('header.about')}</NavLink></li>
      {/* Dark mode toggle */}
      <li>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="w-12 h-6 rounded-full flex items-center px-1 transition-all duration-300 bg-zinc-300 dark:bg-zinc-700"
          aria-label="Toggle dark mode"
        >
          <div className={`transform transition-transform duration-300 ${darkMode ? "translate-x-6" : "translate-x-0"}`}>
            {darkMode ? <BsSunFill className="text-white" /> : <BsMoonStarsFill className="text-gray-800" />}
          </div>
        </button>
      </li>
      {/* Kalbos perjungimo mygtukai */}
      <li>
        <button
          onClick={() => i18n.changeLanguage('en')}
          className={`px-3 py-1 rounded-md text-sm font-medium ${i18n.language === 'en' ? 'bg-rose-900 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
        >
          EN
        </button>
      </li>
      <li>
        <button
          onClick={() => i18n.changeLanguage('lt')}
          className={`px-3 py-1 rounded-md text-sm font-medium ${i18n.language === 'lt' ? 'bg-rose-900 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
        >
          LT
        </button>
      </li>
    </ul>
  );
}