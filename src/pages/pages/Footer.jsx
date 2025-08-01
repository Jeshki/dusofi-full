// src/pages/Footer.jsx
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-100 dark:bg-very-dark-gray text-center p-6 mt-20 border-t border-gray-200 dark:border-gray-700">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center sm:space-x-4"> {/* Bendras konteineris */}
        {/* Autorių teisių pranešimas - mb-2 mobiliesiems, sm:mb-0 stacionariems */}
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 sm:mb-0 sm:order-1">
           © {new Date().getFullYear()} DuSofi {t('footer.all_rights_reserved')} by Jeshki
        </p>

        {/* Socialinių tinklų ikonos - mb-2 mobiliesiems, sm:mb-0 stacionariems */}
        <div className="flex justify-center gap-6 text-2xl text-gray-500 dark:text-gray-400 mb-2 sm:mb-0 sm:order-2">
          <a
            href="https://github.com/jeshki"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-rose-900 dark:hover:text-rose-700 transition-colors"
            aria-label="GitHub"
            title="Jeshki on GitHub"
          >
            <FaGithub />
          </a>
          <a
            href="https://linkedin.com/in/karolis-cibiras"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-rose-900 dark:hover:text-rose-700 transition-colors"
            aria-label="LinkedIn"
            title="Karolis Cibiras on LinkedIn"
          >
            <FaLinkedin />
          </a>
          <a
            href="mailto:karoliscibiras@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-rose-900 dark:hover:text-rose-700 transition-colors"
            aria-label="Email"
            title="Send email to Karolis Cibiras"
          >
            <FaEnvelope />
          </a>
        </div>

        {/* Privatumo politikos nuoroda - be jokio margin bottom */}
        <div className="sm:order-3">
          <Link
            to="/privacy-policy"
            className="text-rose-900 dark:text-rose-700 hover:underline text-sm font-medium"
            title={t('footer.privacy_policy')}
            aria-label={t('footer.privacy_policy')}
          >
            {t('footer.privacy_policy')}
          </Link>
        </div>
      </div>
    </footer>
  );
}