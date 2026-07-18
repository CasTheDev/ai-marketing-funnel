function LeadInsights({
  leads,
  hotCount,
  warmCount,
  coldCount,
  averageScore,
  hotLeadRate,
}) {
  return (
    <div
      style={{
        background: "white",
        marginTop: "30px",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
      }}
    >
      <h2
        style={{
          color: "#6b7280",
          marginBottom: "20px",
        }}
      >
        Lead Insights
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "20px",
        }}
      >
        <div>
          <strong>Total Leads</strong>
          <p>{leads.length}</p>
        </div>

        <div>
          <strong>Hot Leads</strong>
          <p>{hotCount}</p>
        </div>

        <div>
          <strong>Warm Leads</strong>
          <p>{warmCount}</p>
        </div>

        <div>
          <strong>Cold Leads</strong>
          <p>{coldCount}</p>
        </div>

        <div>
          <strong>Average Score</strong>
          <p>{averageScore}</p>
        </div>

        <div>
          <strong>Hot Lead Rate</strong>
          <p>{hotLeadRate}%</p>
        </div>
      </div>
    </div>
  );
}

export default LeadInsights;