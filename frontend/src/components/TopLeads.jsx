function TopLeads({
  leads,
  scores,
  setSelectedLead,
  setShowModal,
}) {
  return (
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
                  cursor: "pointer",
                }}
              >
                <td style={{ padding: "12px" }}>
                  {lead.first_name}
                </td>

                <td style={{ padding: "12px" }}>
                  {lead.company_name}
                </td>

                <td style={{ padding: "12px" }}>
                  {lead.email}
                </td>

                <td style={{ padding: "12px" }}>
                  {lead.score}
                </td>

                <td style={{ padding: "12px" }}>
                  {lead.status}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default TopLeads;