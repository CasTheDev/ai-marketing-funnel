import "./Leads.css";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import { toast } from "sonner";
import DashboardLayout from "../components/DashboardLayout";

import {
  Pencil,
  Trash2,
  Search,
  Plus,
  BrainCircuit,
  Target,
} from "lucide-react";

import AddLeadModal from "../components/AddLeadModal";
import EditLeadModal from "../components/EditLeadModal";
import ConfirmationModal from "../components/ConfirmationModal";

function Leads() {
  const { user, loading: authLoading } = useAuth();

  // --------------------------------------------------
  // Organization + Leads State
  // --------------------------------------------------

  const [organizationId, setOrganizationId] = useState(null);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // --------------------------------------------------
  // Add / Edit / Delete State
  // --------------------------------------------------

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [editingLead, setEditingLead] = useState(null);
  const [leadToDelete, setLeadToDelete] = useState(null);

  const [isSaving, setIsSaving] = useState(false);

  const [newLead, setNewLead] = useState({
    first_name: "",
    company_name: "",
    email: "",
    source: "Website",
  });

  // --------------------------------------------------
  // Lead Details State
  // --------------------------------------------------

  const [selectedLead, setSelectedLead] = useState(null);
  const [leadDetails, setLeadDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState("");
  const [leadActivity, setLeadActivity] = useState([]);

  // --------------------------------------------------
  // Find Organization Belonging To Logged-In User
  // --------------------------------------------------

  useEffect(() => {
    async function getOrganization() {
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("organization_users")
        .select("organization_id")
        .eq("user_id", user.id)
        .single();

      if (error) {
        console.error("Organization lookup error:", error);

        setError(
          "Unable to identify your CRM organization."
        );

        setLoading(false);
        return;
      }

      if (data?.organization_id) {
        console.log(
          "Leads organization found:",
          data.organization_id
        );

        setOrganizationId(data.organization_id);
      } else {
        setError(
          "No CRM organization is associated with this account."
        );

        setLoading(false);
      }
    }

    getOrganization();
  }, [user]);

  // --------------------------------------------------
  // Load Organization Leads
  // --------------------------------------------------

  async function loadLeads() {
    if (!organizationId) return;

    setLoading(true);
    setError("");

    try {
      console.log(
        "Loading organization leads for:",
        organizationId
      );

      const response = await fetch(
        `http://127.0.0.1:8000/organizations/${organizationId}/leads`
      );

      if (!response.ok) {
        throw new Error(
          "Failed to load organization leads"
        );
      }

      const data = await response.json();

      console.log(
        "Organization leads:",
        data
      );

      setLeads(data);
    } catch (error) {
      console.error(
        "Error loading leads:",
        error
      );

      setError(
        "Unable to load your leads right now. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLeads();
  }, [organizationId]);

  // --------------------------------------------------
  // Load Lead Details
  // --------------------------------------------------

 // --------------------------------------------------
// Load Lead Details + Activity History
// --------------------------------------------------

async function openLeadDetails(lead) {
  if (!organizationId || !lead?.lead_id) {
    return;
  }

  setSelectedLead(lead);
  setLeadDetails(null);
  setLeadActivity([]);
  setDetailsError("");
  setDetailsLoading(true);

  try {
    console.log(
      "Loading lead details for:",
      lead.lead_id
    );

    // --------------------------------------------------
    // Load lead details
    // --------------------------------------------------

    const response = await fetch(
      `http://127.0.0.1:8000/organizations/${organizationId}/leads/${lead.lead_id}`
    );

    if (!response.ok) {
      throw new Error(
        "Failed to load lead details"
      );
    }

    const data = await response.json();

    if (data?.error) {
      throw new Error(data.error);
    }

    console.log(
      "Lead details:",
      data
    );

    setLeadDetails(data);

    // --------------------------------------------------
    // Load lead activity history
    // --------------------------------------------------

    const activityResponse = await fetch(
      `http://127.0.0.1:8000/organizations/${organizationId}/leads/${lead.lead_id}/events`
    );

    if (!activityResponse.ok) {
      throw new Error(
        "Failed to load lead activity"
      );
    }

    const activityData =
      await activityResponse.json();

    console.log(
      "Lead activity:",
      activityData
    );

    setLeadActivity(
      Array.isArray(activityData)
        ? activityData
        : []
    );

  } catch (error) {

    console.error(
      "Lead details/activity error:",
      error
    );

    setDetailsError(
      error.message ||
      "Failed to load lead details"
    );

    setLeadActivity([]);

  } finally {

    setDetailsLoading(false);

  }
}

// --------------------------------------------------
// Close Lead Details
// --------------------------------------------------

function closeLeadDetails() {
  setSelectedLead(null);
  setLeadDetails(null);
  setLeadActivity([]);
  setDetailsError("");
  setDetailsLoading(false);
}

  // --------------------------------------------------
  // ADD LEAD
  // --------------------------------------------------

  async function addLead() {
    if (!organizationId) {
      toast.error(
        "Your CRM organization could not be identified."
      );
      return;
    }

    if (
      !newLead.first_name.trim() ||
      !newLead.email.trim()
    ) {
      toast.error(
        "Please enter a name and email address."
      );
      return;
    }

    setIsSaving(true);

    try {
      const { error } = await supabase
        .from("leads")
        .insert([
          {
            organization_id: organizationId,
            first_name:
              newLead.first_name.trim(),
            company_name:
              newLead.company_name.trim(),
            email:
              newLead.email.trim(),
            source: newLead.source,
          },
        ]);

      if (error) {
        console.error(
          "Add Lead Error:",
          error
        );

        toast.error(
          `Failed to add lead: ${error.message}`
        );

        return;
      }

      toast.success(
        "Lead added successfully!"
      );

      setShowAddModal(false);

      setNewLead({
        first_name: "",
        company_name: "",
        email: "",
        source: "Website",
      });

      await loadLeads();
    } catch (error) {
      console.error(
        "Unexpected Add Lead Error:",
        error
      );

      toast.error(
        "Something went wrong while adding the lead."
      );
    } finally {
      setIsSaving(false);
    }
  }

  // --------------------------------------------------
  // EDIT LEAD
  // --------------------------------------------------

  async function updateLead(updatedLead) {
    if (
      !organizationId ||
      !updatedLead?.lead_id
    ) {
      return;
    }

    try {
      const { error } = await supabase
        .from("leads")
        .update({
          first_name:
            updatedLead.first_name?.trim(),
          company_name:
            updatedLead.company_name?.trim(),
          email:
            updatedLead.email?.trim(),
          source:
            updatedLead.source,
        })
        .eq(
          "lead_id",
          updatedLead.lead_id
        )
        .eq(
          "organization_id",
          organizationId
        );

      if (error) {
        console.error(
          "Update Lead Error:",
          error
        );

        toast.error(
          `Failed to update lead: ${error.message}`
        );

        return;
      }

      toast.success(
        `${updatedLead.first_name} was updated successfully!`
      );

      setShowEditModal(false);
      setEditingLead(null);

      await loadLeads();

      // Refresh details if this lead was open
      if (
        selectedLead?.lead_id ===
        updatedLead.lead_id
      ) {
        await openLeadDetails(
          updatedLead
        );
      }
    } catch (error) {
      console.error(
        "Unexpected Update Lead Error:",
        error
      );

      toast.error(
        "Something went wrong while updating the lead."
      );
    }
  }

  // --------------------------------------------------
  // DELETE LEAD
  // --------------------------------------------------

  function requestDeleteLead(lead) {
    setLeadToDelete(lead);
    setShowDeleteModal(true);
  }

  async function deleteLead() {
    if (
      !organizationId ||
      !leadToDelete?.lead_id
    ) {
      return;
    }

    try {
      const { error } = await supabase
        .from("leads")
        .delete()
        .eq(
          "lead_id",
          leadToDelete.lead_id
        )
        .eq(
          "organization_id",
          organizationId
        );

      if (error) {
        console.error(
          "Delete Lead Error:",
          error
        );

        toast.error(
          `Failed to delete lead: ${error.message}`
        );

        return;
      }

      toast.success(
        `${leadToDelete.first_name} was deleted successfully!`
      );

      // If deleted lead was open in details,
      // close the details modal.
      if (
        selectedLead?.lead_id ===
        leadToDelete.lead_id
      ) {
        closeLeadDetails();
      }

      setShowDeleteModal(false);
      setLeadToDelete(null);

      await loadLeads();
    } catch (error) {
      console.error(
        "Unexpected Delete Lead Error:",
        error
      );

      toast.error(
        "Something went wrong while deleting the lead."
      );
    }
  }

  // --------------------------------------------------
  // Authentication Loading
  // --------------------------------------------------

  if (authLoading) {
    return (
      <div className="leads-page">
        <p>Loading your CRM...</p>
      </div>
    );
  }

  // --------------------------------------------------
  // Not Authenticated
  // --------------------------------------------------

  if (!user) {
    return (
      <div className="leads-page">
        <p>
          Please sign in to access your leads.
        </p>
      </div>
    );
  }

  // --------------------------------------------------
  // Loading
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="leads-page">
        <h1 className="leads-title">
          Leads
        </h1>

        <p>Loading leads...</p>
      </div>
    );
  }

  // --------------------------------------------------
  // Error
  // --------------------------------------------------

  if (error) {
    return (
      <div className="leads-page">
        <h1 className="leads-title">
          Leads
        </h1>

        <p>{error}</p>
      </div>
    );
  }

  // --------------------------------------------------
  // KPI Calculations
  // --------------------------------------------------

  const totalLeads = leads.length;

  const googleAdsLeads =
    leads.filter(
      (lead) =>
        lead.source === "Google Ads"
    ).length;

  const facebookLeads =
    leads.filter(
      (lead) =>
        lead.source === "Facebook"
    ).length;

  const websiteLeads =
    leads.filter(
      (lead) =>
        lead.source === "Website"
    ).length;

  // --------------------------------------------------
  // Search
  // --------------------------------------------------

  const filteredLeads = leads.filter(
    (lead) => {
      const search =
        searchTerm
          .toLowerCase()
          .trim();

      return (
        (lead.first_name || "")
          .toLowerCase()
          .includes(search) ||
        (lead.email || "")
          .toLowerCase()
          .includes(search) ||
        (lead.company_name || "")
          .toLowerCase()
          .includes(search) ||
        (lead.source || "")
          .toLowerCase()
          .includes(search)
      );
    }
  );

  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  return (
    <DashboardLayout>
      <div className="leads-page">

      {/* ==========================================
          PAGE HEADER
      ========================================== */}

      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          marginBottom: "30px",
          gap: "20px",
        }}
      >
        <div>
          <h1
            className="leads-title"
            style={{
              marginBottom: "8px",
            }}
          >
            Leads
          </h1>

          <p
            style={{
              margin: 0,
              color: "#94a3b8",
              fontSize: "14px",
            }}
          >
            Manage and track your customer leads.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setShowAddModal(true)
          }
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "#2563eb",
            color: "#ffffff",
            border: "none",
            padding: "11px 16px",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: "14px",
          }}
        >
          <Plus size={18} />
          Add Lead
        </button>
      </div>

      {/* ==========================================
          KPI CARDS
      ========================================== */}

      <div className="kpi-grid">

        <div className="kpi-card">
          <div className="kpi-label">
            Total Leads
          </div>

          <div className="kpi-value">
            {totalLeads}
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-label">
            Google Ads
          </div>

          <div className="kpi-value">
            {googleAdsLeads}
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-label">
            Facebook
          </div>

          <div className="kpi-value">
            {facebookLeads}
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-label">
            Website
          </div>

          <div className="kpi-value">
            {websiteLeads}
          </div>
        </div>

      </div>

      {/* ==========================================
          SEARCH
      ========================================== */}

      <input
        type="text"
        className="search-box"
        placeholder="Search leads..."
        value={searchTerm}
        onChange={(e) =>
          setSearchTerm(
            e.target.value
          )
        }
      />

      {/* ==========================================
          LEADS TABLE
      ========================================== */}

      {filteredLeads.length === 0 ? (
        <p>No leads found.</p>
      ) : (
        <table className="leads-table">

          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Company</th>
              <th>Source</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {filteredLeads.map(
              (lead) => (
                <tr
                  key={lead.lead_id}
                  onClick={() =>
                    openLeadDetails(
                      lead
                    )
                  }
                  style={{
                    cursor:
                      "pointer",
                  }}
                >

                  {/* Name */}

                  <td>
                    {lead.first_name}
                  </td>

                  {/* Email */}

                  <td>
                    {lead.email}
                  </td>

                  {/* Company */}

                  <td>
                    {lead.company_name}
                  </td>

                  {/* Source */}

                  <td>
                    <span
                      className={`source-badge ${
                        lead.source ===
                        "Google Ads"
                          ? "source-google"
                          : lead.source ===
                            "Facebook"
                          ? "source-facebook"
                          : lead.source ===
                            "LinkedIn"
                          ? "source-linkedin"
                          : lead.source ===
                            "Referral"
                          ? "source-referral"
                          : "source-website"
                      }`}
                    >
                      {lead.source}
                    </span>
                  </td>

                  {/* Actions */}

                  <td>
                    <div
                      style={{
                        display: "flex",
                        alignItems:
                          "center",
                        gap: "8px",
                      }}
                    >

                      {/* Edit */}

                      <button
                        type="button"
                        title="Edit lead"
                        aria-label={`Edit ${lead.first_name}`}
                        onClick={(e) => {
                          e.stopPropagation();

                          setEditingLead(
                            lead
                          );

                          setShowEditModal(
                            true
                          );
                        }}
                        style={{
                          width: "34px",
                          height: "34px",
                          display:
                            "flex",
                          alignItems:
                            "center",
                          justifyContent:
                            "center",
                          border:
                            "1px solid #dbeafe",
                          background:
                            "#eff6ff",
                          color:
                            "#2563eb",
                          borderRadius:
                            "8px",
                          cursor:
                            "pointer",
                        }}
                      >
                        <Pencil
                          size={16}
                        />
                      </button>

                      {/* Delete */}

                      <button
                        type="button"
                        title="Delete lead"
                        aria-label={`Delete ${lead.first_name}`}
                        onClick={(e) => {
                          e.stopPropagation();

                          requestDeleteLead(
                            lead
                          );
                        }}
                        style={{
                          width: "34px",
                          height: "34px",
                          display:
                            "flex",
                          alignItems:
                            "center",
                          justifyContent:
                            "center",
                          border:
                            "1px solid #fee2e2",
                          background:
                            "#fef2f2",
                          color:
                            "#dc2626",
                          borderRadius:
                            "8px",
                          cursor:
                            "pointer",
                        }}
                      >
                        <Trash2
                          size={16}
                        />
                      </button>

                    </div>
                  </td>

                </tr>
              )
            )}

          </tbody>

        </table>
      )}

      {/* ==========================================
          LEAD DETAILS MODAL
      ========================================== */}

      {selectedLead && (
        <div
          onClick={
            closeLeadDetails
          }
          style={{
            position: "fixed",
            inset: 0,
            background:
              "rgba(15, 23, 42, 0.45)",
            display: "flex",
            alignItems:
              "center",
            justifyContent:
              "center",
            padding: "24px",
            zIndex: 1000,
          }}
        >

          <div
            onClick={(e) =>
              e.stopPropagation()
            }
            style={{
              width: "100%",
              maxWidth: "620px",
              maxHeight: "90vh",
              overflowY:
                "auto",
              background:
                "#ffffff",
              borderRadius:
                "18px",
              boxShadow:
                "0 25px 60px rgba(15, 23, 42, 0.25)",
              padding: "28px",
              position:
                "relative",
            }}
          >

            {/* Modal Header */}

            <div
              style={{
                display:
                  "flex",
                alignItems:
                  "flex-start",
                justifyContent:
                  "space-between",
                gap: "20px",
                marginBottom:
                  "24px",
              }}
            >

              <div>

                <h2
                  style={{
                    margin: 0,
                    fontSize:
                      "24px",
                    color:
                      "#0f172a",
                  }}
                >
                  Lead Details
                </h2>

                <p
                  style={{
                    margin:
                      "6px 0 0",
                    color:
                      "#64748b",
                    fontSize:
                      "13px",
                  }}
                >
                  Lead ID #
                  {
                    selectedLead.lead_id
                  }
                </p>

              </div>

              <button
                type="button"
                onClick={
                  closeLeadDetails
                }
                aria-label="Close lead details"
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius:
                    "10px",
                  border:
                    "1px solid #e2e8f0",
                  background:
                    "#f8fafc",
                  color:
                    "#475569",
                  cursor:
                    "pointer",
                  fontSize:
                    "20px",
                  lineHeight: 1,
                }}
              >
                ×
              </button>

            </div>

            {/* Details Loading */}

            {detailsLoading && (
              <div
                style={{
                  padding:
                    "40px 10px",
                  textAlign:
                    "center",
                  color:
                    "#64748b",
                }}
              >
                Loading lead details...
              </div>
            )}

            {/* Details Error */}

            {!detailsLoading &&
              detailsError && (
                <div
                  style={{
                    padding:
                      "18px",
                    borderRadius:
                      "12px",
                    background:
                      "#fef2f2",
                    border:
                      "1px solid #fecaca",
                    color:
                      "#b91c1c",
                    fontSize:
                      "14px",
                  }}
                >
                  {
                    detailsError
                  }
                </div>
              )}

            {/* Lead Details */}

            {!detailsLoading &&
              !detailsError &&
              leadDetails && (
                <>

                  {/* Lead Identity */}

                  <div
                    style={{
                      marginBottom:
                        "24px",
                    }}
                  >

                    <h3
                      style={{
                        margin: 0,
                        fontSize:
                          "22px",
                        color:
                          "#111827",
                      }}
                    >
                      {
                        leadDetails.first_name
                      }
                    </h3>

                    <p
                      style={{
                        margin:
                          "5px 0 0",
                        fontSize:
                          "15px",
                        color:
                          "#64748b",
                      }}
                    >
                      {
                        leadDetails.company_name
                      }
                    </p>

                  </div>

                  {/* Intelligence Cards */}

                  <div
                    style={{
                      display:
                        "grid",
                      gridTemplateColumns:
                        "repeat(3, minmax(0, 1fr))",
                      gap:
                        "12px",
                      marginBottom:
                        "24px",
                    }}
                  >

                    {/* Score */}

                    <div
                      style={{
                        padding:
                          "16px",
                        borderRadius:
                          "12px",
                        background:
                          "#f8fafc",
                        border:
                          "1px solid #e2e8f0",
                      }}
                    >

                      <div
                        style={{
                          fontSize:
                            "11px",
                          fontWeight:
                            "700",
                          color:
                            "#64748b",
                          textTransform:
                            "uppercase",
                          marginBottom:
                            "7px",
                        }}
                      >
                        Score
                      </div>

                      <div
                        style={{
                          fontSize:
                            "24px",
                          fontWeight:
                            "700",
                          color:
                            "#2563eb",
                        }}
                      >
                        {
                          leadDetails.score
                        }
                      </div>

                    </div>

                    {/* Status */}

                    <div
                      style={{
                        padding:
                          "16px",
                        borderRadius:
                          "12px",
                        background:
                          "#f8fafc",
                        border:
                          "1px solid #e2e8f0",
                      }}
                    >

                      <div
                        style={{
                          fontSize:
                            "11px",
                          fontWeight:
                            "700",
                          color:
                            "#64748b",
                          textTransform:
                            "uppercase",
                          marginBottom:
                            "7px",
                        }}
                      >
                        Status
                      </div>

                      <div
                        style={{
                          fontSize:
                            "14px",
                          fontWeight:
                            "700",
                          color:
                            leadDetails.status ===
                            "Hot Lead"
                              ? "#dc2626"
                              : leadDetails.status ===
                                "Warm Lead"
                              ? "#d97706"
                              : "#64748b",
                        }}
                      >
                        {
                          leadDetails.status
                        }
                      </div>

                    </div>

                    {/* Source */}

                    <div
                      style={{
                        padding:
                          "16px",
                        borderRadius:
                          "12px",
                        background:
                          "#f8fafc",
                        border:
                          "1px solid #e2e8f0",
                      }}
                    >

                      <div
                        style={{
                          fontSize:
                            "11px",
                          fontWeight:
                            "700",
                          color:
                            "#64748b",
                          textTransform:
                            "uppercase",
                          marginBottom:
                            "7px",
                        }}
                      >
                        Source
                      </div>

                      <div
                        style={{
                          fontSize:
                            "14px",
                          fontWeight:
                            "700",
                          color:
                            "#111827",
                        }}
                      >
                        {
                          leadDetails.source
                        }
                      </div>

                    </div>
                  </div>


                  {/* ==========================================
                      LEAD INTELLIGENCE
                  ========================================== */}

                  <div
                    style={{
                      marginTop: "22px",
                      marginBottom: "22px",
                      padding: "18px",
                      borderRadius: "14px",
                      background: "#f8fafc",
                      border: "1px solid #e2e8f0",
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
    size={17}
    strokeWidth={2}
    color="#2563eb"
  />

  <h3
    style={{
      margin: 0,
      fontSize: "15px",
      fontWeight: "700",
      color: "#111827",
    }}
  >
    Lead Intelligence
  </h3>
</div>

                    <p
                      style={{
                        margin: 0,
                        fontSize: "13px",
                        lineHeight: "1.6",
                        color: "#475569",
                      }}
                    >
                      {leadDetails.status === "Hot Lead"
                        ? "This lead is showing strong buying intent and should be prioritised for follow-up."
                        : leadDetails.status === "Warm Lead"
                        ? "This lead is showing meaningful engagement and may benefit from continued nurturing."
                        : "This lead currently shows limited engagement. Consider increasing touchpoints before prioritising follow-up."}
                    </p>

                  </div>

                  {/* ==========================================
                      RECOMMENDED NEXT ACTION
                  ========================================== */}

                  <div
                    style={{
                      marginBottom: "24px",
                      padding: "18px",
                      borderRadius: "14px",
                      background: "#eff6ff",
                      border: "1px solid #dbeafe",
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
                      <Target
                        size={17}
                        strokeWidth={2}
                        color="#2563eb"
                      />

                      <h3
                        style={{
                          margin: 0,
                          fontSize: "15px",
                          fontWeight: "700",
                          color: "#1e3a8a",
                        }}
                      >
                        Recommended Next Action
                      </h3>

                    </div>

                    <p
                      style={{
                        margin: 0,
                        fontSize: "13px",
                        lineHeight: "1.6",
                        color: "#334155",
                      }}
                    >
                      {leadDetails.status === "Hot Lead"
                        ? "Contact this lead as soon as possible while their buying intent is high."
                        : leadDetails.status === "Warm Lead"
                        ? "Continue nurturing this lead and encourage another meaningful engagement."
                        : "Focus on generating additional engagement before prioritising direct sales follow-up."}
                    </p>

                  </div>


                  {/* Contact Information */}

                  <div
                    style={{
                      borderTop:
                        "1px solid #e2e8f0",
                      paddingTop:
                        "20px",
                    }}
                  >

                    <h3
                      style={{
                        margin:
                          "0 0 14px",
                        fontSize:
                          "15px",
                        color:
                          "#111827",
                      }}
                    >
                      Contact Information
                    </h3>

                    <div
                      style={{
                        display:
                          "grid",
                        gap:
                          "12px",
                      }}
                    >

                      {/* Email */}

                      <div>

                        <div
                          style={{
                            fontSize:
                              "11px",
                            fontWeight:
                              "700",
                            color:
                              "#94a3b8",
                            textTransform:
                              "uppercase",
                            marginBottom:
                              "4px",
                          }}
                        >
                          Email
                        </div>

                        <div
                          style={{
                            fontSize:
                              "14px",
                            color:
                              "#334155",
                          }}
                        >
                          {
                            leadDetails.email
                          }
                        </div>

                      </div>

                      {/* Created */}

                      <div>

                        <div
                          style={{
                            fontSize:
                              "11px",
                            fontWeight:
                              "700",
                            color:
                              "#94a3b8",
                            textTransform:
                              "uppercase",
                            marginBottom:
                              "4px",
                          }}
                        >
                          Created
                        </div>

                        <div
                          style={{
                            fontSize:
                              "14px",
                            color:
                              "#334155",
                          }}
                        >
                          {
                            leadDetails.created_at
                          }
                        </div>

                      </div>

                      {/* Score Updated */}

                      <div>

                        <div
                          style={{
                            fontSize:
                              "11px",
                            fontWeight:
                              "700",
                            color:
                              "#94a3b8",
                            textTransform:
                              "uppercase",
                            marginBottom:
                              "4px",
                          }}
                        >
                          Score Updated
                        </div>

                        <div
                          style={{
                            fontSize:
                              "14px",
                            color:
                              "#334155",
                          }}
                        >
                          {
                            leadDetails.score_created_at ||
                            "No score history"
                          }
                        </div>

                      </div>

                    </div>

                  </div>

                                       {/* ==========================================
                      ACTIVITY HISTORY
                  ========================================== */}

                  <div
                    style={{
                      marginTop: "24px",
                      paddingTop: "20px",
                      borderTop: "1px solid #e2e8f0",
                    }}
                  >

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "16px",
                      }}
                    >

                      <h3
                        style={{
                          margin: 0,
                          fontSize: "15px",
                          color: "#111827",
                        }}
                      >
                        Activity History
                      </h3>

                      {leadActivity.length > 0 && (
                        <span
                          style={{
                            fontSize: "11px",
                            color: "#94a3b8",
                          }}
                        >
                          {leadActivity.length}{" "}
                          {leadActivity.length === 1
                            ? "activity"
                            : "activities"}
                        </span>
                      )}

                    </div>

                    {leadActivity.length === 0 ? (

                      /* EMPTY STATE */

                      <div
                        style={{
                          padding: "28px 16px",
                          textAlign: "center",
                          borderRadius: "12px",
                          background: "#f8fafc",
                          border: "1px solid #e2e8f0",
                        }}
                      >

                        <div
                          style={{
                            width: "38px",
                            height: "38px",
                            margin: "0 auto 10px",
                            borderRadius: "50%",
                            background: "#eff6ff",
                            color: "#2563eb",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "18px",
                            fontWeight: "700",
                          }}
                        >
                          ○
                        </div>

                        <div
                          style={{
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "#334155",
                            marginBottom: "5px",
                          }}
                        >
                          No activity recorded yet
                        </div>

                        <div
                          style={{
                            fontSize: "12px",
                            lineHeight: "1.5",
                            color: "#94a3b8",
                            maxWidth: "320px",
                            margin: "0 auto",
                          }}
                        >
                          Behavioural activity will appear here as this
                          lead interacts with your tracked touchpoints.
                        </div>

                      </div>

                    ) : (

                      /* ACTIVITY TIMELINE */

                      <div
                        style={{
                          position: "relative",
                          maxHeight: "300px",
                          overflowY: "auto",
                          paddingRight: "6px",
                        }}
                      >

                        {leadActivity.map((activity, index) => {

                          const eventType =
                            String(
                              activity.event_type || ""
                            ).trim();

                          // --------------------------------------------------
                          // Human-readable event names
                          // --------------------------------------------------

                          const eventLabels = {
                            page_view: "Page Viewed",
                            pricing_page_view:
                              "Pricing Page Viewed",
                            ebook_download:
                              "Ebook Downloaded",
                            demo_request:
                              "Demo Requested",
                            "Website Visit":
                              "Website Visit",
                            "Email Click":
                              "Email Click",
                            "Form Submit":
                              "Form Submitted",
                          };

                          const displayEvent =
                            eventLabels[eventType] ||
                            eventType ||
                            "Activity";

                          // --------------------------------------------------
                          // Score contribution
                          // --------------------------------------------------

                          const eventScores = {
                            page_view: 1,
                            pricing_page_view: 10,
                            ebook_download: 20,
                            demo_request: 50,
                          };

                          const scoreContribution =
                            eventScores[eventType] ?? 0;

                          // --------------------------------------------------
                          // Format timestamp
                          // --------------------------------------------------

                          const formattedDate =
                            activity.created_at
                              ? new Date(
                                  activity.created_at
                                ).toLocaleString(
                                  undefined,
                                  {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )
                              : "Unknown date";

                          return (

                            <div
                              key={
                                activity.event_id ||
                                `${eventType}-${index}`
                              }
                              style={{
                                position: "relative",
                                display: "flex",
                                gap: "12px",
                                paddingBottom:
                                  index ===
                                  leadActivity.length - 1
                                    ? "0"
                                    : "18px",
                              }}
                            >

                              {/* TIMELINE */}

                              <div
                                style={{
                                  position: "relative",
                                  width: "18px",
                                  flexShrink: 0,
                                  display: "flex",
                                  justifyContent: "center",
                                }}
                              >

                                {index !==
                                  leadActivity.length - 1 && (
                                  <div
                                    style={{
                                      position: "absolute",
                                      top: "14px",
                                      bottom: "-4px",
                                      width: "1px",
                                      background: "#dbeafe",
                                    }}
                                  />
                                )}

                                <div
                                  style={{
                                    position: "relative",
                                    zIndex: 1,
                                    width: "9px",
                                    height: "9px",
                                    marginTop: "4px",
                                    borderRadius: "50%",
                                    background: "#2563eb",
                                    boxShadow:
                                      "0 0 0 4px #eff6ff",
                                  }}
                                />

                              </div>

                              {/* EVENT CONTENT */}

                              <div
                                style={{
                                  flex: 1,
                                  minWidth: 0,
                                  paddingBottom: "2px",
                                }}
                              >

                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent:
                                      "space-between",
                                    gap: "12px",
                                    flexWrap: "wrap",
                                  }}
                                >

                                  <div
                                    style={{
                                      fontSize: "13px",
                                      fontWeight: "650",
                                      color: "#1e293b",
                                    }}
                                  >
                                    {displayEvent}
                                  </div>

                                  {scoreContribution > 0 && (
                                    <span
                                      style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        padding: "3px 7px",
                                        borderRadius: "999px",
                                        background: "#eff6ff",
                                        color: "#2563eb",
                                        fontSize: "10px",
                                        fontWeight: "700",
                                        whiteSpace: "nowrap",
                                      }}
                                    >
                                      +{scoreContribution}{" "}
                                      {scoreContribution === 1
                                        ? "point"
                                        : "points"}
                                    </span>
                                  )}

                                </div>

                                <div
                                  style={{
                                    marginTop: "4px",
                                    fontSize: "11px",
                                    color: "#94a3b8",
                                  }}
                                >
                                  {formattedDate}
                                </div>

                              </div>

                            </div>

                          );
                        })}

                      </div>

                    )}

                  </div>

                  {/* Details Footer */}

                  <div
                    style={{
                      marginTop:
                        "26px",
                      paddingTop:
                        "18px",
                      borderTop:
                        "1px solid #e2e8f0",
                      display:
                        "flex",
                      justifyContent:
                        "flex-end",
                    }}
                  >

                    <button
                      type="button"
                      onClick={
                        closeLeadDetails
                      }
                      style={{
                        padding:
                          "10px 18px",
                        borderRadius:
                          "10px",
                        border:
                          "none",
                        background:
                          "#2563eb",
                        color:
                          "#ffffff",
                        cursor:
                          "pointer",
                        fontSize:
                          "13px",
                        fontWeight:
                          "600",
                      }}
                    >
                      Close
                    </button>

                  </div>

                </>
              )}
            </div>
            </div>

    )} {/*



      {/* ==========================================
          ADD LEAD MODAL
      ========================================== */}

      <AddLeadModal
        showAddModal={
          showAddModal
        }
        setShowAddModal={
          setShowAddModal
        }
        newLead={newLead}
        setNewLead={
          setNewLead
        }
        addLead={addLead}
        isSaving={isSaving}
      />

      {/* ==========================================
          EDIT LEAD MODAL
      ========================================== */}

      <EditLeadModal
        showEditModal={
          showEditModal
        }
        setShowEditModal={
          setShowEditModal
        }
        editingLead={
          editingLead
        }
        updateLead={
          updateLead
        }
      />

      {/* ==========================================
          DELETE CONFIRMATION
      ========================================== */}

      <ConfirmationModal
        isOpen={
          showDeleteModal
        }
        title="Delete Lead"
        message={
          leadToDelete
            ? `Are you sure you want to delete ${leadToDelete.first_name}? This action cannot be undone.`
            : ""
        }
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={
          deleteLead
        }
        onCancel={() => {
          setShowDeleteModal(
            false
          );
          setLeadToDelete(
            null
          );
        }}
      />
    </div>
  </DashboardLayout>
  );
}

export default Leads;
