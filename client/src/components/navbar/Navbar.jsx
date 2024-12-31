import React, { useState } from 'react'
import XYNavLogo from './../../assets/xy essentials_wordmark TR.png'
import Sidebar from '../sidebar/Sidebar'
import './Navbar.css'

const Navbar = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const apiUrl = import.meta.env.VITE_API_URL;
    
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
                        <a className='nav-link-item' style={{fontWeight: window.location.pathname === '/' ? 'bold' : 'normal'}} href='/'>Home</a>
                        <a className='nav-link-item' style={{fontWeight: window.location.pathname === '/shop' ? 'bold' : 'normal'}} href="/shop">Shop</a>
                        <a className='nav-link-item' style={{fontWeight: window.location.pathname === '/blogs' ? 'bold' : 'normal'}} href="/blogs">Blogs</a>
                        <a className='nav-link-item' style={{fontWeight: window.location.pathname === '/about' ? 'bold' : 'normal'}} href="/about">About</a>
                        {/* <a className='nav-link-item' style={{fontWeight: window.location.pathname === '/combos' ? 'bold' : 'normal'}} href="/combos">Combo</a> */}
                        {/* <a className='nav-link-item' style={{fontWeight: window.location.pathname === '/contact' ? 'bold' : 'normal'}} href="/contact">Contact</a> */}
                    </div>
                </div>
                <div className="nav-icons">
                    <div className="nav-link-icons">
                        <a className='nav-link-icon' href="/account">      <i className="nav-icon-item far fa-user"></i></a>
                        <span className='nav-icon-divider'> | </span>
                        <a className='nav-link-icon' href="/cart"><i className="fas fa-shopping-cart" ></i></a>
                        {/* <i className="nav-icon-item fas fa-bell"></i> */}
               
                    </div>
                </div>
            </div>
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        </>
    )
}

export default Navbar