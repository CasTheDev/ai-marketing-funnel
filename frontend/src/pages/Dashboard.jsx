import "./Dashboard.css";
import VexaHeader from "../components/VexaHeader";
import DashboardLayout from "../components/DashboardLayout";
import EditLeadModal from "../components/EditLeadModal";
import AddLeadModal from "../components/AddLeadModal";
import ConfirmationModal from "../components/ConfirmationModal";
import LeadDetailsModal from "../components/LeadDetailsModal";
import TopLeads from "../components/TopLeads";
import SourceChart from "../components/SourceChart";
import LeadInsights from "../components/LeadInsights";
import KPISection from "../components/KPISection";
import CasAIInsight from "../components/CasAIInsight";
import { supabase } from "../lib/supabase";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

import {
  LayoutDashboard,
  Users,
  TrendingUp,
  ShieldCheck,
  BrainCircuit,
  BarChart3,
  Settings,
  LogOut,
  Pencil,
  Trash2,
} from "lucide-react";

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

  const [showCasAI, setShowCasAI] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  const [showAddModal, setShowAddModal] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState(null);

  const [newLead, setNewLead] = useState({
    first_name: "",
    company_name: "",
    email: "",
    source: "Website",
  });

  const [isSaving, setIsSaving] = useState(false);

  const [editingLead, setEditingLead] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const leadsPerPage = 5;
  
  const dashboardInsights = [
  {
    icon: Users,
    title: "High Value Leads",
    value: "4 prospects need immediate attention",
  },
  {
    icon: TrendingUp,
    title: "Conversion Rate",
    value: "12% higher than yesterday",
  },
  {
    icon: ShieldCheck,
    title: "Pipeline Health",
    value: "Excellent",
  },
  {
    icon: BrainCircuit,
    title: "AI Recommendation",
    value: "Contact your hottest lead today.",
  },
];

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

          try {
      const response = await fetch(
        "http://127.0.0.1:8000/source-performance"
      );

      if (!response.ok) {
        throw new Error("Failed to load source performance");
      }

      const sourceData = await response.json();

      console.log("Source performance:", sourceData);

      setSources(sourceData);
    } catch (error) {
      console.error(
        "Error loading source performance:",
        error
      );
    }

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
    lead_count: sourceCounts[source],
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
  setIsSaving(true);

  try {
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
  } finally {
    setIsSaving(false);
  }
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

    toast.success(`${updatedLead.first_name} was updated successfully.`);

    setShowEditModal(false);
    setEditingLead(null);
 
    await loadLeads();
  }

  function requestDeleteLead(lead) {
  setLeadToDelete(lead);
  setShowDeleteModal(true);
}

  async function deleteLead() {
  if (!leadToDelete) return;

  const { error } = await supabase
    .from("leads")
    .delete()
    .eq("lead_id", leadToDelete.lead_id);

  if (error) {
    console.error("Delete Error:", error);
    toast.error(`Failed to delete lead: ${error.message}`);
    return;
  }

  toast.success(`${leadToDelete.first_name} was deleted successfully!`);

  setShowDeleteModal(false);
  setLeadToDelete(null);

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

return (
  <DashboardLayout>

    <div className="crm-page">
      </div>

      {/* VEXA HERO */}
      <VexaHeader
        title="Welcome back, Cas-sandra!"
        heroImage="/images/vexa/vexa-floating.png"
        leads={leads}
        hotCount={hotCount}
        sources={sources}
      />

      {/* DASHBOARD SECTION HEADER */}
      <div className="crm-page-header dashboard-section-header">

        <div>
          <h1 className="crm-page-title">
            Today's Snapshot
          </h1>

          <p className="crm-page-subtitle">
            Your CRM performance at a glance.
          </p>
        </div>
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

<CasAIInsight
  leads={leads}
  hotCount={hotCount}
  sources={sources}
  organizationId={organizationId}
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
        <div className="dashboard-recent-leads">

          <div className="dashboard-search-wrapper">
            
            <input
               type="text"
               className="dashboard-search"
               placeholder="Search leads..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
              />

             <div className="dashboard-leads-toolbar">
              
            <button
              className={`dashboard-filter-button ${
              statusFilter === "All" ? "is-active" : ""
             }`}
              onClick={() => setStatusFilter("All")}
             >
              All ({leads.length})
              </button>

              <button
                className={`dashboard-filter-button is-hot ${
                statusFilter === "Hot Lead" ? "is-active" : ""
                }`}
                onClick={() => setStatusFilter("Hot Lead")}
              >
                Hot ({hotCount})
              </button>

              <button
                className={`dashboard-filter-button is-warm ${
                statusFilter === "Warm Lead" ? "is-active" : ""
               }`}
                onClick={() => setStatusFilter("Warm Lead")}
             >
                Warm ({warmCount})
             </button>

              <button
                className={`dashboard-filter-button is-cold ${
                statusFilter === "Cold Lead" ? "is-active" : ""
                }`}
                onClick={() => setStatusFilter("Cold Lead")}
              >
                Cold ({coldCount})
              </button>

            <select
               className="dashboard-sort"
               value={sortBy}
               onChange={(e) => setSortBy(e.target.value)}
            >
              <option>Highest Score</option>
              <option>Lowest Score</option>
              <option>Company Name</option>
              <option>Name A-Z</option>
            </select>

              <button
                className="dashboard-export-button"
                onClick={exportToCSV}
           >
               Export CSV
              </button>

             <button
               className="dashboard-add-button"
               onClick={() => setShowAddModal(true)}
            >
                + Add Lead
            </button>


            </div>
          </div>

          <h2 className="dashboard-recent-leads-title">
              Recent Leads
          </h2>

          <div className="dashboard-leads-table-wrapper">
  <table className="dashboard-leads-table">
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

           <td>
  <span
    className={`dashboard-status-badge ${
      leadScore?.status === "Hot Lead"
        ? "is-hot"
        : leadScore?.status === "Warm Lead"
          ? "is-warm"
          : "is-cold"
    }`}
  >
    {leadScore ? leadScore.status : "Cold Lead"}
  </span>
</td>

            <td className="dashboard-table-actions">
              
              <button
  type="button"
  onClick={() => {
    setEditingLead(lead);
    setShowEditModal(true);
  }}
  title="Edit lead"
  aria-label={`Edit ${lead.first_name}`}
  className="dashboard-edit-button"
>
  <Pencil size={15} strokeWidth={2} />
</button>

              <button
  type="button"
  onClick={() => requestDeleteLead(lead)}
  title="Delete lead"
  aria-label={`Delete ${lead.first_name}`}
  className="dashboard-delete-button"
>
  <Trash2 size={15} strokeWidth={2} />
</button>
            </td>
          </tr>
        );
      })}
    </tbody>
  </table>
</div>

<div className="dashboard-pagination">
  <button
    className="dashboard-pagination-button"
    disabled={currentPage === 1}
    onClick={() => setCurrentPage(currentPage - 1)}
  >
    Previous
  </button>

  <span className="dashboard-pagination-info">
    Page {currentPage} of {totalPages}
  </span>

  <button
    className="dashboard-pagination-button"
    disabled={currentPage === totalPages}
    onClick={() => setCurrentPage(currentPage + 1)}
  >
    Next
  </button>
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
          isSaving={isSaving}
        />

        <EditLeadModal
          showEditModal={showEditModal}
          setShowEditModal={setShowEditModal}
          editingLead={editingLead}
          setEditingLead={setEditingLead}
          updateLead={updateLead}
        />

        <ConfirmationModal
  isOpen={showDeleteModal}
  title="Delete Lead"
  message={
    leadToDelete
      ? `Are you sure you want to delete ${leadToDelete.first_name}? This action cannot be undone.`
      : ""
  }
  confirmText="Delete"
  cancelText="Cancel"
  onConfirm={deleteLead}
  onCancel={() => {
    setShowDeleteModal(false);
    setLeadToDelete(null);
  }}
/>
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;