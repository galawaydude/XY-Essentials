import React, { useState } from 'react'
import XYNavLogo from './../../assets/xy essentials_wordmark TR.png'
import Sidebar from '../sidebar/Sidebar'
import './Navbar.css'
import { useEffect } from'react';

const Navbar = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/user/cart`, {
                    credentials: 'include',
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log('Fetched cart items:', data.cartItems);
                    setCartItems(data.cartItems);
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

    const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <>
            <div className='navbar'>
                <div className="mobile-menu">
                    <i className="fa-solid fa-bars" onClick={() => setSidebarOpen(true)}></i>
                </div>
                <div className="logo">
                    <a href="/">
                        <img src={XYNavLogo} alt="" /></a>
                </div>
                <div className="nav-links">
                    <div className="nav-link-items">
                        <a className='nav-link-item' style={{ fontWeight: window.location.pathname === '/' ? 'bold' : 'normal' }} href='/'>Home</a>
                        <a className='nav-link-item' style={{ fontWeight: window.location.pathname === '/shop' ? 'bold' : 'normal' }} href="/shop">Shop</a>
                        <a className='nav-link-item' style={{ fontWeight: window.location.pathname === '/blogs' ? 'bold' : 'normal' }} href="/blogs">Blogs</a>
                        <a className='nav-link-item' style={{ fontWeight: window.location.pathname === '/about' ? 'bold' : 'normal' }} href="/about">About</a>
                        {/* <a className='nav-link-item' style={{fontWeight: window.location.pathname === '/combos' ? 'bold' : 'normal'}} href="/combos">Combo</a> */}
                        {/* <a className='nav-link-item' style={{fontWeight: window.location.pathname === '/contact' ? 'bold' : 'normal'}} href="/contact">Contact</a> */}
                    </div>
                </div>
                <div className="nav-icons">
                    <div className="nav-link-icons">
                        <a className='nav-link-icon' href="/cart" data-toggle="tooltip" data-placement="bottom" title="My Cart" ><i className="fas fa-shopping-cart" ></i></a>
                        <span className='nav-icon-divider'> | </span>
                        <a className='nav-link-icon' href="/account" >
                            <i className="nav-icon-item far fa-user" data-toggle="tooltip" data-placement="bottom" title="My Account" ></i>
                        </a>
                        {/* <i className="nav-icon-item fas fa-bell"></i> */}

                    </div>
                </div>
            </div>
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        </>
    )
}

export default Navbar