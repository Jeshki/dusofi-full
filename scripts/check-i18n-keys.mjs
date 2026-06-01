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

function walk(dir) {
  const out = [];
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) out.push(...walk(p));
    else if (/\.(js|jsx|ts|tsx)$/.test(ent.name)) out.push(p);
  }
  return out;
}

function getTranslatorNamespaces(src) {
  const out = new Map();

  // const t = await getTranslations({ locale, namespace: "seo" });
  // const t = getTranslations({ namespace: 'header', ... })
  const getTranslationsRe =
    /\bconst\s+([A-Za-z_$][\w$]*)\s*=\s*(?:await\s+)?getTranslations\(\s*\{[\s\S]*?\bnamespace\s*:\s*["']([^"']+)["'][\s\S]*?\}\s*\)/g;

  // const t = useTranslations("not_found");
  const useTranslationsNamespacedRe =
    /\bconst\s+([A-Za-z_$][\w$]*)\s*=\s*useTranslations\(\s*["']([^"']+)["']\s*\)/g;

  // const t = useTranslations();
  const useTranslationsRootRe =
    /\bconst\s+([A-Za-z_$][\w$]*)\s*=\s*useTranslations\(\s*\)/g;

  let m;
  while ((m = getTranslationsRe.exec(src))) out.set(m[1], m[2]);
  while ((m = useTranslationsNamespacedRe.exec(src))) out.set(m[1], m[2]);
  while ((m = useTranslationsRootRe.exec(src))) {
    if (!out.has(m[1])) out.set(m[1], "");
  }

  return out;
}

const en = JSON.parse(
  fs.readFileSync(path.join("src", "locales", "en", "translation.json"), "utf8"),
);
const dict = flatten(en);

const files = walk("src");
const used = new Set();

for (const f of files) {
  const src = fs.readFileSync(f, "utf8");
  const translators = getTranslatorNamespaces(src);

  // Looks for t("a.b.c") / t('a.b.c') / t(`a.b.c`) - plain strings only.
  // We support any translator variable name (t, tSeo, tHeader, etc).
  const re = /\b([A-Za-z_$][\w$]*)\(\s*(["'`])([^"'`]+)\2/g;
  let m;
  while ((m = re.exec(src))) {
    const fnName = m[1];
    const rawKey = m[3];

    if (!translators.has(fnName)) continue;
    if (rawKey.includes("${")) continue;
    const ns = translators.get(fnName);
    const fullKey = ns ? `${ns}.${rawKey}` : rawKey;
    used.add(fullKey);
  }
}

const usedKeys = [...used].sort();
const missingInEn = usedKeys.filter((k) => !dict.has(k));

console.log(`Files scanned: ${files.length}`);
console.log(`t() keys found: ${usedKeys.length}`);
console.log(`Missing in src/locales/en/translation.json: ${missingInEn.length}`);

if (missingInEn.length) {
  console.log("\nMissing keys:");
  for (const k of missingInEn) console.log(k);
}

