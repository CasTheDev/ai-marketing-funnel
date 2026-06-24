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
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [filter, setFilter] = useState("All");
  const [selectedLead, setSelectedLead] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState("All");

  const filteredLeads = leads.filter((lead) => {
  const leadScore = scores.find(
    (score) => score.lead_id === lead.lead_id
  );

  const status = leadScore?.status || "Cold Lead";

  const matchesSearch =
    lead.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase());

  const matchesFilter =
    statusFilter === "All" ||
    status === statusFilter;

  return matchesSearch && matchesFilter;
});

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

  const exportToCSV = () => {
  const headers = [
    "Name",
    "Company",
    "Email",
    "Source",
    "Score",
    "Status",
  ];

  const rows = filteredLeads.map((lead) => {
    const leadScore = scores.find(
      (score) => score.lead_id === lead.lead_id
    );

    return [
      lead.first_name,
      lead.company_name,
      lead.email,
      lead.source,
      leadScore?.score || 0,
      leadScore?.status || "Cold Lead",
    ];
  });

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const link = document.createElement("a");

  const url = URL.createObjectURL(blob);

  link.href = url;
  link.setAttribute(
    "download",
    "leads_export.csv"
  );

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);
};

const averageScore =
  scores.length > 0
    ? Math.round(
        scores.reduce(
          (total, score) => total + score.score,
          0
        ) / scores.length
      )
    : 0;

const hotLeadRate =
  dashboard?.total_leads > 0
    ? Math.round(
        (dashboard.hot_leads /
          dashboard.total_leads) *
          100
      )
    : 0;

const websiteLeads = leads.filter(
  (lead) => lead.source === "Website"
).length;

const hotCount = scores.filter(
  (score) => score.status === "Hot Lead"
).length;

const warmCount = scores.filter(
  (score) => score.status === "Warm Lead"
).length;

const coldCount =
  leads.length - hotCount - warmCount;

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
          padding: "40px",
          backgroundColor: "#f5f5f5",
          minHeight: "100vh",
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
<div
  style={{
    marginBottom: "30px",
  }}
>
  <h1
    style={{
      margin: 0,
      fontSize: "36px",
      fontWeight: "700",
      color: "#111827",
    }}
  >
    AI Marketing Funnel Dashboard
  </h1>

  <p
    style={{
      marginTop: "8px",
      color: "#6b7280",
      fontSize: "16px",
    }}
  >
    Track leads, performance, and source analytics
  </p>
</div>

        {/* KPI Cards */}
        {/* KPI Cards */}
<div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
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
      textAlign: "center",
      boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
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
      textAlign: "center",
      boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
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
      textAlign: "center",
      boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    }}
  >
    <h3>Hot Leads</h3>
    <h2>{dashboard.hot_leads}</h2>
  </div>

  <div
    style={{
      background: "#8b5cf6",
      color: "white",
      padding: "20px",
      borderRadius: "10px",
      textAlign: "center",
      boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    }}
  >
    <h3>Avg Score</h3>
    <h2>{averageScore}</h2>
  </div>

  <div
    style={{
      background: "#f59e0b",
      color: "white",
      padding: "20px",
      borderRadius: "10px",
      textAlign: "center",
      boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    }}
  >
    <h3>Hot Rate</h3>
    <h2>{hotLeadRate}%</h2>
  </div>

  <div
    style={{
      background: "#06b6d4",
      color: "white",
      padding: "20px",
      borderRadius: "10px",
      textAlign: "center",
      boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    }}
  >
    <h3>Website Leads</h3>
    <h2>{websiteLeads}</h2>
  </div>
</div>

        {/* Recent Leads */}
        <div
          style={{
            background: "white",
            marginTop: "40px",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            textAlign: "center",
          }}
        >

          <div
    style={{
      marginBottom: "20px",
    }}
  >
    <input
      type="text"
      placeholder="Search leads..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      style={{
        width: "98%",
        padding: "12px",
        borderRadius: "8px",
        border: "1px solid #d1d5db",
        fontSize: "16px",
        boxSizing: "border-box",
      }}
    />
    <div
  style={{
    display: "flex",
    gap: "15px",
    marginTop: "15px",
    marginBottom: "20px",
  }}
