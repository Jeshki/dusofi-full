import { ImageResponse } from "next/og";

import { philosophers } from "@/data/philosophers";

export const alt = "DuSofi";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function generateImageMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { id } = await params;
  const numericId = parseInt(id, 10);
  const philosopher = Number.isNaN(numericId) ? undefined : philosophers.find((p) => p.id === numericId);
  const name = philosopher?.name ?? "DuSofi";
  /** Next requires an array; each entry needs `id` (see next-metadata-image-loader). */
  return [
    {
      id: 0,
      alt: `${name} | DuSofi`,
      contentType,
      size,
    },
  ];
}

export default async function PhilosopherOgImage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  const numericId = parseInt(id, 10);
  const philosopher = Number.isNaN(numericId) ? undefined : philosophers.find((p) => p.id === numericId);
  const name = philosopher?.name ?? "Philosopher";
  const years = philosopher?.years ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(160deg, #0f172a 0%, #4c0519 55%, #1e1b4b 100%)",
          color: "#fafafa",
          fontFamily: "system-ui, sans-serif",
          padding: 48,
          textAlign: "center",
        }}
      >
        <span style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.15 }}>{name}</span>
        {years ? (
          <span style={{ fontSize: 28, marginTop: 20, opacity: 0.88 }}>{years}</span>
        ) : null}
        <span
          style={{
            fontSize: 22,
            marginTop: 32,
            opacity: 0.75,
            textTransform: "uppercase",
            letterSpacing: "0.18em",
          }}
        >
          DuSofi - {locale}
        </span>
      </div>
    ),
    { ...size },
  );
}
