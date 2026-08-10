function ConfirmationModal({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null;

  return (
    <div
      onClick={onCancel}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15, 23, 42, 0.55)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "24px",
        zIndex: 3000,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "#ffffff",
          borderRadius: "16px",
          padding: "28px",
          boxShadow: "0 25px 60px rgba(15, 23, 42, 0.25)",
          color: "#0f172a",
        }}
      >
        {/* Modal Title */}
        <h2
          style={{
            margin: 0,
            fontSize: "20px",
            fontWeight: "700",
            color: "#0f172a",
          }}
        >
          {title}
        </h2>

        {/* Confirmation Message */}
        <p
          style={{
            margin: "14px 0 26px",
            fontSize: "14px",
            lineHeight: 1.6,
            color: "#475569",
          }}
        >
          {message}
        </p>

        {/* Actions */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
          }}
        >
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: "10px 18px",
              borderRadius: "8px",
              border: "1px solid #cbd5e1",
              background: "#f8fafc",
              color: "#334155",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: "600",
            }}
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            style={{
              padding: "10px 18px",
              borderRadius: "8px",
              border: "none",
              background: "#ef4444",
              color: "#ffffff",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: "600",
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal;