import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const LOCALES = ["lt", "de", "fr", "es", "it"];

function getArrLen(value) {
  if (!value) return 0;
  if (Array.isArray(value)) return value.length;
  return 0;
}

function parseArgs(argv) {
  const args = new Set(argv.slice(2));
  const onlyLocale = [...LOCALES].find((l) => args.has(l));
  const showAll = args.has("--all");
  const json = args.has("--json");
  return { onlyLocale, showAll, json };
}

function loadPhilosophers() {
  const dataPath = path.resolve(process.cwd(), "src", "data.js");
  const raw = fs.readFileSync(dataPath, "utf8");

  // `src/data.js` imports images (.png) which Node can't load directly.
  // We only need the exported `philosophers` array, so:
  // - turn default imports into stubs (const X = null)
  // - rewrite export to global assignment
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
  const philosophers = context.globalThis.__PHILOSOPHERS__;
  if (!Array.isArray(philosophers)) {
    throw new Error("Failed to load philosophers array from src/data.js");
  }
  return philosophers;
}

function coverageRows(philosophers, locale) {
  const key = `quotes_${locale}`;
  return philosophers
    .map((p) => {
      const enLen = getArrLen(p.quotes);
      const locLen = getArrLen(p[key]);
      return {
        id: p.id,
        name: p.name,
        en: enLen,
        locale: locale,
        loc: locLen,
        diff: enLen - locLen,
        hasField: Object.prototype.hasOwnProperty.call(p, key),
      };
    })
    .sort((a, b) => b.diff - a.diff || a.id - b.id);
}

function printTable(rows) {
  const header = ["id", "en", "loc", "diff", "hasField", "name"];
  console.log(header.join("\t"));
  for (const r of rows) {
    console.log(
      [r.id, r.en, r.loc, r.diff, r.hasField ? "Y" : "N", r.name].join("\t")
    );
  }
}

const philosophers = loadPhilosophers();
const { onlyLocale, showAll, json } = parseArgs(process.argv);
const localesToCheck = onlyLocale ? [onlyLocale] : LOCALES;

if (json) {
  const out = {};
  for (const loc of localesToCheck) {
    const rows = coverageRows(philosophers, loc).filter(
      (r) => showAll || r.diff !== 0
    );
    out[loc] = rows;
  }
  console.log(JSON.stringify(out, null, 2));
} else {
  for (const loc of localesToCheck) {
    const rows = coverageRows(philosophers, loc).filter(
      (r) => showAll || r.diff !== 0
    );
    console.log(`\n=== quotes_${loc} coverage (showAll=${showAll}) ===`);
    printTable(rows);
  }
}

