import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from '../../../components/productcard/ProductCard';
import ReviewCard from '../../../components/reviewcard/ReviewCard';
import './productdetails.css';
import { Link } from 'react-router-dom';

const CustomImageSlider = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedThumb, setSelectedThumb] = useState(0);

    const goToNext = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
        setSelectedThumb((prevThumb) =>
            prevThumb === images.length - 1 ? 0 : prevThumb + 1
        );
    };

    const goToPrevious = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
        setSelectedThumb((prevThumb) =>
            prevThumb === 0 ? images.length - 1 : prevThumb - 1
        );
    };

    const handleThumbClick = (index) => {
        setCurrentIndex(index);
        setSelectedThumb(index);
    };

    return (
        <div className="custom-slider">
            <div className="main-image-container">
                <img
                    src={images[currentIndex]}
                    alt={`Product ${currentIndex + 1}`}
                    className="main-image"
                />

                <button
                    onClick={goToPrevious}
                    className="nav-button prev-button"
                    aria-label="Previous image"
                >
                    <i className="fas fa-chevron-left"></i>
                </button>

                <button
                    onClick={goToNext}
                    className="nav-button next-button"
                    aria-label="Next image"
                >
                    <i className="fas fa-chevron-right"></i>
                </button>

                <div className="pagination-dots">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => handleThumbClick(index)}
                            className={`dot ${index === currentIndex ? 'active' : ''}`}
                            aria-label={`Go to image ${index + 1}`}
                        />
                    ))}
                </div>
            </div>

            <div className="thumbnails-container">
                {images.map((img, index) => (
                    <button
                        key={index}
                        onClick={() => handleThumbClick(index)}
                        className={`thumbnail-button ${index === selectedThumb ? 'active' : ''}`}
                    >
                        <img
                            src={img}
                            alt={`Thumbnail ${index + 1}`}
                            className="thumbnail-image"
                        />
                    </button>
                ))}
            </div>
        </div>
    );
};

