// src/App.jsx
import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Helmet, HelmetProvider } from 'react-helmet-async';
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
import PrivacyPolicy from "./pages/PrivacyPolicy.jsx";
import CookieConsent from "./components/CookieConsent.jsx";
import DonateButton from "./pages/Header-components/Donate.jsx";
import { Analytics } from '@vercel/analytics/react';

// Duomenų ir Enum importai
import { philosophers } from "./data.js";
import { IdeologicalGroups } from "./enums.jsx";

// Pagalbinės funkcijos
export const getStartYear = (yearsString) => {
  if (!yearsString || typeof yearsString !== 'string') return 0;
  
  const cleanYears = yearsString.trim();
  if (!cleanYears) return 0;
  
  const rangeMatch = cleanYears.match(/(\d+)\s*-\s*\d+/);
  if (rangeMatch) {
    const startYear = parseInt(rangeMatch[1]);
    return cleanYears.includes('BC') ? -startYear : startYear;
  }
  
  const singleMatch = cleanYears.match(/(\d+)/);
  if (singleMatch) {
    const year = parseInt(singleMatch[1]);
    return cleanYears.includes('BC') ? -year : year;
  }
  
  return 0;
};

export const getEndYear = (yearsString) => {
  if (!yearsString || typeof yearsString !== 'string') return 0;
  
  const cleanYears = yearsString.trim();
  if (!cleanYears) return 0;
  
  const rangeMatch = cleanYears.match(/\d+\s*-\s*(\d+)/);
  if (rangeMatch) {
    const endYear = parseInt(rangeMatch[1]);
    return cleanYears.includes('BC') ? -endYear : endYear;
  }
  
  const singleMatch = cleanYears.match(/(\d+)/);
  if (singleMatch) {
    const year = parseInt(singleMatch[1]);
    return cleanYears.includes('BC') ? -year : year;
  }
  
  return 0;
};


export default function App() {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [sortBy, setSortBy] = useState('oldest_first');
  const [selectedChronologicalOrder, setSelectedChronologicalOrder] = useState('');
  const [modalContent, setModalContent] = useState({ philosopher: null, contentType: null });
  const [cookiesAccepted, setCookiesAccepted] = useState(() => {
    const consent = localStorage.getItem('cookieConsent');
    return consent === 'accepted' || consent === 'declined';
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
      setSortBy('oldest_first');
    } else if (location.pathname !== '/philosophers') {
      setSelectedGroup('');
      setSelectedRegion('');
      setSelectedChronologicalOrder('');
      setSortBy('oldest_first');
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
  }, []);

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
    if (sortBy === 'youngest_first') {
        result.sort((a, b) => b.startYear - a.startYear);
    } else {
        result.sort((a, b) => a.startYear - b.startYear);
    }
    return result;
  }, [processedPhilosophers, selectedGroup, selectedRegion, sortBy, selectedChronologicalOrder]);

  const handleClearAllFilters = useCallback(() => {
    setSelectedGroup('');
    setSelectedRegion('');
    setSelectedChronologicalOrder('');
    setSortBy('oldest_first');
  }, []);

  const handleAcceptCookies = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setCookiesAccepted(true);
  };

  const handleDeclineCookies = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setCookiesAccepted(true);
  };

  return (
    <HelmetProvider>
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
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
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
        
        {/* Fixed Donate Button - Desktop only (since mobile has it in header) */}
        <div className="hidden md:block fixed bottom-4 right-4 z-40">
          <DonateButton />
        </div>
        
        <Analytics />
        <Footer />
        <BackToTopButton />
        {!cookiesAccepted && (
          <CookieConsent onAccept={handleAcceptCookies} onDecline={handleDeclineCookies} />
        )}
      </div>
    </HelmetProvider>
  );
}
