import fs from "node:fs";
import vm from "node:vm";

const DATA_FILE = "src/ideologiesData.js";
const LOCALES = ["de", "fr", "es", "it", "lt"];
const threshold = Number(process.argv.find((arg) => arg.startsWith("--threshold="))?.split("=")[1] ?? 0.65);
const dryRun = process.argv.includes("--dry-run");
const targetLocales = LOCALES.filter((locale) => process.argv.includes(locale));
const locales = targetLocales.length ? targetLocales : LOCALES;
const cacheFile = `${process.env.TEMP ?? "."}/dusofi-ideology-translation-cache.json`;

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

function loadIdeologies(source) {
  const transformed = source
    .replace(/^\s*import\s+[\w$]+\s+from\s+["'][^"']+["'];\s*$/gm, "")
    .replace(/image:\s*\w+Img/g, "image: null")
    .replace(/^\s*export\s+const\s+ideologies\s*=\s*/m, "globalThis.__IDEO__ = ")
    .replace(/^\s*export\s+.*$/gm, "");
  const ctx = vm.createContext({ globalThis: {} });
  vm.runInContext(transformed, ctx, { timeout: 15_000 });
  return ctx.globalThis.__IDEO__;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function findClosingBacktick(source, openIndex) {
  let escaped = false;
  for (let i = openIndex + 1; i < source.length; i += 1) {
    const char = source[i];
    if (escaped) {
      escaped = false;
      continue;
    }
    if (char === "\\") {
      escaped = true;
      continue;
    }
    if (char === "`") return i;
  }
  throw new Error(`Could not find closing backtick at ${openIndex}`);
}

function findIdeologySpan(source, id) {
  const idRe = new RegExp(`\\bid\\s*:\\s*['"]${escapeRegExp(id)}['"]`);
  const idMatch = idRe.exec(source);
  if (!idMatch) throw new Error(`Could not find ideology ${id}`);

  const nextIdRe = /\n\s*\{\s*\n\s*id\s*:/g;
  nextIdRe.lastIndex = idMatch.index + 1;
  const next = nextIdRe.exec(source);
  return { start: idMatch.index, end: next?.index ?? source.length };
}

function findSubsectionSpan(source, ideologySpan, title) {
  const titleRe = new RegExp(`\\btitle\\s*:\\s*(['"])${escapeRegExp(title)}\\1`);
  const chunk = source.slice(ideologySpan.start, ideologySpan.end);
  const titleMatch = titleRe.exec(chunk);
  if (!titleMatch) throw new Error(`Could not find subsection ${title}`);

  const start = ideologySpan.start + titleMatch.index;
  const nextTitle = source.slice(start + 1, ideologySpan.end).search(/\n\s*\{\s*\n\s*title\s*:/);
  const end = nextTitle === -1 ? ideologySpan.end : start + 1 + nextTitle;
  return { start, end };
}

function findTemplateFieldSpan(source, span, field) {
  const fieldRe = new RegExp(`\\b${field}\\s*:\\s*\``);
  const chunk = source.slice(span.start, span.end);
  const match = fieldRe.exec(chunk);
  if (!match) throw new Error(`Could not find ${field}`);

  const fieldStart = span.start + match.index;
  const open = source.indexOf("`", fieldStart);
  const close = findClosingBacktick(source, open);
  return { start: fieldStart, end: close + 1 };
}

function formatTemplateField(field, value) {
  return `        ${field}: \`${value.replace(/`/g, "\\`")}\``;
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
      return data[0].map((part) => part[0]).join("").trim();
    }
    await sleep(400 * attempt);
  }

  throw new Error(`Translation request failed for ${locale}`);
}

async function translate(text, locale, cache) {
  const key = `${locale}\u0000${text}`;
  if (cache[key]) return cache[key];
  const translated = await requestTranslation(text, locale);
  cache[key] = translated;
  saveCache(cache);
  await sleep(120);
  return translated;
}

const source = fs.readFileSync(DATA_FILE, "utf8").replace(/^\uFEFF/, "");
const ideologies = loadIdeologies(source);
const cache = loadCache();
const replacements = [];
const summary = [];

for (const ideology of ideologies) {
  const ideologySpan = findIdeologySpan(source, ideology.id);
  for (const sub of ideology.subSections ?? []) {
    const en = String(sub.content ?? "").trim();
    if (en.length <= 120) continue;

    for (const locale of locales) {
      const field = `content_${locale}`;
      const localized = String(sub[field] ?? "").trim();
      if (!localized || localized === en) continue;
      const ratio = localized.length / en.length;
      if (ratio >= threshold) continue;

      summary.push({
        id: ideology.id,
        title: sub.title,
        locale,
        enLen: en.length,
        locLen: localized.length,
        ratio: ratio.toFixed(2),
      });

      if (dryRun) continue;

      console.log(`${locale}: ${ideology.id} / ${sub.title} (${ratio.toFixed(2)})`);
      const translated = await translate(en, locale, cache);
      const subSpan = findSubsectionSpan(source, ideologySpan, sub.title);
      const fieldSpan = findTemplateFieldSpan(source, subSpan, field);
      replacements.push({
        ...fieldSpan,
        value: formatTemplateField(field, translated),
      });
    }
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
