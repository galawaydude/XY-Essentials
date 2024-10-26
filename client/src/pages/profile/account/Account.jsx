import React, { useState, useEffect } from 'react';
import './account.css';

// Modal Component for Adding/Editing Address
const AddressModal = ({ isOpen, onClose, onSubmit, initialAddress }) => {
    const [fullName, setFullName] = useState(initialAddress?.fullName || "");
    const [addressLine1, setAddressLine1] = useState(initialAddress?.addressLine1 || "");
    const [addressLine2, setAddressLine2] = useState(initialAddress?.addressLine2 || "");
    const [city, setCity] = useState(initialAddress?.city || "");
    const [state, setState] = useState(initialAddress?.state || "");
    const [postalCode, setPostalCode] = useState(initialAddress?.postalCode || "");
    const [country, setCountry] = useState(initialAddress?.country || "");
    const [phoneNumber, setPhoneNumber] = useState(initialAddress?.phoneNumber || "");

    if (!isOpen) return null;

    const handleSubmit = () => {
        const newAddress = {
            fullName,
            addressLine1,
            addressLine2,
            city,
            state,
            postalCode,
            country,
            phoneNumber
        };
        onSubmit(newAddress);
    };

    return (
        <div className="acc-modal-backdrop">
            <div className="acc-modal-content">
                <h2 className="acc-modal-title">{initialAddress ? "Edit Address" : "Add New Address"}</h2>
                <input type="text" className="acc-modal-input" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full Name" />
                <input type="text" className="acc-modal-input" value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)} placeholder="Address Line 1" />
                <input type="text" className="acc-modal-input" value={addressLine2} onChange={(e) => setAddressLine2(e.target.value)} placeholder="Address Line 2 (Optional)" />
                <input type="text" className="acc-modal-input" value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" />
                <input type="text" className="acc-modal-input" value={state} onChange={(e) => setState(e.target.value)} placeholder="State" />
                <input type="text" className="acc-modal-input" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} placeholder="Postal Code" />
                <input type="text" className="acc-modal-input" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Country" />
                <input type="text" className="acc-modal-input" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="Phone Number" />
                <div className="acc-modal-buttons">
                    <button className="acc-btn acc-btn-cancel" onClick={onClose}>Cancel</button>
                    <button className="acc-btn acc-btn-submit" onClick={handleSubmit}>Submit</button>
                </div>
            </div>
        </div>
    );
};

const Account = () => {
    const userId = '67162ddff162c40b40be0062';
    const [addresses, setAddresses] = useState([]);
    const [orders, setOrders] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editAddressIndex, setEditAddressIndex] = useState(null);

    useEffect(() => {
        // Fetch Addresses
        const fetchAddresses = async () => {
            const response = await fetch(`http://localhost:5000/api/addresses/`);
            const data = await response.json();
            setAddresses(data);
        };

        // Fetch Orders
        const fetchOrders = async () => {
            const response = await fetch(`http://localhost:5000/api/orders/`);
            const data = await response.json();
            if (Array.isArray(data)) {
                setOrders(data);
            } else {
                console.error("Expected an array but got:", data);
                setOrders([]); // Handle non-array data
            }
        };

        fetchAddresses();
        fetchOrders();
    }, [userId]);

    const handleAddAddress = (newAddress) => {
        if (editAddressIndex !== null) {
            const updatedAddresses = [...addresses];
            updatedAddresses[editAddressIndex] = newAddress;
            setAddresses(updatedAddresses);
        } else {
            setAddresses([...addresses, newAddress]);
        }
        setIsModalOpen(false); // Close modal after submitting
        setEditAddressIndex(null); // Reset edit index
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
                        <p className="acc-detail-item"><strong>Name:</strong> John Doe</p>
                        <p className="acc-detail-item"><strong>Email:</strong> john.doe@example.com</p>
                        <p className="acc-detail-item"><strong>Phone:</strong> +1 123 456 7890</p>
                    </div>
                    <button className="acc-btn acc-btn-edit">Edit Profile</button>
                </div>
            </section>

            {/* Past Orders Section */}
            <section className="acc-section acc-past-orders">
                <h2 className="acc-section-title">Past Orders</h2>
                <ul className="acc-orders-list">
                    {orders.map(order => (
                        <li className="acc-order-item" key={order._id}>
                            <p className="acc-order-detail"><strong>Order ID:</strong> {order._id}</p>
                            <p className="acc-order-detail"><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                            <p className="acc-order-detail"><strong>Status:</strong> {order.paymentStatus}</p>
                            <p className="acc-order-detail"><strong>Total:</strong> ${order.finalPrice.toFixed(2)}</p>
                         <a href={`/order-details/${order._id}`}>   <button className="acc-btn acc-btn-view-order">View Order</button></a>
                        </li>
                    ))} 
                </ul>
            </section>

            {/* Addresses Section */}
            <section className="acc-section acc-addresses">
                <h2 className="acc-section-title">Saved Addresses</h2>
                <ul className="acc-addresses-list">
                    {addresses.map((address, index) => (
                        <li className="acc-address-item" key={index}>
                            {`${address.addressLine1}, ${address.city}, ${address.state}, ${address.postalCode}`}
                            <button className="acc-btn acc-btn-edit-address" onClick={() => openEditModal(index)}>Edit</button>
                        </li>
                    ))}
                </ul>
                <button className="acc-btn acc-btn-add-address" onClick={openAddModal}>
                    Add New Address
                </button>
            </section>

            {/* Modal for Adding/Editing Address */}
            <AddressModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleAddAddress}
                initialAddress={editAddressIndex !== null ? addresses[editAddressIndex] : null}
            />
        </div>
    );
};

export default Account;
