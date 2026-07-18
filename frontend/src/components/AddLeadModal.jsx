function AddLeadModal({
  showAddModal,
  setShowAddModal,
  newLead,
  setNewLead,
  addLead,
}) {
  if (!showAddModal) return null;

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
          width: "450px",
        }}
      >
        <h2>Add New Lead</h2>

        <input
          type="text"
          placeholder="First Name"
          value={newLead.first_name}
          onChange={(e) =>
            setNewLead({
              ...newLead,
              first_name: e.target.value,
            })
          }
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "15px",
          }}
        />

        <input
          type="text"
          placeholder="Company"
          value={newLead.company_name}
          onChange={(e) =>
            setNewLead({
              ...newLead,
              company_name: e.target.value,
            })
          }
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "15px",
          }}
        />

        <input
          type="email"
          placeholder="Email"
          value={newLead.email}
          onChange={(e) =>
            setNewLead({
              ...newLead,
              email: e.target.value,
            })
          }
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "15px",
          }}
        />

        <select
          value={newLead.source}
          onChange={(e) =>
            setNewLead({
              ...newLead,
              source: e.target.value,
            })
          }
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "20px",
          }}
        >
          <option>Website</option>
          <option>LinkedIn</option>
          <option>Referral</option>
          <option>Facebook</option>
          <option>Google Ads</option>
        </select>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
          }}
        >
          <button onClick={() => setShowAddModal(false)}>
            Cancel
          </button>

          <button
            onClick={addLead}
            style={{
              background: "#10b981",
              color: "white",
              border: "none",
              padding: "10px 18px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Save Lead
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddLeadModal;