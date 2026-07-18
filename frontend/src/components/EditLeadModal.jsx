import { useEffect, useState } from "react";

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
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "30px",
          borderRadius: "10px",
          width: "400px",
        }}
      >
        <h2>Edit Lead</h2>

        <div style={{ marginBottom: "15px" }}>
          <label>First Name</label>
          <input
            type="text"
            value={formData.first_name}
            onChange={(e) =>
              setFormData({
                ...formData,
                first_name: e.target.value,
              })
            }
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "5px",
            }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Company</label>
          <input
            type="text"
            value={formData.company_name}
            onChange={(e) =>
              setFormData({
                ...formData,
                company_name: e.target.value,
              })
            }
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "5px",
            }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({
                ...formData,
                email: e.target.value,
              })
            }
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "5px",
            }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label>Source</label>

          <select
            value={formData.source}
            onChange={(e) =>
              setFormData({
                ...formData,
                source: e.target.value,
              })
            }
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "5px",
            }}
          >
            <option>Website</option>
            <option>LinkedIn</option>
            <option>Referral</option>
            <option>Google Ads</option>
            <option>Facebook</option>
          </select>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
          }}
        >
          <button
            onClick={() => setShowEditModal(false)}
            style={{
              padding: "10px 16px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>

          <button
            onClick={() =>
              updateLead({
                ...editingLead,
                ...formData,
              })
            }
            style={{
              background: "#2563eb",
              color: "white",
              border: "none",
              padding: "10px 18px",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditLeadModal;