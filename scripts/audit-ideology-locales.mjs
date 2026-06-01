import fs from "node:fs";
import vm from "node:vm";

const raw = fs.readFileSync("src/ideologiesData.js", "utf8");
const transformed = raw
  .replace(/^\s*import\s+[\w$]+\s+from\s+["'][^"']+["'];\s*$/gm, "")
  .replace(/image:\s*\w+Img/g, "image: null")
  .replace(/^\s*export\s+const\s+ideologies\s*=\s*/m, "globalThis.__IDEO__ = ")
  .replace(/^\s*export\s+.*$/gm, "");

const ctx = vm.createContext({ globalThis: {} });
vm.runInContext(transformed, ctx, { timeout: 15_000 });
const ideologies = ctx.globalThis.__IDEO__;
const locales = process.argv[2]
  ? [process.argv[2]]
  : ["de", "fr", "es", "it", "lt"];
const issues = [];
const relative = [];

for (const ideo of ideologies) {
  for (const sub of ideo.subSections ?? []) {
    const en = (sub.content ?? "").trim();
    if (!en) continue;
    for (const loc of locales) {
      const key = `content_${loc}`;
      const val = (sub[key] ?? "").trim();
      if (!val) {
        issues.push({
          type: "missing",
          id: ideo.id,
          title: sub.title,
          loc,
          enLen: en.length,
        });
        continue;
      }
      if (val === en) {
        issues.push({
          type: "same-as-en",
          id: ideo.id,
          title: sub.title,
          loc,
        });
      }
      const r = val.length / en.length;
      if (en.length > 120 && r < 0.65) {
        relative.push({
          id: ideo.id,
          title: sub.title,
          loc,
          enLen: en.length,
          locLen: val.length,
          ratio: r.toFixed(2),
        });
      }
    }
  }
  const descEn = (ideo.description ?? "").length;
  for (const loc of locales) {
    const key = `description_${loc}`;
    const val = ideo[key];
    if (!val) {
      issues.push({ type: "missing-desc", id: ideo.id, loc });
    } else if (val.length < descEn * 0.45 && val.length < 300) {
      issues.push({
        type: "short-desc",
        id: ideo.id,
        loc,
        enLen: descEn,
        locLen: val.length,
      });
    }
  }
}

relative.sort((a, b) => Number(a.ratio) - Number(b.ratio));
console.log("Issues:", issues.length);
const byType = {};
for (const i of issues) byType[i.type] = (byType[i.type] ?? 0) + 1;
console.log(byType);
for (const i of issues) console.log(JSON.stringify(i));
console.log("\nShortest relative to EN (<55%):", relative.length);
for (const i of relative.slice(0, 35)) console.log(JSON.stringify(i));
