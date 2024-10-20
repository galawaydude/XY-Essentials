import React from 'react'
import './Navbar.css'

const Navbar = () => {
    return (
        <div className='navbar'>
            <div className="logo">
                <a href="/"><strong>XY Essentials</strong></a>
            </div>
            <div className="nav-links">
                <div className="nav-link-items">
                    <a className='nav-link-item' href='/'>Home</a>
                    <a className='nav-link-item' href="/shop">Shop</a>
                    <a className='nav-link-item' href="/about">About</a>
                    <a className='nav-link-item' href="/gifts">Gifts</a>
                    <a className='nav-link-item' href="/contact">Contact</a>
                </div>
            </div>
            <div className="nav-icons">
                <div className="nav-link-icons">
                    <i className="nav-icon-item fas fa-bell"></i>
                    <i className="nav-icon-item far fa-user"></i>
                </div>
            </div>
       </div>
    )
}

export default Navbar