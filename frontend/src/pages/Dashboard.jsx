import LeadInsights from "../components/LeadInsights";
import KPISection from "../components/KPISection";
import { supabase } from "../lib/supabase";
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

import { useAuth } from "../context/AuthContext";

function App() {

  const { user } = useAuth();

  const [organizationId, setOrganizationId] = useState(null);

  const [dashboard, setDashboard] = useState(null);
  const [leads, setLeads] = useState([]);
  const [scores, setScores] = useState([]);
  const [sources, setSources] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  

  const [selectedLead, setSelectedLead] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [sortBy, setSortBy] = useState("Highest Score");

  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);

  const [showAddModal, setShowAddModal] = useState(false);

const [newLead, setNewLead] = useState({
  first_name: "",
  company_name: "",
  email: "",
  source: "Website",
});

const [editingLead, setEditingLead] = useState(null);
const [isEditing, setIsEditing] = useState(false);

  const leadsPerPage = 5;

  async function analyzeLead(lead) {
  setAiLoading(true);

  setTimeout(() => {
    setAiResult({
      ai_score: 85,
      ai_summary:
        "Strong buying signals detected from engagement history.",
      ai_recommendation:
        "Schedule a discovery call within 24 hours.",
    });

    setAiLoading(false);
  }, 1500);
}

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

const sortedLeads = [...filteredLeads].sort(
  (a, b) => {
    const scoreA =
      scores.find(
        (score) => score.lead_id === a.lead_id
      )?.score || 0;

    const scoreB =
      scores.find(
        (score) => score.lead_id === b.lead_id
      )?.score || 0;

    if (sortBy === "Highest Score")
      return scoreB - scoreA;

    if (sortBy === "Lowest Score")
      return scoreA - scoreB;

    if (sortBy === "Company Name")
      return a.company_name.localeCompare(
        b.company_name
      );

    if (sortBy === "Name A-Z")
      return a.first_name.localeCompare(
        b.first_name
      );

    return 0;
  }
);

useEffect(() => {
  async function getOrganization() {
    if (!user) return;

    const { data, error } = await supabase
      .from("organization_users")
      .select("organization_id")
      .eq("user_id", user.id)
      .single();

    if (error) {
      console.error("Organization lookup error:", error);
      return;
    }

    if (data) {
      console.log("Organization found:", data.organization_id);
      setOrganizationId(data.organization_id);
    }
  }

  getOrganization();
}, [user]);

useEffect(() => {
  if (!organizationId) return;


  async function loadLeads() {
    console.log("Loading leads for:", organizationId);

    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .eq("organization_id", organizationId);

    if (error) {
      console.error("Leads error:", error);
      return;
    }

    console.log("Organization Leads:", data);

    setLeads(data);
  }

  loadLeads();

  async function loadScores() {
    const { data, error } = await supabase
      .from("lead_scores")
      .select("*");

    if (error) {
      console.error("Lead Scores Error:", error);
      return;
    }

    console.log("Lead Scores:", data);

    setScores(data);
  }

  loadScores();

  setDashboard({
  leads,
  scores,
  hotCount: scores.filter(
    (score) => score.status === "Hot Lead"
  ).length,
});


}, [organizationId]);

useEffect(() => {
  const sourceCounts = {};

  leads.forEach((lead) => {
    sourceCounts[lead.source] =
      (sourceCounts[lead.source] || 0) + 1;
  });

  const sourceData = Object.keys(sourceCounts).map(
    (source) => ({
      source,
      leads: sourceCounts[source],
    })
  );

  console.log("Chart Data:", sourceData);

  setSources(sourceData);
}, [leads]);


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

async function addLead() {
  const { error } = await supabase
    .from("leads")
    .insert([
      {
        organization_id: organizationId,
        first_name: newLead.first_name,
        company_name: newLead.company_name,
        email: newLead.email,
        source: newLead.source,
      },
    ]);

  if (error) {
    console.error(error);
    alert("Failed to save lead.");
    return;
  }

  alert("Lead added successfully!");

  setShowAddModal(false);

  setNewLead({
    first_name: "",
    company_name: "",
    email: "",
    source: "Website",
  });

  // Reload the leads
  const { data } = await supabase
    .from("leads")
    .select("*")
    .eq("organization_id", organizationId);

  setLeads(data);
}

const averageScore =
  scores.length > 0
    ? Math.round(
        scores.reduce(
          (total, score) => total + score.score,
          0
        ) / scores.length
      )
    : 0;


const hotCount = scores.filter(
  (score) => score.status === "Hot Lead"
).length;

const warmCount = scores.filter(
  (score) => score.status === "Warm Lead"
).length;

const coldCount =
  leads.length - hotCount - warmCount;

const hotLeadRate =
  leads.length > 0
    ? Math.round(
        (hotCount / leads.length) * 100
      )
    : 0;

