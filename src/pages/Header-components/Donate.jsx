// src/pages/Header-components/Donate.jsx
import React, { useState, useRef, useEffect, useCallback } from "react";

// --- Duomenys ---
// Patogiau laikyti duomenis atskirai, kad būtų lengviau juos redaguoti.
const DONATE_OPTIONS = [
  {
    label: "PayPal",
    type: "link",
    value: "https://www.paypal.com/mvmvts",
    display: "Aukoti per PayPal", // Pakeistas tekstas, kad būtų aiškesnis
  },
  { label: "USDT (TRC20)", type: "address", value: "TYqagvB5TSGDRHthSjNd4P5YRY7JUui8aG" },
  { label: "USDT (ERC20)", type: "address", value: "0x64A1Fdc41E948F449124A5A4D1c6311219E525aE" },
  { label: "TRX (Tron)", type: "address", value: "TYqagvB5TSGDRHthSjNd4P5YRY7JUui8aG" },
  { label: "XRP", type: "address", value: "r4rc8AxCwHT7Fqv92xUVSM4njZT1DxDqha" },
];

// --- Vidiniai Komponentai ---

// Atskiras komponentas, skirtas kriptovaliutos adreso atvaizdavimui.
// Taip kodas tampa tvarkingesnis.
function CryptoOption({ opt, onCopy, isCopied }) {
  return (
    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
      <div className="flex justify-between items-center mb-2">
        <span className="font-bold text-sm text-gray-800 dark:text-gray-200">{opt.label}</span>
        <button
          onClick={() => onCopy(opt.value)}
          className={`px-3 py-1 text-xs font-semibold rounded-md transition-all duration-200 ${
            isCopied
              ? "bg-green-600 text-white"
              : "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-800/50 dark:text-blue-200 dark:hover:bg-blue-700/50"
          }`}
          aria-label={`Kopijuoti ${opt.label} adresą`}
        >
          {isCopied ? "Nukopijuota!" : "Kopijuoti"}
        </button>
      </div>
      <div className="w-full bg-gray-100 dark:bg-gray-800 p-2 rounded">
        <span className="font-mono text-xs text-gray-600 dark:text-gray-400 break-all select-all">
          {opt.value}
        </span>
      </div>
    </div>
  );
}

// Komponentas, skirtas PayPal nuorodai
function PayPalOption({ opt }) {
  return (
    <a
      href={opt.value}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full text-center px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors dark:bg-blue-500 dark:hover:bg-blue-600"
      aria-label="Aukoti per PayPal. Atsidarys naujame lange."
    >
      {opt.display}
    </a>
  );
}


// --- Pagrindinis Komponentas ---

export default function DonateButton() {
  const [showOptions, setShowOptions] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(null); // Dabar saugome patį adresą
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const handleCopy = useCallback(async (value) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedAddress(value); // Išsaugome nukopijuotą adresą
      setTimeout(() => setCopiedAddress(null), 2000); // Po 2 sekundžių grąžiname į pradinę būseną
    } catch (err) {
      // Modernesnis pranešimas, jei kopijavimas nepavyksta
      alert("Kopijavimas nepavyko. Prašome nukopijuoti adresą rankiniu būdu.");
    }
  }, []);

  // `useEffect` lieka nepakitę, nes jie veikia puikiai.
  useEffect(() => {
    if (!showOptions) return;
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target) &&
        buttonRef.current && !buttonRef.current.contains(e.target)
      ) {
        setShowOptions(false);
      }
    };
    const handleEscape = (e) => {
      if (e.key === "Escape") setShowOptions(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [showOptions]);

  useEffect(() => {
    if (showOptions && dropdownRef.current) {
      dropdownRef.current.querySelector("a,button")?.focus();
    }
  }, [showOptions]);

  return (
    <div className="relative inline-block">
      {/* Pagrindinis "Donate" mygtukas */}
      <button
        ref={buttonRef}
        onClick={() => setShowOptions((v) => !v)}
        className="text-lg font-medium uppercase tracking-wide text-gray-700 dark:text-gray-300 hover:text-rose-900 dark:hover:text-rose-700 transition-colors cursor-pointer bg-transparent border-none"
        style={{ fontFamily: "'Cinzel', serif" }}
        aria-haspopup="true"
        aria-expanded={showOptions}
        aria-controls="donate-dropdown"
        type="button"
      >
        Donate
      </button>

      {/* Išskleidžiamas meniu */}
      {showOptions && (
        <div
          ref={dropdownRef}
          className="absolute top-full right-0 mt-2 w-72 sm:w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-2xl z-50 p-4"
          id="donate-dropdown"
          role="menu"
          aria-label="Aukojimo parinktys"
        >
          <ul className="space-y-3">
            {DONATE_OPTIONS.map((opt) => (
              <li key={opt.label}>
                {opt.type === 'link' ? (
                  <PayPalOption opt={opt} />
                ) : (
                  <CryptoOption
                    opt={opt}
                    onCopy={handleCopy}
                    isCopied={copiedAddress === opt.value} // Patikriname, ar BŪTENT ŠIS adresas nukopijuotas
                  />
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
