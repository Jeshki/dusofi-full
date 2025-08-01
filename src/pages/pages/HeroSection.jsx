// src/pages/HeroSection.jsx
import React from "react";
import whiteLogo from "./img/white-logo.svg";
import { useTranslation } from 'react-i18next'; // <--- Importuokite useTranslation

export default function HeroSection() {
  const { t } = useTranslation(); // <--- Inicijuokite useTranslation

  return (
    <section className="bg-very-dark-gray text-white py-6 px-6 sm:px-12 lg:px-20">
      <div className="w-full max-w-screen-xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
        <div className="max-w-xl text-center lg:text-left">
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-2 uppercase tracking-wide font-serif" dangerouslySetInnerHTML={{ __html: t('hero_section.title') }}>
            {/* Tekstas atvaizduojamas per dangerouslySetInnerHTML, kad būtų palaikytas <br /> */}
          </h1> {/* <--- Naudokite t() funkciją ir dangerouslySetInnerHTML */}
          <p className="text-lg text-gray-300">{t('hero_section.subtitle')}</p> {/* <--- Naudokite t() funkciją */}
        </div>
        <img
          src={whiteLogo}
          alt="DuSofi Philosophy Logo"
          title="DuSofi Philosophy Logo"
          className="w-48 h-48 sm:w-80 sm:h-80 lg:w-96 lg:h-96 object-contain"
          loading="lazy"
          decoding="async"
        />
      </div>
    </section>
  );
}