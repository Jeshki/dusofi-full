// src/views/Header-components/DesktopNav.jsx
"use client";

import React from "react";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";
import { useLocale, useTranslations } from "next-intl";

import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { usePhilosopherUi } from "@/context/PhilosopherUiContext";

function navClass(isActive, activeClassName, inactiveClassName) {
  return isActive ? activeClassName : inactiveClassName;
}

export default function DesktopNav() {
  const t = useTranslations();
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const { darkMode, setDarkMode } = usePhilosopherUi();

  const activeClassName = "text-rose-900 dark:text-rose-700";
  const inactiveClassName = "hover:text-rose-900 dark:hover:text-rose-700 transition-colors";

  const isActivePath = (href) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <nav className="hidden md:flex items-center" aria-label={t("header.main_nav")}>
      <ul
        className="flex gap-6 items-center text-lg font-medium uppercase tracking-wide text-gray-700 dark:text-gray-300"
        style={{ fontFamily: "'Cinzel', serif" }}
      >
        <li>
          <Link href="/" className={navClass(isActivePath("/"), activeClassName, inactiveClassName)}>
            {t("header.home")}
          </Link>
        </li>
        <li>
          <Link
            href="/philosophers"
            className={navClass(isActivePath("/philosophers"), activeClassName, inactiveClassName)}
          >
            {t("header.philosophers")}
          </Link>
        </li>
        <li>
          <Link
            href="/ideologies"
            className={navClass(isActivePath("/ideologies"), activeClassName, inactiveClassName)}
          >
            {t("header.ideologies")}
          </Link>
        </li>
        <li>
          <Link href="/quotes" className={navClass(isActivePath("/quotes"), activeClassName, inactiveClassName)}>
            {t("header.quotes")}
          </Link>
        </li>
        <li>
          <Link href="/about" className={navClass(isActivePath("/about"), activeClassName, inactiveClassName)}>
            {t("header.about")}
          </Link>
        </li>
        <li>
          <button
            type="button"
            onClick={() => setDarkMode(!darkMode)}
            className="w-12 h-6 rounded-full flex items-center px-1 transition-all duration-300 bg-zinc-300 dark:bg-zinc-700"
            aria-label={darkMode ? t("header.activate_light_mode") : t("header.activate_dark_mode")}
          >
            <div
              className={`transform transition-transform duration-300 ${darkMode ? "translate-x-6" : "translate-x-0"}`}
            >
              {darkMode ? <SunIcon className="text-white h-5 w-5" /> : <MoonIcon className="text-gray-800 h-5 w-5" />}
            </div>
          </button>
        </li>
        <li className="flex items-center">
          <label className="sr-only" htmlFor="lang-select-desktop">
            {t("header.language")}
          </label>
          <select
            id="lang-select-desktop"
            value={locale}
            onChange={(e) => {
              const nextLocale = e.target.value;
              router.replace(pathname, { locale: nextLocale });
            }}
            className="px-3 py-1 rounded-md text-sm font-medium bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-rose-700 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            aria-label={t("header.language")}
          >
            <option value="en">EN</option>
            <option value="lt">LT</option>
            <option value="fr">FR</option>
            <option value="de">DE</option>
            <option value="es">ES</option>
            <option value="it">IT</option>
          </select>
        </li>
      </ul>
    </nav>
  );
}
