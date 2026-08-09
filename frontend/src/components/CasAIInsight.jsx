import { useEffect, useState } from "react";
import {
  BrainCircuit,
  Users,
  TrendingUp,
  ShieldCheck,
  MessageCircle,
  X,
  Send,
} from "lucide-react";

function CasAIInsight({
  leads = [],
  hotCount = 0,
  sources = [],
  organizationId = null,
}) {

  const [showCasAI, setShowCasAI] = useState(false);
  const [casQuestion, setCasQuestion] = useState("");
  const [casAnswer, setCasAnswer] = useState("");
  const [casLoading, setCasLoading] = useState(false);

  const totalLeads = leads.length;
  async function askCasAI(question) {
  if (!question.trim()) return;

  if (!organizationId) {
    setCasAnswer(
      "I can't access your CRM organization yet. Please refresh the dashboard and try again."
    );
    return;
  }

  setCasLoading(true);
  setCasAnswer("");

  try {
    const response = await fetch("http://127.0.0.1:8000/cas-ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        organization_id: organizationId,
        question: question,
      }),
    });

    if (!response.ok) {
      throw new Error("CAS AI request failed");
    }

    const data = await response.json();

    setCasAnswer(data.answer);
  } catch (error) {
    console.error("CAS AI error:", error);

    setCasAnswer(
      "I'm having trouble connecting to your CRM right now. Please make sure the backend is running and try again."
    );
  } finally {
    setCasLoading(false);
  }
}

  // Find the lead source bringing in the most leads
    const highestLeadCount =
  sources.length > 0
    ? Math.max(
        ...sources.map((source) => source.lead_count || 0)
      )
    : 0;

const topSources = sources.filter(
  (source) => source.lead_count === highestLeadCount
);

