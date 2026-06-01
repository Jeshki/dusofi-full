import fs from "node:fs";

const files = ["src/data.js", "src/ideologiesData.js"];
const dryRun = process.argv.includes("--dry-run");

const cp1252EncodeMap = new Map([
  [0x20ac, 0x80],
  [0x201a, 0x82],
  [0x0192, 0x83],
  [0x201e, 0x84],
  [0x2026, 0x85],
  [0x2020, 0x86],
  [0x2021, 0x87],
  [0x02c6, 0x88],
  [0x2030, 0x89],
  [0x0160, 0x8a],
  [0x2039, 0x8b],
  [0x0152, 0x8c],
  [0x017d, 0x8e],
  [0x2018, 0x91],
  [0x2019, 0x92],
  [0x201c, 0x93],
  [0x201d, 0x94],
  [0x2022, 0x95],
  [0x2013, 0x96],
  [0x2014, 0x97],
  [0x02dc, 0x98],
  [0x2122, 0x99],
  [0x0161, 0x9a],
  [0x203a, 0x9b],
  [0x0153, 0x9c],
  [0x017e, 0x9e],
  [0x0178, 0x9f],
]);

const mojibakeMarker =
  /Ã.|â[€\u0080-\u009f]|Â[«»]|Ä[\u0080-\u009f…—™¯±³¾¸]|Å[\u0080-\u009f¡¢£¥¾½«³¯¼ª½ ¾]|á¹|Ê|ðŸ|Ø|Ñ[\u0080-\u009f]/;

const literalFixes = [
  [/The пороки/g, "The vices"],
  [/the пороки/g, "the vices"],
  [/Le mal vient du пороки/g, "Le mal vient des vices"],
  [/Les пороки/g, "Les vices"],
  [/Los пороки/g, "Los vicios"],
  [/los пороки/g, "los vicios"],
  [/I пороки/g, "I vizi"],
  [/i пороки/g, "i vizi"],
  [/del пороки/g, "dei vizi"],
  [/dell'пороки/g, "dei vizi"],
  [/безмятежны \(peaceful\)/g, "peaceful"],
  [/безмятежны \(friedlich\)/g, "friedlich"],
  [/безмятежны \(pacifiques\)/g, "paisibles"],
  [/безмятежны \(pacíficos\)/g, "pacíficos"],
  [/безмятежны \(pacifici\)/g, "pacifici"],
  [/безмятежны \(taikūs\)/g, "taikūs"],
];

function encodeCp1252(text) {
  const bytes = [];
  for (const char of text) {
    const code = char.codePointAt(0);
    if (code <= 0xff) {
      bytes.push(code);
    } else if (cp1252EncodeMap.has(code)) {
      bytes.push(cp1252EncodeMap.get(code));
    } else {
      bytes.push(...Buffer.from(char));
    }
  }
  return Buffer.from(bytes);
}

function badness(text) {
  const matches = text.match(/Ã|â€|Â[«»]|Ä[—™¯±³¾¸]|Å[¡¢£¥¾½«³¯¼ª½ ¾]|�|пороки|безмятежны/g);
  return matches ? matches.length : 0;
}

function decodeMojibakeLine(line) {
  if (!mojibakeMarker.test(line)) return line;

  const decoded = encodeCp1252(line).toString("utf8");
  if (decoded.includes("�")) return line;
  return badness(decoded) < badness(line) ? decoded : line;
}

function fixLine(line) {
  let next = decodeMojibakeLine(line);
  for (const [pattern, replacement] of literalFixes) {
    next = next.replace(pattern, replacement);
  }
  return next;
}

for (const file of files) {
  const source = fs.readFileSync(file, "utf8").replace(/^\uFEFF/, "");
  const lines = source.split(/\n/);
  const fixedLines = lines.map(fixLine);
  const fixed = fixedLines.join("\n");
  const changedLines = lines.reduce(
    (count, line, index) => count + (line !== fixedLines[index] ? 1 : 0),
    0,
  );

  console.log(`${file}: changed lines ${changedLines}`);
  if (!dryRun && fixed !== source) {
    fs.writeFileSync(file, fixed);
  }
}
