import React from "react";

function VexaHeader({
  greeting,
  title,
  subtitle,
  heroImage,
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background:
          "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        borderRadius: "20px",
        padding: "35px",
        color: "white",
        marginBottom: "35px",
        overflow: "hidden",
      }}
    >
      {/* Left Content */}
      <div
        style={{
          width: "40%",
          zIndex: 2,
        }}
      >
        <p
          style={{
            color: "#60a5fa",
            fontWeight: "600",
            marginBottom: "10px",
            fontSize: "16px",
          }}
        >
          {greeting}
        </p>

        <h1
          style={{
            margin: 0,
            fontSize: "36px",
            fontWeight: "700",
            lineHeight: "1.2",
          }}
        >
          {title}
        </h1>

        {/* AI Insights */}
        <div
          style={{
            marginTop: "25px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            fontSize: "15px",
          }}
        >
          <div>
            🔥 <strong>High Value Leads</strong>
            <br />
            <span style={{ color: "#cbd5e1" }}>
              4 prospects need immediate attention
            </span>
          </div>

          <div>
            📈 <strong>Conversion Rate</strong>
            <br />
            <span style={{ color: "#cbd5e1" }}>
              12% higher than yesterday
            </span>
          </div>

          <div>
            🟢 <strong>Pipeline Health</strong>
            <br />
            <span style={{ color: "#cbd5e1" }}>
              Excellent
            </span>
          </div>

          <div>
            🧠 <strong>AI Recommendation</strong>
            <br />
            <span style={{ color: "#cbd5e1" }}>
              Contact your hottest lead today.
            </span>
          </div>
        </div>
      </div>

      {/* Right Image */}
      <div
        style={{
          width: "60%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img
          src={heroImage}
          alt="Vexa AI Assistant"
          style={{
            width: "100%",
            maxWidth: "650px",
            height: "auto",
            borderRadius: "12px",
          }}
        />
      </div>
    </div>
  );
}

export default VexaHeader;