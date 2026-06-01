import { ImageResponse } from "next/og";

const ALLOWED = new Set(["192", "512"]);

export async function GET(
  _request: Request,
  context: { params: Promise<{ size: string }> },
) {
  const { size } = await context.params;
  if (!ALLOWED.has(size)) {
    return new Response("Not Found", { status: 404 });
  }

  const px = size === "192" ? 192 : 512;
  const fontSize = size === "192" ? 96 : 256;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#881337",
          color: "#fafafa",
          fontSize,
          fontWeight: 700,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        D
      </div>
    ),
    { width: px, height: px },
  );
}
