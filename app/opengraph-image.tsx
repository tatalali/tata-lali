import { ImageResponse } from "next/og";

export const alt = "Tata Lali — Apprendre l'IA, sans paniquer.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#F2EDE4",
          color: "#1A1A1A",
          padding: "80px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            fontSize: 22,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          <span>Tata Lali</span>
          <span style={{ color: "#E63946" }}>01</span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
          }}
        >
          <div
            style={{
              fontSize: 96,
              fontWeight: 700,
              lineHeight: 1.02,
              letterSpacing: "-0.02em",
              maxWidth: 900,
            }}
          >
            Apprendre l'IA, sans paniquer.
          </div>
          <div
            style={{
              width: 80,
              height: 4,
              background: "#1A1A1A",
            }}
          />
          <div style={{ fontSize: 28, opacity: 0.8 }}>
            Un manuel illustré · pour les 45-65 ans · printemps 2026
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
