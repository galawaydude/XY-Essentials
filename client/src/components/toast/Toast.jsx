import React, { useEffect } from 'react';
import { Toast as BootstrapToast } from 'react-bootstrap';
import { IoClose } from 'react-icons/io5';
import './Toast.css';
import { Link } from 'react-router-dom';

const Toast = ({ action, message, show, onClose, link, link_name }) => {
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
        <button 
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'none',
            border: 'none',
            padding: 0,
            width: '20px',
            height: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--m3)',
            opacity: 0.7,
            transition: 'opacity 0.2s',
            cursor: 'pointer',
          }}
          onClick={onClose}
          aria-label="Close"
        >
          <IoClose 
            style={{
              width: '16px',
              height: '16px',
            }}
          />
        </button>
        <BootstrapToast.Header>
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

