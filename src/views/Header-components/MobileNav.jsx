// src/views/Header-components/MobileNav.jsx
"use client";

import React from "react";
import { BsSunFill, BsMoonStarsFill } from "react-icons/bs";
import { useLocale, useTranslations } from "next-intl";

import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { usePhilosopherUi } from "@/context/PhilosopherUiContext";

function navClass(isActive, activeClassName, inactiveClassName) {
  return isActive ? activeClassName : inactiveClassName;
}

export default function MobileNav({ isOpen, setIsOpen }) {
  const t = useTranslations();
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const { darkMode, setDarkMode } = usePhilosopherUi();

  const activeClassName = "text-rose-900 dark:text-rose-700";
  const inactiveClassName = "hover:text-rose-900 dark:hover:text-rose-700 transition-colors";
  const closeMenu = () => setIsOpen(false);

  const isActivePath = (href) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  const toggleDarkModeAndCloseMenu = () => {
    setDarkMode(!darkMode);
    closeMenu();
  };

  return (
    <nav
      id="mobile-menu"
      className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
        isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
      }`}
      aria-label={t("header.main_nav_mobile")}
    >
      <div className="max-h-[calc(100vh-200px)] overflow-y-auto pb-10">
        <ul
          className="flex flex-col gap-4 px-6 pt-2 text-lg font-medium uppercase tracking-wide text-gray-700 dark:text-gray-300"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          <li>
            <Link
              href="/"
              onClick={closeMenu}
              className={navClass(isActivePath("/"), activeClassName, inactiveClassName)}
            >
              {t("header.home")}
            </Link>
          </li>
          <li>
            <Link
              href="/philosophers"
              onClick={closeMenu}
              className={navClass(isActivePath("/philosophers"), activeClassName, inactiveClassName)}
            >
              {t("header.philosophers")}
            </Link>
          </li>
          <li>
            <Link
              href="/ideologies"
              onClick={closeMenu}
              className={navClass(isActivePath("/ideologies"), activeClassName, inactiveClassName)}
            >
              {t("header.ideologies")}
            </Link>
          </li>
          <li>
            <Link
              href="/quotes"
              onClick={closeMenu}
              className={navClass(isActivePath("/quotes"), activeClassName, inactiveClassName)}
            >
              {t("header.quotes")}
            </Link>
          </li>
          <li>
            <Link
              href="/about"
              onClick={closeMenu}
              className={navClass(isActivePath("/about"), activeClassName, inactiveClassName)}
            >
              {t("header.about")}
            </Link>
          </li>

          <li className="mt-2">
            <button
              type="button"
              onClick={toggleDarkModeAndCloseMenu}
              className="w-12 h-6 rounded-full flex items-center px-1 transition-all duration-300 bg-zinc-300 dark:bg-zinc-700"
              aria-label={darkMode ? t("header.activate_light_mode") : t("header.activate_dark_mode")}
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

          <li className="mt-2">
            <label className="sr-only" htmlFor="lang-select-mobile">
              {t("header.language")}
            </label>
            <select
              id="lang-select-mobile"
              value={locale}
              onChange={(e) => {
                const nextLocale = e.target.value;
                router.replace(pathname, { locale: nextLocale });
                closeMenu();
              }}
              className="w-full px-3 py-2 rounded-md text-sm font-medium bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-rose-700 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              aria-label={t("header.language")}
            >
              <option value="en">English (EN)</option>
              <option value="lt">Lietuvių (LT)</option>
              <option value="fr">Français (FR)</option>
              <option value="de">Deutsch (DE)</option>
              <option value="es">Español (ES)</option>
              <option value="it">Italiano (IT)</option>
            </select>
          </li>
        </ul>
      </div>
    </nav>
  );
}