const websiteLeads = leads.filter(
  (lead) => lead.source === "Website"
).length;


  const indexOfLastLead =
  currentPage * leadsPerPage;

const indexOfFirstLead =
  indexOfLastLead - leadsPerPage;

const currentLeads =
  sortedLeads.slice(
    indexOfFirstLead,
    indexOfLastLead
  );

const totalPages = Math.ceil(
  sortedLeads.length / leadsPerPage
);

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
<KPISection
  leads={leads}
  scores={scores}
  hotCount={hotCount}
  averageScore={averageScore}
  hotLeadRate={hotLeadRate}
  websiteLeads={websiteLeads}
/>
  <LeadInsights
  leads={leads}
  hotCount={hotCount}
  warmCount={warmCount}
  coldCount={coldCount}
  averageScore={averageScore}
  hotLeadRate={hotLeadRate}
/>

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
      statusFilter === "All"
        ? "#2563eb"
        : "#f3f4f6",
    color:
      statusFilter === "All"
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
      statusFilter === "Hot Lead"
        ? "#ef4444"
        : "#f3f4f6",
    color:
      statusFilter === "Hot Lead"
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
      statusFilter === "Warm Lead"
        ? "#f59e0b"
        : "#f3f4f6",
    color:
      statusFilter === "Warm Lead"
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
      statusFilter === "Cold Lead"
        ? "#10b981"
        : "#f3f4f6",
    color:
      statusFilter === "Cold Lead"
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

<select
  value={sortBy}
  onChange={(e) => setSortBy(e.target.value)}
  style={{
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
  }}
>
  <option>Highest Score</option>
  <option>Lowest Score</option>
  <option>Company Name</option>
  <option>Name A-Z</option>
</select>

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

<button
  onClick={() => setShowAddModal(true)}
  style={{
    background: "#10b981",
    color: "white",
    border: "none",
    padding: "10px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  }}
>
  + Add Lead
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
              {currentLeads.map((lead) => {
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
          <div
  style={{
    marginTop: "20px",
    display: "flex",
    justifyContent: "center",
    gap: "10px",
  }}
>
  <button
    disabled={currentPage === 1}
    onClick={() =>
      setCurrentPage(currentPage - 1)
    }
  >
    Previous
  </button>

  <span>
    Page {currentPage} of {totalPages}
  </span>

  <button
    disabled={currentPage === totalPages}
    onClick={() =>
      setCurrentPage(currentPage + 1)
    }
  >
    Next
  </button>
</div>
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
              dataKey="leads"
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
                <th>Email</th>
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
  onClick={() => analyzeLead(selectedLead)}
  style={{
    background: "#10b981",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    marginTop: "20px",
  }}
>
  
  ✨ Analyze Lead
</button>

{aiLoading && (
  <p style={{ marginTop: "15px" }}>
    Analyzing lead...
  </p>
)}

{aiResult && (
  <div style={{ marginTop: "20px" }}>
    <h3>AI Analysis</h3>

    <p>
      <strong>AI Score:</strong>{" "}
      {aiResult.ai_score}
    </p>

    <p>
      <strong>Summary:</strong>{" "}
      {aiResult.ai_summary}
    </p>

    <p>
      <strong>Recommendation:</strong>{" "}
      {aiResult.ai_recommendation}
    </p>
  </div>
)}
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

{showAddModal && (
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
        width: "450px",
      }}
    >
      <h2>Add New Lead</h2>

      <input
        type="text"
        placeholder="First Name"
        value={newLead.first_name}
        onChange={(e) =>
          setNewLead({
            ...newLead,
            first_name: e.target.value,
          })
        }
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "15px",
        }}
      />

      <input
        type="text"
        placeholder="Company"
        value={newLead.company_name}
        onChange={(e) =>
          setNewLead({
            ...newLead,
            company_name: e.target.value,
          })
        }
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "15px",
        }}
      />

      <input
        type="email"
        placeholder="Email"
        value={newLead.email}
        onChange={(e) =>
          setNewLead({
            ...newLead,
            email: e.target.value,
          })
        }
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "15px",
        }}
      />

      <select
        value={newLead.source}
        onChange={(e) =>
          setNewLead({
            ...newLead,
            source: e.target.value,
          })
        }
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "20px",
        }}
      >
        <option>Website</option>
        <option>LinkedIn</option>
        <option>Referral</option>
        <option>Facebook</option>
        <option>Google Ads</option>
      </select>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "10px",
        }}
      >
        <button onClick={() => setShowAddModal(false)}>
          Cancel
        </button>

        <button
  onClick={addLead}
  style={{
    background: "#10b981",
    color: "white",
    border: "none",
    padding: "10px 18px",
    borderRadius: "8px",
    cursor: "pointer",
  }}
>
          Save Lead
        </button>
      </div>
    </div>
  </div>
)}
      </div>
    </div>
  );
}

export default App;