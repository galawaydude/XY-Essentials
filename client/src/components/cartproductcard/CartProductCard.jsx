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
                <div className="cp-left">
                    <div className="cp-img-wrapper">
                        <img loading="lazy" src={product.images[0]} alt={product.name} />
                    </div>
                </div>

                <div className="cp-right">
                    <div className="cp-header">
                        <div className="cp-title-section">
                            <h3>{product.name}</h3>
                            <div className="cp-attributes">
                                {product.color && <span>Color: {product.color}</span>}
                                {product.size && <span>Size: {product.size}</span>}
                            </div>
                        </div>
                        <button className="cp-remove" onClick={handleDelete}>
                            <i className="fas fa-trash"></i>
                        </button>
                    </div>

                    <div className="cp-footer">
                        <div className="cp-price">
                            <span className="price-label">Price:</span>
                            <span className="price-amount">₹{product.price}</span>
                        </div>

                        <div className="cp-quantity">
                            <span className="qty-label">Quantity:</span>
                            <div className="qty-controls">
                                <button onClick={handleDecrease}>−</button>
                                <span>{quantity}</span>
                                <button onClick={handleIncrease}>+</button>
                            </div>
                        </div>

                        <div className="cp-total">
                            <span className="total-label">Total:</span>
                            <span className="total-amount">₹{totalPrice.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartProductCard;