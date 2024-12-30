import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-main">
      <div className="footer-content">
        {/* Subscription Section */}
        <div className="subscribe-section">
          <h2>Register Now So You Don't Miss Our Programs</h2>
          <div className="subscribe-form">
            <input 
              type="email" 
              placeholder="Enter your Email"
              className="email-input"
            />
            <button className="subscribe-btn">Subscribe Now</button>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="footer-nav">
          <div className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/disclaimer">Disclaimer</Link>
          </div>
          
          <div className="social-links">
            <a href="#" aria-label="Facebook">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" aria-label="Twitter">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" aria-label="Instagram">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" aria-label="YouTube">
              <i className="fab fa-youtube"></i>
            </a>
          </div>
        </nav>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p>© 2024 All rights reserved.</p>
          <div className="legal-links">
            <Link to="/terms">Terms of Service</Link>
            <Link to="/privacy">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;