import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AddressModal from '../../../components/address/AddressModal';
import EditProfileModal from '../../../components/editprofile/editprofile';
import './account.css';

const Account = () => {
    const [profile, setProfile] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [orders, setOrders] = useState([]);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editAddressIndex, setEditAddressIndex] = useState(null);
    const [defaultAddressId, setDefaultAddressId] = useState(null);

    useEffect(() => {
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
            // Set the first address as default if none is set
            const defaultAddress = data.find(address => address.isDefault);
            if (defaultAddress) {
                setDefaultAddressId(defaultAddress._id);
            }
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

    const handleSetDefault = async (addressId) => {
        console.log('Setting default address to:', addressId);
        
        try {
            const response = await fetch(`http://localhost:5000/api/addresses/${addressId}/set-default`, {
                method: 'PUT',
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Failed to update default address');
            }
            console.log('Default address updated successfully');
            setDefaultAddressId(addressId);
        } catch (error) {
            console.error('Error while setting default address:', error);
        }
    };

    const openAddModal = () => {
        setIsModalOpen(true);
        setEditAddressIndex(null);
    };

    const openEditModal = (index) => {
        setEditAddressIndex(index);
        setIsModalOpen(true);
    };

    const handleProfileUpdate = (updatedProfile) => {
        setProfile(updatedProfile);
    };

    return (
        <div className="acc-page con1">
            {/* Personal Details Section */}
            <section className="acc-section acc-personal-details">
                <h2 className="acc-section-title">Account Information</h2>
                <div className="acc-details-grid">
                    <div className="acc-details-info">
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
                    <div className="acc-buttons-container">
                        <button
                            className="acc-btn acc-btn-edit"
                            onClick={() => setIsProfileModalOpen(true)} // Add onClick handler
                        >
                            <i className="fa-regular fa-user"></i>
                            Edit Profile
                        </button>
                        <button
                            className="acc-btn acc-btn-orders"
                            onClick={() => window.location.href = "/orders"}
                        >
                            <i className="fa-solid fa-clipboard-list"></i>
                            Your Orders
                        </button>
                    </div>
                </div>
            </section>

            {/* Addresses Section */}
            <section className="acc-section acc-addresses">
                <h2 className="acc-section-title">Saved Addresses</h2>
                <ul className="acc-addresses-list">
                    {addresses.length > 0 ? (
                        addresses.map((address, index) => (
                            <li
                                className={`acc-address-item ${address._id === defaultAddressId ? 'default-address' : ''}`}
                                key={index}
                            >
                                <div className="acc-address-content">
                                    <div className="acc-address-text">
                                        {`${address.fullName || 'Not available'}, ${address.addressLine1 || 'Not available'}, ${address.addressLine2 || 'Not available'}, ${address.landMark || 'Not available'}, ${address.city || 'Not available'}, ${address.state || 'Not available'}, ${address.postalCode || 'Not available'}, ${address.phoneNumber || 'Not available'}`}
                                        {address._id === defaultAddressId && (
                                            <div className="text-sm text-blue-600 font-medium mt-2 def-label">Default</div>
                                        )}
                                    </div>
                                    <div className="acc-address-actions">
                                        {address._id !== defaultAddressId && (
                                            <button
                                                className="acc-btn acc-btn-default"
                                                onClick={() => handleSetDefault(address._id)}
                                            >
                                                Set as Default
                                            </button>
                                        )}
                                        <button
                                            className="acc-btn acc-btn-edit-address"
                                            onClick={() => openEditModal(index)}
                                            aria-label="Edit address"
                                        >
                                            <i className="fa-solid fa-pen-to-square"></i>
                                        </button>
                                    </div>
                                </div>
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

            {/*EditProfileModal */}
            <EditProfileModal
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
                onSave={handleProfileUpdate}
                currentUser={profile}
            />

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
