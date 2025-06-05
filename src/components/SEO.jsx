// src/components/SEO.jsx
import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * SEO komponentas, skirtas dinamiškai nustatyti puslapio meta žymes.
 * Naudoja react-helmet-async.
 *
 * @param {object} props - Komponento savybės.
 * @param {string} props.title - Puslapio pavadinimas.
 * @param {string} props.description - Puslapio aprašymas.
 * @param {string} [props.name='Your Website Name'] - Svetainės pavadinimas (naudojamas open graph).
 * @param {string} [props.type='website'] - Puslapio tipas (naudojamas open graph).
 */
export default function SEO({ title, description, name = 'DuSofi', type = 'website' }) {
  return (
    <Helmet>
      {/* Standartinės meta žymės */}
      <title>{title}</title>
      <meta name="description" content={description} />

      {/* Open Graph / Facebook meta žymės */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {/* <meta property="og:image" content="[Nuoroda į paveikslėlį]" />  Jei turite numatytąjį paveikslėlį */}
      {/* <meta property="og:url" content="[Puslapio URL]" /> */}

      {/* Twitter meta žymės */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content="@YourTwitterHandle" /> {/* Pakeiskite į savo Twitter vartotojo vardą */}
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {/* <meta name="twitter:image" content="[Nuoroda į paveikslėlį]" /> */}
    </Helmet>
  );
}