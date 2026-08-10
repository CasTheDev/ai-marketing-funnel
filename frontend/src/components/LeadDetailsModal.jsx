import { Sparkles, X } from "lucide-react";
import "../styles/modal.css";

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
    <div className="modal-overlay">
      <div className="modal-card">

        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">
            Lead Details
          </h2>

          <button
            type="button"
            className="modal-close"
            onClick={() => setShowModal(false)}
            aria-label="Close"
            title="Close"
          >
            <X size={17} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">

          <div className="modal-detail-row">
            <span className="modal-detail-label">
              Name
            </span>

            <span className="modal-detail-value">
              {selectedLead.first_name}
            </span>
          </div>

          <div className="modal-detail-row">
            <span className="modal-detail-label">
              Company
            </span>

            <span className="modal-detail-value">
              {selectedLead.company_name}
            </span>
          </div>

          <div className="modal-detail-row">
            <span className="modal-detail-label">
              Email
            </span>

            <span className="modal-detail-value">
              {selectedLead.email}
            </span>
          </div>

          <div className="modal-detail-row">
            <span className="modal-detail-label">
              Source
            </span>

            <span className="modal-detail-value">
              {selectedLead.source}
            </span>
          </div>

          <div className="modal-detail-row">
            <span className="modal-detail-label">
              Created
            </span>

            <span className="modal-detail-value">
              {selectedLead.created_at}
            </span>
          </div>

          {/* AI Analysis */}
          <button
            type="button"
            className="modal-button modal-button-success"
            onClick={() => analyzeLead(selectedLead)}
            disabled={aiLoading}
            style={{
              marginTop: "20px",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Sparkles size={16} />

            {aiLoading
              ? "Analyzing..."
              : "Analyze Lead"}
          </button>

          {aiLoading && (
            <p className="modal-loading">
              Analyzing lead...
            </p>
          )}

          {aiResult && (
            <div className="modal-ai-section">

              <h3 className="modal-ai-title">
                AI Analysis
              </h3>

              <div className="modal-ai-item">
                <strong>AI Score:</strong>{" "}
                {aiResult.ai_score}
              </div>

              <div className="modal-ai-item">
                <strong>Summary:</strong>{" "}
                {aiResult.ai_summary}
              </div>

              <div className="modal-ai-item">
                <strong>Recommendation:</strong>{" "}
                {aiResult.ai_recommendation}
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="modal-footer">

          <button
            type="button"
            className="modal-button modal-button-secondary"
            onClick={() => setShowModal(false)}
          >
            Close
          </button>

        </div>

      </div>
    </div>
  );
}

export default LeadDetailsModal;
