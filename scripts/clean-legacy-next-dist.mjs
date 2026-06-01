/**
 * Dev prelude:
 * 1) Removes legacy Temp distDir (breaks module resolution).
 * 2) Removes project `.next` if manifests are missing (common after OneDrive/sync races).
 *
 * `node ./scripts/clean-legacy-next-dist.mjs --all` — delete project `.next` entirely (recovery).
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const nextConfigPath = path.join(root, "next.config.mjs");
const localNext = path.join(root, ".next");
const prerenderManifest = path.join(localNext, "prerender-manifest.json");
const routesManifest = path.join(localNext, "routes-manifest.json");

const cfg = fs.readFileSync(nextConfigPath, "utf8");
if (cfg.includes("dusofi-full-next")) {
  console.error(
    "[dusofi] next.config.mjs still references the legacy Temp distDir. Remove any `dusofi-full-next` / external distDir logic.",
  );
  process.exit(1);
}

const legacy = path.join(os.tmpdir(), "dusofi-full-next");
if (fs.existsSync(legacy)) {
  fs.rmSync(legacy, { recursive: true, force: true });
  console.log("[dusofi] removed legacy build folder:", legacy);
}

const all = process.argv.includes("--all");
if (all && fs.existsSync(localNext)) {
  fs.rmSync(localNext, { recursive: true, force: true });
  console.log("[dusofi] removed .next (--all)");
} else if (fs.existsSync(localNext)) {
  const missingPrerender = !fs.existsSync(prerenderManifest);
  const missingRoutes = !fs.existsSync(routesManifest);
  if (missingPrerender || missingRoutes) {
    fs.rmSync(localNext, { recursive: true, force: true });
    console.log(
      "[dusofi] removed incomplete .next (missing prerender-manifest.json and/or routes-manifest.json).",
    );
  }
}
