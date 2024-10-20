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
    const [reviews, setReviews] = useState(null);
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
                setReviews(data.reviews? data.reviews : []);
            } catch (error) {
                console.error(error);
                setProduct(null); 
            } finally {
                setLoading(false);
            }
        };

        fetchProductDetails();
    }, [productId]);

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
                                    className={`fas fa-star ${index < Math.floor(product.rating) ? '' : (index < product.rating ? 'fas fa-star-half-alt' : 'far fa-star')}`}
                                ></i>
                            ))}
                            <span>({product.reviews.length} reviews)</span>
                        </p>
                        <p className='pd-desc'>{product.description}</p>
                    </div>
                    <div className="pd-desc-info">
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
                        {/* If there's a strike price, uncomment this */}
                        {/* <div className="pd-strike-price">
                            $102
                        </div> */}
                    </div>
                    <div className="pd-quatity">
                        <div className='pd-quantity-head'>Quantity</div>
                        <div className="pd-quantity-counter">
                            <button>-</button>
                            <p className='pd-quantity-num'>1</p>
                            <button>+</button>
                        </div>
                    </div>

                    <div className="pd-divider"></div>

                    <div className="pd-btns">
                        <div className="pd-cart-btn">
                            <button>
                                <span>Add to Cart</span>
                            </button>
                        </div>
                        <div className="pd-buy-btn">
                            <button>
                                <span>Buy Now</span>
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
                  
  <ProductCard product={product} key={product._id}/>


                    ))}
                </div>
            </div>
            <div className="section container">
                <div className="home-pro-head">
                    <div className="section_left_title">
                        All <strong>Reviews</strong>
                    </div>
                </div>
                <hr />
                <div className="pd-reviews">
                    <div className="pd-reviews-con">
                        {reviews.map(review => (
                            <ReviewCard key={review._id} review={review} /> // Assuming ReviewCard accepts a review prop
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetails;
