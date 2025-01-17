import React, { useState, useEffect } from 'react';
import { FaSearch, FaPlus, FaCopy, FaEdit, FaTrash, FaFilter } from 'react-icons/fa';
import { toast } from 'react-toastify';
import './coupons.css';
import { Link } from 'react-router-dom';
import CouponCard from '../../components/couponcard/CouponCard';


const Coupons = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalType, setModalType] = useState('add');
    const [selectedCouponId, setSelectedCouponId] = useState(null);
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
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

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

    const handleDelete = async (id) => {
        try {
            // Send DELETE request to the API
            const response = await fetch(`http://localhost:5000/api/coupons/${id}`, {
                method: 'DELETE',
                credentials: 'include',
            });
    
            if (!response.ok) {
                throw new Error('Failed to delete coupon');
            }
    
            // Update the state to remove the deleted coupon
            setCoupons(coupons.filter(coupon => coupon._id !== id));
            setModalVisible(false);
            setCouponToDelete(null);
        } catch (error) {
            setError(error.message);
        }
    };

    const handleAddCoupon = async () => {
        try {
            console.log('Adding coupon:', newCoupon);
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
            console.log('Added coupon:', newCouponEntry);
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
            console.error('Error adding coupon:', error);
            setError(error.message);
        }
    };

    const handleEdit = (coupon) => {
        console.log('Edit button clicked for:', coupon); // Debug log
        setModalType('edit');
        setSelectedCouponId(coupon._id);
        setNewCoupon({
            code: coupon.code,
            discountType: coupon.discountType,
            discountValue: coupon.discountValue,
            expirationDate: coupon.expirationDate?.split('T')[0] || '',
            minimumPurchaseAmount: coupon.minimumPurchaseAmount || 0,
            maxDiscountAmount: coupon.maxDiscountAmount || 0,
            usageLimit: coupon.usageLimit || 1,
            isActive: coupon.isActive
        });
        setModalVisible(true);
    };

    const handleUpdateCoupon = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/coupons/${selectedCouponId}`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newCoupon),
            });
            if (!response.ok) {
                throw new Error('Failed to update coupon');
            }
            const updatedCoupon = await response.json();
            setCoupons(coupons.map(c => c._id === updatedCoupon._id ? updatedCoupon : c));
            setModalVisible(false);
            setModalType('add');
            setSelectedCouponId(null);
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
        } catch (err) {
            setError(err.message);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewCoupon((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleCopyCode = (code) => {
        navigator.clipboard.writeText(code);
        toast.success('Coupon code copied to clipboard!', {
            position: 'top-right',
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    };

    const getStatusBadge = (coupon) => {
        const now = new Date();
        const expiryDate = new Date(coupon.expirationDate);
        
        if (!coupon.isActive) return 'inactive';
        if (expiryDate < now) return 'expired';
        if (coupon.usageCount >= coupon.usageLimit) return 'exhausted';
        return 'active';
    };

    const filteredCoupons = coupons.filter((coupon) => {
        const status = getStatusBadge(coupon);
    
        // Apply status filter (all, active, inactive, expired, exhausted)
        if (filterStatus !== 'all' && status !== filterStatus) {
            return false;
        }
    
        // Apply search filter
        if (searchTerm && !coupon.code.toLowerCase().includes(searchTerm.toLowerCase())) {
            return false;
        }
        return true;
    });

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="coupons-container">
            <div className="coupons-header">
                <div className="header-title">
                    <h1>Coupon Management</h1>
                    <p>Create and manage discount coupons</p>
                </div>
                <button className="add-coupon-btn" onClick={() => setModalVisible(true)}>
                    <FaPlus /> New Coupon
                </button>
            </div>

            <div className="filters-section">
                <div className="search-box">
                    <FaSearch />
                    <input
                        type="text"
                        placeholder="Search coupons..."
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="filter-box">
                    <FaFilter />
                    <select onChange={(e) => setFilterStatus(e.target.value)}>
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="expired">Expired</option>
                    </select>
                </div>
            </div>

            <div className="coupons-table-container">
                <table className="coupons-table">
                    <thead>
                        <tr>
                            <th>Code</th>
                            <th>Discount</th>
                            <th>Minimum Purchase</th>
                            <th>Usage</th>
                            <th>Expiry Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCoupons.map((coupon) => (
                            <tr key={coupon._id}>
                                <td className="coupon-code-cell">
                                    <span>{coupon.code}</span>
                                    <FaCopy 
                                        className="copy-icon"
                                        onClick={() => handleCopyCode(coupon.code)}
                                    />
                                </td>
                                <td>
                                    {coupon.discountType === 'percentage' 
                                        ? `${coupon.discountValue}%` 
                                        : `₹${coupon.discountValue}`
                                    }
                                    {coupon.maxDiscountAmount && 
                                        <small> (Max: ₹{coupon.maxDiscountAmount})</small>
                                    }
                                </td>
                                <td>₹{coupon.minimumPurchaseAmount}</td>
                                <td>
                                    {coupon.usageCount || 0}/{coupon.usageLimit || '∞'}
                                </td>
                                <td>
                                    <span className={
                                        new Date(coupon.expirationDate) < new Date() ? 'expired-date' : ''
                                    }>
                                        {new Date(coupon.expirationDate).toLocaleDateString()}
                                    </span>
                                </td>
                                <td>
                                    <span className={`status-badge ${getStatusBadge(coupon)}`}>
                                        {getStatusBadge(coupon)}
                                    </span>
                                </td>
                                <td className="actions-cell">
                                    <button 
                                        className="action-btn edit"
                                        onClick={() => handleEdit(coupon)}
                                    >
                                        <FaEdit />
                                    </button>
                                    <button 
                                        className="action-btn delete"
                                        onClick={() => handleDelete(coupon._id)}
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add/Edit Modal */}
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
                                <h3>{modalType === 'edit' ? 'Edit Coupon' : 'Add a New Coupon'}</h3>
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
                                    {modalType === 'edit' ? (
                                        <button className="add-btn" onClick={handleUpdateCoupon}>
                                            Update Coupon
                                        </button>
                                    ) : (
                                        <button className="add-btn" onClick={handleAddCoupon}>
                                            Add Coupon
                                        </button>
                                    )}
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

