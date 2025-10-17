import React from 'react';
import './ConfirmationModal.css';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className="confirmation-modal-overlay">
      <div className="confirmation-modal">
        <p>Do you want to confirm it.!!!</p>
        <div className="confirmation-modal-buttons">
          <button className="confirm-btn" onClick={onConfirm}>Yes</button>
          <button className="cancel-btn" onClick={onClose}>No</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
