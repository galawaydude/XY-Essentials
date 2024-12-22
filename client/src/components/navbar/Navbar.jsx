import React from 'react'
import './Navbar.css'
import XYNavLogo from './../../assets/xy essentials_wordmark TR.png'

const Navbar = () => {
    return (
        <div className='navbar'>
            <div className="logo">
                <a href="/">
                <img src={XYNavLogo} alt="" /></a>
            </div>
            <div className="nav-links">
                <div className="nav-link-items">
                    <a className='nav-link-item' style={{fontWeight: window.location.pathname === '/' ? 'bold' : 'normal'}} href='/'>Home</a>
                    <a className='nav-link-item' style={{fontWeight: window.location.pathname === '/shop' ? 'bold' : 'normal'}} href="/shop">Shop</a>
                    <a className='nav-link-item' style={{fontWeight: window.location.pathname === '/about' ? 'bold' : 'normal'}} href="/about">About</a>
                    {/* <a className='nav-link-item' style={{fontWeight: window.location.pathname === '/combos' ? 'bold' : 'normal'}} href="/combos">Combo</a> */}
                    <a className='nav-link-item' style={{fontWeight: window.location.pathname === '/contact' ? 'bold' : 'normal'}} href="/contact">Contact</a>
                </div>
            </div>
            <div className="nav-icons">
                <div className="nav-link-icons">
                    <a className='nav-link-icon' href="/account">      <i className="nav-icon-item far fa-user"></i></a>
                    <a className='nav-link-icon' href="/cart"><i className="fas fa-shopping-cart" ></i></a>
                    {/* <i className="nav-icon-item fas fa-bell"></i> */}
           
                </div>
            </div>

        </div>
    )
}

export default Navbar