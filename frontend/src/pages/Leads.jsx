import "./Leads.css";
import { useEffect, useState } from "react";

function Leads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch leads from FastAPI
  useEffect(() => {
    fetch("http://127.0.0.1:8000/leads")
      .then((response) => response.json())
      .then((data) => {
        setLeads(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading leads:", error);
        setLoading(false);
      });
  }, []);

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
      lead.first_name.toLowerCase().includes(search) ||
      lead.email.toLowerCase().includes(search) ||
      lead.company_name.toLowerCase().includes(search) ||
      lead.source.toLowerCase().includes(search)
    );
  });

  if (loading) {
    return (
      <div className="leads-page">
        <h2>Loading leads...</h2>
      </div>
    );
  }

  return (
    <div className="leads-page">

      <h1 className="leads-title">Leads</h1>

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

      <input
        type="text"
        className="search-box"
        placeholder="Search leads..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

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