const ProductDetails = () => {
    const [products, setProducts] = useState([]);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState([]);
    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [rating, setRating] = useState(1);
    const [comment, setComment] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [openDescItems, setOpenDescItems] = useState({});
    const { id: productId } = useParams();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/products/');
                const data = await response.json();
                setProducts(data.slice(0, 4));
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/products/${productId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch product details');
                }
                const data = await response.json();
                setProduct(data);
                setReviews(data.reviews ? data.reviews : []);
            } catch (error) {
                console.error(error);
                setProduct(null);
            } finally {
                setLoading(false);
            }
        };

        fetchProductDetails();
    }, [productId]);

    const handleAddReview = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/products/${productId}/reviews`, {
                credentials: 'include',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ rating, comment }),
            });

            if (!response.ok) {
                throw new Error('Failed to add review');
            }

            const newReview = await response.json();
            setReviews((prevReviews) => [...prevReviews, newReview]);
            setRating(1);
            setComment('');
            setReviewModalOpen(false);
        } catch (error) {
            console.error(error);
        }
    };

    const calculateAverageRating = (reviews) => {
        if (reviews.length === 0) return 0;
        const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
        const average = totalRating / reviews.length;
        return parseFloat(average.toFixed(1));
    };

    const averageRating = calculateAverageRating(reviews);

    const handleOpenReviewModal = () => {
        setReviewModalOpen(true);
    };

    const handleCloseReviewModal = () => {
        setReviewModalOpen(false);
    };

    const handleQuantityChange = (operation) => {
        setQuantity((prevQuantity) => {
            if (operation === 'increment') {
                return prevQuantity + 1;
            } else if (operation === 'decrement' && prevQuantity > 1) {
                return prevQuantity - 1;
            }
            return prevQuantity;
        });
    };

    const handleAddToCart = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    productId: product._id,
                    quantity: quantity,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to add product to cart');
            }

            const data = await response.json();
            console.log('Product added to cart:', data);
        } catch (error) {
            console.error('Error adding product to cart:', error);
        }
    };

    const handleToggleDescItem = (index) => {
        setOpenDescItems((prev) => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!product) {
        return <p>Product not found.</p>;
    }

    return (
        <div className="product-details">
            <div className="text-nav-con container">
                <p>Home &gt; Shop &gt; {product.category}</p>
            </div>
            <div className="product-details-con container section">
                <div className="product-images-con">
                    <CustomImageSlider images={product.images} />
                </div>

                <div className="product-desc-con">
                    <div className="pd-main-deets">
                        <h4 className='pd-title'>{product.name}</h4>
                        <p className='pd-star-rating'>
                            {Array.from({ length: 5 }, (_, index) => (
                                <i
                                    key={index}
                                    className={`fas fa-star ${index < Math.floor(averageRating) ? '' : (index < averageRating ? 'fas fa-star-half-alt' : 'far fa-star')}`}
                                ></i>
                            ))}
                            <span>({product.reviews.length} reviews)</span>
                        </p>
                        <p className='pd-desc'>{product.description}</p>
                    </div>
                    <div className="pd-desc-info">
                        {[
                            { title: "Sizes", content: product.sizes.join(', ') },
                            { title: "Suitable For", content: product.suitableFor.join(', ') },
                            { title: "What Makes It Worth Using", content: product.whatMakesItWorthUsing },
                            { title: "Key Ingredients", content: product.keyIngredients.map((ing) => `${ing.ingredient} (${ing.description})`).join(', ') },
                            { title: "Claims", content: product.claims.join(', ') }
                        ].map((item, index) => (
                            <div key={index} className="pd-desc-item">
                                <div className="pd-desc-item-head" onClick={() => handleToggleDescItem(index)}>
                                    <h6>{item.title}</h6>
                                    <i className={`fas ${openDescItems[index] ? 'fa-angle-up' : 'fa-angle-down'}`}></i>
                                </div>
                                <div className={`pd-desc-content ${openDescItems[index] ? 'open' : ''}`}>
                                    <p>{item.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="product-order-con">
                    <div className="pd-price">
                        <div className="pd-actual-price">
                            ${product.price}
                        </div>
                    </div>
                    <div className="pd-quantity">
                        <div className='pd-quantity-head'>Quantity</div>
                        <div className="pd-quantity-counter">
                            <button onClick={() => handleQuantityChange('decrement')}>-</button>
                            <p className='pd-quantity-num'>{quantity}</p>
                            <button onClick={() => handleQuantityChange('increment')}>+</button>
                        </div>
                    </div>

                    <div className="pd-btns">
                        <div className="pd-cart-btn">
                            <button onClick={handleAddToCart}>
                                <span>Add to Cart</span>
                            </button>
                        </div>
                    </div>

                    <div className="pd-service-features">
                        <div className="pd-sf-item">
                            <div className="pd-sf-icon">
                                <i className="fas fa-shipping-fast"></i>
                            </div>
                            <div className="pd-sf-text">Free Shipping</div>
                        </div>
                        <div className="pd-sf-item">
                            <div className="pd-sf-icon">
                                <i className="fas fa-money-check-alt"></i>
                            </div>
                            <div className="pd-sf-text">Money-back Guarantee</div>
                        </div>
                        <div className="pd-sf-item">
                            <div className="pd-sf-icon">
                                <i className="fas fa-truck"></i>
                            </div>
                            <div className="pd-sf-text">Fast Delivery</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="section container">
                <div className="home-pro-head">
                    <div className="section_left_title">
                        Recommended For <strong>You</strong>
                    </div>
                    <div className="view-all-btn">
                        <span>View All</span>
                        <i className="fas fa-arrow-right"></i>
                    </div>
                </div>
                <hr />
                <div className="home-products-con">
                    {products.map(product => (
                        <ProductCard product={product} key={product._id} />
                    ))}
                </div>
            </div>

            <div className="section container">
                <div className="home-pro-head">
                    <div className="section_left_title">
                        All <strong>Reviews</strong>
                    </div>
                    <div className="add-review-btn">
                        <button onClick={handleOpenReviewModal}>Add Review</button>
                    </div>
                </div>
                <div className="review-summary">
                    <div className="review-summary-average">
                        <span className="average-rating">{averageRating}</span>
                        <div className="average-stars">
                            {Array.from({ length: 5 }, (_, index) => (
                                <i
                                    key={index}
                                    className={`fas fa-star ${index < Math.floor(averageRating)
                                        ? ''
                                        : index < averageRating
                                            ? 'fas fa-star-half-alt'
                                            : 'far fa-star'
                                        }`}
                                ></i>
                            ))}
                        </div>
                        <span className="total-reviews">Based on {reviews.length} reviews</span>
                    </div>
                    <div className="review-summary-bars">
                        {[5, 4, 3, 2, 1].map((stars) => {
                            const count = reviews.filter(review => review.rating === stars).length;
                            const percentage = (count / reviews.length) * 100 || 0;

                            return (
                                <div key={stars} className="rating-bar-row">
                                    <span className="star-label">{stars} stars</span>
                                    <div className="rating-bar-container">
                                        <div
                                            className="rating-bar-fill"
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="pd-reviews">
                    <div className="pd-reviews-con">
                        {reviews.map((review) => (
                            <ReviewCard key={review._id} review={review} />
                        ))}
                    </div>
                </div>
            </div>

            {reviewModalOpen && (
                <div className="review-modal">
                    <div className="modal-content">
                        <span className="close" onClick={handleCloseReviewModal}>&times;</span>
                        <h2>Add Your Review</h2>
                        <div className="modal-rating-container">
                            <label>Rating:</label>
                            <div className="star-rating">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <i
                                        key={star}
                                        className={`rating-star ${star <= rating ? 'fas fa-star' : 'far fa-star'
                                            }`}
                                        onClick={() => setRating(star)}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className='modal-comment-con'>
                            <label>Comment:</label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            ></textarea>
                        </div>
                        <button onClick={handleAddReview}>Submit Review</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetails;