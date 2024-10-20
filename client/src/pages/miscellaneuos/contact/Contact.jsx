import React from 'react';
import './contact.css'; // Assuming you have a separate CSS file for styling

const Contact = () => {
    return (
        <div className="contact-maincon">
            {/* <div className="contact-top-bg">
                <img 
                    src="https://images.unsplash.com/photo-1548610762-7c6afe24c261?q=80&w=1776&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                    alt="Contact Background" 
                />
                <h1 className="contact-overlay-text">Contact Us</h1>
            </div> */}
            <div className="contact-content container">
                <h2 className='git-head'>Get in Touch</h2>
                <p>We'd love to hear from you! Whether you have a question, feedback, or just want to say hi, feel free to reach out using the form below.</p>
                <form className="contact-form">
                    <label htmlFor="name">Name</label>
                    <input type="text" id="name" placeholder="Your Name" required />

                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" placeholder="Your Email" required />

                    <label htmlFor="message">Message</label>
                    <textarea id="message" rows="4" placeholder="Your Message" required></textarea>

                    <button type="submit">Send Message</button>
                </form>
            </div>
        </div>
    );
}

export default Contact;