>
  <button
  onClick={() => setFilterStatus("All")}
  style={{
    background:
      filterStatus === "All"
        ? "#2563eb"
        : "#f3f4f6",
    color:
      filterStatus === "All"
        ? "white"
        : "#111827",
    border: "none",
    padding: "10px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  }}
>
  All ({leads.length})
</button>

<button
  onClick={() => setFilterStatus("Hot Lead")}
  style={{
    background:
      filterStatus === "Hot Lead"
        ? "#ef4444"
        : "#f3f4f6",
    color:
      filterStatus === "Hot Lead"
        ? "white"
        : "#111827",
    border: "none",
    padding: "10px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  }}
>
  Hot ({hotCount})
</button>

<button
  onClick={() => setFilterStatus("Warm Lead")}
  style={{
    background:
      filterStatus === "Warm Lead"
        ? "#f59e0b"
        : "#f3f4f6",
    color:
      filterStatus === "Warm Lead"
        ? "white"
        : "#111827",
    border: "none",
    padding: "10px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  }}
>
  Warm ({warmCount})
</button>

<button
  onClick={() => setFilterStatus("Cold Lead")}
  style={{
    background:
      filterStatus === "Cold Lead"
        ? "#10b981"
        : "#f3f4f6",
    color:
      filterStatus === "Cold Lead"
        ? "white"
        : "#111827",
    border: "none",
    padding: "10px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  }}
>
  Cold ({coldCount})
</button>

<button
  onClick={exportToCSV}
  style={{
    background: "#2563eb",
    color: "white",
    border: "none",
    padding: "10px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  }}
>
  Export CSV
</button>


</div>
  </div>

          <h2
  style={{
    color: "#6b7280",
    fontSize: "24px",
    fontWeight: "600",
    marginBottom: "20px",
  }}
>
  Recent Leads
</h2>

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
              {filteredLeads.map((lead) => {
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

                    <td 
                    style={{
                      padding: "14px 12px",
                      textAlign: "center",
                    }}
                    >
                      <span
                        style={{
                          display: "inline-block",
                          padding: "8px 16px",
                          borderRadius: "20px",
                          color: "white",
                          fontWeight: "bold",
                          minWidth: "90px",
                          textAlign: "center",
                          whiteSpace: "nowrap",
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
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h2
  style={{
    color: "#6b7280",
    fontSize: "24px",
    fontWeight: "600",
    marginBottom: "20px",
  }}
>
  Lead Sources
</h2>

          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={sources}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="source" />
              <YAxis />
              <Tooltip />
              <Bar 
              dataKey="lead_count" 
              fill="#2563eb"
              />
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
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h2
  style={{
    color: "#6b7280",
    fontSize: "24px",
    fontWeight: "600",
    marginBottom: "20px",
  }}
>
  Top Leads
</h2>

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
                <th style={{ minWidth: "120px" }}>
                  Status
                </th>
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
                  <tr 
                  key={lead.lead_id}
                  onClick={() => {
                    setSelectedLead(lead);
                    setShowModal(true);
                  }}
                  style={{ 
                    cursor: "pointer" 
                  }}
                  >
                    <td style={{padding: "12px" }}>{lead.first_name}</td>
                    <td style={{padding: "12px" }}>{lead.company_name}</td>
                    <td style={{padding: "12px" }}>{lead.email}</td>
                    <td style={{padding: "12px" }}>{lead.score}</td>
                    <td style={{padding: "12px" }}>{lead.status}</td>
                    
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        {showModal && selectedLead && (
        <div
         style={{
           position: "fixed",
           top: 0,
           left: 0,
           width: "100%",
           height: "100%",
           backgroundColor: "rgba(0,0,0,0.5)",
           display: "flex",
           justifyContent: "center",
           alignItems: "center",
           zIndex: 1000,
    
      }}
    >
    <div
      style={{
        background: "white",
        padding: "30px",
        borderRadius: "12px",
        width: "500px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
      }}
    >
      <h2 style={{ color: "#111827" }}>
        Lead Details
      </h2>

      <hr />

      <p>
        <strong>Name:</strong>{" "}
        {selectedLead.first_name}
      </p>

      <p>
        <strong>Company:</strong>{" "}
        {selectedLead.company_name}
      </p>

      <p>
        <strong>Email:</strong>{" "}
        {selectedLead.email}
      </p>

      <p>
        <strong>Source:</strong>{" "}
        {selectedLead.source}
      </p>

      <p>
        <strong>Created:</strong>{" "}
        {selectedLead.created_at}
      </p>

      <button
        onClick={() => setShowModal(false)}
        style={{
          marginTop: "20px",
          background: "#2563eb",
          color: "white",
          border: "none",
          padding: "10px 20px",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        Close
      </button>
    </div>
  </div>
)}
      </div>
    </div>
  );
}

export default App;