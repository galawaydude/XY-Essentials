import React from 'react'
import './Sidebar.css'

const Sidebar = ({ isOpen, onClose }) => {
    return (
        <div className={`sidebar-overlay ${isOpen ? 'active' : ''}`} onClick={onClose}>
            <div className={`sidebar ${isOpen ? 'active' : ''}`} onClick={e => e.stopPropagation()}>
                <div className="sidebar-header">
                    <i className="fas fa-times close-btn" onClick={onClose}></i>
                </div>
                <div className="sidebar-links">
                    <a className='sidebar-link' href='/'>Home</a>
                    <a className='sidebar-link' href="/shop">Shop</a>
                    <a className='sidebar-link' href="/blogs">Blogs</a>
                    <a className='sidebar-link' href="/about">About</a>
                </div>
            </div>
        </div>
    )
}

export default Sidebar
