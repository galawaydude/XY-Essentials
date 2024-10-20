import React from 'react';
import './cartproductcard.css';

const CartProductCard = ({ product, quantity, onUpdateQuantity, onRemoveFromCart }) => {
    const handleIncrease = () => {
        onUpdateQuantity(product._id, quantity + 1); // Increase quantity
    };

    const handleDecrease = () => {
        if (quantity > 1) {
            onUpdateQuantity(product._id, quantity - 1); // Decrease quantity
        }
    };

    const handleDelete = () => {
        onRemoveFromCart(product._id); // Remove item from cart
    };

    return (
        <div className="cart-product-card">
            <div className="cart-product-details">
                <div className="cp-img">
                    <img src={product.images[0]} alt={product.name} /> {/* Assuming product has an images array */}
                </div>
                <div className="cp-details">
                    <div className='cp-name'>{product.name}</div>
                    <div className="cp-price">${product.price}</div>
                    <div className='cp-options'>
                        <div className="cp-counter">
                            <span onClick={handleIncrease}><i className="fas fa-plus"></i></span>
                            <span>{quantity}</span>
                            <span onClick={handleDecrease}><i className="fas fa-minus"></i></span>
                        </div>
                        <div className="cp-dlt-btn" onClick={handleDelete}>
                            <i className="fas fa-trash-alt"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartProductCard;
