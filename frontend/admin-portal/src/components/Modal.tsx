import React from "react";
import "./Modal.css";

interface ModalProps {
  isOpen: boolean;
  message: string;
  onConfirm?: () => void;
  onClose: () => void;
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  message,
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
    <div className="custom-modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
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
      </div>
    </div>
  );
};

export default Modal;
