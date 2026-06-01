import fs from "node:fs";
import path from "node:path";

function flatten(obj, prefix = "") {
  const out = new Map();
  for (const [k, v] of Object.entries(obj)) {
    const next = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) {
      for (const [kk, vv] of flatten(v, next)) out.set(kk, vv);
    } else {
      out.set(next, v);
    }
  }
  return out;
}

const localesDir = path.join("src", "locales");
const baseLocale = process.argv[2] ?? "en";
const showLimit = Number(process.argv[3] ?? "60");

const basePath = path.join(localesDir, baseLocale, "translation.json");
const base = JSON.parse(fs.readFileSync(basePath, "utf8"));
const baseFlat = flatten(base);
const baseKeys = [...baseFlat.keys()].sort();

const localeDirs = fs
  .readdirSync(localesDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .filter((l) => l !== baseLocale)
  .sort();

console.log(`Base locale: ${baseLocale}`);
console.log(`Base keys: ${baseKeys.length}`);
console.log(`Locales: ${localeDirs.join(", ") || "(none)"}`);

for (const locale of localeDirs) {
  const file = path.join(localesDir, locale, "translation.json");
  if (!fs.existsSync(file)) {
    console.log(`\n${locale}: missing translation.json`);
    continue;
  }

  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  const flat = flatten(data);
  const missing = baseKeys.filter((k) => !flat.has(k));
  const empty = baseKeys.filter((k) => flat.has(k) && String(flat.get(k) ?? "").trim() === "");

  console.log(`\n${locale}: missing ${missing.length}, empty ${empty.length}`);
  if (missing.length) {
    console.log(`  missing (first ${Math.min(showLimit, missing.length)}):`);
    for (const k of missing.slice(0, showLimit)) console.log(`  - ${k}`);
  }
  if (empty.length) {
    console.log(`  empty (first ${Math.min(showLimit, empty.length)}):`);
    for (const k of empty.slice(0, showLimit)) console.log(`  - ${k}`);
  }
}

