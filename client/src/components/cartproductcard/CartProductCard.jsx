import React from 'react';
import './cartproductcard.css';

const CartProductCard = ({ product, quantity, onUpdateQuantity, onRemoveFromCart }) => {
    const handleIncrease = () => {
        onUpdateQuantity(product._id, quantity + 1);
    };

    const handleDecrease = () => {
        if (quantity > 1) {
            onUpdateQuantity(product._id, quantity - 1);
        }
    };

    const handleDelete = () => {
        onRemoveFromCart(product._id);
    };

    const totalPrice = product.price * quantity;

    return (
        <div className="cart-product-card">
            <div className="cart-product-details">
                {/* Product Image */}
                <div className="cp-img">
                    <img src={product.images[0]} alt={product.name} />
                </div>

                {/* Product Info Container */}
                <div className="cp-info-container">
                    {/* Price and Name Section */}
                    <div className="cp-main-info">
                        <div className="cp-name">{product.name}</div>
                        <div className="cp-attributes">
                            {product.color && <div>Color: {product.color}</div>}
                            {product.size && <div>Size: {product.size}</div>}
                        </div>
                    </div>

                    {/* Price, Quantity, and Total Section */}
                    <div className="cp-right-section">
                        <div className="cp-price-desktop">₹{product.price}</div>

                        <div className="cp-controls">
                            <div className="cp-counter">
                                <span onClick={handleDecrease}>−</span>
                                <span>{quantity}</span>
                                <span onClick={handleIncrease}>+</span>
                            </div>
                        </div>

                        <div className="cp-total-section">
                            <div className="total-price">₹{totalPrice.toFixed(2)}</div>
                        </div>
                        <span className="cp-dlt-btn" onClick={handleDelete}>
                            <i className="fas fa-trash-alt"></i>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartProductCard;