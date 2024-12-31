import React from 'react';
import './privacypolicy.css';

const PrivacyPolicy = () => {
    return (
        <div className="privacy-maincon">
            <div className="privacy-top-bg">
                <img 
                    src="https://images.unsplash.com/photo-1548610762-7c6afe24c261?q=80&w=1776&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                    alt="Privacy Policy Background" 
                />
                <h1 className="privacy-overlay-text">Privacy Policy</h1>
            </div>
            <div className="privacy-content container">
                <h2>Information We Collect</h2>
                <p>
                    We collect information that you provide directly to us, including when you create an account,
                    make a purchase, sign up for our newsletter, or contact us for support.
                </p>
                <h2>How We Use Your Information</h2>
                <p>
                    We use the information we collect to process your orders, communicate with you about our
                    products and services, and improve your shopping experience.
                </p>
                <h2>Information Sharing</h2>
                <p>
                    We do not sell or rent your personal information to third parties. We only share your
                    information as described in this Privacy Policy.
                </p>
            </div>
        </div>
    );
}

export default PrivacyPolicy;