import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const errors = [];
const warnings = [];

function read(file) {
  return fs.readFileSync(file, "utf8");
}

function readJson(file) {
  return JSON.parse(read(file));
}

function walk(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(file));
    else files.push(file);
  }
  return files;
}

function flatten(obj, prefix = "") {
  const out = new Map();
  for (const [key, value] of Object.entries(obj)) {
    const next = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      for (const [childKey, childValue] of flatten(value, next)) {
        out.set(childKey, childValue);
      }
    } else {
      out.set(next, value);
    }
  }
  return out;
}

function loadPhilosophers() {
  const dataPath = path.join("src", "data.js");
  const raw = read(dataPath);
  const transformed = raw
    .replace(
      /^\s*import\s+([A-Za-z_$][\w$]*)\s+from\s+["'][^"']+["'];\s*$/gm,
      "const $1 = null;"
    )
    .replace(/^\s*import .*?;\s*$/gm, "")
    .replace(
      /^\s*export\s+const\s+philosophers\s*=\s*/m,
      "globalThis.__PHILOSOPHERS__ = "
    )
    .replace(/^\s*export\s+default\s+philosophers\s*;\s*$/gm, "");

  const context = vm.createContext({ globalThis: {} });
  vm.runInContext(transformed, context, { filename: dataPath, timeout: 10_000 });
  return context.globalThis.__PHILOSOPHERS__;
}

function routingLocales() {
  const source = read(path.join("src", "i18n", "routing.ts"));
  const match = source.match(/locales:\s*\[([^\]]+)\]/);
  if (!match) {
    errors.push("Could not parse locales from src/i18n/routing.ts.");
    return [];
  }
  return [...match[1].matchAll(/["']([^"']+)["']/g)].map((m) => m[1]);
}

function checkSeoTranslations() {
  const locales = routingLocales();
  const baseSeo = readJson(path.join("src", "locales", "en", "translation.json")).seo;
  const requiredKeys = Object.keys(baseSeo);

  for (const locale of locales) {
    const file = path.join("src", "locales", locale, "translation.json");
    const seo = readJson(file).seo ?? {};
    for (const key of requiredKeys) {
      const value = String(seo[key] ?? "").trim();
      if (!value) errors.push(`${locale}: missing seo.${key}`);
      if (key.endsWith("_title") || key.endsWith("_title_dynamic")) {
        if (value.length > 65) warnings.push(`${locale}: seo.${key} is ${value.length} chars`);
      }
      if (key.endsWith("_description") || key.endsWith("_description_dynamic")) {
        if (value.length < 70 || value.length > 170) {
          warnings.push(`${locale}: seo.${key} description is ${value.length} chars`);
        }
      }
    }

    if (locale !== "en") {
      const sameAsEnglish = requiredKeys.filter((key) => seo[key] === baseSeo[key]);
      if (sameAsEnglish.length) {
        warnings.push(`${locale}: ${sameAsEnglish.length} SEO value(s) match English exactly`);
      }
    }
  }
}

function checkMetadataRoutes() {
  const pageFiles = walk(path.join("src", "app", "[locale]"))
    .filter((file) => file.endsWith(`${path.sep}page.tsx`))
    .filter((file) => !file.includes(`${path.sep}not-found.tsx`));

  for (const file of pageFiles) {
    const source = read(file);
    if (!source.includes("generateMetadata")) {
      errors.push(`${file}: missing generateMetadata`);
    }
    if (!source.includes("buildPageMetadata")) {
      errors.push(`${file}: does not use buildPageMetadata`);
    }
  }

  const helper = read(path.join("src", "lib", "metadata-helpers.ts"));
  for (const token of ["alternates", "openGraph", "twitter", "robots", "OPEN_GRAPH_LOCALES"]) {
    if (!helper.includes(token)) errors.push(`metadata helper missing ${token}`);
  }
}

