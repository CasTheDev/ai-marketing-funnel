import { UserPlus, X } from "lucide-react";
import "../styles/modal.css";

function AddLeadModal({
  showAddModal,
  setShowAddModal,
  newLead,
  setNewLead,
  addLead,
  isSaving,
}) {
  if (!showAddModal) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card">

        {/* Header */}
        <div className="modal-header">
          <div>
            <h2 className="modal-title">
              Add New Lead
            </h2>

            <p
              style={{
                margin: "5px 0 0",
                color: "#64748b",
                fontSize: "13px",
              }}
            >
              Add a new lead to your organization.
            </p>
          </div>

          <button
            type="button"
            className="modal-close"
            onClick={() => setShowAddModal(false)}
            disabled={isSaving}
            aria-label="Close"
            title="Close"
          >
            <X size={17} />
          </button>
        </div>

        {/* Form */}
        <div className="modal-body">

          <div className="modal-field">
            <label className="modal-label">
              First Name
            </label>

            <input
              type="text"
              className="modal-input"
              placeholder="Enter first name"
              value={newLead.first_name}
              onChange={(e) =>
                setNewLead({
                  ...newLead,
                  first_name: e.target.value,
                })
              }
              disabled={isSaving}
            />
          </div>

          <div className="modal-field">
            <label className="modal-label">
              Company
            </label>

            <input
              type="text"
              className="modal-input"
              placeholder="Enter company name"
              value={newLead.company_name}
              onChange={(e) =>
                setNewLead({
                  ...newLead,
                  company_name: e.target.value,
                })
              }
              disabled={isSaving}
            />
          </div>

          <div className="modal-field">
            <label className="modal-label">
              Email
            </label>

            <input
              type="email"
              className="modal-input"
              placeholder="Enter email address"
              value={newLead.email}
              onChange={(e) =>
                setNewLead({
                  ...newLead,
                  email: e.target.value,
                })
              }
              disabled={isSaving}
            />
          </div>

          <div className="modal-field">
            <label className="modal-label">
              Lead Source
            </label>

            <select
              className="modal-select"
              value={newLead.source}
              onChange={(e) =>
                setNewLead({
                  ...newLead,
                  source: e.target.value,
                })
              }
              disabled={isSaving}
            >
              <option>Website</option>
              <option>LinkedIn</option>
              <option>Referral</option>
              <option>Facebook</option>
              <option>Google Ads</option>
            </select>
          </div>

        </div>

        {/* Footer */}
        <div className="modal-footer">

          <button
            type="button"
            className="modal-button modal-button-secondary"
            onClick={() => setShowAddModal(false)}
            disabled={isSaving}
          >
            Cancel
          </button>

          <button
            type="button"
            className="modal-button modal-button-success"
            onClick={addLead}
            disabled={isSaving}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <UserPlus size={16} />

            {isSaving ? "Saving..." : "Save Lead"}
          </button>

        </div>

      </div>
    </div>
  );
}

export default AddLeadModal;