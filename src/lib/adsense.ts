const ADSENSE_CLIENT =
  process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT ||
  process.env.GOOGLE_ADSENSE_CLIENT ||
  "";

export function getAdSenseClient() {
  const value = ADSENSE_CLIENT.trim();
  if (!value) return undefined;
  return value.startsWith("ca-pub-") ? value : `ca-pub-${value.replace(/^pub-/, "")}`;
}

export function getAdSensePublisherId() {
  return getAdSenseClient()?.replace(/^ca-/, "");
}
