import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { spawnSync } from "node:child_process";

const LOCALES = ["lt", "de", "fr", "es", "it"];
const ALL_LOCALES = ["en", ...LOCALES];
const LOCALES_DIR = path.join("src", "locales");

const mojibakePattern =
  /\u00e2[\u0080-\u00ff\u2000-\u206f\u20ac\u2122]|\u00c3[\u0080-\u00bf]|\u00c2[\u0080-\u00bf\u00a0]|\u00c5[\u0080-\u00bf]|\u00c4[\u0080-\u00bf]|\u00d0[\u0080-\u00bf]|\u00d1[\u0080-\u00bf]|\ufffd/;
const cyrillicPattern = /[\u0400-\u04ff]/;

const errors = [];
const warnings = [];

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

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function walkTextFiles(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkTextFiles(file));
    } else if (/\.(js|jsx|ts|tsx|json)$/.test(entry.name)) {
      files.push(file);
    }
  }
  return files;
}

function loadPhilosophers() {
  const dataPath = path.join("src", "data.js");
  const raw = fs.readFileSync(dataPath, "utf8");
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

function loadIdeologies() {
  const dataPath = path.join("src", "ideologiesData.js");
  const raw = fs.readFileSync(dataPath, "utf8");
  const transformed = raw
    .replace(/^\s*import\s+[\w$]+\s+from\s+["'][^"']+["'];\s*$/gm, "")
    .replace(/image:\s*\w+Img/g, "image: null")
    .replace(/^\s*export\s+const\s+ideologies\s*=\s*/m, "globalThis.__IDEO__ = ")
    .replace(/^\s*export\s+.*$/gm, "");

  const context = vm.createContext({ globalThis: {} });
  vm.runInContext(transformed, context, { filename: dataPath, timeout: 15_000 });
  return context.globalThis.__IDEO__;
}

function runI18nUsageCheck() {
  const result = spawnSync(process.execPath, [path.join("scripts", "check-i18n-keys.mjs")], {
    encoding: "utf8",
  });

  if (result.error || result.status !== 0) {
    errors.push(`i18n key usage check failed: ${result.error?.message ?? result.stderr}`);
    return;
  }

  const match = result.stdout.match(/Missing in src\/locales\/en\/translation\.json:\s*(\d+)/);
  if (!match) {
    errors.push("i18n key usage check output could not be parsed.");
  } else if (Number(match[1]) !== 0) {
    errors.push(`i18n key usage check found ${match[1]} missing key(s).`);
  }
}

function checkTranslationJson() {
  const base = readJson(path.join(LOCALES_DIR, "en", "translation.json"));
  const baseFlat = flatten(base);
  const baseKeys = [...baseFlat.keys()].sort();

  for (const locale of LOCALES) {
    const file = path.join(LOCALES_DIR, locale, "translation.json");
    if (!fs.existsSync(file)) {
      errors.push(`${locale}: missing translation.json`);
      continue;
    }

    const data = readJson(file);
    const flat = flatten(data);
    const missing = baseKeys.filter((key) => !flat.has(key));
    const empty = baseKeys.filter(
      (key) => flat.has(key) && String(flat.get(key) ?? "").trim() === ""
    );

    if (missing.length) errors.push(`${locale}: missing ${missing.length} translation key(s)`);
    if (empty.length) errors.push(`${locale}: ${empty.length} empty translation value(s)`);

    const untranslatedSeo = Object.keys(base.seo ?? {}).filter(
      (key) => data.seo?.[key] === base.seo?.[key]
    );
    if (untranslatedSeo.length) {
      warnings.push(`${locale}: ${untranslatedSeo.length} SEO value(s) match English exactly`);
    }
  }
}

function checkQuoteCoverage() {
  const philosophers = loadPhilosophers();
  for (const philosopher of philosophers) {
    const enLength = Array.isArray(philosopher.quotes) ? philosopher.quotes.length : 0;
    for (const locale of LOCALES) {
      const key = `quotes_${locale}`;
      const localizedLength = Array.isArray(philosopher[key])
        ? philosopher[key].length
        : 0;
      if (localizedLength !== enLength) {
        errors.push(
          `${philosopher.name} (id ${philosopher.id}) ${key}: ${localizedLength}/${enLength}`
        );
      }
    }
  }
}

function checkIdeologyCoverage() {
  const ideologies = loadIdeologies();
  for (const ideology of ideologies) {
    const descEnLength = String(ideology.description ?? "").trim().length;
    for (const locale of LOCALES) {
      const desc = String(ideology[`description_${locale}`] ?? "").trim();
      if (!desc) {
        errors.push(`${ideology.id}: missing description_${locale}`);
      } else if (descEnLength > 0 && desc.length < descEnLength * 0.45 && desc.length < 300) {
        errors.push(`${ideology.id}: description_${locale} looks too short`);
      }
    }

    for (const subsection of ideology.subSections ?? []) {
      const en = String(subsection.content ?? "").trim();
      if (!en) continue;

      for (const locale of LOCALES) {
        const key = `content_${locale}`;
        const value = String(subsection[key] ?? "").trim();
        if (!value) {
          errors.push(`${ideology.id}/${subsection.title}: missing ${key}`);
        } else if (value === en) {
          errors.push(`${ideology.id}/${subsection.title}: ${key} matches English`);
        } else if (en.length > 120 && value.length / en.length < 0.65) {
          errors.push(`${ideology.id}/${subsection.title}: ${key} looks too short`);
        }
      }
    }
  }
}

function checkTextArtifacts() {
  for (const file of walkTextFiles("src")) {
    const lines = fs.readFileSync(file, "utf8").split(/\n/);
    for (let index = 0; index < lines.length; index++) {
      if (mojibakePattern.test(lines[index])) {
        errors.push(`${file}:${index + 1}: possible mojibake artifact`);
      }
      if (cyrillicPattern.test(lines[index])) {
        errors.push(`${file}:${index + 1}: unexpected Cyrillic text`);
      }
    }
  }
}

checkTranslationJson();
runI18nUsageCheck();
checkQuoteCoverage();
checkIdeologyCoverage();
checkTextArtifacts();

if (warnings.length) {
  console.log("Warnings:");
  for (const warning of warnings) console.log(`- ${warning}`);
  console.log("");
}

if (errors.length) {
  console.error("Translation audit failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("Translation audit passed.");
console.log(`Locales checked: ${ALL_LOCALES.join(", ")}`);
