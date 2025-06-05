// src/pages/Header-components/Header.jsx
import React, { useState } from "react";
import Logo from "./Logo";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";
import MobileToggle from "./MobileToggle";

// Svetainės antraštės komponentas.
export default function Header({ darkMode, setDarkMode }) {
  // Būsenos kintamasis, skirtas mobiliojo meniu matomumui valdyti.
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    // Antraštės pagrindinis konteineris su lipniu pozicionavimu ir stiliais.
    <header className="sticky top-0 z-50 bg-gray-100/80 dark:bg-very-dark-gray/80 backdrop-blur-lg shadow-md transition-colors duration-300">
      {/* Antraštės vidinis konteineris, skirtas elementų išdėstymui. */}
      <div className="flex justify-between items-center px-4 sm:px-6 py-3 max-w-7xl mx-auto">
        {/* Logotipo komponentas. */}
        <Logo darkMode={darkMode} />
        {/* Darbalaukio navigacijos komponentas (matomas tik didesniuose ekranuose). */}
        <DesktopNav darkMode={darkMode} setDarkMode={setDarkMode} />
        {/* Mobiliosios navigacijos perjungimo mygtukas (matomas tik mažuose ekranuose). */}
        {/* Šis mygtukas turi `md:hidden` klasę, kuri reiškia, kad jis bus paslėptas vidutiniuose ir didesniuose ekranuose. */}
        <MobileToggle isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} darkMode={darkMode} />
      </div>
      {/* Mobiliosios navigacijos meniu komponentas. */}
      {/* Jo matomumas valdomas `isOpen` prop'u ir CSS klasėmis `max-h-0 opacity-0` (paslėptas) ir `max-h-96 opacity-100` (rodomas). */}
      <MobileNav
        isOpen={isMobileMenuOpen}
        setIsOpen={setIsMobileMenuOpen}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />
    </header>
  );
}