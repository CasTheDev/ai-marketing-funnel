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
        console.log("Leads organization found:", data.organization_id);
        setOrganizationId(data.organization_id);
      } else {
        setError("No CRM organization is associated with this account.");
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
      (lead.first_name || "").toLowerCase().includes(search) ||
      (lead.email || "").toLowerCase().includes(search) ||
      (lead.company_name || "").toLowerCase().includes(search) ||
      (lead.source || "").toLowerCase().includes(search)
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
              <tr key={lead.lead_id}>
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
    </div>
  );
}

export default Leads;