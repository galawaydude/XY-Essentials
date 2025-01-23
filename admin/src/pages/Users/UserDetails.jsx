import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaShoppingBag, FaClock, FaStar, FaEdit } from 'react-icons/fa';
import './UserDetails.css';

const UserDetails = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchUserDetails();
    }, [id]);

    const fetchUserDetails = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${id}`, {
                credentials: 'include'
            });
            const data = await response.json();
            setUser(data);
        } catch (error) {
            setError('Failed to fetch user details');
        }
        setLoading(false);
    };

    const handleRoleUpdate = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${id}/role`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ isAdmin: !user.isAdmin })
            });

            if (response.ok) {
                const updatedUser = await response.json();
                setUser(updatedUser);
                setIsEditing(false);
            }
        } catch (error) {
            setError('Failed to update user role');
        }
    };

    if (loading) return <div className="loading-spinner">Loading user details...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (!user) return <div className="error-message">User not found</div>;

    return (
        <div className="user-details-container">
            <div className="user-header">
                <div className="user-header-info">
                    <div className="user-avatar">
                        {/* {user.pfp ? (
                            <img loading="lazy" src={user.pfp} alt={user.name} />
                        ) : ( */}
                            <FaUser className="default-avatar" />
                      
                    </div>
                    <div className="user-header-text">
                        <h1>{user.name}</h1>
                        <p className="user-meta">
                            <span><FaEnvelope /> {user.email}</span>
                            <span><FaPhone /> {user.mobileNumber || 'Not provided'}</span>
                            <span><FaClock /> Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                        </p>
                    </div>
                </div>
                <div className="user-stats">
                    <div className="stat-card">
                        <h3>{user.orders?.length || 0}</h3>
                        <p>Total Orders</p>
                    </div>
                    <div className="stat-card">
                        <h3>{user.addresses?.length || 0}</h3>
                        <p>Saved Addresses</p>
                    </div>
                </div>
            </div>

            <div className="user-content">
                {/* <div className="content-tabs">
                    <button 
                        className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        Overview
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
                        onClick={() => setActiveTab('orders')}
                    >
                        Orders
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === 'addresses' ? 'active' : ''}`}
                        onClick={() => setActiveTab('addresses')}
                    >
                        Addresses
                    </button>
                </div> */}

                <div className="tab-content">
                    {activeTab === 'overview' && (
                        <div className="overview-tab">
                            <div className="quick-stats">
                                <h2>Account Overview</h2>
                                <div className="stats-grid">
                                    {/* <div className="stat-item">
                                        <span className="stat-label">Account Status</span>
                                        <span className={`stat-value ${user.isActive ? 'active' : 'inactive'}`}>
                                            {user.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </div> */}
                                    <div className="stat-item">
                                        <span className="stat-label">Role</span>
                                        <div className="stat-value-with-action">
                                            {isEditing ? (
                                                <>
                                                    <select 
                                                        value={user.isAdmin ? 'admin' : 'customer'}
                                                        onChange={() => handleRoleUpdate()}
                                                    >
                                                        <option value="customer">Customer</option>
                                                        <option value="admin">Admin</option>
                                                    </select>
                                                    <button onClick={() => setIsEditing(false)}>Cancel</button>
                                                </>
                                            ) : (
                                                <>
                                                    <span>{user.isAdmin ? 'Admin' : 'Customer'}</span>
                                                    <button className="edit-button" onClick={() => setIsEditing(true)}>
                                                        <FaEdit />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-label">Last Order</span>
                                        <span className="stat-value">
                                            {user.orders?.length > 0 
                                                ? new Date(user.orders[user.orders.length - 1].createdAt).toLocaleDateString()
                                                : 'No orders yet'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'orders' && (
                        <div className="orders-tab">
                            <h2>Order History</h2>
                            {user.orders && user.orders?.length > 0 ? (
                                <div className="orders-grid">
                                    {user.orders.map(order => (
                                        <div key={order._id} className="order-card">
                                            <div className="order-header">
                                                <h3>Order #{order._id.slice(-6)}</h3>
                                                <span className={`order-status ${order.status}`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                            <div className="order-details">
                                                <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                                                <p>Items: {order.items?.length}</p>
                                                <p>Total: ₹{order.totalAmount}</p>
                                            </div>
                                            <Link to={`/admin/orders/${order._id}`} className="view-order-btn">
                                                View Details
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="no-data">No orders found</p>
                            )}
                        </div>
                    )}

                    {activeTab === 'addresses' && (
                        <div className="addresses-tab">
                            <h2>Saved Addresses</h2>
                            {user.addresses && user.addresses.length > 0 ? (
                                <div className="addresses-grid">
                                    {user.addresses.map(address => (
                                        <div key={address._id} className={`address-card ${address.isDefault ? 'default' : ''}`}>
                                            {address.isDefault && <span className="default-badge">Default</span>}
                                            <h3>{address.fullName}</h3>
                                            <p>{address.addressLine1}</p>
                                            <p>{address.addressLine2}</p>
                                            <p>{address.landmark}</p>
                                            <p>{address.city}, {address.state} {address.pincode}</p>
                                            <p>Phone: {address.phone}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="no-data">No addresses found</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserDetails;
