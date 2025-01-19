import React from 'react';
import './tos.css';

const TermsOfService = () => {
    return (
        <div className="terms-maincon">
            <div className="terms-top-bg">
                <img 
                    src="https://images.unsplash.com/photo-1548610762-7c6afe24c261?q=80&w=1776&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                    alt="Terms of Service Background" 
                />
                <h1 className="terms-overlay-text">Terms of Service</h1>
            </div>
            <div className="terms-content section">
                <h2>Agreement to Terms</h2>
                <p>
                    By accessing our website, you agree to be bound by these Terms of Service and to comply
                    with all applicable laws and regulations.
                </p>
                <h2>Use License</h2>
                <p>
                    Permission is granted to temporarily download one copy of the materials for personal,
                    non-commercial transitory viewing only.
                </p>
                <h2>Limitations</h2>
                <p>
                    You may not modify or copy the materials on this website. This license shall automatically
                    terminate if you violate any of these restrictions.
                </p>
            </div>
        </div>
    );
}

export default TermsOfService;