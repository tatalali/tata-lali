import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#F2EDE4",
          color: "#1A1A1A",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          fontWeight: 700,
          fontSize: 18,
          letterSpacing: "-0.04em",
          border: "2px solid #1A1A1A",
        }}
      >
        TL
      </div>
    ),
    { ...size }
  );
}