const topSource =
  topSources.length === 1
    ? topSources[0].source
    : topSources.length > 1
    ? "Multiple sources tied"
    : "No data";

  // Simple pipeline assessment
  let pipelineStatus = "Needs Attention";

  if (hotCount >= 3) {
    pipelineStatus = "Strong";
  } else if (hotCount >= 1) {
    pipelineStatus = "Healthy";
  }

  // Generate a simple recommendation from current CRM data
  let recommendation =
    "Continue following up with your newest leads.";

  if (hotCount > 0) {
    recommendation = `You have ${hotCount} high-intent ${
      hotCount === 1 ? "lead" : "leads"
    } ready for follow-up.`;
  } else if (totalLeads === 0) {
    recommendation =
      "Your CRM is ready. Start adding leads to generate AI recommendations.";
  } else {
    recommendation =
      "No hot leads yet. Focus on increasing engagement with your current leads.";
  }

  return (
    <section
      style={{
        background: "#ffffff",
        marginTop: "30px",
        marginBottom: "30px",
        padding: "24px",
        borderRadius: "14px",
        boxShadow: "0 6px 18px rgba(15, 23, 42, 0.08)",
        border: "1px solid #e5e7eb",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "20px",
          marginBottom: "22px",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "12px",
              background:
                "linear-gradient(135deg, #2563eb, #7c3aed)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              boxShadow: "0 4px 12px rgba(37, 99, 235, 0.25)",
            }}
          >
            <BrainCircuit size={23} />
          </div>

          <div>
            <div
              style={{
                fontSize: "13px",
                color: "#6b7280",
                marginBottom: "2px",
              }}
            >
              CAS AI
            </div>

            <h2
              style={{
                margin: 0,
                fontSize: "22px",
                fontWeight: "700",
                color: "#111827",
              }}
            >
              I've analysed today's CRM activity.
            </h2>
          </div>
        </div>

        <div
          style={{
            fontSize: "12px",
            fontWeight: "600",
            color: "#2563eb",
            background: "#eff6ff",
            padding: "7px 12px",
            borderRadius: "20px",
          }}
        >
          AI CRM Assistant
        </div>
      </div>

      {/* Intelligence cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "14px",
          marginBottom: "20px",
        }}
      >
        {/* Active Leads */}
        <div
          style={{
            background: "#f8fafc",
            borderRadius: "12px",
            padding: "16px",
            border: "1px solid #eef2f7",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "#2563eb",
              marginBottom: "8px",
            }}
          >
            <Users size={18} />

            <span
              style={{
                fontSize: "12px",
                fontWeight: "600",
                color: "#64748b",
              }}
            >
              Active Leads
            </span>
          </div>

          <strong
            style={{
              fontSize: "24px",
              color: "#111827",
            }}
          >
            {totalLeads}
          </strong>
        </div>

        {/* Top Source */}
        <div
          style={{
            background: "#f8fafc",
            borderRadius: "12px",
            padding: "16px",
            border: "1px solid #eef2f7",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "#7c3aed",
              marginBottom: "8px",
            }}
          >
            <TrendingUp size={18} />

            <span
              style={{
                fontSize: "12px",
                fontWeight: "600",
                color: "#64748b",
              }}
            >
              Top Source
            </span>
          </div>

          <strong
            style={{
              fontSize: "18px",
              color: "#111827",
            }}
          >
            {topSource}
          </strong>
        </div>

        {/* Pipeline */}
        <div
          style={{
            background: "#f8fafc",
            borderRadius: "12px",
            padding: "16px",
            border: "1px solid #eef2f7",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "#10b981",
              marginBottom: "8px",
            }}
          >
            <ShieldCheck size={18} />

            <span
              style={{
                fontSize: "12px",
                fontWeight: "600",
                color: "#64748b",
              }}
            >
              Pipeline
            </span>
          </div>

          <strong
            style={{
              fontSize: "18px",
              color: "#111827",
            }}
          >
            {pipelineStatus}
          </strong>
        </div>
      </div>

      {/* Recommendation */}
      <div
        style={{
          background:
            "linear-gradient(135deg, #eff6ff 0%, #f5f3ff 100%)",
          borderRadius: "12px",
          padding: "18px 20px",
          border: "1px solid #dbeafe",
          marginBottom: "18px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "8px",
          }}
        >
          <BrainCircuit
            size={18}
            color="#2563eb"
          />

          <strong
            style={{
              fontSize: "17px",
              color: "#111827",
            }}
          >
            CAS AI Recommendation
          </strong>
        </div>

        <p
          style={{
            margin: 0,
            color: "#374151",
            fontSize: "15px",
            lineHeight: "1.5",
          }}
        >
          {recommendation}
        </p>
      </div>

      {/* Ask CAS AI */}
      <button
        type="button"
        onClick={() => setShowCasAI(true)}
        
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          background: "#2563eb",
          color: "white",
          border: "none",
          padding: "11px 18px",
          borderRadius: "9px",
          cursor: "pointer",
          fontWeight: "600",
          fontSize: "14px",
        }}
      >
        <MessageCircle size={17} />
        Ask CAS AI
        </button>

  {/* CAS AI Assistant */}
  {showCasAI && (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15, 23, 42, 0.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "620px",
          background: "#ffffff",
          borderRadius: "18px",
          boxShadow: "0 25px 60px rgba(0, 0, 0, 0.25)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            background:
              "linear-gradient(135deg, #111827 0%, #1e3a8a 55%, #7c3aed 100%)",
            color: "white",
            padding: "20px 22px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "12px",
                background:
                  "linear-gradient(135deg, #2563eb, #a855f7)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <BrainCircuit size={22} />
            </div>

            <div>
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: "700",
                }}
              >
                CAS AI
              </div>

              <div
                style={{
                  fontSize: "12px",
                  opacity: 0.8,
                  marginTop: "2px",
                }}
              >
                Your CRM Intelligence Assistant
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowCasAI(false)}
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "8px",
              border: "none",
              background: "rgba(255,255,255,0.12)",
              color: "white",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            aria-label="Close CAS AI"
          >
            <X size={20} />
          </button>
        </div>

        {/* Assistant body */}
        <div
          style={{
            padding: "28px",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "14px",
              marginBottom: "24px",
            }}
          >
            <div
              style={{
                width: "42px",
                height: "42px",
                minWidth: "42px",
                borderRadius: "12px",
                background: "#eff6ff",
                color: "#2563eb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <BrainCircuit size={21} />
            </div>

            <div>
              <strong
                style={{
                  display: "block",
                  color: "#111827",
                  fontSize: "16px",
                  marginBottom: "6px",
                }}
              >
                Hi, I'm CAS.
              </strong>

              <p
                style={{
                  margin: 0,
                  color: "#64748b",
                  fontSize: "14px",
                  lineHeight: "1.6",
                }}
              >
                I've analysed your CRM activity. Ask me about your
                leads, pipeline, sources, or follow-up priorities.
              </p>
            </div>
          </div>

          {/* Quick questions */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
              marginBottom: "20px",
            }}
          >
            {casLoading && (
  <div
    style={{
      marginTop: "14px",
      padding: "12px",
      background: "#f8fafc",
      borderRadius: "10px",
      color: "#64748b",
      fontSize: "13px",
    }}
  >
    CAS is analysing your CRM...
  </div>
)}

{casAnswer && !casLoading && (
  <div
    style={{
      marginTop: "14px",
      padding: "14px",
      background: "#eff6ff",
      border: "1px solid #dbeafe",
      borderRadius: "10px",
      color: "#1e293b",
      fontSize: "14px",
      lineHeight: "1.5",
    }}
  >
    {casAnswer}
  </div>
)}
            <button
              type="button"
              style={{
                padding: "9px 12px",
                borderRadius: "20px",
                border: "1px solid #dbeafe",
                background: "#eff6ff",
                color: "#2563eb",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: "600",
              }}
            >

              <button
                type="button"
                onClick={() => {
                setCasQuestion("Which source performs best?");
                askCasAI("Which source performs best?");
              }}
           >
              Which source performs best?
            </button>
              Which source performs best?
            </button>

            <button
              type="button"
              style={{
                padding: "9px 12px",
                borderRadius: "20px",
                border: "1px solid #dbeafe",
                background: "#eff6ff",
                color: "#2563eb",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: "600",
              }}
            >

              <button
                type="button"
                onClick={() => {
                setCasQuestion("Which source performs best?");
                askCasAI("Which source performs best?");
              }}
           >
              Which source performs best?
            </button>
              Which source performs best?
            </button>

            <button
              type="button"
              style={{
                padding: "9px 12px",
                borderRadius: "20px",
                border: "1px solid #dbeafe",
                background: "#eff6ff",
                color: "#2563eb",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: "600",
              }}
            >
              <button
                type="button"
                onClick={() => {
                setCasQuestion("How is my pipeline?");
                askCasAI("How is my pipeline?");
             }}
            >
             How is my pipeline?
            </button>
              How is my pipeline?
            </button>
          </div>

          {/* Chat input */}
          <div
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
              border: "1px solid #dbe3ef",
              borderRadius: "12px",
              padding: "8px",
              background: "#f8fafc",
            }}
          >
            <input
              type="text"
              value={casQuestion}
              onChange={(e) => setCasQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  askCasAI(casQuestion);
                }
              }}
              placeholder="Ask CAS about your CRM..."
              
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                background: "transparent",
                padding: "10px",
                fontSize: "14px",
                color: "#111827",
              }}
            />

            <button
              type="button"
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "10px",
                border: "none",
                background: "#2563eb",
                color: "white",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              aria-label="Send message"
            >
              <button
                type="button"
                onClick={() => askCasAI(casQuestion)}
              >
                <Send size={18} />
              </button>
            </button>
          </div>

          <p
            style={{
              margin: "12px 0 0",
              textAlign: "center",
              fontSize: "11px",
              color: "#94a3b8",
            }}
          >
            CAS AI uses your CRM data to help you make better decisions.
          </p>
        </div>
      </div>
    </div>
  )}
</section>
  );
}

export default CasAIInsight;