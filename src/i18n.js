// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Importuojame vertimo failus (juos sukursime vėliau)
import enTranslation from './locales/en/translation.json'; // Pakeistas kelias
import ltTranslation from './locales/lt/translation.json'; // Pakeistas kelias

i18n
  .use(LanguageDetector) // Naudoja naršyklės kalbos aptikimą
  .use(initReactI18next) // Perduoda i18n instanciją react-i18next
  .init({
    fallbackLng: 'en', // Numatoma kalba, jei pasirinkta kalba nerasta
    debug: true, // Įjunkite derinimą kūrimo metu, kad matytumėte konsolės pranešimus
    detection: {
      order: ['queryString', 'cookie', 'localStorage', 'navigator', 'htmlTag'], // Kalbos aptikimo tvarka
      caches: ['localStorage', 'cookie'], // Kur saugoti aptiktą kalbą
    },
    resources: {
      en: {
        translation: enTranslation, // Anglų kalbos vertimai
      },
      lt: {
        translation: ltTranslation, // Lietuvių kalbos vertimai
      },
    },
    interpolation: {
      escapeValue: false, // React jau apsaugo nuo XSS
    },
    react: {
      useSuspense: false, // Naudosime useTranslation hook'ą be Suspense
    },
  });

export default i18n;