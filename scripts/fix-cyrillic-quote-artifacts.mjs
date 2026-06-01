import fs from "node:fs";

const DATA_FILE = "src/data.js";
const dryRun = process.argv.includes("--dry-run");
const cacheFile = `${process.env.TEMP ?? "."}/dusofi-cyrillic-quote-cache.json`;

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

async function sleep(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function requestTranslation(text, locale) {
  const url = new URL("https://translate.googleapis.com/translate_a/single");
  url.searchParams.set("client", "gtx");
  url.searchParams.set("sl", "auto");
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
  if (cache[key]) return replaceCyrillicTerms(cache[key], locale);
  const translated = replaceCyrillicTerms(await requestTranslation(text, locale), locale);
  cache[key] = translated;
  saveCache(cache);
  await sleep(100);
  return translated;
}

const replacements = {
  en: [
    ["ум никогда не поверит, пока сердце не почувствует", "mind will never believe until the heart feels"],
    ["сеятель счастья", "a sower of happiness"],
    ["быстро успокоить", "quickly soothe"],
    ["злое место", "wicked place"],
    ["бесконечная радость", "infinite joy"],
    ["орган восприятия", "organ of perception"],
    ["особые действия", "special acts"],
    ["руководящая сила", "guiding force"],
    ["признать", "recognize"],
    ["сансара", "samsara"],
    ["бытие", "being"],
    ["фантазії", "fantasies"],
    ["оживить", "enliven"],
    ["обмененный", "exchanged"],
    ["бесконечный", "infinite"],
    ["планете", "planned"],
    ["присутствие", "presence"],
    ["дуалистичен", "dualistic"],
    ["тринитарен", "trinitarian"],
    ["серьезный", "serious"],
    ["великий", "great"],
    ["разделение", "division"],
    ["разум", "reason"],
    ["перекресток", "crossroads"],
    ["произвольное", "arbitrary"],
    ["нарушение", "violation"],
    ["действия", "acts"],
    ["действие", "act"],
    ["кредо", "creeds"],
    ["лишь", "only"],
    ["окончание", "end"],
    ["слуги", "servants"],
    ["сыновья", "sons"],
    ["богатство", "wealth"],
    ["победа", "victory"],
    ["социален", "social"],
    ["политичен", "political"],
    ["привычка", "habit"],
    ["иллюзия", "illusion"],
    ["устойчивость", "stability"],
    ["высшее", "supreme"],
    ["пластичный", "malleable"],
    ["глупость", "foolishness"],
    ["океан", "ocean"],
    ["только", "only"],
    ["открить", "reveal"],
    ["оркестр", "orchestra"],
    ["скупой", "stingy"],
    ["благо", "good"],
    ["обиды", "insults"],
    ["пустота", "emptiness"],
    ["глубокое", "deep"],
    ["поднимание", "raising"],
    ["наслаждении", "pleasure"],
    ["категории", "categories"],
    ["наивный", "naive"],
    ["разумный", "rational"],
    ["красота", "beauty"],
    ["легко", "easy"],
    ["познание", "knowledge"],
  ],
  de: [
    ["злое место", "böser Ort"],
    ["разумный", "Vernünftigen"],
    ["фантазії", "Fantasien"],
  ],
  fr: [
    ["сеятель счастья", "semeur de bonheur"],
    ["быстро успокоить", "apaiser rapidement"],
    ["злое место", "lieu mauvais"],
    ["бесконечная радость", "joie infinie"],
    ["сансара", "samsara"],
    ["бытие", "être"],
    ["фантазії", "fantaisies"],
    ["слуги", "serviteurs"],
    ["сыновья", "fils"],
    ["нарушение", "violation"],
    ["proizvolnoe", "arbitraire"],
    ["привычка", "habitude"],
    ["разделение", "division"],
    ["высшее", "suprême"],
    ["глупость", "folie"],
    ["богатство", "richesse"],
    ["скупой", "avare"],
    ["благо", "bons"],
    ["разумный", "raisonnable"],
  ],
  es: [
    ["сеятель счастья", "sembrador de felicidad"],
    ["быстро успокоить", "calmar rápidamente"],
    ["злое место", "lugar malo"],
    ["бесконечная радость", "alegría infinita"],
    ["сансара", "samsara"],
    ["бытие", "ser"],
    ["фантазії", "fantasías"],
    ["слуги", "sirvientes"],
    ["сыновья", "hijos"],
    ["произвольное", "arbitrario"],
    ["нарушение", "violación"],
    ["особые действия", "actos especiales"],
    ["действие", "acto"],
    ["кредо", "credos"],
    ["победа", "victoria"],
    ["привычка", "hábito"],
    ["разделение", "división"],
    ["высшее", "supremo"],
    ["глупость", "necedad"],
    ["богатство", "riqueza"],
    ["оркестр", "orquesta"],
    ["скупой", "tacaño"],
    ["благо", "buenas"],
    ["обиды", "ofensas"],
    ["наслаждении", "placer"],
    ["наивный", "ingenuo"],
    ["разумный", "razonable"],
    ["красота", "belleza"],
    ["руководящая сила", "fuerza rectora"],
  ],
  it: [
    ["сеятель счастья", "seminatore di felicità"],
    ["злое место", "luogo malvagio"],
    ["бесконечная радость", "gioia infinita"],
    ["бытие", "essere"],
    ["фантазії", "fantasie"],
    ["обмененный", "scambiata"],
    ["слуги", "servi"],
    ["сыновья", "figli"],
    ["дуалистичен", "dualistico"],
    ["тринитарен", "trinitario"],
    ["произвольное", "arbitrario"],
    ["кредо", "credi"],
    ["глупость", "stoltezza"],
    ["богатство", "ricchezza"],
    ["скупой", "avaro"],
    ["обиды", "offese"],
    ["пустота", "vacuità"],
    ["иллюзия", "illusione"],
    ["наслаждении", "piacere"],
    ["наивный", "ingenuo"],
    ["разумный", "ragionevole"],
    ["руководящая сила", "forza guida"],
  ],
};

function replaceCyrillicTerms(text, locale) {
  let next = text;
  for (const [from, to] of replacements[locale] ?? replacements.en) {
    next = next.replaceAll(from, to);
  }
  return next;
}

function localeFromQuotesField(field) {
  const match = field.match(/^quotes(?:_([a-z]{2}))?$/);
  return match?.[1] ?? "en";
}

const source = fs.readFileSync(DATA_FILE, "utf8").replace(/^\uFEFF/, "");
const lines = source.split(/\n/);
const cache = loadCache();
const targets = [];
let currentLocale = null;
let arrayDepth = 0;

for (let i = 0; i < lines.length; i += 1) {
  const line = lines[i];
  const fieldMatch = line.match(/^\s*(quotes(?:_[a-z]{2})?)\s*:\s*\[/);
  if (fieldMatch) {
    currentLocale = localeFromQuotesField(fieldMatch[1]);
    arrayDepth = 1;
    continue;
  }

  if (currentLocale) {
    if (line.includes("[")) arrayDepth += (line.match(/\[/g) ?? []).length;
    if (line.includes("]")) arrayDepth -= (line.match(/\]/g) ?? []).length;
    if (arrayDepth <= 0) {
      currentLocale = null;
      arrayDepth = 0;
      continue;
    }

    if (!/[\u0400-\u04ff]/.test(line)) continue;

    const stringMatch = line.match(/^(\s*)("(?:[^"\\]|\\.)*")(\s*,?\s*)$/);
    if (!stringMatch) continue;

    const text = JSON.parse(stringMatch[2]);
    targets.push({
      index: i,
      indent: stringMatch[1],
      suffix: stringMatch[3],
      locale: currentLocale,
      text,
    });
  }
}

console.log(
  JSON.stringify(
    targets.map(({ index, locale, text }) => ({ line: index + 1, locale, text })),
    null,
    2,
  ),
);

if (!dryRun) {
  for (const target of targets) {
    const translated = await translate(target.text, target.locale, cache);
    lines[target.index] = `${target.indent}${JSON.stringify(translated)}${target.suffix}`;
  }
  fs.writeFileSync(DATA_FILE, lines.join("\n"));
}
