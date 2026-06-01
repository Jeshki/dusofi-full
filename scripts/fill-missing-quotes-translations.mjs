import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const DATA_FILE = path.join("src", "data.js");
const LOCALES = ["lt", "de", "fr", "es", "it"];
const args = new Set(process.argv.slice(2));
const dryRun = args.has("--dry-run");
const selectedLocales = LOCALES.filter((locale) => args.has(locale));
const targetLocales = selectedLocales.length ? selectedLocales : LOCALES;
const cacheFile = path.join(process.env.TEMP ?? ".", "dusofi-translation-cache.json");

function loadCache() {
  try {
    return JSON.parse(fs.readFileSync(cacheFile, "utf8"));
  } catch {
    return {};
  }
}

function saveCache(cache) {
  fs.writeFileSync(cacheFile, `${JSON.stringify(cache, null, 2)}\n`);
}

function loadPhilosophers(source) {
  const transformed = source
    .replace(
      /^\s*import\s+([A-Za-z_$][\w$]*)\s+from\s+["'][^"']+["'];\s*$/gm,
      "const $1 = null;",
    )
    .replace(/^\s*import .*?;\s*$/gm, "")
    .replace(/^\s*export\s+const\s+philosophers\s*=\s*/m, "globalThis.__PHILOSOPHERS__ = ")
    .replace(/^\s*export\s+default\s+philosophers\s*;\s*$/gm, "");

  const context = vm.createContext({ globalThis: {} });
  vm.runInContext(transformed, context, { filename: DATA_FILE, timeout: 10_000 });
  return context.globalThis.__PHILOSOPHERS__;
}

function getItemBounds(source) {
  const idRe = /\bid:\s*(\d+)\s*,/g;
  const matches = [];
  let match;
  while ((match = idRe.exec(source))) {
    matches.push({ id: Number(match[1]), index: match.index });
  }

  const itemStarts = [];
  const itemStartRe = /^\s*\{\s*$/gm;
  while ((match = itemStartRe.exec(source))) {
    itemStarts.push(match.index);
  }

  function nearestItemStartBefore(index, after = -1) {
    let found = -1;
    for (const start of itemStarts) {
      if (start >= index) break;
      if (start > after) found = start;
    }
    return found;
  }

  return matches.map(({ id, index }, i) => {
    const startIndex = nearestItemStartBefore(index);
    const start = startIndex === -1 ? index : startIndex;
    const next = matches[i + 1]?.index;
    const nextStart = next == null ? -1 : nearestItemStartBefore(next, start);
    const end = nextStart === -1 ? source.length : nextStart;
    return { id, start, end };
  });
}

function findMatchingBracket(source, openIndex) {
  let quote = null;
  let escaped = false;

  for (let i = openIndex + 1; i < source.length; i += 1) {
    const char = source[i];

    if (quote) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === quote) {
        quote = null;
      }
      continue;
    }

    if (char === '"' || char === "'" || char === "`") {
      quote = char;
      continue;
    }

    if (char === "]") {
      return i;
    }
  }

  throw new Error(`Could not find matching ] after index ${openIndex}`);
}

function findArraySpan(source, bounds, field) {
  const chunk = source.slice(bounds.start, bounds.end);
  const fieldRe = new RegExp(`\\b${field}\\s*:\\s*\\[`);
  const match = fieldRe.exec(chunk);
  if (!match) return null;

  const fieldStart = bounds.start + match.index;
  const openIndex = source.indexOf("[", fieldStart);
  const closeIndex = findMatchingBracket(source, openIndex);
  return { start: fieldStart, end: closeIndex + 1 };
}

function formatArray(field, values) {
  const lines = values.map((value) => `      ${JSON.stringify(value)},`);
  return `    ${field}: [\n${lines.join("\n")}\n    ]`;
}

