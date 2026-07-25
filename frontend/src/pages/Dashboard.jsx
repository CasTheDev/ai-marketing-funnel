import EditLeadModal from "../components/EditLeadModal";
import AddLeadModal from "../components/AddLeadModal";
import LeadDetailsModal from "../components/LeadDetailsModal";
import TopLeads from "../components/TopLeads";
import SourceChart from "../components/SourceChart";
import LeadInsights from "../components/LeadInsights";
import KPISection from "../components/KPISection";
import { supabase } from "../lib/supabase";
import { toast } from "sonner";
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

function Dashboard() {

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

  const [showEditModal, setShowEditModal] = useState(false);

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
      toast.error("Failed to add lead.");
      return;
    }

    toast.success("Lead added successfully!");

    setShowAddModal(false);

    setNewLead({
      first_name: "",
      company_name: "",
      email: "",
      source: "Website",
    });

    await loadLeads();
  }

  async function updateLead(updatedLead) {
    const { error } = await supabase
      .from("leads")
      .update({
        first_name: updatedLead.first_name,
        company_name: updatedLead.company_name,
        email: updatedLead.email,
        source: updatedLead.source,
      })
      .eq("lead_id", updatedLead.lead_id);

    if (error) {
      console.error("Supabase Update Error:", error);
      toast.error(`Failed to update lead: ${error.message}`);
      return;
    }

    toast.success(`${lead.name} was updated successfully.`);

    setShowEditModal(false);
    setEditingLead(null);
 
    await loadLeads();
  }

  async function deleteLead(leadId) {
  const confirmed = window.confirm(
    "Are you sure you want to delete this lead?"
  );

  if (!confirmed) return;

  const { error } = await supabase
    .from("leads")
    .delete()
    .eq("lead_id", leadId);

  if (error) {
    console.error("Delete Error:", error);
    toast.error(`Failed to delete lead: ${error.message}`);
    return;
  }

  toast.success("Lead deleted successfully!");

  await loadLeads();
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
                onClick={() => setStatusFilter("All")}
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
                onClick={() => setStatusFilter("Hot Lead")}
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
                onClick={() => setStatusFilter("Warm Lead")}
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
                onClick={() => setStatusFilter("Cold Lead")}
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
                <th>Actions</th>
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
                    <td
                      style={{
                        padding: "12px",
                        textAlign: "center",
                      }}
                    >
                      <button
                        onClick={() => {
                          setEditingLead(lead);
                          setShowEditModal(true);
                        }}
                        style={{
                          background: "#2563eb",
                          color: "white",
                          border: "none",
                          padding: "6px 10px",
                          borderRadius: "6px",
                          cursor: "pointer",
                          marginRight: "8px",
                        }}
                      >
                        ✏️
                      </button>

                      <button
                        onClick={() => deleteLead(lead.lead_id)}
                        style={{
                          background: "#ef4444",
                          color: "white",
                          border: "none",
                          padding: "6px 10px",
                          borderRadius: "6px",
                          cursor: "pointer",
                        }}
                      >
                        🗑️
                      </button>
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

        <SourceChart
          sources={sources}
        />

        <TopLeads
          leads={leads}
          scores={scores}
          setSelectedLead={setSelectedLead}
          setShowModal={setShowModal}
        />

        <LeadDetailsModal
          showModal={showModal}
          selectedLead={selectedLead}
          analyzeLead={analyzeLead}
          aiLoading={aiLoading}
          aiResult={aiResult}
          setShowModal={setShowModal}
        />

        <AddLeadModal
          showAddModal={showAddModal}
          setShowAddModal={setShowAddModal}
          newLead={newLead}
          setNewLead={setNewLead}
          addLead={addLead}
        />

        <EditLeadModal
          showEditModal={showEditModal}
          setShowEditModal={setShowEditModal}
          editingLead={editingLead}
          setEditingLead={setEditingLead}
          updateLead={updateLead}
        />
      </div>
    </div>
  );
}

export default Dashboard;