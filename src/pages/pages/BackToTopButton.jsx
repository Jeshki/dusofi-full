// src/pages/BackToTopButton.jsx
import React, { useState, useEffect } from 'react';
import { ArrowUpIcon } from '@heroicons/react/24/solid'; // Importuojame rodyklės ikoną iš Heroicons

export default function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  // Funkcija, kuri tikrina slinkties poziciją ir nustato mygtuko matomumą
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) { // Mygtukas atsiras, kai paslinksime žemyn 300px
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Funkcija, kuri slenka į puslapio viršų
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // Sklandus slinkimas
    });
  };

  // Pridedame ir pašaliname slinkties įvykio klausytoją
  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="p-3 bg-rose-900 text-white rounded-full shadow-lg hover:bg-rose-950 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-rose-900 focus:ring-offset-2 dark:focus:ring-offset-black"
          aria-label="Grįžti į viršų"
          title="Grįžti į viršų"
        >
          <ArrowUpIcon className="h-6 w-6" /> {/* Pakeista FaArrowUp */}
        </button>
      )}
    </div>
  );
}