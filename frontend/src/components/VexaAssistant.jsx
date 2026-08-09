import { useEffect, useState } from "react";
import {
  BrainCircuit,
  Users,
  TrendingUp,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { getDashboardSummary } from "../api/dashboard";

function VexaAssistant() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSummary() {
      try {
        const data = await getDashboardSummary();
        setSummary(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadSummary();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          background: "white",
          borderRadius: "20px",
          padding: "30px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          marginBottom: "30px",
        }}
      >
        Loading VEXA...
      </div>
    );
  }

  return (
    <div
      style={{
        background: "white",
        borderRadius: "20px",
        padding: "30px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        marginBottom: "30px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "20px",
        }}
      >
        <BrainCircuit size={34} color="#2563eb" />

        <div>
          <h2
            style={{
              margin: 0,
              color: "#111827",
            }}
          >
            {summary.greeting}
          </h2>

          <p
            style={{
              margin: "6px 0 0",
              color: "#6b7280",
            }}
          >
            I've analysed today's CRM activity.
          </p>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: "20px",
          marginTop: "25px",
        }}
      >
        <Card
          icon={<Users size={22} />}
          title="Active Leads"
          value={summary.total_leads}
        />

        <Card
          icon={<TrendingUp size={22} />}
          title="Top Source"
          value={summary.top_source}
        />

        <Card
          icon={<ShieldCheck size={22} />}
          title="Pipeline"
          value={summary.pipeline_health}
        />
      </div>

      <div
        style={{
          marginTop: "30px",
          padding: "20px",
          background: "#eff6ff",
          borderRadius: "14px",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <Sparkles size={18} color="#2563eb" />

          <strong>CAS Recommendation</strong>
        </div>

        <p
          style={{
            margin: 0,
            color: "#374151",
            lineHeight: 1.6,
          }}
        >
          {summary.recommendation}
        </p>
      </div>

      <button
        style={{
          marginTop: "25px",
          background: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "12px",
          padding: "14px 24px",
          cursor: "pointer",
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <BrainCircuit size={18} />
        Ask CAS
      </button>
    </div>
  );
}

function Card({ icon, title, value }) {
  return (
    <div
      style={{
        background: "#f9fafb",
        padding: "20px",
        borderRadius: "14px",
      }}
    >
      <div
        style={{
          color: "#2563eb",
          marginBottom: "12px",
        }}
      >
        {icon}
      </div>

      <div
        style={{
          fontSize: "14px",
          color: "#6b7280",
        }}
      >
        {title}
      </div>

      <div
        style={{
          marginTop: "8px",
          fontSize: "20px",
          fontWeight: "700",
        }}
      >
        {value}
      </div>
    </div>
  );
}

export default VexaAssistant;