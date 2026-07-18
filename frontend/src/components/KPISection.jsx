function KPISection({
  leads,
  scores,
  hotCount,
  averageScore,
  hotLeadRate,
  websiteLeads,
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
        gap: "20px",
        marginTop: "20px",
      }}
    >
      <div
        style={{
          background: "#2563eb",
          color: "white",
          padding: "20px",
          borderRadius: "10px",
          textAlign: "center",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        }}
      >
        <h3>Total Leads</h3>
        <h2>{leads.length}</h2>
      </div>

      <div
        style={{
          background: "#10b981",
          color: "white",
          padding: "20px",
          borderRadius: "10px",
          textAlign: "center",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        }}
      >
        <h3>Total Events</h3>
        <h2>{scores.length}</h2>
      </div>

      <div
        style={{
          background: "#ef4444",
          color: "white",
          padding: "20px",
          borderRadius: "10px",
          textAlign: "center",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        }}
      >
        <h3>Hot Leads</h3>
        <h2>{hotCount}</h2>
      </div>

      <div
        style={{
          background: "#8b5cf6",
          color: "white",
          padding: "20px",
          borderRadius: "10px",
          textAlign: "center",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        }}
      >
        <h3>Avg Score</h3>
        <h2>{averageScore}</h2>
      </div>

      <div
        style={{
          background: "#f59e0b",
          color: "white",
          padding: "20px",
          borderRadius: "10px",
          textAlign: "center",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        }}
      >
        <h3>Hot Rate</h3>
        <h2>{hotLeadRate}%</h2>
      </div>

      <div
        style={{
          background: "#06b6d4",
          color: "white",
          padding: "20px",
          borderRadius: "10px",
          textAlign: "center",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        }}
      >
        <h3>Website Leads</h3>
        <h2>{websiteLeads}</h2>
      </div>
    </div>
  );
}

export default KPISection;