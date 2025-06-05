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

// Duomenų ir Enum importai
import { philosophers } from "./data.js";
import { IdeologicalGroups, ChronologicalOrderEnum } from "./enums.jsx";

// --- Pagalbinės funkcijos (getStartYear, getEndYear) ---
// Šios funkcijos turi būti eksportuojamos, kad būtų prieinamos kituose failuose
export const getStartYear = (yearsString) => {
  if (!yearsString || typeof yearsString !== 'string') return Infinity;
  const str = yearsString.toLowerCase().trim();
  if (str.includes('unknown')) return Infinity;

  // Handle explicit BC/BCE ranges (e.g., (BC 470–399))
  const bcMatch = str.match(/(\d+)\s*–\s*(\d+)\s*(bc|bce)/);
  if (bcMatch) {
    return -parseInt(bcMatch[1], 10);
  }

  // Handle single BC/BCE year (e.g., (BC 470))
  const singleBcMatch = str.match(/(\d+)\s*(bc|bce)/);
  if (singleBcMatch) {
      return -parseInt(singleBcMatch[1], 10);
  }

  // Handle century ranges (e.g., (BC 6th century))
  const centuryBcMatch = str.match(/(\d+)(st|nd|rd|th)\s+century\s+(bc|bce)/);
  if (centuryBcMatch) {
    const century = parseInt(centuryBcMatch[1], 10);
    return -(century * 100);
  }

  const centuryAdMatch = str.match(/(\d+)(st|nd|rd|th)\s+century/);
  if (centuryAdMatch) {
      const century = parseInt(centuryAdMatch[1], 10);
      return (century - 1) * 100 + 1;
  }

  // Handle explicit AD/CE ranges (e.g., (1775–1854))
  const adRangeMatch = str.match(/(\d{3,4})\s*–\s*(\d{3,4})/);
  if (adRangeMatch) {
      return parseInt(adRangeMatch[1], 10);
  }

  // Handle single AD/CE year (e.g., (1950))
  const singleAdMatch = str.match(/(\d{3,4})/);
  if (singleAdMatch) {
      return parseInt(singleAdMatch[1], 10);
  }

  return Infinity;
};

export const getEndYear = (yearsString) => {
  if (!yearsString || typeof yearsString !== 'string') return -Infinity;
  const str = yearsString.toLowerCase().trim();
  if (str.includes('unknown')) return -Infinity;

  // Handle explicit BC/BCE ranges first
  const bcMatch = str.match(/(\d+)\s*–\s*(\d+)\s*(bc|bce)/);
  if (bcMatch) {
    return -parseInt(bcMatch[2], 10);
  }

  // Handle single BC/BCE year (e.g., (BC 470))
  const singleBcMatch = str.match(/(\d+)\s*(bc|bce)/);
  if (singleBcMatch) {
      return -parseInt(singleBcMatch[1], 10);
  }

  // Handle century ranges (e.g., (BC 6th century))
  const centuryBcMatch = str.match(/(\d+)(st|nd|rd|th)\s+century\s+(bc|bce)/);
  if (centuryBcMatch) {
    const century = parseInt(centuryBcMatch[1], 10);
    return -((century - 1) * 100 + 1);
  }

  const centuryAdMatch = str.match(/(\d+)(st|nd|rd|th)\s+century/);
  if (centuryAdMatch) {
      const century = parseInt(centuryAdMatch[1], 10);
      return century * 100;
  }

  // Handle explicit AD/CE ranges (e.g., (1775–1854))
  const adRangeMatch = str.match(/(\d{3,4})\s*–\s*(\d{3,4})/);
  if (adRangeMatch) {
      return parseInt(adRangeMatch[2], 10);
  }

  // Handle single AD/CE year (e.g., (1950))
  const singleAdMatch = str.match(/(\d{3,4})/);
  if (singleAdMatch) {
      return parseInt(singleAdMatch[1], 10);
  }

  return -Infinity;
};
// --- Pagalbinių funkcijų pabaiga ---

export default function App() {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [sortBy, setSortBy] = useState('default');
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
      setSortBy('default');
    } else if (location.pathname !== '/philosophers') {
      setSelectedGroup('');
      setSelectedRegion('');
      setSelectedChronologicalOrder('');
      setSortBy('default');
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
    if (sortBy === 'chronological') {
        result.sort((a, b) => a.startYear - b.startYear);
    } else if (sortBy === 'youngest_first') {
        result.sort((a, b) => b.startYear - a.startYear);
    } else if (sortBy === 'newest_by_death') {
        result.sort((a, b) => b.endYear - a.endYear);
    } else {
        result.sort((a, b) => {
            const nameA = a.name || '';
            const nameB = b.name || '';
            return nameA.localeCompare(nameB);
        });
    }
    return result;
  }, [processedPhilosophers, selectedGroup, selectedRegion, sortBy, selectedChronologicalOrder]);

  const handleClearAllFilters = useCallback(() => {
    setSelectedGroup('');
    setSelectedRegion('');
    setSelectedChronologicalOrder('');
    setSortBy('default');
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
      <Footer />
      <BackToTopButton />
      {/* Pridėtas CookieConsent komponentas, jei slapukai dar nėra nei priimti, nei atmesti */}
      {!cookiesAccepted && (
        <CookieConsent onAccept={handleAcceptCookies} onDecline={handleDeclineCookies} /> //
      )}
    </div>
  );
}