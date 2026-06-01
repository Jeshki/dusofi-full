import path from "node:path";
import { fileURLToPath } from "node:url";

import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  /** Must stay under the project so server bundles resolve `react` / `next` from `node_modules`. */
  distDir: ".next",
  /** Lockfile conflict: parent `dusofi/` may also have a lockfile — keep tracing on this app only. */
  outputFileTracingRoot: path.join(__dirname),
  reactStrictMode: true,
  /** OneDrive / sync often corrupts `.next/cache/webpack/*.pack.gz` — memory cache avoids ENOENT in dev. */
  webpack: (config, { dev }) => {
    if (dev) {
      config.cache = false;
    }
    return config;
  },
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default withNextIntl(nextConfig);
