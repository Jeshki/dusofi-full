// src/App.jsx
import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { useTranslation } from 'react-i18next';

// Komponentų importai
import BioModal from "./BioModal.jsx";
import HomePage from "./pages/HomePage.jsx";
import PhilosophersListPage from "./pages/PhilosophersListPage.jsx";
import PhilosopherPage from "./pages/PhilosopherPage.jsx";
import About from "./pages/About.jsx";
import Ideologies from "./pages/Ideologies.jsx";
import Quotes from "./pages/Quotes.jsx";
import Footer from "./pages/Footer.jsx";
import Header from "./pages/Header-components/Header.jsx";
import BackToTopButton from "./pages/BackToTopButton.jsx";
// Pridėta: importuojame PrivacyPolicy ir CookieConsent
import PrivacyPolicy from "./pages/PrivacyPolicy.jsx"; //
import CookieConsent from "./components/CookieConsent.jsx"; //
import { Analytics } from '@vercel/analytics/react';

// Duomenų ir Enum importai
import { philosophers } from "./data.js";
import { IdeologicalGroups, ChronologicalOrderEnum } from "./enums.jsx";

// --- Pagalbinės funkcijos (getStartYear, getEndYear) ---
// Šios funkcijos turi būti eksportuojamos, kad būtų prieinamos kituose failuose
export const getStartYear = (yearsString) => {
  if (!yearsString || typeof yearsString !== 'string') return Infinity;
  const str = yearsString.toLowerCase().trim();
  if (str.includes('unknown')) return Infinity;

  const prefixPattern = '(?:fl\\.\\s*)?(?:c\\.\\s*|ca\\.\\s*|approx\\.\\s*)?'; // Pattern for "fl. ", "c. ", "ca. ", "approx. "

  // Handle ranges spanning BC/BCE to AD/CE (e.g., "c. 4 BC – 65 AD")
  const bcAdMatch = str.match(new RegExp(`${prefixPattern}(\\d+)\\s*(bc|bce)\\s*[-–]\\s*${prefixPattern}(\\d+)(?:\\s*(ad|ce))?`, 'i'));
  // For "c. 4 BC – 65 AD", startYear is -4.
  if (bcAdMatch) {
    return -parseInt(bcAdMatch[1], 10); // Corrected index for the first year (BC part)
  }

  // Handle explicit BC/BCE ranges (e.g., "470–399 BC" or "BC 470–399" or "c. BC 470-399")
  let bcRangeMatch = str.match(new RegExp(`${prefixPattern}(\\d+)\\s*[-–]\\s*${prefixPattern}(\\d+)\\s*(bc|bce)`, 'i'));
  if (bcRangeMatch) { // Format: "470-399 BC"
    return -parseInt(bcRangeMatch[1], 10); // First year in the range
  }
  bcRangeMatch = str.match(new RegExp(`${prefixPattern}(bc|bce)\\s*(\\d+)\\s*[-–]\\s*${prefixPattern}(\\d+)`, 'i'));
  if (bcRangeMatch) { // Format: "BC 470-399"
    return -parseInt(bcRangeMatch[2], 10); // First year is bcRangeMatch[2]
  }

  // Handle single BC/BCE year (e.g., "470 BC" or "BC 470" or "c. BC 470")
  let singleBcYearMatch = str.match(new RegExp(`${prefixPattern}(\\d+)\\s*(bc|bce)`, 'i'));
  if (singleBcYearMatch) { // Format: "470 BC"
      return -parseInt(singleBcYearMatch[1], 10);
  }
  singleBcYearMatch = str.match(new RegExp(`${prefixPattern}(bc|bce)\\s*(\\d+)`, 'i'));
  if (singleBcYearMatch) { // Format: "BC 470" or "c. BC 470"
      return -parseInt(singleBcYearMatch[2], 10); // Year is in the second main capture group
  }

  // Handle century ranges (e.g., "6th century BC" or "BC 6th century")
  let centuryBcMatch = str.match(new RegExp(`${prefixPattern}(\\d+)(st|nd|rd|th)\\s+century\\s+(bc|bce)`, 'i'));
  if (centuryBcMatch) { // Format: "6th century BC"
    const century = parseInt(centuryBcMatch[1], 10);
    return -(century * 100);
  }
  centuryBcMatch = str.match(new RegExp(`${prefixPattern}(bc|bce)\\s*(\\d+)(st|nd|rd|th)\\s+century`, 'i'));
  if (centuryBcMatch) { // Format: "BC 6th century"
    const century = parseInt(centuryBcMatch[2], 10); // Century number is in the second group
    return -(century * 100);
  }

  // Handle AD/CE century ranges (e.g., "5th century AD" or "AD 5th century" or "5th century")
  let centuryAdMatch = str.match(new RegExp(`${prefixPattern}(\\d+)(st|nd|rd|th)\\s+century(?:\\s*(ad|ce))?`, 'i'));
  if (centuryAdMatch) { // Format: "5th century AD" or "5th century"
      const century = parseInt(centuryAdMatch[1], 10);
      return (century - 1) * 100 + 1;
  }
  centuryAdMatch = str.match(new RegExp(`${prefixPattern}(ad|ce)\\s*(\\d+)(st|nd|rd|th)\\s+century`, 'i'));
  if (centuryAdMatch) { // Format: "AD 5th century"
      const century = parseInt(centuryAdMatch[2], 10); // Century number is in the second group
      return (century - 1) * 100 + 1;
  }

  // Handle explicit AD/CE ranges (e.g., "1775–1854", "1775-1854 AD", "AD 1775-1854")
  let adRangeMatch = str.match(new RegExp(`${prefixPattern}(\\d+)\\s*[-–]\\s*${prefixPattern}(\\d+)(?:\\s*(ad|ce))?`, 'i'));
  if (adRangeMatch) { // Format: "1775-1854 AD" or "1775-1854"
      return parseInt(adRangeMatch[1], 10); // First year in the range
  }
  adRangeMatch = str.match(new RegExp(`${prefixPattern}(ad|ce)\\s*(\\d+)\\s*[-–]\\s*${prefixPattern}(\\d+)`, 'i'));
  if (adRangeMatch) { // Format: "AD 1775-1854"
      return parseInt(adRangeMatch[2], 10); // First year is adRangeMatch[2]
  }

  // Handle single AD/CE year (e.g.,"1950", "1950 AD", "AD 1950", "c. AD 1950")
  let singleAdYearMatch = str.match(new RegExp(`${prefixPattern}(\\d+)(?:\\s*(ad|ce))?`, 'i'));
  if (singleAdYearMatch) { // Format: "1950" or "1950 AD"
      return parseInt(singleAdYearMatch[1], 10);
  }
  singleAdYearMatch = str.match(new RegExp(`${prefixPattern}(ad|ce)\\s*(\\d+)`, 'i'));
  if (singleAdYearMatch) { // Format: "AD 1950" or "c. AD 1950"
      return parseInt(singleAdYearMatch[2], 10); // Year is in the second main capture group
  }

  return Infinity;
};

