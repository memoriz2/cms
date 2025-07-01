import React from "react";
import "./Modal.css";

interface ModalProps {
  isOpen: boolean;
  message?: string;
  children?: React.ReactNode;
  onConfirm?: () => void;
  onClose: () => void;
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  message,
  children,
  onConfirm,
  onClose,
  confirmText = "확인",
  cancelText = "취소",
  showCancel = false,
}) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <div
      className="custom-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`modal-content ${!children ? "message-modal" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children ? (
          children
        ) : (
          <>
            <p>{message}</p>
            <div className="modal-actions">
              {showCancel && (
                <button onClick={handleCancel} className="cancel-btn">
                  {cancelText}
                </button>
              )}
              <button onClick={handleConfirm} className="confirm-btn">
                {confirmText}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Modal;