function chunkTexts(texts, maxChars = 3_500, maxItems = 35) {
  const chunks = [];
  let current = [];
  let currentChars = 0;

  for (const text of texts) {
    const nextChars = text.length + 40;
    if (current.length && (current.length >= maxItems || currentChars + nextChars > maxChars)) {
      chunks.push(current);
      current = [];
      currentChars = 0;
    }
    current.push(text);
    currentChars += nextChars;
  }

  if (current.length) chunks.push(current);
  return chunks;
}

async function sleep(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function requestTranslation(text, locale) {
  const url = new URL("https://translate.googleapis.com/translate_a/single");
  url.searchParams.set("client", "gtx");
  url.searchParams.set("sl", "en");
  url.searchParams.set("tl", locale);
  url.searchParams.set("dt", "t");
  url.searchParams.set("q", text);

  for (let attempt = 1; attempt <= 4; attempt += 1) {
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      return data[0].map((part) => part[0]).join("");
    }
    await sleep(400 * attempt);
  }

  throw new Error(`Translation request failed for locale ${locale}`);
}

async function translateTexts(texts, locale, cache) {
  const out = new Array(texts.length);
  const pending = [];

  texts.forEach((text, index) => {
    const cacheKey = `${locale}\u0000${text}`;
    if (cache[cacheKey]) {
      out[index] = cache[cacheKey];
    } else {
      pending.push({ text, index });
    }
  });

  const chunks = chunkTexts(pending);
  let completed = 0;

  for (const chunk of chunks) {
    const delimiter = `\n<<<DUSOFI_TRANSLATION_SPLIT_${locale}_${Date.now()}_${completed}>>>\n`;
    const joined = chunk.map(({ text }) => text).join(delimiter);
    let translated = await requestTranslation(joined, locale);
    let parts = translated.split(delimiter);

    if (parts.length !== chunk.length) {
      parts = [];
      for (const { text } of chunk) {
        parts.push(await requestTranslation(text, locale));
        await sleep(80);
      }
    }

    parts.forEach((part, i) => {
      const { text, index } = chunk[i];
      const normalized = part.trim();
      out[index] = normalized;
      cache[`${locale}\u0000${text}`] = normalized;
    });

    completed += chunk.length;
    saveCache(cache);
    await sleep(120);
  }

  return out;
}

const source = fs.readFileSync(DATA_FILE, "utf8").replace(/^\uFEFF/, "");
const philosophers = loadPhilosophers(source);
const boundsById = new Map(getItemBounds(source).map((bounds) => [bounds.id, bounds]));
const cache = loadCache();
const replacements = [];
const summary = {};

for (const locale of targetLocales) {
  summary[locale] = { philosophers: 0, quotes: 0 };

  for (const philosopher of philosophers) {
    if (!Array.isArray(philosopher.quotes)) continue;

    const field = `quotes_${locale}`;
    const localized = Array.isArray(philosopher[field]) ? philosopher[field] : [];
    if (localized.length >= philosopher.quotes.length) continue;

    const missing = philosopher.quotes.slice(localized.length).filter((quote) => typeof quote === "string");
    if (!missing.length) continue;

    summary[locale].philosophers += 1;
    summary[locale].quotes += missing.length;

    if (dryRun) continue;

    console.log(
      `${locale}: translating ${missing.length} quotes for ${philosopher.id} ${philosopher.name}`,
    );
    const translated = await translateTexts(missing, locale, cache);
    const bounds = boundsById.get(philosopher.id);
    const span = bounds && findArraySpan(source, bounds, field);
    if (!span) {
      throw new Error(`Could not find ${field} for philosopher id ${philosopher.id}`);
    }

    replacements.push({
      ...span,
      value: formatArray(field, [...localized, ...translated]),
    });
  }
}

console.log(JSON.stringify(summary, null, 2));

if (!dryRun && replacements.length) {
  let nextSource = source;
  for (const replacement of replacements.sort((a, b) => b.start - a.start)) {
    nextSource =
      nextSource.slice(0, replacement.start) + replacement.value + nextSource.slice(replacement.end);
  }
  fs.writeFileSync(DATA_FILE, nextSource);
}
