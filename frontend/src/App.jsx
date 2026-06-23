import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

function App() {
  const [dashboard, setDashboard] = useState(null);
  const [leads, setLeads] = useState([]);
  const [scores, setScores] = useState([]);
  const [sources, setSources] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/dashboard")
      .then((response) => response.json())
      .then((data) => setDashboard(data));

    fetch("http://127.0.0.1:8000/leads")
      .then((response) => response.json())
      .then((data) => setLeads(data));

    fetch("http://127.0.0.1:8000/lead-scores")
      .then((response) => response.json())
      .then((data) => setScores(data));

    fetch("http://127.0.0.1:8000/source-performance")
      .then((response) => response.json())
      .then((data) => setSources(data));
  }, []);

  if (!dashboard) {
    return <h2>Loading Dashboard...</h2>;
  }

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        fontFamily: "Arial",
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: "220px",
          background: "#111827",
          color: "white",
          padding: "20px",
        }}
      >
        <h2>AI Funnel CRM</h2>

        <hr />

        <p>📊 Dashboard</p>
        <p>👥 Leads</p>
        <p>🔥 Lead Scores</p>
        <p>📈 Analytics</p>
      </div>

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          padding: "30px",
          backgroundColor: "#f5f5f5",
        }}
      >
        <h1>AI Marketing Funnel Dashboard</h1>

        {/* KPI Cards */}
        <div
          style={{
            display: "flex",
            gap: "20px",
            marginTop: "20px",
          }}
        >
          <div
            style={{
              background: "#2563eb",
              color: "white",
              padding: "20px",
              borderRadius: "10px",
              minWidth: "180px",
            }}
          >
            <h3>Total Leads</h3>
            <h2>{dashboard.total_leads}</h2>
          </div>

          <div
            style={{
              background: "#10b981",
              color: "white",
              padding: "20px",
              borderRadius: "10px",
              minWidth: "180px",
            }}
          >
            <h3>Total Events</h3>
            <h2>{dashboard.total_events}</h2>
          </div>

          <div
            style={{
              background: "#ef4444",
              color: "white",
              padding: "20px",
              borderRadius: "10px",
              minWidth: "180px",
            }}
          >
            <h3>Hot Leads</h3>
            <h2>{dashboard.hot_leads}</h2>
          </div>
        </div>

        {/* Recent Leads */}
        <div
          style={{
            background: "white",
            marginTop: "30px",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <h2>Recent Leads</h2>

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr>
                <th>Name</th>
                <th>Company</th>
                <th>Email</th>
                <th>Source</th>
                <th>Score</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {leads.map((lead) => {
                const leadScore = scores.find(
                  (score) => score.lead_id === lead.lead_id
                );

                return (
                  <tr key={lead.lead_id}>
                    <td>{lead.first_name}</td>
                    <td>{lead.company_name}</td>
                    <td>{lead.email}</td>
                    <td>{lead.source}</td>

                    <td>{leadScore ? leadScore.score : 0}</td>

                    <td>
                      <span
                        style={{
                          padding: "6px 12px",
                          borderRadius: "20px",
                          color: "white",
                          fontWeight: "bold",
                          backgroundColor:
                            leadScore?.status === "Hot Lead"
                              ? "#ef4444"
                              : leadScore?.status === "Warm Lead"
                              ? "#f59e0b"
                              : "#10b981",
                        }}
                      >
                        {leadScore ? leadScore.status : "Cold Lead"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Lead Sources Chart */}
        <div
          style={{
            background: "white",
            marginTop: "30px",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <h2>Lead Sources</h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sources}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="source" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="lead_count" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Leads */}
        <div
          style={{
            background: "white",
            marginTop: "30px",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <h2>Top Leads</h2>

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr>
                <th>Name</th>
                <th>Company</th>
                <th>Score</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {leads
                .map((lead) => {
                  const leadScore = scores.find(
                    (score) => score.lead_id === lead.lead_id
                  );

                  return {
                    ...lead,
                    score: leadScore?.score || 0,
                    status: leadScore?.status || "Cold Lead",
                  };
                })
                .sort((a, b) => b.score - a.score)
                .slice(0, 5)
                .map((lead) => (
                  <tr key={lead.lead_id}>
                    <td>{lead.first_name}</td>
                    <td>{lead.company_name}</td>
                    <td>{lead.score}</td>
                    <td>{lead.status}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;