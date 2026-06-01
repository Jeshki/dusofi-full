"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { philosophers } from "@/data/philosophers";
import { IdeologicalGroups } from "@/enums.jsx";
import { getEndYear, getStartYear } from "@/lib/years.js";

const PhilosopherUiContext = createContext(null);

export function PhilosopherUiProvider({ children, pathname, search }) {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("darkMode") === "true";
  });

  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [sortBy, setSortBy] = useState("youngest_first");
  const [selectedChronologicalOrder, setSelectedChronologicalOrder] = useState("");

  const [modalContent, setModalContent] = useState({
    philosopher: null,
    contentType: null,
  });

  const [cookiesAccepted, setCookiesAccepted] = useState(() => {
    if (typeof window === "undefined") return true;
    const consent = localStorage.getItem("cookieConsent");
    return consent === "accepted" || consent === "declined";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    if (typeof window !== "undefined") {
      localStorage.setItem("darkMode", darkMode ? "true" : "false");
    }
  }, [darkMode]);

  useEffect(() => {
    const params = new URLSearchParams(search ?? "");
    const groupParam = params.get("group");
    if (pathname === "/philosophers" && groupParam) {
      if (IdeologicalGroups[groupParam]) {
        setSelectedGroup(groupParam);
      } else {
        setSelectedGroup("");
      }
      setSelectedRegion("");
      setSelectedChronologicalOrder("");
      setSortBy("youngest_first");
    } else if (pathname !== "/philosophers") {
      setSelectedGroup("");
      setSelectedRegion("");
      setSelectedChronologicalOrder("");
      setSortBy("youngest_first");
    }
  }, [pathname, search]);

  const processedPhilosophers = useMemo(() => {
    return philosophers
      .filter((p) => p && typeof p.name === "string" && p.name.trim() !== "")
      .map((p) => ({
        ...p,
        startYear: getStartYear(p.years),
        endYear: getEndYear(p.years),
      }));
  }, []);

  const filteredAndSortedPhilosophers = useMemo(() => {
    let result = [...processedPhilosophers];
    if (selectedGroup) {
      const groupIdeologies = IdeologicalGroups[selectedGroup];
      if (groupIdeologies && Array.isArray(groupIdeologies)) {
        result = result.filter(
          (p) => p.IdeologicalOrder && groupIdeologies.includes(p.IdeologicalOrder)
        );
      }
    }
    if (selectedRegion) {
      result = result.filter((p) => p.geographicalOrder === selectedRegion);
    }
    if (selectedChronologicalOrder) {
      result = result.filter((p) => p.ChronologicalOrder === selectedChronologicalOrder);
    }
    if (sortBy === "youngest_first") {
      result.sort((a, b) => b.startYear - a.startYear);
    } else {
      result.sort((a, b) => a.startYear - b.startYear);
    }
    return result;
  }, [processedPhilosophers, selectedGroup, selectedRegion, sortBy, selectedChronologicalOrder]);

  const handleClearAllFilters = useCallback(() => {
    setSelectedGroup("");
    setSelectedRegion("");
    setSelectedChronologicalOrder("");
    setSortBy("youngest_first");
  }, []);

  const handleOpenModal = useCallback((philosopher, contentType) => {
    setModalContent({ philosopher, contentType });
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalContent({ philosopher: null, contentType: null });
  }, []);

  const handleAcceptCookies = useCallback(() => {
    localStorage.setItem("cookieConsent", "accepted");
    setCookiesAccepted(true);
  }, []);

  const handleDeclineCookies = useCallback(() => {
    localStorage.setItem("cookieConsent", "declined");
    setCookiesAccepted(true);
  }, []);

  const value = useMemo(
    () => ({
      darkMode,
      setDarkMode,
      selectedGroup,
      setSelectedGroup,
      selectedRegion,
      setSelectedRegion,
      sortBy,
      setSortBy,
      selectedChronologicalOrder,
      setSelectedChronologicalOrder,
      handleClearAllFilters,
      filteredPhilosophers: filteredAndSortedPhilosophers,
      handleCardClick: handleOpenModal,
      modalContent,
      handleCloseModal,
      cookiesAccepted,
      handleAcceptCookies,
      handleDeclineCookies,
    }),
    [
      darkMode,
      selectedGroup,
      selectedRegion,
      sortBy,
      selectedChronologicalOrder,
      handleClearAllFilters,
      filteredAndSortedPhilosophers,
      handleOpenModal,
      modalContent,
      handleCloseModal,
      cookiesAccepted,
      handleAcceptCookies,
      handleDeclineCookies,
    ]
  );

  return (
    <PhilosopherUiContext.Provider value={value}>{children}</PhilosopherUiContext.Provider>
  );
}

export function usePhilosopherUi() {
  const ctx = useContext(PhilosopherUiContext);
  if (!ctx) {
    throw new Error("usePhilosopherUi must be used within PhilosopherUiProvider");
  }
  return ctx;
}
