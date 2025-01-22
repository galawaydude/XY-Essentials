import React from 'react';
import './disclaimer.css';

const Disclaimer = () => {
    return (
        <div className="disclaimer-maincon">
            <div className="disclaimer-top-bg">
                <img loading="lazy" 
                    src="https://images.unsplash.com/photo-1548610762-7c6afe24c261?q=80&w=1776&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                    alt="Disclaimer Background" 
                />
                <h1 className="disclaimer-overlay-text">Disclaimer</h1>
            </div>
            <div className="disclaimer-content container">
                <h2>Website Disclaimer</h2>
                <p>
                    The information provided on this website is for general informational purposes only. All
                    information is provided in good faith, however we make no representation or warranty of any kind.
                </p>
                <h2>Product Disclaimer</h2>
                <p>
                    While we strive to ensure product information is accurate, actual product packaging and
                    materials may contain more or different information than shown on our website.
                </p>
                <h2>Medical Disclaimer</h2>
                <p>
                    The content on this website is not intended to be a substitute for professional medical
                    advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified
                    health provider.
                </p>
            </div>
        </div>
    );
}

export default Disclaimer;