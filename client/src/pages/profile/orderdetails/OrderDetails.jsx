import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './orderdetails.css';

const OrderDetails = () => {
  const { id } = useParams(); // Get the order ID from the URL
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/orders/${id}`, {
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Failed to fetch order details');
        }
        const data = await response.json();
        setOrder(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!order) return <p>No order found</p>;

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Destructure order data
  const {
    _id,
    orderItems,
    shippingFee,
    subtotal,
    discount,
    finalPrice,
    deliveryDate,
    createdAt,
    shippingAddress,
    paymentMethod,
    paymentStatus,
    shippingStatus,
    trackingNumber,
  } = order;

  return (
    <div className="order-details-container">
      <h1 className="order-details-heading">Order ID: {_id}</h1>

      {/* Order Status */}
      <div className="order-status-section">
        <p><strong>Payment Status:</strong> {paymentStatus}</p>
        <p><strong>Shipping Status:</strong> {shippingStatus}</p>
        {trackingNumber && (
          <p><strong>Tracking Number:</strong> {trackingNumber}</p>
        )}
        <p><strong>Delivery Date:</strong> {deliveryDate}</p>
      </div>

      {/* Products Section */}
      <div className="products-section">
        <h2>Products in this order</h2>
        {orderItems.map((item, index) => (
          <div key={index} className="product-item">
            <img src={item.product.images[0]} alt={item.product.name} className="product-image" />
            <div className="product-details">
              <p><strong>Product Name:</strong> {item.product.name}</p>
              <p><strong>Quantity:</strong> {item.quantity}</p>
              <p><strong>Price:</strong> ₹{item.price}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Pricing Breakdown */}
      <div className="pricing-breakdown">
        <h2>Price Breakdown</h2>
        <p><strong>Subtotal:</strong> ₹{subtotal}</p>
        <p><strong>Shipping Price:</strong> ₹{shippingFee}</p>
        {/* <p><strong>Tax:</strong> ₹{taxPrice}</p> */}
        {discount > 0 && <p><strong>Discount:</strong> ₹{discount}</p>}
        <p><strong>Total Amount:</strong> ₹{finalPrice}</p>
      </div>

      {/* Shipping Information */}
      <div className="shipping-section">
        <h2>Shipping Information</h2>
        <p><strong>Full Name:</strong> {shippingAddress.fullName}</p>
        <p><strong>Address Line 1:</strong> {shippingAddress.addressLine1}</p>
        {shippingAddress.addressLine2 && (
          <p><strong>Address Line 2:</strong> {shippingAddress.addressLine2}</p>
        )}
        <p><strong>City:</strong> {shippingAddress.city}</p>
        <p><strong>State:</strong> {shippingAddress.state}</p>
        <p><strong>Postal Code:</strong> {shippingAddress.postalCode}</p>
        <p><strong>Phone Number:</strong> {shippingAddress.phoneNumber}</p>
      </div>

      {/* Payment Information */}
      <div className="payment-section">
        <h2>Payment Information</h2>
        <p><strong>Payment Method:</strong> {paymentMethod === 'cod'? "Pay On Delivery" : "Razorpay"}</p>
        <p><strong>Order Date:</strong> {formatDate(createdAt)}</p>
      </div>
    </div>
  );
};

export default OrderDetails;
