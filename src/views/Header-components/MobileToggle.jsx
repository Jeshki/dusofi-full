// src/views/Header-components/MobileToggle.jsx
"use client";

import React from "react";
import { HiMenu, HiX } from "react-icons/hi";
import { useTranslations } from "next-intl";

export default function MobileToggle({ isOpen, setIsOpen }) {
  const t = useTranslations();

  return (
    <button
      type="button"
      onClick={() => setIsOpen(!isOpen)}
      className="md:hidden text-2xl p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-rose-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      aria-label={isOpen ? t("header.close_menu") : t("header.open_menu")}
      aria-expanded={isOpen}
      aria-controls="mobile-menu"
    >
      {isOpen ? <HiX /> : <HiMenu />}
    </button>
  );
}
