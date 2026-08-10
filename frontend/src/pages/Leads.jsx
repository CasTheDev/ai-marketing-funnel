import "./Leads.css";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

function Leads() {
  const { user, loading: authLoading } = useAuth();

  const [organizationId, setOrganizationId] = useState(null);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedLead, setSelectedLead] = useState(null);
  const [leadDetails, setLeadDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState("");

  // Find the organization belonging to the logged-in user
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
        setError("Unable to identify your CRM organization.");
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

  // Load only leads belonging to this organization
  useEffect(() => {
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
          throw new Error("Failed to load organization leads");
        }

        const data = await response.json();

        console.log("Organization leads:", data);

        setLeads(data);
      } catch (error) {
        console.error("Error loading leads:", error);

        setError(
          "Unable to load your leads right now. Please try again."
        );
      } finally {
        setLoading(false);
      }
    }

    loadLeads();
  }, [organizationId]);

  // Load details for a selected lead
  async function openLeadDetails(lead) {
    if (!organizationId || !lead?.lead_id) return;

    setSelectedLead(lead);
    setLeadDetails(null);
    setDetailsError("");
    setDetailsLoading(true);

    try {
      console.log(
        "Loading lead details for:",
        lead.lead_id
      );

      const response = await fetch(
        `http://127.0.0.1:8000/organizations/${organizationId}/leads/${lead.lead_id}`
      );

      if (!response.ok) {
        throw new Error("Failed to load lead details");
      }

      const data = await response.json();

      if (data?.error) {
        throw new Error(data.error);
      }

      console.log("Lead details:", data);

      setLeadDetails(data);
    } catch (error) {
      console.error("Lead details error:", error);

      setDetailsError(
        "Unable to load this lead's details. Please try again."
      );
    } finally {
      setDetailsLoading(false);
    }
  }

  function closeLeadDetails() {
    setSelectedLead(null);
    setLeadDetails(null);
    setDetailsError("");
    setDetailsLoading(false);
  }

  // Wait for authentication to finish
  if (authLoading) {
    return (
      <div className="leads-page">
        <p>Loading your CRM...</p>
      </div>
    );
  }

  // User is not authenticated
  if (!user) {
    return (
      <div className="leads-page">
        <p>Please sign in to access your leads.</p>
      </div>
    );
  }

  // Loading organization/leads
  if (loading) {
    return (
      <div className="leads-page">
        <h1 className="leads-title">Leads</h1>
        <p>Loading leads...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="leads-page">
        <h1 className="leads-title">Leads</h1>
        <p>{error}</p>
      </div>
    );
  }

  // KPI Cards
  const totalLeads = leads.length;

  const googleAdsLeads = leads.filter(
    (lead) => lead.source === "Google Ads"
  ).length;

  const facebookLeads = leads.filter(
    (lead) => lead.source === "Facebook"
  ).length;

  const websiteLeads = leads.filter(
    (lead) => lead.source === "Website"
  ).length;

  // Search Filter
  const filteredLeads = leads.filter((lead) => {
    const search = searchTerm.toLowerCase();

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
  });

  return (
    <div className="leads-page">
      <h1 className="leads-title">Leads</h1>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-label">Total Leads</div>
          <div className="kpi-value">{totalLeads}</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-label">Google Ads</div>
          <div className="kpi-value">{googleAdsLeads}</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-label">Facebook</div>
          <div className="kpi-value">{facebookLeads}</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-label">Website</div>
          <div className="kpi-value">{websiteLeads}</div>
        </div>
      </div>

      {/* Search */}
      <input
        type="text"
        className="search-box"
        placeholder="Search leads..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Leads Table */}
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
            </tr>
          </thead>

          <tbody>
            {filteredLeads.map((lead) => (
              <tr
                key={lead.lead_id}
                onClick={() => openLeadDetails(lead)}
                style={{
                  cursor: "pointer",
                }}
              >
                <td>{lead.first_name}</td>

                <td>{lead.email}</td>

                <td>{lead.company_name}</td>

                <td>
                  <span
                    className={`source-badge ${
                      lead.source === "Google Ads"
                        ? "source-google"
                        : lead.source === "Facebook"
                        ? "source-facebook"
                        : lead.source === "LinkedIn"
                        ? "source-linkedin"
                        : lead.source === "Referral"
                        ? "source-referral"
                        : "source-website"
                    }`}
                  >
                    {lead.source}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Lead Details Modal */}
      {selectedLead && (
        <div
          onClick={closeLeadDetails}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
            zIndex: 1000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: "620px",
              maxHeight: "90vh",
              overflowY: "auto",
              background: "#ffffff",
              borderRadius: "18px",
              boxShadow: "0 25px 60px rgba(15, 23, 42, 0.25)",
              padding: "28px",
              position: "relative",
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: "20px",
                marginBottom: "24px",
              }}
            >
              <div>
                <h2
                  style={{
                    margin: 0,
                    fontSize: "24px",
                    color: "#0f172a",
                  }}
                >
                  Lead Details
                </h2>

                <p
                  style={{
                    margin: "6px 0 0",
                    color: "#64748b",
                    fontSize: "13px",
                  }}
                >
                  Lead ID #{selectedLead.lead_id}
                </p>
              </div>

              <button
                type="button"
                onClick={closeLeadDetails}
                aria-label="Close lead details"
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  border: "1px solid #e2e8f0",
                  background: "#f8fafc",
                  color: "#475569",
                  cursor: "pointer",
                  fontSize: "20px",
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
                  padding: "40px 10px",
                  textAlign: "center",
                  color: "#64748b",
                }}
              >
                Loading lead details...
              </div>
            )}

            {/* Details Error */}
            {!detailsLoading && detailsError && (
              <div
                style={{
                  padding: "18px",
                  borderRadius: "12px",
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  color: "#b91c1c",
                  fontSize: "14px",
                }}
              >
                {detailsError}
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
                      marginBottom: "24px",
                    }}
                  >
                    <h3
                      style={{
                        margin: 0,
                        fontSize: "22px",
                        color: "#111827",
                      }}
                    >
                      {leadDetails.first_name}
                    </h3>

                    <p
                      style={{
                        margin: "5px 0 0",
                        fontSize: "15px",
                        color: "#64748b",
                      }}
                    >
                      {leadDetails.company_name}
                    </p>
                  </div>

                  {/* Intelligence Cards */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(3, minmax(0, 1fr))",
                      gap: "12px",
                      marginBottom: "24px",
                    }}
                  >
                    <div
                      style={{
                        padding: "16px",
                        borderRadius: "12px",
                        background: "#f8fafc",
                        border: "1px solid #e2e8f0",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "11px",
                          fontWeight: "700",
                          color: "#64748b",
                          textTransform: "uppercase",
                          marginBottom: "7px",
                        }}
                      >
                        Score
                      </div>

                      <div
                        style={{
                          fontSize: "24px",
                          fontWeight: "700",
                          color: "#2563eb",
                        }}
                      >
                        {leadDetails.score}
                      </div>
                    </div>

                    <div
                      style={{
                        padding: "16px",
                        borderRadius: "12px",
                        background: "#f8fafc",
                        border: "1px solid #e2e8f0",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "11px",
                          fontWeight: "700",
                          color: "#64748b",
                          textTransform: "uppercase",
                          marginBottom: "7px",
                        }}
                      >
                        Status
                      </div>

                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: "700",
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
                        {leadDetails.status}
                      </div>
                    </div>

                    <div
                      style={{
                        padding: "16px",
                        borderRadius: "12px",
                        background: "#f8fafc",
                        border: "1px solid #e2e8f0",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "11px",
                          fontWeight: "700",
                          color: "#64748b",
                          textTransform: "uppercase",
                          marginBottom: "7px",
                        }}
                      >
                        Source
                      </div>

                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: "700",
                          color: "#111827",
                        }}
                      >
                        {leadDetails.source}
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div
                    style={{
                      borderTop: "1px solid #e2e8f0",
                      paddingTop: "20px",
                    }}
                  >
                    <h3
                      style={{
                        margin: "0 0 14px",
                        fontSize: "15px",
                        color: "#111827",
                      }}
                    >
                      Contact Information
                    </h3>

                    <div
                      style={{
                        display: "grid",
                        gap: "12px",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: "11px",
                            fontWeight: "700",
                            color: "#94a3b8",
                            textTransform: "uppercase",
                            marginBottom: "4px",
                          }}
                        >
                          Email
                        </div>

                        <div
                          style={{
                            fontSize: "14px",
                            color: "#334155",
                          }}
                        >
                          {leadDetails.email}
                        </div>
                      </div>

                      <div>
                        <div
                          style={{
                            fontSize: "11px",
                            fontWeight: "700",
                            color: "#94a3b8",
                            textTransform: "uppercase",
                            marginBottom: "4px",
                          }}
                        >
                          Created
                        </div>

                        <div
                          style={{
                            fontSize: "14px",
                            color: "#334155",
                          }}
                        >
                          {leadDetails.created_at}
                        </div>
                      </div>

                      <div>
                        <div
                          style={{
                            fontSize: "11px",
                            fontWeight: "700",
                            color: "#94a3b8",
                            textTransform: "uppercase",
                            marginBottom: "4px",
                          }}
                        >
                          Score Updated
                        </div>

                        <div
                          style={{
                            fontSize: "14px",
                            color: "#334155",
                          }}
                        >
                          {leadDetails.score_created_at ||
                            "No score history"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div
                    style={{
                      marginTop: "26px",
                      paddingTop: "18px",
                      borderTop: "1px solid #e2e8f0",
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    <button
                      type="button"
                      onClick={closeLeadDetails}
                      style={{
                        padding: "10px 18px",
                        borderRadius: "10px",
                        border: "none",
                        background: "#2563eb",
                        color: "#ffffff",
                        cursor: "pointer",
                        fontSize: "13px",
                        fontWeight: "600",
                      }}
                    >
                      Close
                    </button>
                  </div>
                </>
              )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Leads;