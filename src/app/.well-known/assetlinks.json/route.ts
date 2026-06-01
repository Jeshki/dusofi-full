import { NextResponse } from "next/server";

/**
 * Digital Asset Links for Trusted Web Activity (Google Play).
 * Set in hosting env after you have the Play app id + signing cert SHA-256:
 *   ANDROID_ASSETLINKS_PACKAGE=lt.example.app
 *   ANDROID_ASSETLINKS_SHA256=Fingerprints comma-separated (with or without colons)
 */
export async function GET() {
  const packageName = process.env.ANDROID_ASSETLINKS_PACKAGE?.trim();
  const rawFingerprints = process.env.ANDROID_ASSETLINKS_SHA256?.trim();

  if (!packageName || !rawFingerprints) {
    return new NextResponse(null, { status: 404 });
  }

  const sha256_cert_fingerprints = rawFingerprints
    .split(/[\s,]+/)
    .map((s) => s.trim())
    .filter(Boolean);

  if (sha256_cert_fingerprints.length === 0) {
    return new NextResponse(null, { status: 404 });
  }

  const body = [
    {
      relation: ["delegate_permission/common.handle_all_urls"],
      target: {
        namespace: "android_app",
        package_name: packageName,
        sha256_cert_fingerprints,
      },
    },
  ];

  return NextResponse.json(body, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
