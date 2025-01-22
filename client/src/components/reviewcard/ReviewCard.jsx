import React, { useState } from 'react';
import './reviewcard.css';

const ReviewCard = ({ review, onDelete, onUpdate, currentUserId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedRating, setEditedRating] = useState(review.rating);
  const [editedComment, setEditedComment] = useState(review.comment);

  const handleSubmitEdit = async () => {
    await onUpdate(review._id, {
      rating: editedRating,
      comment: editedComment
    });
    setIsEditing(false);
  };

  const isOwner = currentUserId === review.user._id;

  return (
    <div className="review-card">
      {!isEditing ? (
        <>
          <div className="review-header">
            <div className="review-info-header">
              <h6>{review.user?.name}</h6>
              <div className="review-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <i
                    key={star}
                    className={`fas fa-star`}
                    style={{ color: star <= review.rating ? '#FFD700' : '#e4e5e9' }}
                  ></i>
                ))}
              </div>
            </div>
            {isOwner && (
              <div className="review-actions">
                <button
                  className="review-edit-btn"
                  onClick={() => setIsEditing(true)}
                  aria-label="Edit review"
                >
                  <i className="fas fa-edit"></i>
                </button>
                <button
                  className="review-delete-btn"
                  onClick={() => onDelete(review._id)}
                  aria-label="Delete review"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            )}
          </div>
          <div className="review-info">
            <p>{review.comment}</p>
          </div>
          <div className="review-date">
            <p>Posted on {new Date(review.updatedAt).toLocaleDateString()}</p>
          </div>
        </>
      ) : (
        <div className="review-edit-form">
          <div className="rating-edit">
            {[1, 2, 3, 4, 5].map((star) => (
              <i
                key={star}
                className={`fas fa-star`}
                onClick={() => setEditedRating(star)}
                style={{ color: star <= editedRating ? '#FFD700' : '#e4e5e9' }}
              ></i>
            ))}
          </div>
          <textarea
            value={editedComment}
            onChange={(e) => setEditedComment(e.target.value)}
            className="review-edit-textarea"
          />
          <div className="edit-actions">
            <button onClick={handleSubmitEdit} className="save-btn">Save</button>
            <button onClick={() => setIsEditing(false)} className="cancel-btn">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewCard;