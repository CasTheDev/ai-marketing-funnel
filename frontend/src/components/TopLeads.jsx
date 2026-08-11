import "./TopLeads.css";

function TopLeads({
  leads,
  scores,
  setSelectedLead,
  setShowModal,
}) {
  return (
    <div className="top-leads">
      <h2 className="top-leads-title">
        Top Leads
      </h2>

      <div className="top-leads-table-wrapper">
        <table className="top-leads-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Company</th>
              <th>Email</th>
              <th>Score</th>
              <th className="top-lead-status">
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
                  className="top-lead-row"
                  onClick={() => {
                    setSelectedLead(lead);
                    setShowModal(true);
                  }}
                >
                  <td>
                    {lead.first_name}
                  </td>

                  <td>
                    {lead.company_name}
                  </td>

                  <td>
                    {lead.email}
                  </td>

                  <td className="top-lead-score">
                    {lead.score}
                  </td>

                  <td className="top-lead-status">
                    {lead.status}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TopLeads;