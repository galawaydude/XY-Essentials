import React, { useState, useEffect } from 'react';
import './account.css';
import AddressModal from '../../../components/address/AddressModal';

const Account = () => {
    const [profile, setProfile] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [orders, setOrders] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editAddressIndex, setEditAddressIndex] = useState(null);

    useEffect(() => {
        // Fetch Profile, Addresses, and Orders
        const fetchProfile = async () => {
            const response = await fetch(`http://localhost:5000/api/users/profile/`, {
                credentials: 'include',
            });
            const data = await response.json();
            setProfile(data);
        };

        const fetchAddresses = async () => {
            const response = await fetch(`http://localhost:5000/api/users/user/addresses`, {
                credentials: 'include',
            });
            const data = await response.json();
            setAddresses(data);
        };

        const fetchOrders = async () => {
            const response = await fetch(`http://localhost:5000/api/users/user/orders`, {
                credentials: 'include',
            });
            const data = await response.json();
            setOrders(Array.isArray(data) ? data : []);
        };

        fetchProfile();
        fetchAddresses();
        fetchOrders();
    }, []);

    const handleAddAddress = (newAddress) => {
        if (editAddressIndex !== null) {
            const updatedAddresses = [...addresses];
            updatedAddresses[editAddressIndex] = newAddress;
            setAddresses(updatedAddresses);
        } else {
            setAddresses([...addresses, newAddress]);
        }
        setIsModalOpen(false); 
        setEditAddressIndex(null); 
    };

    const openAddModal = () => {
        setIsModalOpen(true);
        setEditAddressIndex(null);
    };

    const openEditModal = (index) => {
        setEditAddressIndex(index);
        setIsModalOpen(true);
    };

    return (
        <div className="acc-page">
            {/* Personal Details Section */}
            <section className="acc-section acc-personal-details">
                <h2 className="acc-section-title">Account Information</h2>
                <div className="acc-details-grid">
                    <div>
                        <p className="acc-detail-item">
                            <strong>Name:</strong> {profile.name || 'Not available'}
                        </p>
                        <p className="acc-detail-item">
                            <strong>Email:</strong> {profile.email || 'Not available'}
                        </p>
                        <p className="acc-detail-item">
                            <strong>Phone:</strong> {profile.mobileNumber || 'Not available'}
                        </p>
                    </div>
                    <button className="acc-btn acc-btn-edit">Edit Profile</button>
                </div>
            </section>

            {/* Addresses Section */}
            <section className="acc-section acc-addresses">
                <h2 className="acc-section-title">Saved Addresses</h2>
                <ul className="acc-addresses-list">
                    {addresses.length > 0 ? (
                        addresses.map((address, index) => (
                            <li className="acc-address-item" key={index}>
                                {`${address.fullName || 'Not available'}, ${address.addressLine1 || 'Not available'}, ${address.addressLine2 || 'Not available'}, ${address.landMark || 'Not available'}, ${address.city || 'Not available'}, ${address.state || 'Not available'}, ${address.postalCode || 'Not available'}, ${address.phoneNumber || 'Not available'}`}
                                <button className="acc-btn acc-btn-edit-address" onClick={() => openEditModal(index)}>Edit</button>
                            </li>
                        ))
                    ) : (
                        <li className="acc-address-item"><p>No saved addresses available.</p></li>
                    )}
                </ul>
                <button className="acc-btn acc-btn-add-address" onClick={openAddModal}>
                    Add New Address
                </button>
            </section>

            {/* Past Orders Section */}
            <section className="acc-section acc-past-orders">
                <h2 className="acc-section-title">Past Orders</h2>
                <ul className="acc-orders-list">
                    {orders.length > 0 ? (
                        orders.map(order => (
                            <li className="acc-order-item" key={order._id}>
                                <p className="acc-order-detail"><strong>Order ID:</strong> {order._id}</p>
                                <p className="acc-order-detail"><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                                <p className="acc-order-detail"><strong>Status:</strong> {order.paymentStatus}</p>
                                <p className="acc-order-detail"><strong>Total:</strong> ${order.finalPrice.toFixed(2)}</p>
                                <a href={`/order-details/${order._id}`}>
                                    <button className="acc-btn acc-btn-view-order">View Order</button>
                                </a>
                            </li>
                        ))
                    ) : (
                        <li className="acc-order-item"><p>No past orders available.</p></li>
                    )}
                </ul>
            </section>

            {/* Modal for Adding/Editing Address */}
            <AddressModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleAddAddress}
                initialAddress={editAddressIndex !== null ? addresses[editAddressIndex] : null}
            />
        </div>
    );
};

export default Account;
