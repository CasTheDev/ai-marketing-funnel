import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  BrainCircuit,
  Settings,
  LogOut,
} from "lucide-react";

const navStyle = ({ isActive }) => ({
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "12px",
  width: "100%",
  boxSizing: "border-box",
  borderRadius: "10px",
  textDecoration: "none",
  color: "white",
  background: isActive ? "#2563eb" : "transparent",
  fontWeight: isActive ? "600" : "400",
});

function Sidebar() {
  return (
    <div
      style={{
        width: "260px",
        background:
          "linear-gradient(180deg, #0f172a 0%, #111827 50%, #1e293b 100%)",
        color: "white",
        padding: "20px",
      }}
    >
      <div
        style={{
          textAlign: "center",
          marginBottom: "30px",
        }}
      >
        <img
          src="/images/voxa-ai-logo.png"
          alt="Voxa AI CRM"
          style={{
            width: "90px",
            height: "90px",
            borderRadius: "50%",
            marginBottom: "15px",
          }}
        />

        <h2
          style={{
            margin: 0,
            fontSize: "22px",
            fontWeight: "700",
          }}
        >
          VOXA AI CRM
        </h2>

        <p
          style={{
            fontSize: "13px",
            color: "#cbd5e1",
            marginTop: "6px",
          }}
        >
          Intelligent Lead Management
        </p>
      </div>

      <hr
        style={{
          border: "none",
          borderTop: "1px solid #374151",
          marginBottom: "25px",
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "18px",
        }}
      >
        <NavLink to="/dashboard" style={navStyle}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/leads" style={navStyle}>
          <Users size={20} />
          <span>Leads</span>
        </NavLink>

        <NavLink to="/analytics" style={navStyle}>
          <BarChart3 size={20} />
          <span>Analytics</span>
        </NavLink>

        <NavLink to="/ai-insights" style={navStyle}>
          <BrainCircuit size={20} />
          <span>AI Insights</span>
        </NavLink>

        <NavLink to="/settings" style={navStyle}>
          <Settings size={20} />
          <span>Settings</span>
        </NavLink>
      </div>

      <div
        style={{
          marginTop: "60px",
          borderTop: "1px solid #374151",
          paddingTop: "20px",
        }}
      >
        <div
          style={{
            fontWeight: "600",
          }}
        >
          Cas-sandra
        </div>

        <div
          style={{
            color: "#9ca3af",
            fontSize: "13px",
            marginBottom: "18px",
          }}
        >
          Administrator
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            cursor: "pointer",
          }}
        >
          <LogOut size={20} />
          <span>Logout</span>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;