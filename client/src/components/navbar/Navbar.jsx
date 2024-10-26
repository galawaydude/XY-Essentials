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
                    {/* <a className='nav-link-item' href="/combos">Combo</a> */}
                    <a className='nav-link-item' href="/contact">Contact</a>
                </div>
            </div>
            <div className="nav-icons">
                <div className="nav-link-icons">
                    <a className='nav-link-icon' href="/cart"><i className="fas fa-shopping-cart" ></i></a>
                    {/* <i className="nav-icon-item fas fa-bell"></i> */}
                    <a className='nav-link-icon' href="/account">      <i className="nav-icon-item far fa-user"></i></a>
              
                </div>
            </div>
       </div>
    )
}

export default Navbar