export const getEndYear = (yearsString) => {
  if (!yearsString || typeof yearsString !== 'string') return -Infinity;
  const str = yearsString.toLowerCase().trim();
  if (str.includes('unknown')) return -Infinity;

  const prefixPattern = '(?:fl\\.\\s*)?(?:c\\.\\s*|ca\\.\\s*|approx\\.\\s*)?';
  // Handle ranges spanning BC/BCE to AD/CE (e.g., "c. 4 BC – 65 AD")
  // For "c. 4 BC – 65 AD", endYear is 65.
  const bcAdMatch = str.match(new RegExp(`${prefixPattern}(\\d+)\\s*(bc|bce)\\s*[-–]\\s*${prefixPattern}(\\d+)(?:\\s*(ad|ce))?`, 'i'));
  if (bcAdMatch) {
    return parseInt(bcAdMatch[3], 10); // Corrected index for the second year (AD part)
  }

  // Handle explicit BC/BCE ranges (e.g., "470–399 BC" or "BC 470–399")
  let bcRangeMatch = str.match(new RegExp(`${prefixPattern}(\\d+)\\s*[-–]\\s*${prefixPattern}(\\d+)\\s*(bc|bce)`, 'i'));
  if (bcRangeMatch) { // Format: "470-399 BC"
    return -parseInt(bcRangeMatch[2], 10); // Second year in the range
  }
  bcRangeMatch = str.match(new RegExp(`${prefixPattern}(bc|bce)\\s*(\\d+)\\s*[-–]\\s*${prefixPattern}(\\d+)`, 'i'));
  if (bcRangeMatch) { // Format: "BC 470-399"
    return -parseInt(bcRangeMatch[3], 10); // Second year is bcRangeMatch[3]
  }

  // Handle single BC/BCE year (e.g., "470 BC" or "BC 470")
  let singleBcYearMatch = str.match(new RegExp(`${prefixPattern}(\\d+)\\s*(bc|bce)`, 'i'));
  if (singleBcYearMatch) { // Format: "470 BC"
      return -parseInt(singleBcYearMatch[1], 10);
  }
  singleBcYearMatch = str.match(new RegExp(`${prefixPattern}(bc|bce)\\s*(\\d+)`, 'i'));
  if (singleBcYearMatch) { // Format: "BC 470"
      return -parseInt(singleBcYearMatch[2], 10);
  }

  // Handle century ranges (e.g., "6th century BC" or "BC 6th century")
  let centuryBcMatch = str.match(new RegExp(`${prefixPattern}(\\d+)(st|nd|rd|th)\\s+century\\s+(bc|bce)`, 'i'));
  if (centuryBcMatch) { // Format: "6th century BC"
    const century = parseInt(centuryBcMatch[1], 10);
    return -((century - 1) * 100 + 1);
  }
  centuryBcMatch = str.match(new RegExp(`${prefixPattern}(bc|bce)\\s*(\\d+)(st|nd|rd|th)\\s+century`, 'i'));
  if (centuryBcMatch) { // Format: "BC 6th century"
    const century = parseInt(centuryBcMatch[2], 10);
    return -((century - 1) * 100 + 1);
  }

  // Handle AD/CE century ranges (e.g., "5th century AD" or "AD 5th century" or "5th century")
  let centuryAdMatch = str.match(new RegExp(`${prefixPattern}(\\d+)(st|nd|rd|th)\\s+century(?:\\s*(ad|ce))?`, 'i'));
  if (centuryAdMatch) { // Format: "5th century AD" or "5th century"
      const century = parseInt(centuryAdMatch[1], 10);
      return century * 100;
  }
  centuryAdMatch = str.match(new RegExp(`${prefixPattern}(ad|ce)\\s*(\\d+)(st|nd|rd|th)\\s+century`, 'i'));
  if (centuryAdMatch) { // Format: "AD 5th century"
      const century = parseInt(centuryAdMatch[2], 10);
      return century * 100;
  }

  // Handle explicit AD/CE ranges (e.g., "1775–1854", "1775-1854 AD", "AD 1775-1854")
  let adRangeMatch = str.match(new RegExp(`${prefixPattern}(\\d+)\\s*[-–]\\s*${prefixPattern}(\\d+)(?:\\s*(ad|ce))?`, 'i'));
  if (adRangeMatch) { // Format: "1775-1854 AD" or "1775-1854"
      return parseInt(adRangeMatch[2], 10); // Second year in the range
  }
  adRangeMatch = str.match(new RegExp(`${prefixPattern}(ad|ce)\\s*(\\d+)\\s*[-–]\\s*${prefixPattern}(\\d+)`, 'i'));
  if (adRangeMatch) { // Format: "AD 1775-1854"
      return parseInt(adRangeMatch[3], 10); // Second year is adRangeMatch[3]
  }

  // Handle single AD/CE year (e.g.,"1950", "1950 AD", "AD 1950")
  let singleAdYearMatch = str.match(new RegExp(`${prefixPattern}(\\d+)(?:\\s*(ad|ce))?`, 'i'));
  if (singleAdYearMatch) { // Format: "1950" or "1950 AD"
      return parseInt(singleAdYearMatch[1], 10);
  }
  singleAdYearMatch = str.match(new RegExp(`${prefixPattern}(ad|ce)\\s*(\\d+)`, 'i'));
  if (singleAdYearMatch) { // Format: "AD 1950"
      return parseInt(singleAdYearMatch[2], 10);
  }

  return -Infinity;
};
// --- Pagalbinių funkcijų pabaiga ---

