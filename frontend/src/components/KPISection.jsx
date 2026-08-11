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
    <div className="kpi-section">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="kpi-card"
            style={{
              "--kpi-color": card.color,
            }}
          >
            <div className="kpi-icon">
              <Icon
                size={32}
                color="var(--kpi-color)"
              />
            </div>

            <div className="kpi-label">
              {card.title}
            </div>

            <div className="kpi-value">
              {card.value}
            </div>

            <div className="kpi-subtitle">
              {card.subtitle}
            </div>
          </div>
        );
      })}
    </div>
  );
  }

export default KPISection;