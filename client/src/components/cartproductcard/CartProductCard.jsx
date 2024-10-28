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

    return (
        <div className="cart-product-card">
            <div className="cart-product-details">
                {/* Product Info Column */}
                <div className="product-info">
                    <div className="cp-img">
                        <img src={product.images[0]} alt={product.name} />
                    </div>
                    <div className="cp-text">
                        <div className="cp-name">{product.name}</div>
                        <div className="cp-attributes">
                            {product.color && <div>Color: {product.color}</div>}
                            {product.size && <div>Size: {product.size}</div>}
                        </div>
                    </div>
                </div>

                {/* Price Column */}
                <div className="cp-price">
                    ${product.price}
                </div>

                {/* Quantity Column */}
                <div className="cp-counter">
                    <span onClick={handleDecrease}>-</span>
                    <span>{quantity}</span>
                    <span onClick={handleIncrease}>+</span>
                </div>

                {/* Total Price Column */}
                <div className="total-price">
                    ${(product.price * quantity).toFixed(2)}
                    <span className="cp-dlt-btn" onClick={handleDelete}>
                        <i className="fas fa-trash-alt"></i>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default CartProductCard;