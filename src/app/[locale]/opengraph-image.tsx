import { ImageResponse } from "next/og";

export const alt = "DuSofi";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

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
          background: "linear-gradient(145deg, #1e1b4b 0%, #881337 45%, #0f172a 100%)",
          color: "#fafafa",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <span style={{ fontSize: 96, fontWeight: 700, letterSpacing: "0.12em" }}>DuSofi</span>
        <span style={{ fontSize: 32, marginTop: 28, opacity: 0.92 }}>Philosophy & wisdom</span>
        <span
          style={{
            fontSize: 22,
            marginTop: 20,
            opacity: 0.78,
            textTransform: "uppercase",
            letterSpacing: "0.2em",
          }}
        >
          {locale}
        </span>
      </div>
    ),
    { ...size },
  );
}
