import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#F2EDE4",
          color: "#1A1A1A",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          padding: 24,
        }}
      >
        <div
          style={{
            fontWeight: 700,
            fontSize: 88,
            letterSpacing: "-0.04em",
            lineHeight: 1,
          }}
        >
          TL
        </div>
        <div
          style={{
            width: 60,
            height: 4,
            background: "#1A1A1A",
            marginTop: 16,
          }}
        />
        <div
          style={{
            fontSize: 16,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            marginTop: 12,
          }}
        >
          Tata Lali
        </div>
      </div>
    ),
    { ...size }
  );
}
