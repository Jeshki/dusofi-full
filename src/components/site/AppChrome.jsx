"use client";

import React from "react";

import BioModal from "@/BioModal.jsx";
import CookieConsent from "@/components/CookieConsent.jsx";
import { usePhilosopherUi } from "@/context/PhilosopherUiContext";
import Footer from "@/views/Footer.jsx";
import Header from "@/views/Header-components/Header.jsx";
import BackToTopButton from "@/views/BackToTopButton.jsx";

export default function AppChrome({ children }) {
  const {
    darkMode,
    setDarkMode,
    modalContent,
    handleCloseModal,
    cookiesAccepted,
    handleAcceptCookies,
    handleDeclineCookies,
  } = usePhilosopherUi();

  return (
    <div className="min-h-screen bg-white text-gray-800 transition-colors duration-300 dark:bg-black dark:text-gray-200">
      <Header />
      <main className="pb-12 pt-4">{children}</main>

      {modalContent.philosopher && modalContent.contentType && (
        <BioModal
          philosopher={modalContent.philosopher}
          contentType={modalContent.contentType}
          onClose={handleCloseModal}
        />
      )}

      <Footer />
      <BackToTopButton />

      {!cookiesAccepted && (
        <CookieConsent onAccept={handleAcceptCookies} onDecline={handleDeclineCookies} />
      )}
    </div>
  );
}
