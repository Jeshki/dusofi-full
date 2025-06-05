// src/pages/PrivacyPolicy.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO.jsx'; // Importuojame SEO komponentą

export default function PrivacyPolicy() {
  const { t } = useTranslation();

  return (
    <section className="max-w-4xl mx-auto px-6 py-12">
      <SEO
        title={t('seo.privacy_policy_title')}
        description={t('seo.privacy_policy_description')}
      />
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-900 dark:text-gray-100 font-serif uppercase">
        {t('privacy_policy.title')}
      </h1>

      <div className="text-lg leading-relaxed text-gray-800 dark:text-gray-300 space-y-6 prose dark:prose-invert">
        <p>{t('privacy_policy.intro')}</p>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-rose-900 dark:text-rose-700">{t('privacy_policy.data_collection.title')}</h2>
        <p>{t('privacy_policy.data_collection.p1')}</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>{t('privacy_policy.data_collection.list1')}</li>
          <li>{t('privacy_policy.data_collection.list2')}</li>
          <li>{t('privacy_policy.data_collection.list3')}</li>
        </ul>
        <p>{t('privacy_policy.data_collection.p2')}</p>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-rose-900 dark:text-rose-700">{t('privacy_policy.cookies.title')}</h2>
        <p>{t('privacy_policy.cookies.p1')}</p>
        <p>{t('privacy_policy.cookies.p2')}</p>
        <p>{t('privacy_policy.cookies.p3')}</p>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-rose-900 dark:text-rose-700">{t('privacy_policy.data_security.title')}</h2>
        <p>{t('privacy_policy.data_security.p1')}</p>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-rose-900 dark:text-rose-700">{t('privacy_policy.your_rights.title')}</h2>
        <p>{t('privacy_policy.your_rights.p1')}</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>{t('privacy_policy.your_rights.list1')}</li>
          <li>{t('privacy_policy.your_rights.list2')}</li>
          <li>{t('privacy_policy.your_rights.list3')}</li>
          <li>{t('privacy_policy.your_rights.list4')}</li>
        </ul>
        <p>{t('privacy_policy.your_rights.p2')}</p>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-rose-900 dark:text-rose-700">{t('privacy_policy.changes.title')}</h2>
        <p>{t('privacy_policy.changes.p1')}</p>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-rose-900 dark:text-rose-700">{t('privacy_policy.contact.title')}</h2>
        <p>{t('privacy_policy.contact.p1')}</p>
        <p>{t('privacy_policy.contact.p2')}</p>
      </div>

      <div className="mt-12 text-center">
        <Link
          to="/"
          className="px-6 py-3 bg-rose-900 text-white rounded-lg shadow-md hover:bg-rose-950 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-rose-900 focus:ring-offset-2 dark:focus:ring-offset-stone-900"
        >
          {t('privacy_policy.back_to_home')}
        </Link>
      </div>
    </section>
  );
}