import React, { useEffect } from 'react';
import { Toast as BootstrapToast } from 'react-bootstrap';
import './Toast.css';

const Toast = ({ action, message, show, onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // Default Bootstrap toast duration

      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <div className="toast-container">
      <BootstrapToast 
        show={show} 
        onClose={onClose}
        className="custom-toast"
      >
        <BootstrapToast.Header closeButton>
          <strong className="me-auto">{action}</strong>
        </BootstrapToast.Header>
        <BootstrapToast.Body>
          {message}
        </BootstrapToast.Body>
      </BootstrapToast>
    </div>
  );
};

export default Toast;
