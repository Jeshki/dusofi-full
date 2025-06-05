// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter as Router } from "react-router-dom";
import './i18n';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import { HelmetProvider } from 'react-helmet-async'; // Pridėta: Importuojame HelmetProvider

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <HelmetProvider> {/* Pridėta: Apgaubiame App komponentą su HelmetProvider */}
        <Router>
          <App />
        </Router>
      </HelmetProvider>
    </I18nextProvider>
  </React.StrictMode>
);