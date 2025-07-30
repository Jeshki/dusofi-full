// src/components/SEO.jsx
import React from 'react';
import { Helmet } from 'react-helmet-async'; // Helmet manages document head tags

export default function SEO({ title, description, name = 'DuSofi', type = 'website' }) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content="@YourTwitterHandle" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {/* <meta name="twitter:image" content="[Nuoroda į paveikslėlį]" /> */}
    </Helmet>
  );
}