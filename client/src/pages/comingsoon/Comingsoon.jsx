import React from 'react';
import './comingsoon.css';
import comingsoonImg from '../../assets/comingsoon.png';

const Comingsoon = () => {
  return (
    <div className="coming-soon-container">
      <p className="coming-soon-text">
        Exciting things are on the way. Stay tuned!
      </p>
      <img loading="lazy" 
        src={comingsoonImg} 
        alt="Coming Soon" 
        className="coming-soon-image"
      />
    </div>
  );
};

export default Comingsoon;
