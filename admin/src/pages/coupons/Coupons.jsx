import React, { useEffect, useState } from 'react';
import './coupons.css';
import { Link } from 'react-router-dom';
import CouponCard from '../../components/couponcard/CouponCard';

const Coupons = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalType, setModalType] = useState('');
    const [couponToDelete, setCouponToDelete] = useState(null);
    const [newCoupon, setNewCoupon] = useState({
        code: '',
        discountType: 'percentage',
        discountValue: '',
        expirationDate: '',
        minimumPurchaseAmount: '',
        maxDiscountAmount: '',
        usageLimit: '',
        isActive: true,
    });

    useEffect(() => {
        const fetchCoupons = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/coupons/', {
                    credentials: 'include',
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch coupons');
                }
                const data = await response.json();
                setCoupons(data);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchCoupons();
    }, []);

    const handleDelete = async () => {
        try {
            // Send DELETE request to the API
            const response = await fetch(`http://localhost:5000/api/coupons/${couponToDelete}`, {
                method: 'DELETE',
                credentials: 'include',
            });
    
            if (!response.ok) {
                throw new Error('Failed to delete coupon');
            }
    
            // Update the state to remove the deleted coupon
            setCoupons(coupons.filter(coupon => coupon._id !== couponToDelete));
            setModalVisible(false);
            setCouponToDelete(null);
        } catch (error) {
            setError(error.message);
        }
    };
    

    const handleAddCoupon = async () => {
        // Logic to add the new coupon (e.g., API call)
        try {
            const response = await fetch('http://localhost:5000/api/coupons/', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newCoupon),
            });
            if (!response.ok) {
                throw new Error('Failed to add coupon');
            }
            const newCouponEntry = await response.json();
            setCoupons([...coupons, newCouponEntry]);
            setModalVisible(false);
            setNewCoupon({
                code: '',
                discountType: 'percentage',
                discountValue: '',
                expirationDate: '',
                minimumPurchaseAmount: '',
                maxDiscountAmount: '',
                usageLimit: '',
                isActive: true,
            });
        } catch (error) {
            setError(error.message);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewCoupon((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="coupons-maincon">
            <div className="coupons-header">
                <h2>Coupons</h2>
                <div className="coupons-actions">
                    <input type="text" className="search-bar" placeholder="Search..." />
                    <button 
                        className="add-coupon-btn"
                        onClick={() => {
                            setModalType('add');
                            setModalVisible(true);
                        }}
                    >
                        Add Coupon
                    </button>
                </div>
            </div>

            <div className="coupons-cards">
                {coupons.map((coupon) => (
                    <div className="coupon-card" key={coupon._id}>
                        <CouponCard coupon={coupon} />
                        <div className="ic-actions">
                            <i
                                className="fas fa-trash-alt ic-action-icon"
                                title="Delete"
                                onClick={() => {
                                    setCouponToDelete(coupon._id);
                                    setModalType('delete');
                                    setModalVisible(true);
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {modalVisible && (
                <div className="modal">
                    <div className="modal-content">
                        {modalType === 'delete' ? (
                            <>
                                <h3>Are you sure you want to delete this coupon?</h3>
                                <div className="modal-actions">
                                    <button className="delete-btn" onClick={handleDelete}>Yes, Delete</button>
                                    <button onClick={() => setModalVisible(false)}>Cancel</button>
                                </div>
                            </>
                        ) : (
                            <>
                                <h3>Add a New Coupon</h3>
                                <form>
                                    <div className="form-group">
                                        <label>Code:</label>
                                        <input
                                            type="text"
                                            name="code"
                                            value={newCoupon.code}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Discount Type:</label>
                                        <select
                                            name="discountType"
                                            value={newCoupon.discountType}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="percentage">Percentage</option>
                                            <option value="fixed">Fixed</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Discount Value:</label>
                                        <input
                                            type="number"
                                            name="discountValue"
                                            value={newCoupon.discountValue}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Expiration Date:</label>
                                        <input
                                            type="date"
                                            name="expirationDate"
                                            value={newCoupon.expirationDate}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Minimum Purchase Amount:</label>
                                        <input
                                            type="number"
                                            name="minimumPurchaseAmount"
                                            value={newCoupon.minimumPurchaseAmount}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Max Discount Amount:</label>
                                        <input
                                            type="number"
                                            name="maxDiscountAmount"
                                            value={newCoupon.maxDiscountAmount}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Usage Limit:</label>
                                        <input
                                            type="number"
                                            name="usageLimit"
                                            value={newCoupon.usageLimit}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Is Active:</label>
                                        <input
                                            type="checkbox"
                                            name="isActive"
                                            checked={newCoupon.isActive}
                                            onChange={(e) =>
                                                setNewCoupon((prevData) => ({
                                                    ...prevData,
                                                    isActive: e.target.checked,
                                                }))
                                            }
                                        />
                                    </div>
                                </form>
                                <div className="modal-actions">
                                    <button className="add-btn" onClick={handleAddCoupon}>Add Coupon</button>
                                    <button onClick={() => setModalVisible(false)}>Cancel</button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Coupons;
