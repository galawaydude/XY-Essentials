import React from 'react';
import './reviewcard.css';

const ReviewCard = ({ review }) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  
  const { user, rating, comment, updatedAt } = review;
  

  // Create star elements based on rating
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        stars.push(<i key={i} className="rating-star fas fa-star"></i>);
      } else if (i === Math.ceil(rating)) {
        stars.push(<i key={i} className="rating-star fas fa-star-half-alt"></i>);
      } else {
        stars.push(<i key={i} className="rating-star far fa-star"></i>);
      }
    }
    return stars;
  };

  // Format the date to display only the date part
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="review-card">
      <div className="review-header">
        <div className="review-rating">
          {renderStars()}
        </div>
        <button 
          className="review-delete-btn"
          aria-label="Delete review"
        >
          <i className="fa-solid fa-trash"></i>
        </button>
      </div>
      <div className="review-info">
        <h6>{user?.name}</h6>
        <p>{comment}</p>
      </div>
      <div className="review-date">
        <p>Posted on {formatDate(updatedAt)}</p>
      </div>
    </div>
  );
};

export default ReviewCard;