import React from 'react';
import XYSvg from './../../assets/(SVG)xy essentials_final.svg';
import './preloader.css';

const PreLoader = () => {
  const apiUrl = import.meta.env.VITE_API_URL;

  return (
    // <div className="preloader">
    //   <div className="loader-circle"></div>
    //   <img src={XYSvg} alt="XY Essentials" className="preloader-svg" />
    // </div>

    <div className="loader-container">

      <svg className="loader-text" viewBox="0 0 800 300">
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          className="site-name"
        >
          XY Essentials
        </text>
      </svg>

    </div>
  );
};

export default PreLoader;
