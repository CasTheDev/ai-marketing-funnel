import "./KPISection.css";
import {
  Users,
  Activity,
  Flame,
  Award,
  TrendingUp,
  Globe,
} from "lucide-react";

function KPISection({
  leads,
  scores,
  hotCount,
  averageScore,
  hotLeadRate,
  websiteLeads,
}) {

  const cards = [
  {
    title: "Total Leads",
    value: leads.length,
    subtitle: "Active contacts",
    color: "#2563eb",
    icon: Users,
  },
  {
    title: "Total Events",
    value: scores.length,
    subtitle: "Tracked activities",
    color: "#10b981",
    icon: Activity,
  },
  {
    title: "Hot Leads",
    value: hotCount,
    subtitle: "High intent prospects",
    color: "#ef4444",
    icon: Flame,
  },
  {
    title: "Average Score",
    value: averageScore,
    subtitle: "Lead quality",
    color: "#8b5cf6",
    icon: Award,
  },
  {
    title: "Hot Rate",
    value: `${hotLeadRate}%`,
    subtitle: "Conversion health",
    color: "#f59e0b",
    icon: TrendingUp,
  },
  {
    title: "Website Leads",
    value: websiteLeads,
    subtitle: "Organic enquiries",
    color: "#06b6d4",
    icon: Globe,
  },
];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "24px",
        marginTop: "20px",
      }}
    >
      {cards.map((card) => {
  const Icon = card.icon;

  return (
    <div
      key={card.title}
      className="kpi-card"
      style={{
        background: "#ffffff",
        borderRadius: "20px",
        padding: "28px",
        boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
        borderTop: `4px solid ${card.color}`,
      }}
    >
      <div
        style={{
          width: "52px",
          height: "52px",
          borderRadius: "14px",
          background: `${card.color}15`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "18px",
        }}
      >
        <Icon size={32} color={card.color} />
      </div>

      <div
        style={{
          fontSize: "14px",
          fontWeight: 600,
          color: "#64748b",
          marginBottom: "8px",
        }}
      >
        {card.title}
      </div>

      <div
        style={{
          fontSize: "34px",
          fontWeight: 700,
          color: "#0f172a",
          lineHeight: 1,
        }}
      >
        {card.value}
      </div>

      <div
        style={{
          marginTop: "10px",
          fontSize: "13px",
          color: "#94a3b8",
        }}
      >
        {card.subtitle}
      </div>
    </div>
  );
})}
    </div>
  );
}

export default KPISection;