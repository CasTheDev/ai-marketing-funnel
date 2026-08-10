import { AlertTriangle, X } from "lucide-react";
import "../styles/modal.css";

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
      className="modal-overlay"
      onClick={onCancel}
    >
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Header */}
        <div className="modal-header">

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: "38px",
                height: "38px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "10px",
                background: "#fee2e2",
                color: "#dc2626",
                flexShrink: 0,
              }}
            >
              <AlertTriangle size={19} />
            </div>

            <h2 className="modal-title">
              {title}
            </h2>
          </div>

          <button
            type="button"
            className="modal-close"
            onClick={onCancel}
            aria-label="Close"
            title="Close"
          >
            <X size={17} />
          </button>

        </div>

        {/* Message */}
        <div className="modal-body">

          <p
            style={{
              margin: 0,
              color: "#475569",
              fontSize: "14px",
              lineHeight: 1.7,
            }}
          >
            {message}
          </p>

        </div>

        {/* Actions */}
        <div className="modal-footer">

          <button
            type="button"
            className="modal-button modal-button-secondary"
            onClick={onCancel}
          >
            {cancelText}
          </button>

          <button
            type="button"
            className="modal-button modal-button-danger"
            onClick={onConfirm}
          >
            {confirmText}
          </button>

        </div>

      </div>
    </div>
  );
}

export default ConfirmationModal;