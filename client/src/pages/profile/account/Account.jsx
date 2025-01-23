import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AddressModal from '../../../components/newaddress/AddressModal';  // Fixed import
import EditAddressModal from '../../../components/editaddress/EditAddressModal';
import EditProfileModal from '../../../components/editprofile/EditProfile';
import './account.css';

const Account = () => {
    const navigate = useNavigate();  
    const apiUrl = import.meta.env.VITE_API_URL;
    const [profile, setProfile] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [orders, setOrders] = useState([]);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [addressToEdit, setAddressToEdit] = useState(null);
    const [defaultAddressId, setDefaultAddressId] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/profile/`, {
                credentials: 'include',
            });
            const data = await response.json();
            setProfile(data);

            if (!response.ok) {
                navigate('/login');
                console.error('Failed to fetch profile');
            }
        };

        const fetchAddresses = async () => {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/user/addresses`, {
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
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/user/orders`, {
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
        setAddresses([...addresses, newAddress]);
        setIsAddModalOpen(false);
    };

    const handleEditAddress = (updatedAddress) => {
        const updatedAddresses = addresses.map(addr =>
            addr._id === updatedAddress._id ? updatedAddress : addr
        );
        setAddresses(updatedAddresses);
        setIsEditModalOpen(false);
        setAddressToEdit(null);
    };

    const handleSetDefault = async (addressId) => {
        console.log('Setting default address to:', addressId);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/addresses/${addressId}/set-default`, {
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

    const handleDeleteAddress = async (addressId) => {
        try {
            const response = await fetch(`${apiUrl}/api/users/user/addresses/${addressId}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Failed to delete address');
            }
            // Remove the address from the state
            setAddresses(addresses.filter(addr => addr._id !== addressId));
        } catch (error) {
            console.error('Error deleting address:', error);
        }
    };

    const handleLogout = async () => {
        console.log('Logging out...');
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {
                method: 'POST',
                credentials: 'include',
            });
            if (!response.ok) {
                console.error('Failed to log out:', response.status, response.statusText);
                throw new Error('Failed to log out');
            }
    
            // Clear user info and navigate after successful logout
            console.log('Logged out successfully');
            localStorage.removeItem('user-info');
            navigate('/');
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };
    

    const openAddModal = () => {
        setIsAddModalOpen(true);
    };

    const openEditModal = (address) => {
        setAddressToEdit(address);
        setIsEditModalOpen(true);
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
                        <button
                            className="acc-btn acc-btn-logout" onClick={handleLogout}
                        >
                            <i className="fa-solid fa-right-from-bracket"></i>
                            Logout
                        </button>
                    </div>
                </div>
            </section>

            {/* Addresses Section */}
            <section className="acc-section acc-addresses">
                <div className="acc-section-header">
                    <h2 className="acc-section-title">Saved Addresses</h2>
                    <button className="acc-btn acc-btn-add-address" onClick={openAddModal}>
                        <i className="fa-regular fa-square-plus"></i>
                    </button>
                </div>
                <ul className="acc-addresses-list">
                    {addresses.length > 0 ? (
                        addresses.map((address) => (
                            <li
                                className={`acc-address-item ${address._id === defaultAddressId ? 'default-address' : ''}`}
                                key={address._id}
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
                                            onClick={() => openEditModal(address)}
                                            aria-label="Edit address"
                                        >
                                            <i className="fa-solid fa-pen-to-square"></i>
                                        </button>
                                        <button
                                            className="acc-btn acc-btn-delete-address"
                                            onClick={() => handleDeleteAddress(address._id)}
                                            aria-label="Delete address"
                                        >
                                            <i className="fa-solid fa-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))
                    ) : (
                        <li className="acc-address-item"><p>No saved addresses available.</p></li>
                    )}
                </ul>
            </section>

            {/*EditProfileModal */}
            <EditProfileModal
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
                onSave={handleProfileUpdate}
                currentUser={profile}
            />

            {/* Add Address Modal */}
            <AddressModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSave={handleAddAddress}
            />

            {/* Edit Address Modal */}
            <EditAddressModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setAddressToEdit(null);
                }}
                onSave={handleEditAddress}
                address={addressToEdit}
            />
        </div>
    );
};

export default Account;

