import React, { useEffect, useState } from 'react';
import './productdetails.css';
import { useParams } from 'react-router-dom';
import ProductCard from '../../../components/productcard/ProductCard';
import ReviewCard from '../../../components/reviewcard/ReviewCard';
import { Link } from 'react-router-dom'

const ProductDetails = () => {
    const [products, setProducts] = useState([]);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState([]);
    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [rating, setRating] = useState(1);
    const [comment, setComment] = useState('');
    const [quantity, setQuantity] = useState(1); // State for quantity
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
            setRating(1); // Reset rating
            setComment(''); // Reset comment
            setReviewModalOpen(false); // Close the modal
        } catch (error) {
            console.error(error);
        }
    };


    const calculateAverageRating = (reviews) => {
        if (reviews.length === 0) return 0; // Return 0 if no reviews
        const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
        const average = totalRating / reviews.length;
        return parseFloat(average.toFixed(1)); // Return average with one decimal place
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
                    <div className="product-view-img">
                        <img src={product.images[0]} alt={product.name} />
                    </div>
                    <div className="product-allimg-con">
                        {product.images.map((img, index) => (
                            <img key={index} src={img} alt={`${product.name} ${index + 1}`} />
                        ))}
                    </div>
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
                        <div className="pd-desc-item">
                            <div className="pd-desc-item-head">
                                <h6>Sizes</h6>
                                <i className="fas fa-angle-up"></i>
                            </div>
                            <p className='pd-desc'>{product.sizes.join(', ')}</p>
                        </div>
                        <div className="pd-desc-item">
                            <div className="pd-desc-item-head">
                                <h6>Suitable For</h6>
                                <i className="fas fa-angle-up"></i>
                            </div>
                            <p className='pd-desc'>{product.suitableFor.join(', ')}</p>
                        </div>
                        <div className="pd-desc-item">
                            <div className="pd-desc-item-head">
                                <h6>What Makes It Worth Using</h6>
                                <i className="fas fa-angle-up"></i>
                            </div>
                            <p className='pd-desc'>{product.whatMakesItWorthUsing}</p>
                        </div>
                        <div className="pd-desc-item">
                            <div className="pd-desc-item-head">
                                <h6>Key Ingredients</h6>
                                <i className="fas fa-angle-up"></i>
                            </div>
                            <p className='pd-desc'>
                                {product.keyIngredients.map((ing) => `${ing.ingredient} (${ing.description})`).join(', ')}
                            </p>
                        </div>
                        <div className="pd-desc-item">
                            <div className="pd-desc-item-head">
                                <h6>Claims</h6>
                                <i className="fas fa-angle-up"></i>
                            </div>
                            <p className='pd-desc'>{product.claims.join(', ')}</p>
                        </div>
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

                    {/* <div className="pd-divider"></div> */}

                    <div className="pd-btns">
                        <div className="pd-cart-btn">
                            <button onClick={handleAddToCart}>
                                <span>Add to Cart</span>
                            </button>
                        </div>
                        {/* <div className="pd-buy-btn">
                                <button>
                                    <span>Buy Now</span>
                                </button>
                            </div> */}
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
                <hr />
                <div className="pd-reviews">
                    <div className="pd-reviews-con">
                        {reviews.map((review) => (
                            <ReviewCard key={review._id} review={review} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Review Modal */}
            {reviewModalOpen && (
                <div className="review-modal">
                    <div className="modal-content">
                        <span className="close" onClick={handleCloseReviewModal}>&times;</span>
                        <h2>Add Your Review</h2>
                        <div>
                            <label>Rating:</label>
                            <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <option key={star} value={star}>{star}</option>
                                ))}
                            </select>
                        </div>
                        <div>
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
}

export default ProductDetails;