import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const dataPath = path.resolve(process.cwd(), "src", "data.js");

function loadPhilosophers(source) {
  const transformed = source
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

function findMatching(source, openIndex, openChar, closeChar) {
  let quote = null;
  let escaped = false;
  let lineComment = false;
  let blockComment = false;
  let depth = 0;

  for (let i = openIndex; i < source.length; i++) {
    const ch = source[i];
    const next = source[i + 1];

    if (lineComment) {
      if (ch === "\n") lineComment = false;
      continue;
    }

    if (blockComment) {
      if (ch === "*" && next === "/") {
        blockComment = false;
        i++;
      }
      continue;
    }

    if (quote) {
      if (escaped) {
        escaped = false;
      } else if (ch === "\\") {
        escaped = true;
      } else if (ch === quote) {
        quote = null;
      }
      continue;
    }

    if (ch === "/" && next === "/") {
      lineComment = true;
      i++;
      continue;
    }

    if (ch === "/" && next === "*") {
      blockComment = true;
      i++;
      continue;
    }

    if (ch === "\"" || ch === "'" || ch === "`") {
      quote = ch;
      continue;
    }

    if (ch === openChar) depth++;
    if (ch === closeChar) {
      depth--;
      if (depth === 0) return i;
    }
  }

  throw new Error(`No matching ${closeChar} found at ${openIndex}`);
}

function findMatchingBracket(source, openIndex) {
  return findMatching(source, openIndex, "[", "]");
}

function formatArray(values, indent) {
  const itemIndent = `${indent}  `;
  const lines = values.map((value) => `${itemIndent}${JSON.stringify(value)},`);
  return `[\n${lines.join("\n")}\n${indent}]`;
}

let source = fs.readFileSync(dataPath, "utf8");
const philosophers = loadPhilosophers(source);
const sourcePositions = philosophers
  .map((p) => ({ id: p.id, index: source.indexOf(`id: ${p.id},`) }))
  .filter((p) => p.index !== -1)
  .sort((a, b) => a.index - b.index);

function findSourceRange(id) {
  const currentIndex = sourcePositions.findIndex((p) => p.id === id);
  if (currentIndex === -1) throw new Error(`Could not find philosopher id ${id}`);
  return {
    start: sourcePositions[currentIndex].index,
    end: sourcePositions[currentIndex + 1]?.index ?? source.length,
  };
}

const fixes = philosophers
  .filter((p) => Array.isArray(p.quotes) && Array.isArray(p.quotes_lt))
  .filter((p) => p.quotes_lt.length > p.quotes.length)
  .map((p) => ({
    id: p.id,
    name: p.name,
    targetLength: p.quotes.length,
    currentLength: p.quotes_lt.length,
    values: p.quotes_lt.slice(0, p.quotes.length),
  }));

for (const fix of fixes) {
  const bounds = findSourceRange(fix.id);
  let keyIndex = bounds.end;
  let replacements = 0;

  while ((keyIndex = source.lastIndexOf("quotes_lt:", keyIndex)) !== -1 && keyIndex > bounds.start) {
    const openIndex = source.indexOf("[", keyIndex);
    const closeIndex = findMatchingBracket(source, openIndex);
    const lineStart = source.lastIndexOf("\n", keyIndex) + 1;
    const indent = source.slice(lineStart, keyIndex).match(/^\s*/)?.[0] ?? "";
    const replacement = formatArray(fix.values, indent);

    source = `${source.slice(0, openIndex)}${replacement}${source.slice(closeIndex + 1)}`;
    keyIndex -= 1;
    replacements++;
  }

  if (replacements === 0) {
    throw new Error(`Could not find quotes_lt for id ${fix.id}`);
  }
  fix.replacements = replacements;
}

fs.writeFileSync(dataPath, source);

if (fixes.length === 0) {
  console.log("No extra Lithuanian quote entries found.");
} else {
  for (const fix of fixes) {
    console.log(
      `${fix.name} (id ${fix.id}): ${fix.currentLength} -> ${fix.targetLength} (${fix.replacements} field(s))`
    );
  }
}
