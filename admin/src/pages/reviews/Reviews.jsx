import React, { useState, useEffect } from 'react';
import { FaSearch, FaStar, FaFilter, FaTrash, FaCheck, FaTimes, FaExclamationTriangle } from 'react-icons/fa';
import './reviews.css';

const Reviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRating, setFilterRating] = useState('all');
    const [sortBy, setSortBy] = useState('recent');
    const [selectedReviews, setSelectedReviews] = useState([]);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/reviews', {
                credentials: 'include'
            });
            if (!response.ok) throw new Error('Failed to fetch reviews');
            const data = await response.json();
            setReviews(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (reviewId) => {
        if (window.confirm('Are you sure you want to delete this review?')) {
            try {
                const response = await fetch(`http://localhost:5000/api/reviews/${reviewId}`, {
                    method: 'DELETE',
                    credentials: 'include'
                });
                if (response.ok) {
                    setReviews(reviews.filter(review => review._id !== reviewId));
                }
            } catch (error) {
                console.error('Error deleting review:', error);
            }
        }
    };

    const handleBulkDelete = async () => {
        if (window.confirm(`Delete ${selectedReviews.length} reviews?`)) {
            try {
                await Promise.all(
                    selectedReviews.map(reviewId =>
                        fetch(`http://localhost:5000/api/reviews/${reviewId}`, {
                            method: 'DELETE',
                            credentials: 'include'
                        })
                    )
                );
                fetchReviews();
                setSelectedReviews([]);
            } catch (error) {
                console.error('Error in bulk delete:', error);
            }
        }
    };

    const filteredReviews = reviews
        .filter(review => {
            const matchesSearch = review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                review.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                review.product?.name?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesRating = filterRating === 'all' || review.rating === parseInt(filterRating);
            return matchesSearch && matchesRating;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'recent': return new Date(b.createdAt) - new Date(a.createdAt);
                case 'rating': return b.rating - a.rating;
                case 'oldest': return new Date(a.createdAt) - new Date(b.createdAt);
                default: return 0;
            }
        });

    const renderStars = (rating) => {
        return [...Array(5)].map((_, index) => (
            <FaStar key={index} className={index < rating ? 'star-filled' : 'star-empty'} />
        ));
    };

    if (loading) return <div className="loading">Loading reviews...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div className="reviews-container">
            <div className="reviews-header">
                <h1>Review Management</h1>
                <div className="reviews-stats">
                    <div className="stat-item">
                        <span className="stat-label">Total Reviews</span>
                        <span className="stat-value">{reviews.length}</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Average Rating</span>
                        <span className="stat-value">
                            {(reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1)}
                        </span>
                    </div>
                </div>
            </div>

            <div className="filters-section">
                <div className="search-box">
                    <FaSearch />
                    <input
                        type="text"
                        placeholder="Search reviews, products, or users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="filters">
                    <select 
                        value={filterRating}
                        onChange={(e) => setFilterRating(e.target.value)}
                        className="rating-filter"
                    >
                        <option value="all">All Ratings</option>
                        {[5, 4, 3, 2, 1].map(num => (
                            <option key={num} value={num}>{num} Stars</option>
                        ))}
                    </select>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="sort-filter"
                    >
                        <option value="recent">Most Recent</option>
                        <option value="rating">Highest Rating</option>
                        <option value="oldest">Oldest First</option>
                    </select>
                </div>
                {selectedReviews.length > 0 && (
                    <button className="bulk-delete-btn" onClick={handleBulkDelete}>
                        Delete Selected ({selectedReviews.length})
                    </button>
                )}
            </div>

            <div className="reviews-grid">
                {filteredReviews.map(review => (
                    <div key={review._id} className="review-card">
                        <div className="review-header">
                            <div className="user-info">
                                <div className="avatar">
                                    {review.user?.name?.charAt(0) || 'U'}
                                </div>
                                <div className="user-details">
                                    <h3>{review.user?.name || 'Anonymous'}</h3>
                                    <span className="review-date">
                                        {new Date(review.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                            <div className="rating">
                                {renderStars(review.rating)}
                            </div>
                        </div>
                        <div className="review-product">
                            <strong>Product:</strong> {review.product?.name}
                        </div>
                        <div className="review-content">
                            <p>{review.comment}</p>
                        </div>
                        <div className="review-actions">
                            <button 
                                className="delete-btn"
                                onClick={() => handleDelete(review._id)}
                            >
                                <FaTrash /> Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Reviews;
