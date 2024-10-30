import React, { useEffect, useState } from 'react';
import './cart.css';
import CartProductCard from '../../components/cartproductcard/CartProductCard';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/users/user/cart', {   
                    credentials: 'include',
                });
    
                if (response.ok) {
                    const data = await response.json();
                    console.log('Fetched cart items:', data.cartItems); 
                    setCartItems(data.cartItems);
                    const initialSelectedItems = {};
                    data.cartItems.forEach(item => {
                        initialSelectedItems[item.product._id] = true; 
                    });
                    setSelectedItems(initialSelectedItems);
                } else {
                    const errorData = await response.json();
                    console.error('Failed to fetch cart:', errorData);
                }
            } catch (error) {
                console.error('Error fetching cart:', error);
            }
        };
    
        fetchCart();
    }, []);

    const updateQuantity = async (productId, newQuantity) => {
        if (newQuantity < 1) return;
        try {
            const response = await fetch(`http://localhost:5000/api/cart/${productId}`, {
                method: 'PUT',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ quantity: newQuantity }),
            });

            if (response.ok) {
                setCartItems((prevItems) =>
                    prevItems.map((item) =>
                        item.product._id === productId ? { ...item, quantity: newQuantity } : item
                    )
                );
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
                setCartItems((prevItems) => prevItems.filter((item) => item.product._id !== productId));
            }
        } catch (error) {
            console.error('Error removing item:', error);
        }
    };

    const calculateSubtotal = () => {
        return cartItems
            .filter(item => selectedItems[item.product._id])
            .reduce((total, item) => total + (item.product.price * item.quantity), 0);
    };

    const handleCheckout = () => {
        const checkoutItems = cartItems.filter(item => selectedItems[item.product._id]);
        if (checkoutItems.length === 0) {
            alert("Please select at least one item to proceed to checkout.");
            return;
        }
        navigate('/checkout', { state: { checkoutItems } });
    };

    const handleCheckboxChange = (productId) => {
        setSelectedItems((prev) => ({
            ...prev,
            [productId]: !prev[productId],
        }));
    };

    return (
        <div className="cart">
            <div className="container">
                <div className="home-pro-head">
                    <div className="section_left_title">Shopping Cart</div>
                    <div className="items-count">{cartItems.length} items in your bag.</div>
                </div>
                <div className="cart-product-summary">
                    <div className="cart-products-con">
                        <div className="cart-header">
                            <span>Product</span>
                            <span>Price</span>
                            <span>Quantity</span>
                            <span>Total Price</span>
                        </div>
                        {cartItems.map((item) => (
                            <div key={item.product._id} className="cart-item-container">
                                <input
                                    type="checkbox"
                                    className="cart-item-checkbox"
                                    checked={!!selectedItems[item.product._id]}
                                    onChange={() => handleCheckboxChange(item.product._id)}
                                />
                                <CartProductCard 
                                    product={item.product} 
                                    quantity={item.quantity}
                                    onUpdateQuantity={updateQuantity}
                                    onRemoveFromCart={removeFromCart}
                                />
                            </div>
                        ))}
                    </div>
                    <div className="cart-summary-con">
                        <h3>Cart Total</h3>
                        <div className="total-con">
                            {/* <span>Total</span> */}
                            <span className='cart-price'>₹{calculateSubtotal().toFixed(2)}</span>
                        </div>
                        <button className="checkout-button" onClick={handleCheckout}>
                            Checkout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;