export default function App() {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [sortBy, setSortBy] = useState('youngest_first'); // Default to youngest first
  const [selectedChronologicalOrder, setSelectedChronologicalOrder] = useState('');
  const [modalContent, setModalContent] = useState({ philosopher: null, contentType: null });
  // Pridėta: slapukų būsena
  const [cookiesAccepted, setCookiesAccepted] = useState(() => {
    const consent = localStorage.getItem('cookieConsent'); //
    return consent === 'accepted' || consent === 'declined'; // Jei jau yra pasirinkimas, banneris nerodomas
  });


  const location = useLocation();
  const { i18n } = useTranslation();

   useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', darkMode ? 'true' : 'false');
  }, [darkMode]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const groupParam = params.get('group');
    if (location.pathname === '/philosophers' && groupParam) {
      if (IdeologicalGroups[groupParam]) {
        setSelectedGroup(groupParam);
      } else {
        setSelectedGroup('');
      }
      setSelectedRegion('');
      setSelectedChronologicalOrder('');
      setSortBy('youngest_first'); // Default sorting when navigating with group param
    } else if (location.pathname !== '/philosophers') {
      setSelectedGroup('');
      setSelectedRegion('');
      setSelectedChronologicalOrder('');
      setSortBy('youngest_first'); // Default sorting when leaving philosophers page
    }
  }, [location.search, location.pathname]);

  const processedPhilosophers = useMemo(() => {
     return philosophers
      .filter(p => p && typeof p.name === 'string' && p.name.trim() !== '')
      .map(p => ({
        ...p,
        startYear: getStartYear(p.years),
        endYear: getEndYear(p.years)
    }));
  }, [philosophers]);

  const handleOpenModal = (philosopher, contentType) => {
    setModalContent({ philosopher, contentType });
  };

  const filteredAndSortedPhilosophers = useMemo(() => {
    let result = [...processedPhilosophers];
    if (selectedGroup) {
      const groupIdeologies = IdeologicalGroups[selectedGroup];
      if (groupIdeologies && Array.isArray(groupIdeologies)) {
        result = result.filter(p => p.IdeologicalOrder && groupIdeologies.includes(p.IdeologicalOrder));
      }
    }
    if (selectedRegion) {
      result = result.filter(p => p.geographicalOrder === selectedRegion);
    }
    if (selectedChronologicalOrder) {
      result = result.filter(p => p.ChronologicalOrder === selectedChronologicalOrder);
    }
    // Atnaujinta rūšiavimo logika
    if (sortBy === 'youngest_first') {
        result.sort((a, b) => b.startYear - a.startYear);
    } else { // Numatytasis arba 'oldest_first'
        result.sort((a, b) => a.startYear - b.startYear);
    }
    return result;
  }, [processedPhilosophers, selectedGroup, selectedRegion, sortBy, selectedChronologicalOrder]);

  const handleClearAllFilters = useCallback(() => {
    setSelectedGroup('');
    setSelectedRegion('');
    setSelectedChronologicalOrder('');
    setSortBy('youngest_first'); // Reset sorting to youngest first
  }, []);

  // Funkcija slapukų sutikimui
  const handleAcceptCookies = () => {
    localStorage.setItem('cookieConsent', 'accepted'); //
    setCookiesAccepted(true); //
  };

  // Funkcija slapukų atsisakymui
  const handleDeclineCookies = () => {
    localStorage.setItem('cookieConsent', 'declined'); //
    setCookiesAccepted(true); // Vis tiek nustatome, kad pasirinkimas padarytas, jog banneris neberodytų
    // Čia galite pridėti logiką, kuri ištrina visus slapukus, jei lankytojas atsisako
  };


  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-800 dark:text-gray-200 transition-colors duration-300">
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      <main className="pt-4 pb-12">
        <Routes>
          <Route
            path="/"
            element={<HomePage
              filteredPhilosophers={filteredAndSortedPhilosophers}
              handleCardClick={handleOpenModal}
              selectedGroup={selectedGroup}
              setSelectedGroup={setSelectedGroup}
              selectedRegion={selectedRegion}
              setSelectedRegion={setSelectedRegion}
              sortBy={sortBy}
              setSortBy={setSortBy}
              selectedChronologicalOrder={selectedChronologicalOrder}
              setSelectedChronologicalOrder={setSelectedChronologicalOrder}
              handleClearAllFilters={handleClearAllFilters}
            />}
          />

          <Route
            path="/philosophers"
            element={<PhilosophersListPage
              filteredPhilosophers={filteredAndSortedPhilosophers}
              selectedGroup={selectedGroup}
              setSelectedGroup={setSelectedGroup}
              selectedRegion={selectedRegion}
              setSelectedRegion={setSelectedRegion}
              sortBy={sortBy}
              setSortBy={setSortBy}
              selectedChronologicalOrder={selectedChronologicalOrder}
              setSelectedChronologicalOrder={setSelectedChronologicalOrder}
              handleClearAllFilters={handleClearAllFilters}
            />}
          />

          <Route path="/about" element={<About />} />
          <Route path="/ideologies" element={<Ideologies />} />
          <Route path="/quotes" element={<Quotes />} />
          {/* Pridėtas privatumo politikos maršrutas */}
          <Route path="/privacy-policy" element={<PrivacyPolicy />} /> {/* */}

          <Route path="/philosopher/:id" element={<PhilosopherPage />} />
       
        </Routes>
      </main>

      {modalContent.philosopher && modalContent.contentType && (
        <BioModal
          philosopher={modalContent.philosopher}
          contentType={modalContent.contentType}
          onClose={() => setModalContent({ philosopher: null, contentType: null })}
        />
      )}
      <Analytics />
      <Footer />
      <BackToTopButton />
      {/* Pridėtas CookieConsent komponentas, jei slapukai dar nėra nei priimti, nei atmesti */}
      {!cookiesAccepted && (
        <CookieConsent onAccept={handleAcceptCookies} onDecline={handleDeclineCookies} /> //
      )}
    </div>
  );
}