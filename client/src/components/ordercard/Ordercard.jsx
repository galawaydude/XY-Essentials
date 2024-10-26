import React from 'react';
import './ordercard.css';


function OrderCard({ order }) {
  return (
    <div className="order-card-main-con">
      <div className="order-card-con">
        <div className="order-card-details-header">
          <h3>Order ID: {order._id}</h3>
          <div className='order-attribute'>Shipping Address: {order.shippingAddress}</div>
          <div className='order-attribute'>Payment Status: <span className='r-tag'>{order.paymentStatus} </span></div>
          <div className='order-attribute'>Shipping Status: {order.shippingStatus}</div>
        </div>

        {/* Loop through order items */}
        {order.orderItems.map((item, index) => (
          <div className="order-item-con" key={index}>
            <div className="order-card-details-con">
            <div className="order-card-product"> <i className="fa-regular fa-circle-dot bullet-pt"></i>'Product Name Here' {item.product.name} * {item.quantity} </div>
            </div>
          </div>
        ))}

        {/* Order Summary */}
        <div className="order-summary-con">
          <div className='order-attribute'>Final Price: ${order.finalPrice.toFixed(2)}</div>
          <div className='order-attribute'>Delivered At: {order.deliveredAt ? new Date(order.deliveredAt).toLocaleDateString() : 'Not yet delivered'}</div>
        </div>
      </div>
    </div>
  );
}

export default OrderCard;