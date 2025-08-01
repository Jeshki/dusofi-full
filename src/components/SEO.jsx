// src/components/SEO.jsx
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

export default function SEO({ 
  title, 
  description, 
  keywords,
  image,
  name = 'DuSofi - Philosophy & Wisdom', 
  type = 'website',
  author = 'DuSofi Team',
  lang = 'en',
  article = null, // For article-specific data
  breadcrumbs = null, // For breadcrumb schema
  faq = null, // For FAQ schema
  lastModified = null,
  publishDate = null
}) {
  const location = useLocation();
  const baseUrl = 'https://dusofi.lt';
  const currentUrl = `${baseUrl}${location.pathname}`;
  
  // Enhanced default values
  const defaultTitle = 'DuSofi - Explore Philosophy & Wisdom | Ancient & Modern Philosophical Insights';
  const defaultDescription = 'Discover philosophical wisdom from history\'s greatest thinkers. Explore 500+ philosophers, ideologies, and 10,000+ timeless quotes that shape our understanding of life, ethics, and existence.';
  const defaultImage = `${baseUrl}/images/og-dusofi-philosophy.png`;
  const defaultKeywords = 'philosophy, philosophers, wisdom, quotes, ideologies, ancient philosophy, modern philosophy, ethics, metaphysics, existentialism, stoicism, aristotle, plato, socrates, kant, nietzsche';

  const seoTitle = title || defaultTitle;
  const seoDescription = description || defaultDescription;
  const seoImage = image || defaultImage;
  const seoKeywords = keywords || defaultKeywords;

  // Generate structured data based on page type
  const generateStructuredData = () => {
    const baseSchema = {
      "@context": "https://schema.org",
      "@graph": [
        // Website Schema
        {
          "@type": "WebSite",
          "@id": `${baseUrl}/#website`,
          "url": baseUrl,
          "name": name,
          "description": seoDescription,
          "inLanguage": lang === 'en' ? 'en-US' : 'lt-LT',
          "potentialAction": [
            {
              "@type": "SearchAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": `${baseUrl}/search?q={search_term_string}`
              },
              "query-input": "required name=search_term_string"
            }
          ],
          "publisher": {
            "@type": "Organization",
            "@id": `${baseUrl}/#organization`,
            "name": author,
            "url": baseUrl,
            "logo": {
              "@type": "ImageObject",
              "url": `${baseUrl}/images/dusofi-logo.png`,
              "width": 512,
              "height": 512
            },
            "sameAs": [
              "https://twitter.com/dusofi",
              "https://facebook.com/dusofi",
              "https://instagram.com/dusofi"
            ]
          }
        },
        // WebPage Schema
        {
          "@type": "WebPage",
          "@id": `${currentUrl}#webpage`,
          "url": currentUrl,
          "name": seoTitle,
          "description": seoDescription,
          "inLanguage": lang === 'en' ? 'en-US' : 'lt-LT',
          "isPartOf": {
            "@id": `${baseUrl}/#website`
          },
          "about": {
            "@type": "Thing",
            "name": "Philosophy"
          },
          "datePublished": publishDate,
          "dateModified": lastModified || new Date().toISOString(),
          "breadcrumb": breadcrumbs ? {
            "@type": "BreadcrumbList",
            "itemListElement": breadcrumbs.map((crumb, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "name": crumb.name,
              "item": `${baseUrl}${crumb.url}`
            }))
          } : undefined
        }
      ]
    };

    // Add Article schema if it's an article
    if (article && type === 'article') {
      baseSchema["@graph"].push({
        "@type": "Article",
        "@id": `${currentUrl}#article`,
        "headline": seoTitle,
        "description": seoDescription,
        "image": {
          "@type": "ImageObject",
          "url": seoImage,
          "width": 1200,
          "height": 630
        },
        "datePublished": article.publishDate,
        "dateModified": article.modifiedDate || new Date().toISOString(),
        "author": {
          "@type": "Person",
          "name": article.author || author,
          "url": article.authorUrl
        },
        "publisher": {
          "@id": `${baseUrl}/#organization`
        },
        "mainEntityOfPage": {
          "@id": `${currentUrl}#webpage`
        },
        "articleSection": article.category,
        "wordCount": article.wordCount,
        "timeRequired": article.readingTime,
        "keywords": seoKeywords.split(', ')
      });
    }

    // Add FAQ schema if provided
    if (faq && faq.length > 0) {
      baseSchema["@graph"].push({
        "@type": "FAQPage",
        "@id": `${currentUrl}#faq`,
        "mainEntity": faq.map(item => ({
          "@type": "Question",
          "name": item.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": item.answer
          }
        }))
      });
    }

    return baseSchema;
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <html lang={lang} />
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      <meta name="keywords" content={seoKeywords} />
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="bingbot" content="index, follow" />
      
      {/* Enhanced Meta Tags */}
      <meta name="referrer" content="origin-when-cross-origin" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content="DuSofi" />
      
      {/* Dates */}
      {publishDate && <meta name="article:published_time" content={publishDate} />}
      {lastModified && <meta name="article:modified_time" content={lastModified} />}
      
      {/* Canonical URL */}
      <link rel="canonical" href={currentUrl} />
      
      {/* Language alternates */}
      <link rel="alternate" hrefLang="en" href={currentUrl.replace('/lt/', '/')} />
      <link rel="alternate" hrefLang="lt" href={currentUrl.replace('/', '/lt/')} />
      <link rel="alternate" hrefLang="x-default" href={currentUrl.replace('/lt/', '/')} />
      
      {/* Preconnect for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={seoImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={`${seoTitle} - Philosophy and Wisdom`} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:site_name" content={name} />
      <meta property="og:locale" content={lang === 'en' ? 'en_US' : 'lt_LT'} />
      {lang === 'en' && <meta property="og:locale:alternate" content="lt_LT" />}
      {lang === 'lt' && <meta property="og:locale:alternate" content="en_US" />}
      
      {/* Article-specific OG tags */}
      {article && type === 'article' && (
        <>
          <meta property="article:author" content={article.author || author} />
          <meta property="article:section" content={article.category} />
          <meta property="article:published_time" content={article.publishDate} />
          <meta property="article:modified_time" content={article.modifiedDate || new Date().toISOString()} />
          {article.tags && article.tags.map(tag => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@DuSofi" />
      <meta name="twitter:creator" content="@DuSofi" />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={seoImage} />
      <meta name="twitter:image:alt" content={`${seoTitle} - Philosophy and Wisdom`} />
      <meta name="twitter:domain" content="dusofi.lt" />
      
      {/* Additional Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
      <meta name="theme-color" content="#be185d" />
      <meta name="msapplication-TileColor" content="#be185d" />
      <meta name="msapplication-navbutton-color" content="#be185d" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      
      {/* Favicons */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/site.webmanifest" />
      
      {/* DNS Prefetch for performance */}
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      
      {/* Enhanced Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(generateStructuredData(), null, 0)}
      </script>
    </Helmet>
  );
}
