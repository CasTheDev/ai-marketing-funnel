function LeadDetailsModal({
  showModal,
  selectedLead,
  analyzeLead,
  aiLoading,
  aiResult,
  setShowModal,
}) {
  if (!showModal || !selectedLead) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "white",
          padding: "30px",
          borderRadius: "12px",
          width: "500px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
        }}
      >
        <h2 style={{ color: "#111827" }}>
          Lead Details
        </h2>

        <hr />

        <p><strong>Name:</strong> {selectedLead.first_name}</p>
        <p><strong>Company:</strong> {selectedLead.company_name}</p>
        <p><strong>Email:</strong> {selectedLead.email}</p>
        <p><strong>Source:</strong> {selectedLead.source}</p>
        <p><strong>Created:</strong> {selectedLead.created_at}</p>

        <button
          onClick={() => analyzeLead(selectedLead)}
          style={{
            background: "#10b981",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "8px",
            cursor: "pointer",
            marginTop: "20px",
          }}
        >
          ✨ Analyze Lead
        </button>

        {aiLoading && (
          <p style={{ marginTop: "15px" }}>
            Analyzing lead...
          </p>
        )}

        {aiResult && (
          <div style={{ marginTop: "20px" }}>
            <h3>AI Analysis</h3>

            <p>
              <strong>AI Score:</strong> {aiResult.ai_score}
            </p>

            <p>
              <strong>Summary:</strong> {aiResult.ai_summary}
            </p>

            <p>
              <strong>Recommendation:</strong> {aiResult.ai_recommendation}
            </p>
          </div>
        )}

        <button
          onClick={() => setShowModal(false)}
          style={{
            marginTop: "20px",
            background: "#2563eb",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default LeadDetailsModal;