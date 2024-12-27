import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
    FaBox, FaBlog, FaTicketAlt, FaShoppingCart, FaTachometerAlt, 
    FaBars, FaTimes, FaUsers, FaChartLine, FaPlus, FaEdit,
    FaChevronDown, FaChevronRight, FaTags, FaShippingFast,
    FaComments, FaCog, FaUserCog, FaClipboardList
} from 'react-icons/fa';
import './sidebar.css';

const Sidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [expandedGroups, setExpandedGroups] = useState([
        'Overview',
        'Products',
        'Orders',
        'Blogs',
        'Marketing',
        'Administration',
    ]);

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);
    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    
    const toggleGroup = (groupName) => {
        setExpandedGroups(prev => 
            prev.includes(groupName) 
                ? prev.filter(g => g !== groupName)
                : [...prev, groupName]
        );
    };

    const navGroups = [
        {
            name: 'Overview',
            items: [
                { path: '/', name: 'Dashboard', icon: <FaTachometerAlt /> },
                // { path: '/admin/analytics', name: 'Analytics', icon: <FaChartLine /> },
            ]
        },
        {
            name: 'Products',
            items: [
                { path: '/admin/inventory', name: 'All Products', icon: <FaBox /> },
                { path: '/admin/add-product', name: 'Add Product', icon: <FaPlus /> },
                // { path: '/admin/edit-product', name: 'Edit Product', icon: <FaPlus /> },
                // { path: '/admin/categories', name: 'Categories', icon: <FaTags /> },
                // { path: '/admin/combos', name: 'Combos', icon: <FaClipboardList /> }
            ]
        },
        {
            name: 'Orders',
            items: [
                { path: '/admin/orders', name: 'All Orders', icon: <FaShoppingCart /> },
                // { path: '/admin/pending-orders', name: 'Pending', icon: <FaClipboardList /> },
                // { path: '/admin/shipping', name: 'Shipping', icon: <FaShippingFast /> }
            ]
        },
        {
            name: 'Blogs',
            items: [
                { path: '/admin/blogs', name: 'Blogs', icon: <FaBlog /> },
                { path: '/admin/add-blog', name: 'Add Blog', icon: <FaPlus /> },
            ]
        },
        {
            name: 'Marketing',
            items: [
                { path: '/admin/coupons', name: 'Coupons', icon: <FaTicketAlt /> },
                { path: '/admin/reviews', name: 'Reviews', icon: <FaComments /> }
            ]
        },
        {
            name: 'Administration',
            items: [
                { path: '/admin/users', name: 'Users', icon: <FaUsers /> },
            ]
        }
    ];

    return (
        <>
            <div className="mobile-toggle" onClick={toggleMobileMenu}>
                {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </div>

            <nav className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
                <div className="sidebar-header">
                    <h2 className="sidebar-title">
                        {isCollapsed ? '' : 'XY Essentials'}
                    </h2>
                    <button className="collapse-btn" onClick={toggleSidebar}>
                        <FaBars />
                    </button>
                </div>

                <div className="nav-links">
                    {navGroups.map((group) => (
                        <div key={group.name} className="nav-group">
                            <div 
                                className="nav-group-header"
                                onClick={() => !isCollapsed && toggleGroup(group.name)}
                            >
                                <span className="nav-group-name">
                                    {!isCollapsed && group.name}
                                </span>
                                {!isCollapsed && (
                                    <span className="nav-group-icon">
                                        {expandedGroups.includes(group.name) ? 
                                            <FaChevronDown /> : <FaChevronRight />}
                                    </span>
                                )}
                            </div>
                            <div className={`nav-group-items ${
                                isCollapsed ? 'collapsed' : 
                                expandedGroups.includes(group.name) ? 'expanded' : ''
                            }`}>
                                {group.items.map((item) => (
                                    <NavLink
                                        key={item.path}
                                        to={item.path}
                                        className={({ isActive }) => 
                                            `nav-link ${isActive ? 'active' : ''}`
                                        }
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        title={isCollapsed ? item.name : ''}
                                    >
                                        <span className="nav-icon">{item.icon}</span>
                                        <span className="nav-text">
                                            {!isCollapsed && item.name}
                                        </span>
                                    </NavLink>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </nav>
        </>
    );
};

export default Sidebar;

