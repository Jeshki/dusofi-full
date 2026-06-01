import fs from "node:fs";

const file = "src/data.js";
const src = fs.readFileSync(file, "utf8").replace(/^\uFEFF/, "");

// Heuristic: each philosopher object contains `id: <number>,` and objects are in array order.
// We approximate object boundaries by taking the closest preceding "\n  {" (array item start)
// and slicing until the next array item start.
const idRe = /\bid:\s*(\d+)\s*,/g;
const matches = [];
let m;
while ((m = idRe.exec(src))) matches.push({ id: Number(m[1]), index: m.index });

function findItemStart(pos) {
  const marker = "\n  {";
  const start = src.lastIndexOf(marker, pos);
  return start === -1 ? pos : start + 1; // keep leading newline out
}

function findItemEnd(fromPos) {
  const marker = "\n  {";
  const next = src.indexOf(marker, fromPos + 1);
  return next === -1 ? src.length : next + 1;
}

function sliceFor(i) {
  const idPos = matches[i].index;
  const start = findItemStart(idPos);
  const end = findItemEnd(idPos);
  return src.slice(start, end);
}

function hasField(chunk, field) {
  return new RegExp(`\\b${field}\\s*:`).test(chunk);
}

function fieldValueStartsEmpty(chunk, field) {
  const match = chunk.match(new RegExp(`\\b${field}\\s*:\\s*`));
  if (!match || match.index == null) return false;

  const valueStart = chunk.slice(match.index + match[0].length);
  return /^(""|''|`\s*`|\[\s*\])(\s*,|\s*\n)/.test(valueStart);
}

function getName(chunk) {
  return chunk.match(/\bname:\s*"([^"]+)"/)?.[1] ?? "(unknown)";
}

function listMissing(locale, fields) {
  const out = new Map();
  for (let i = 0; i < matches.length; i += 1) {
    const id = matches[i].id;
    const chunk = sliceFor(i);
    const name = getName(chunk);
    for (const base of fields) {
      const localized = `${base}_${locale}`;
      if (!out.has(base)) {
        out.set(base, { missing: [], empty: [] });
      }

      if (!hasField(chunk, localized)) {
        out.get(base).missing.push({ id, name });
        continue;
      }

      if (fieldValueStartsEmpty(chunk, localized)) {
        out.get(base).empty.push({ id, name });
      }
    }
  }
  return out;
}

const locale = process.argv[2] ?? "lt";
const fields = ["quote", "shortStory", "biography", "quotes", "bio"];
const missing = listMissing(locale, fields);

console.log(`Scanning ${file}`);
console.log(`Locale: ${locale}`);
for (const base of fields) {
  const status = missing.get(base) ?? { missing: [], empty: [] };
  console.log(`${base}_${locale}: missing ${status.missing.length}, empty ${status.empty.length}`);

  if (status.missing.length) {
    console.log(`  missing: ${status.missing.map(({ id, name }) => `${id}:${name}`).join(", ")}`);
  }

  if (status.empty.length) {
    console.log(`  empty: ${status.empty.map(({ id, name }) => `${id}:${name}`).join(", ")}`);
  }
}