function checkHreflangAndSitemap() {
  const hreflang = read(path.join("src", "lib", "hreflang.ts"));
  if (!hreflang.includes('"x-default"')) {
    errors.push("hreflang helper missing x-default alternate.");
  }

  const sitemap = read(path.join("src", "app", "sitemap.ts"));
  const localeLoops = [...sitemap.matchAll(/for\s*\(\s*const\s+locale\s+of\s+routing\.locales\s*\)/g)].length;
  if (localeLoops < 2) {
    errors.push("sitemap should emit localized entries for static and philosopher routes.");
  }
  if (!sitemap.includes("alternates")) errors.push("sitemap missing alternates.");

  const staticPaths = sitemap.match(/STATIC_PATHS\s*=\s*\[([^\]]+)\]/s);
  const staticCount = staticPaths
    ? [...staticPaths[1].matchAll(/["']\/[^"']*["']/g)].length
    : 0;
  const expected = routingLocales().length * (staticCount + loadPhilosophers().length);
  if (expected <= 0) errors.push("Could not calculate expected sitemap size.");
}

function checkRobotsAndOgImages() {
  const robots = read(path.join("src", "app", "robots.ts"));
  if (!robots.includes("sitemap")) errors.push("robots.ts missing sitemap.");
  if (!robots.includes('allow: "/"')) errors.push("robots.ts should allow root crawling.");

  const ogFiles = [
    path.join("src", "app", "[locale]", "opengraph-image.tsx"),
    path.join("src", "app", "[locale]", "philosopher", "[id]", "opengraph-image.tsx"),
  ];
  for (const file of ogFiles) {
    const source = read(file);
    if (!source.includes("1200") || !source.includes("630")) {
      errors.push(`${file}: OpenGraph image should be 1200x630.`);
    }
    if (!source.includes("ImageResponse")) {
      errors.push(`${file}: missing ImageResponse.`);
    }
  }
}

function checkJsonLd() {
  const source = read(path.join("src", "lib", "jsonld.tsx"));
  for (const token of [
    "Organization",
    "BreadcrumbList",
    "WebPage",
    "ItemList",
    "Person",
    "WebSite",
  ]) {
    if (!source.includes(token)) errors.push(`jsonld helper missing ${token}.`);
  }
}

function checkMojibakeInSeoFiles() {
  const files = [
    path.join("src", "app", "sitemap.ts"),
    path.join("src", "app", "robots.ts"),
    path.join("src", "app", "[locale]", "opengraph-image.tsx"),
    path.join("src", "app", "[locale]", "philosopher", "[id]", "opengraph-image.tsx"),
    path.join("src", "lib", "metadata-helpers.ts"),
    path.join("src", "lib", "hreflang.ts"),
    path.join("src", "lib", "jsonld.tsx"),
    path.join("src", "middleware.ts"),
  ];
  const bad =
    /\u00e2[\u0080-\u00ff\u2000-\u206f\u20ac\u2122]|\u00c3[\u0080-\u00bf]|\u00c2[\u0080-\u00bf\u00a0]|\u00c5[\u0080-\u00bf]|\u00c4[\u0080-\u00bf]|\u00d0[\u0080-\u00bf]|\u00d1[\u0080-\u00bf]|\ufffd/;

  for (const file of files) {
    const lines = read(file).split(/\n/);
    lines.forEach((line, index) => {
      if (bad.test(line)) errors.push(`${file}:${index + 1}: possible encoding artifact`);
    });
  }
}

checkSeoTranslations();
checkMetadataRoutes();
checkHreflangAndSitemap();
checkRobotsAndOgImages();
checkJsonLd();
checkMojibakeInSeoFiles();

if (warnings.length) {
  console.log("SEO warnings:");
  for (const warning of warnings) console.log(`- ${warning}`);
  console.log("");
}

if (errors.length) {
  console.error("SEO audit failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("SEO audit passed.");
