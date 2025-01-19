import React, { useEffect } from 'react';
import { Toast as BootstrapToast } from 'react-bootstrap';
import './Toast.css';
import { Link } from 'react-router-dom';

const Toast = ({ action, message, show, onClose, link , link_name}) => {
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
        <BootstrapToast.Header closeButton closeVariant="white">
          <strong className="me-auto">{action}</strong>
        </BootstrapToast.Header>
        <BootstrapToast.Body>
          {message}
          {link && <Link to={link}> {link_name}</Link>}
        </BootstrapToast.Body>
      </BootstrapToast>
    </div>
  );
};

export default Toast;

