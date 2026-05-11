import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Elimu Finder — Schools for Neurodivergent Learners in Kenya";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#ff7a10",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background pattern dots */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* Card */}
        <div
          style={{
            background: "white",
            borderRadius: 24,
            padding: "52px 64px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            maxWidth: 900,
            textAlign: "center",
            boxShadow: "0 24px 80px rgba(0,0,0,0.2)",
          }}
        >
          {/* Logo mark */}
          <div
            style={{
              width: 64,
              height: 64,
              background: "#ff7a10",
              borderRadius: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 24,
              fontSize: 32,
            }}
          >
            🎓
          </div>

          <div
            style={{
              fontSize: 56,
              fontWeight: 800,
              color: "#1c1917",
              lineHeight: 1.1,
              marginBottom: 16,
            }}
          >
            Elimu Finder
          </div>

          <div
            style={{
              fontSize: 24,
              color: "#78716c",
              lineHeight: 1.4,
              maxWidth: 680,
            }}
          >
            Kenya's free directory of special, integrated & inclusive schools
            for neurodivergent learners
          </div>

          <div
            style={{
              marginTop: 32,
              display: "flex",
              gap: 12,
            }}
          >
            {["Special schools", "Integrated units", "Inclusive mainstream", "TVETs"].map(
              (label) => (
                <div
                  key={label}
                  style={{
                    background: "#fff7ed",
                    color: "#c2410c",
                    borderRadius: 100,
                    padding: "8px 18px",
                    fontSize: 16,
                    fontWeight: 600,
                  }}
                >
                  {label}
                </div>
              )
            )}
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 28,
            color: "rgba(255,255,255,0.7)",
            fontSize: 18,
          }}
        >
          elimufinder.co.ke · Free to use · Always
        </div>
      </div>
    ),
    { ...size }
  );
}
