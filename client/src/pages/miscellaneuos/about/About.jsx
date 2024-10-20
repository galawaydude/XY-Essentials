import React from 'react';
import './about.css'; // Assuming you have a separate CSS file for styling

const About = () => {
    return (
        <div className="about-maincon">
            <div className="about-top-bg">
                <img 
                    src="https://images.unsplash.com/photo-1548610762-7c6afe24c261?q=80&w=1776&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                    alt="About Background" 
                />
                <h1 className="about-overlay-text">About Us</h1>
            </div>
            <div className="about-content container">
                <h2>Our Story</h2>
                <p>
                    Welcome to our blog! We are passionate about sharing insights, tips, and stories that inspire and inform. 
                    Our journey began with a love for writing and a desire to connect with others. 
                    Join us as we explore various topics, from technology to lifestyle, and everything in between.
                </p>
                <h2>Our Mission</h2>
                <p>
                    Our mission is to create a community of readers who seek knowledge and inspiration. 
                    We aim to provide high-quality content that adds value to your life and encourages open dialogue.
                </p>
            </div>
        </div>
    );
}

export default About;
