import React, { useEffect, useState } from 'react';
import './yourorders.css';

const YourOrders = () => {
  // Dummy data for testing
  const dummyOrders = [
    {
      _id: '64a1db450d4c3d370f5c896e',
      createdAt: '2024-12-15T12:34:56Z',
      shippingStatus: 'Shipped',
      finalPrice: 1500.5,
      orderItems: [
        {
          product: 'Wireless Headphone', 
          quantity: 2,
          price: 5499.5,
        },
        {
          product: 'Smart Watch', 
          quantity: 3,
          price: 3300.5,
        },
      ],
    },
    {
      _id: '64a1db450d4c3d370f5c897f',
      createdAt: '2024-12-16T14:20:34Z',
      shippingStatus: 'Pending',
      finalPrice: 1000.0,
      orderItems: [
        {
          product: 'Bluetooth Speaker', 
          quantity: 3,
          price: 300,
        },
        {
          product: 'Phone Case', 
          quantity: 2,
          price: 200,
        },
      ],
    },
  ];

  const [orders, setOrders] = useState(dummyOrders);

  // Format date to a more readable format
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleViewDetails = (orderId) => {
    // This can be replaced with navigation logic to order details page
    console.log(`Viewing details for order: ${orderId}`);
  };

  return (
    <div className="ol-orders-container">
      {orders?.length > 0 ? (
        <div className="ol-orders-grid">
          {orders.map((order) => (
            <div key={order._id} className="ol-order-card">
              <div className="ol-order-details-left">
                <div className="ol-order-detail">
                  <span className="ol-order-detail-label">Order ID:</span>
                  <p className="ol-order-detail-value">{order._id.slice(-8)}</p>
                </div>
                <div className="ol-order-detail">
                  <span className="ol-order-detail-label">Status:</span>
                  <p className="ol-order-detail-value">{order.shippingStatus}</p>
                </div>
                <div className="ol-order-detail">
                  <span className="ol-order-detail-label">Total Price:</span>
                  <p className="ol-order-detail-value">${order.finalPrice.toFixed(2)}</p>
                </div>
                <div className="ol-order-detail">
                  <span className="ol-order-detail-label">Order Date:</span>
                  <p className="ol-order-detail-value">{formatDate(order.createdAt)}</p>
                </div>
              </div>
              <div className="ol-order-details-right">
                <h4 className="ol-order-items-title">Order Items</h4>
                {order.orderItems.map((item, index) => (
                  <div key={index} className="ol-order-item">
                    <span className="ol-item-name">{item.product}</span>
                    <span className="ol-item-quantity">Qty: {item.quantity}</span>
                  </div>
                ))}
                <button 
                  className="ol-view-details-btn"
                  onClick={() => handleViewDetails(order._id)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="ol-no-orders">No orders found.</p>
      )}
    </div>
  );
};

export default YourOrders;