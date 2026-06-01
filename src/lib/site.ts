export const DEFAULT_SITE_URL = "https://dusofi.lt";

export function getSiteUrl() {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.VERCEL_URL ||
    DEFAULT_SITE_URL;

  if (raw.startsWith("http://") || raw.startsWith("https://")) {
    return raw.replace(/\/+$/, "");
  }

  // VERCEL_URL is like "my-app.vercel.app"
  return `https://${raw}`.replace(/\/+$/, "");
}
