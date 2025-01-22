import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
    FaTruck, FaFileInvoice, FaPrint, FaEdit, 
    FaBoxOpen, FaUser, FaMapMarkerAlt, FaCreditCard,
    FaShippingFast, FaCheckCircle, FaTimesCircle
} from 'react-icons/fa';
import './orderdetails.css';

const OrderDetails = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingStatus, setEditingStatus] = useState(false);
    const [updatedStatus, setUpdatedStatus] = useState('');
    const [waybillNumber, setWaybillNumber] = useState('');
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [updatedPaymentStatus, setUpdatedPaymentStatus] = useState('');

    useEffect(() => {
        fetchOrderDetails();
    }, [id]);

    const fetchOrderDetails = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/${id}`, {
                credentials: 'include'
            });
            const data = await response.json();
            setOrder(data);
            setUpdatedStatus(data.shippingStatus);
            setWaybillNumber(data.waybill || '');
        } catch (error) {
            setError('Failed to fetch order details');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async () => {
        try {
            await fetch(`${import.meta.env.VITE_API_URL}/api/orders/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ shippingStatus: updatedStatus })
            });
            fetchOrderDetails();
            setEditingStatus(false);
        } catch (error) {
            setError('Failed to update status');
        }
    };

    const handleWaybillUpdate = async () => {
        try {
            await fetch(`${import.meta.env.VITE_API_URL}/api/orders/${id}/waybill`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ waybillNumber })
            });
            fetchOrderDetails();
            setShowUpdateModal(false);
        } catch (error) {
            setError('Failed to update waybill');
        }
    };

    const handlePaymentStatusUpdate = async () => {
        try {
            await fetch(`${import.meta.env.VITE_API_URL}/api/orders/${id}/payment-status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ paymentStatus: updatedPaymentStatus })
            });
            fetchOrderDetails();
            setShowPaymentModal(false);
        } catch (error) {
            setError('Failed to update payment status');
        }
    };

    const generateBill = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/${id}/generate-bill`, {
                credentials: 'include'
            });
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Order_${id}_Invoice.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } catch (error) {
            setError('Failed to generate bill');
        }
    };

    if (loading) return <div className="loading-spinner">Loading order details...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (!order) return <div className="error-message">Order not found</div>;

    return (
        <div className="admin-order-details">
            <div className="order-header">
                <div className="header-left">
                    <h1>Order #{id}</h1>
                    <span className="order-date">{new Date(order.createdAt).toLocaleString()}</span>
                </div>
                <div className="order-controls">
                    <button className="control-btn primary" onClick={generateBill}>
                        <FaFileInvoice /> Generate Invoice
                    </button>
                    <button className="control-btn secondary" onClick={() => window.print()}>
                        <FaPrint /> Print Order
                    </button>
                    <button className="control-btn success" onClick={() => setShowStatusModal(true)}>
                        <FaShippingFast /> Update Status
                    </button>
                    <button className="control-btn warning" onClick={() => setShowPaymentModal(true)}>
                        <FaCreditCard /> Update Payment
                    </button>
                </div>
            </div>

            <div className="order-grid">
                <div className="order-section order-info">
                    <h2><FaBoxOpen /> Order Information</h2>
                    <div className="info-grid">
                        <div className="info-item">
                            <span>Order ID:</span>
                            <strong>{order._id}</strong>
                        </div>
                        <div className="info-item">
                            <span>Order Date:</span>
                            <strong>{new Date(order.createdAt).toLocaleString()}</strong>
                        </div>
                        <div className="info-item">
                            <span>Status:</span>
                            <div className={`status-badge ${order.shippingStatus.toLowerCase()}`}>
                                {order.shippingStatus}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="order-section customer-info">
                    <h2><FaUser /> Customer Information</h2>
                    <div className="info-grid">
                        <div className="info-item">
                            <span>Name:</span>
                            <strong>{order.user.name}</strong>
                        </div>
                        <div className="info-item">
                            <span>Email:</span>
                            <strong>{order.user.email}</strong>
                        </div>
                        <div className="info-item">
                            <span>Phone:</span>
                            <strong>{order.shippingAddress.phoneNumber}</strong>
                        </div>
                    </div>
                </div>

                <div className="order-section shipping-info">
                    <h2><FaMapMarkerAlt /> Shipping Information</h2>
                    <div className="address-details">
                        <p>{order.shippingAddress.fullName}</p>
                        <p>{order.shippingAddress.addressLine1}</p>
                        <p>{order.shippingAddress.addressLine2}</p>
                        <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                        <p>{order.shippingAddress.postalCode}</p>
                        <p>Phone: {order.shippingAddress.phoneNumber}</p>
                    </div>
                </div>

                <div className="order-section payment-info">
                    <h2><FaCreditCard /> Payment Information</h2>
                    <div className="info-grid">
                        <div className="info-item">
                            <span>Total Amount:</span>
                            <strong>₹{order.finalPrice}</strong>
                        </div>
                        <div className="info-item">
                            <span>Discount:</span>
                            <strong>₹{order.discount}</strong>
                        </div>
                        <div className="info-item">
                            <span>Payment Method:</span>
                            <strong>{order.paymentMethod === 'cod' ? "Pay on Delivery" : "Razorpay"}</strong>
                        </div>
                        <div className="info-item">
                            <span>Payment Status:</span>
                            <div className={`status-badge ${order.paymentStatus.toLowerCase()}`}>
                                {order.paymentStatus}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="order-items">
                <h2>Order Items</h2>
                <table className="items-table">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Packaging</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.orderItems.map((item, index) => (
                            <tr key={index}>
                                <td className="product-cell">
                                    <img loading="lazy" src={item.productId.images[0]} alt={item.productName} />
                                    <span>{item.productName}</span>
                                </td>
                                <td>{item.packaging}</td>
                                <td>{item.quantity}</td>
                                <td>₹{item.price}</td>
                                <td>₹{item.price * item.quantity}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* <div className="order-summary">
                <div className="summary-item">
                    <span>Subtotal:</span>
                    <strong>₹{order.subtotal}</strong>
                </div>
                <div className="summary-item">
                    <span>Shipping:</span>
                    <strong>₹{order.shippingFee}</strong>
                </div>
                <div className="summary-item">
                    <span>Discount:</span>
                    <strong>₹{order.discount}</strong>
                </div>
                <div className="summary-item total">
                    <span>Total:</span>
                    <strong>₹{order.finalPrice}</strong>
                </div>
            </div> */}

            {showStatusModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Update Order Status</h3>
                        <div className="modal-body">
                            <label>Shipping Status:</label>
                            <select 
                                value={updatedStatus}
                                onChange={(e) => setUpdatedStatus(e.target.value)}
                                className="status-select"
                            >
                                <option value="Pending">Pending</option>
                                <option value="Processing">Processing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                            {order.shippingStatus === 'Shipped' && (
                                <>
                                    <label>Waybill Number:</label>
                                    <input
                                        type="text"
                                        value={waybillNumber}
                                        onChange={(e) => setWaybillNumber(e.target.value)}
                                        placeholder="Enter waybill number"
                                    />
                                </>
                            )}
                        </div>
                        <div className="modal-actions">
                            <button onClick={handleStatusUpdate} className="update-btn">
                                Update
                            </button>
                            <button onClick={() => setShowStatusModal(false)} className="cancel-btn">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showPaymentModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Update Payment Status</h3>
                        <div className="modal-body">
                            <label>Payment Status:</label>
                            <select 
                                value={updatedPaymentStatus}
                                onChange={(e) => setUpdatedPaymentStatus(e.target.value)}
                                className="status-select"
                            >
                                <option value="Pending">Pending</option>
                                <option value="Processing">Processing</option>
                                <option value="Completed">Completed</option>
                                <option value="Failed">Failed</option>
                                <option value="Refunded">Refunded</option>
                            </select>
                        </div>
                        <div className="modal-actions">
                            <button onClick={handlePaymentStatusUpdate} className="update-btn">
                                Update
                            </button>
                            <button onClick={() => setShowPaymentModal(false)} className="cancel-btn">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderDetails;
