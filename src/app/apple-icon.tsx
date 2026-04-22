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
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1C1C1C",
          color: "#C9A84C",
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: 130,
          fontStyle: "italic",
          lineHeight: 1,
          letterSpacing: "-0.02em",
        }}
      >
        G
      </div>
    ),
    { ...size },
  );
}
