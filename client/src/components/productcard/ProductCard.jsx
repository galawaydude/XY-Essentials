import React, { useState } from 'react';
import './productcard.css';
import { Link } from 'react-router-dom';
import Toast from '../toast/Toast';

const ProductCard = ({ product }) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  
  const [showToast, setShowToast] = useState(false);
  const [message, setMessage] = useState('');
  const [buttonText, setButtonText] = useState('Add');

  const handleAddToCart = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          productId: product._id,
          quantity: 1,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add product to cart');
      }

      const data = await response.json();
      console.log('Product added to cart:', data);
      setMessage(`${product.name} added to cart.`);
      setShowToast(true);

      setButtonText('Added');
      setTimeout(() => {
        setButtonText('Add');
      }, 1000);

      setTimeout(() => {
        setMessage('');
        setShowToast(false);
      }, 6000);
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  };

  return (
    <div className="home-product-item">
      <Link to={`/products/${product._id}`} target="_blank" rel="noopener noreferrer" key={product._id}>
        <div className="home-product-img">
          <img src={product.images[0]} alt={product.name} />
        </div>
      </Link>
      <div className="home-product-details">
        <Link to={`/products/${product._id}`} key={product._id}>
          <div className="h-product-title">
            {product.name.length > 40 ? `${product.name.substring(0, 40)}...` : product.name}
          </div>
        </Link>
        <div className="h-product-subtitle">
          {product.description.length > 60 ? `${product.description.substring(0, 60)}...` : product.description}
        </div>
        <div className="h-product-price-cart">
          <div className="h-product-prices">
            <div className="h-p-price">
              ₹{product.price}
            </div>
          </div>
        </div>
        <div className="h-p-cart-btn">
          <Toast action='Added to cart' message={message} show={showToast} onClose={() => setShowToast(false)} />
          <button onClick={handleAddToCart}>
            <i className="fas fa-cart-plus"></i>
            <span>{buttonText}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;

