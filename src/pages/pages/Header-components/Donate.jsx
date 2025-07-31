// src/pages/Header-components/Donate.jsx
import React, { useState, useRef, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";

const DONATE_OPTIONS = [
  {
    label: "PayPal",
    type: "link",
    value: "https://www.paypal.me/mvmvts",
    display: "paypal_label",
  },
  { label: "USDT (TRC20)", type: "address", value: "TYqagvB5TSGDRHthSjNd4P5YRY7JUui8aG" },
  { label: "USDT (ERC20)", type: "address", value: "0x64A1Fdc41E948F449124A5A4D1c6311219E525aE" },
  { label: "TRX (Tron)", type: "address", value: "TYqagvB5TSGDRHthSjNd4P5YRY7JUui8aG" },
  { label: "XRP", type: "address", value: "r4rc8AxCwHT7Fqv92xUVSM4njZT1DxDqha" },
];

function CryptoOption({ opt, onCopy, isCopied, t }) {
  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
      <div className="flex flex-col gap-3 mb-3">
        <span className="font-bold text-sm text-gray-900 dark:text-gray-100">{opt.label}</span>
        <button
          onClick={() => onCopy(opt.value)}
          className={`px-4 py-2 text-sm font-semibold rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-gray-800 w-full ${
            isCopied
              ? "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500"
              : "bg-rose-600 hover:bg-rose-700 text-white focus:ring-rose-500 active:bg-rose-800"
          }`}
          aria-label={t('donate.copy_address_label', { currency: opt.label })}
          disabled={isCopied}
          type="button"
        >
          {isCopied ? t('donate.copied_button') : t('donate.copy_button')}
        </button>
      </div>
      <div className="w-full bg-gray-100 dark:bg-gray-900 p-3 rounded-md border border-gray-200 dark:border-gray-700">
        <span className="font-mono text-xs text-gray-700 dark:text-gray-300 break-all select-all block leading-relaxed">
          {opt.value}
        </span>
      </div>
    </div>
  );
}

function PayPalOption({ opt, t }) {
  return (
    <a
      href={opt.value}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full text-center px-6 py-4 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg transition-colors dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-gray-800 shadow-md hover:shadow-lg"
      aria-label={t('donate.paypal_description')}
    >
      {t('donate.paypal_label')}
    </a>
  );
}

export default function DonateButton({ onMenuClose }) {
  const { t } = useTranslation();
  const [showOptions, setShowOptions] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(null);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleButtonClick = () => {
    console.log('Donate button clicked, showOptions:', showOptions, 'isMobile:', isMobile);
    setShowOptions((prev) => !prev);
    
    // Don't close mobile menu when opening dropdown - let user interact with it
    // if (onMenuClose && !showOptions) {
    //   onMenuClose();
    // }
  };

  const handleCopy = useCallback(async (value) => {
    try {
      if (!navigator.clipboard) throw new Error('Clipboard API not available');

      await navigator.clipboard.writeText(value);
      setCopiedAddress(value);
      setTimeout(() => setCopiedAddress(null), 2000);
    } catch {
      try {
        const textArea = document.createElement('textarea');
        textArea.value = value;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);

        if (successful) {
          setCopiedAddress(value);
          setTimeout(() => setCopiedAddress(null), 2000);
        } else {
          throw new Error('Fallback copy failed');
        }
      } catch {
        alert(t('donate.copy_failed_message'));
      }
    }
  }, [t]);

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
      if (e.key === "Escape") {
        setShowOptions(false);
      }
    };

    const handleTouchStart = (e) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target) &&
        buttonRef.current && !buttonRef.current.contains(e.target)
      ) {
        setShowOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [showOptions]);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={handleButtonClick}
        className="text-lg font-medium uppercase tracking-wide text-gray-800 dark:text-gray-200 hover:text-rose-900 dark:hover:text-rose-400 transition-colors cursor-pointer bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-900 rounded-md px-1 py-1"
        style={{ fontFamily: "'Cinzel', serif" }}
        aria-haspopup="true"
        aria-expanded={showOptions}
        aria-controls="donate-dropdown"
        aria-label={t('donate.dropdown_label')}
        type="button"
      >
        {t('donate.button_label')}
      </button>

      {showOptions && !isMobile && (
        <div
          ref={dropdownRef}
          className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg shadow-2xl p-5 max-h-[70vh] overflow-y-auto z-50"
          id="donate-dropdown"
          role="menu"
          aria-label={t('donate.dropdown_label')}
        >
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100" style={{ fontFamily: "'Cinzel', serif" }}>
                {t('donate.dropdown_label')}
              </h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Choose your preferred donation method
            </p>
          </div>
          
          <ul className="space-y-4">
            {DONATE_OPTIONS.map((opt) => (
              <li key={opt.label}>
                {opt.type === 'link' ? (
                  <PayPalOption opt={opt} t={t} />
                ) : (
                  <CryptoOption
                    opt={opt}
                    onCopy={handleCopy}
                    isCopied={copiedAddress === opt.value}
                    t={t}
                  />
                )}
              </li>
            ))}
          </ul>
          
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Thank you for your support! 🙏
            </p>
          </div>
        </div>
      )}

      {showOptions && isMobile && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-[100]"
            onClick={() => setShowOptions(false)}
          />
          <div
            ref={dropdownRef}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-md max-h-[80vh] overflow-y-auto z-[101] bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg shadow-2xl p-5"
            id="donate-dropdown-mobile"
            role="menu"
            aria-label={t('donate.dropdown_label')}
          >
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100" style={{ fontFamily: "'Cinzel', serif" }}>
                  {t('donate.dropdown_label')}
                </h3>
                <button
                  onClick={() => setShowOptions(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-xl font-bold"
                  aria-label="Close"
                >
                  ×
                </button>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Choose your preferred donation method
              </p>
            </div>
            
            <ul className="space-y-4">
              {DONATE_OPTIONS.map((opt) => (
                <li key={opt.label}>
                  {opt.type === 'link' ? (
                    <PayPalOption opt={opt} t={t} />
                  ) : (
                    <CryptoOption
                      opt={opt}
                      onCopy={handleCopy}
                      isCopied={copiedAddress === opt.value}
                      t={t}
                    />
                  )}
                </li>
              ))}
            </ul>
            
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                Thank you for your support! 🙏
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
