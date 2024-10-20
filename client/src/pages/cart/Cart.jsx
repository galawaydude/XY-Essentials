import React, { useEffect, useState } from 'react';
import './cart.css';
import CartProductCard from '../../components/cartproductcard/CartProductCard';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/cart', {
                    credentials: 'include', // Include cookies for authentication
                });
                if (response.ok) {
                    const data = await response.json();
                    setCartItems(data.cartItems);
                } else {
                    console.error('Failed to fetch cart:', await response.json());
                }
            } catch (error) {
                console.error('Error fetching cart:', error);
            }
        };

        fetchCart();
    }, []);

    const updateQuantity = async (productId, newQuantity) => {
        if (newQuantity < 1) return; // Prevent setting quantity to less than 1
        try {
            const response = await fetch(`http://localhost:5000/api/cart/${productId}`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ quantity: newQuantity }),
            });

            if (response.ok) {
                // Update local state
                setCartItems((prevItems) =>
                    prevItems.map((item) =>
                        item.product._id === productId ? { ...item, quantity: newQuantity } : item
                    )
                );
            } else {
                console.error('Failed to update quantity:', await response.json());
            }
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    };

    const removeFromCart = async (productId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/cart/${productId}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (response.ok) {
                // Remove item from local state
                setCartItems((prevItems) => prevItems.filter((item) => item.product._id !== productId));
            } else {
                console.error('Failed to remove item:', await response.json());
            }
        } catch (error) {
            console.error('Error removing item:', error);
        }
    };

    return (
        <div className="cart">
            <div className="section container">
                <div className="home-pro-head">
                    <div className="section_left_title">
                        <strong>Cart</strong>
                    </div>
                </div>
                <hr />
            </div>

            <div className="cart-product-summary container">
                <div className="cart-products-con">
                    {cartItems.map((item) => (
                        <CartProductCard 
                            key={item.product._id} 
                            product={item.product} 
                            quantity={item.quantity}
                            onUpdateQuantity={updateQuantity}
                            onRemoveFromCart={removeFromCart}
                        />
                    ))}
                </div>
                <div className="cart-summary-con"></div>
            </div>
        </div>
    );
};

export default Cart;
