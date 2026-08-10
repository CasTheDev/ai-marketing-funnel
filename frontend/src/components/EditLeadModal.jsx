import { useEffect, useState } from "react";
import { Save, X } from "lucide-react";
import "../styles/modal.css";

function EditLeadModal({
  showEditModal,
  setShowEditModal,
  editingLead,
  updateLead,
}) {
  const [formData, setFormData] = useState({
    first_name: "",
    company_name: "",
    email: "",
    source: "",
  });

  useEffect(() => {
    if (editingLead) {
      setFormData({
        first_name: editingLead.first_name || "",
        company_name: editingLead.company_name || "",
        email: editingLead.email || "",
        source: editingLead.source || "",
      });
    }
  }, [editingLead]);

  if (!showEditModal || !editingLead) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card">

        {/* Header */}
        <div className="modal-header">
          <div>
            <h2 className="modal-title">
              Edit Lead
            </h2>

            <p
              style={{
                margin: "5px 0 0",
                color: "#64748b",
                fontSize: "13px",
              }}
            >
              Update this lead's information.
            </p>
          </div>

          <button
            type="button"
            className="modal-close"
            onClick={() => setShowEditModal(false)}
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
              value={formData.first_name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  first_name: e.target.value,
                })
              }
            />
          </div>

          <div className="modal-field">
            <label className="modal-label">
              Company
            </label>

            <input
              type="text"
              className="modal-input"
              value={formData.company_name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  company_name: e.target.value,
                })
              }
            />
          </div>

          <div className="modal-field">
            <label className="modal-label">
              Email
            </label>

            <input
              type="email"
              className="modal-input"
              value={formData.email}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  email: e.target.value,
                })
              }
            />
          </div>

          <div className="modal-field">
            <label className="modal-label">
              Lead Source
            </label>

            <select
              className="modal-select"
              value={formData.source}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  source: e.target.value,
                })
              }
            >
              <option>Website</option>
              <option>LinkedIn</option>
              <option>Referral</option>
              <option>Google Ads</option>
              <option>Facebook</option>
            </select>
          </div>

        </div>

        {/* Footer */}
        <div className="modal-footer">

          <button
            type="button"
            className="modal-button modal-button-secondary"
            onClick={() => setShowEditModal(false)}
          >
            Cancel
          </button>

          <button
            type="button"
            className="modal-button modal-button-primary"
            onClick={() =>
              updateLead({
                ...editingLead,
                ...formData,
              })
            }
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Save size={16} />
            Save Changes
          </button>

        </div>

      </div>
    </div>
  );
}

export default EditLeadModal;