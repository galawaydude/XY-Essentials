import React from 'react';
import './ordercard.css';

const OrderCard = ({ order }) => {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const totalItems = order?.orderItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <div className="order-card">
      <div className="order-header">
        <span className="order-id">Order #{order?._id?.slice(-6)}</span>
        <span className="order-date">{formatDate(order?.createdAt)}</span>
      </div>

      <div className="order-summary">
        <div className="order-info">
          <span>{totalItems} Items</span>
          <span className="order-status">{order?.shippingStatus}</span>
        </div>
        <div className="order-total">
          <span>Total: </span>
          <span>₹{order?.finalPrice?.toFixed(2)}</span>
        </div>
      </div>

      <button className="order-view-btn">View Details</button>
    </div>
  );
};

export default OrderCard;