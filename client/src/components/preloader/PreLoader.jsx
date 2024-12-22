import React from 'react';
import XYSvg from './../../assets/(SVG)xy essentials_final.svg';
import './preloader.css';

const PreLoader = () => {
  return (
    <div className="preloader">
      <div className="loader-circle"></div>
      <img src={XYSvg} alt="XY Essentials" className="preloader-svg" />
    </div>
  );
};

export default PreLoader;
