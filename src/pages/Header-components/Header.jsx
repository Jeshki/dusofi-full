// src/pages/Header-components/Header.jsx
import React, { useState, useEffect } from "react";
import Logo from "./Logo";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";
import MobileToggle from "./MobileToggle";

export default function Header({ darkMode, setDarkMode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when window is resized to desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-gray-100/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-md transition-colors duration-300">
      <div className="flex justify-between items-center px-4 sm:px-6 py-3 max-w-7xl mx-auto">
        <Logo darkMode={darkMode} />
        <DesktopNav darkMode={darkMode} setDarkMode={setDarkMode} />
        <MobileToggle isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} darkMode={darkMode} />
      </div>
      <MobileNav
        isOpen={isMobileMenuOpen}
        setIsOpen={setIsMobileMenuOpen}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />
    </header>
  );
}