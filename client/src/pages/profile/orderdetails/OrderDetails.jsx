import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './orderdetails.css';

const OrderDetails = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { id } = useParams();
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

  const formatAddress = (address) => {
    const parts = [
      address.fullName,
      address.addressLine1,
      address.addressLine2,
      address.city,
      address.state,
      address.postalCode,
      address.phoneNumber
    ].filter(Boolean); // Remove empty or undefined values
    return parts.join(', ');
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
    <div>
      <div className="text-nav-con container">
        <a href="/profile">Profile </a>&nbsp;&nbsp;&gt;
        &nbsp;&nbsp;<a href="/orders"> Your Orders</a>&nbsp;&nbsp;&gt;
        &nbsp;&nbsp;<a > Order: {_id}</a>
      </div>
      <div className="ord-details-container con1 section">


        <div className="ord-payment-item">
          <div className="ord-payment-label">Order Date: </div>
          <div className="ord-payment-value">{formatDate(createdAt)}</div>
        </div>
        <h1 className="ord-details-heading">Order ID: {_id}</h1>
        {/* Order Status Section */}
        <div className="ord-status-section">
          {/* Info Sections */}
          <div className="ord-info-sections">
            {/* Shipping Section */}
            <div className="ord-shipping-section">
              <h2 className="ord-shipping-heading">Shipping Information</h2>

              <div className="ord-status-item">
                <span className="ord-status-label">Shipping Status: </span>
                <span className="ord-status-value">{shippingStatus}</span>
              </div>
              {trackingNumber && (
                <div className="ord-status-item">
                  <span className="ord-status-label">Tracking Number: </span>
                  <span className="ord-status-value">{trackingNumber}</span>
                </div>
              )}

              <div className="ord-shipping-item">
                <span>
                  <span className='ord-status-label'>Shipping Address: </span>
                  {formatAddress(shippingAddress)}
                </span>

              </div>

              <div className="ord-shipping-item">
                <span className="ord-status-label">Delivery Date:</span>
                <span className="ord-status-value">{deliveryDate}</span>
              </div>
            </div>


            {/* Payment Section */}
            <div className="ord-payment-section">
              <h2 className="ord-payment-heading">Payment Information</h2>

              <div className="ord-payment-item">
                <span className="ord-status-label">Payment Status:</span>
                <span className="ord-status-value">{paymentStatus}</span>
              </div>

              <div className="ord-payment-info">
                <div className="ord-payment-item">
                  <div className="ord-payment-label">Payment Method: </div>
                  <div className="ord-payment-value">
                    {paymentMethod === 'cod' ? "Pay On Delivery" : "Razorpay"}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Pricing Breakdown */}
        <div className="ord-pricing-breakdown">
          <h2 className="ord-pricing-heading">Price Breakdown</h2>
          <div className="ord-price-row">
            <span className="ord-price-label">Subtotal</span>
            <span className="ord-price-value">₹{subtotal}</span>
          </div>
          <div className="ord-price-row">
            <span className="ord-price-label">Shipping Price</span>
            <span className="ord-price-value">₹{shippingFee}</span>
          </div>
          {discount > 0 && (
            <div className="ord-price-row">
              <span className="ord-price-label">Discount</span>
              <span className="ord-price-value">₹{discount}</span>
            </div>
          )}
          <div className="ord-price-row">
            <span className="ord-price-label">Total Amount</span>
            <span className="ord-price-value">₹{finalPrice}</span>
          </div>
        </div>


        {/* Products Section */}
        <div className="ord-products-section">
          <h2 className="ord-products-heading">Products in this order</h2>
          {orderItems.map((item, index) => (
            <div key={index} className="ord-product-item">
              <img src={item.product.images[0]} alt={item.product.name} className="ord-product-image" />
              <div className="ord-product-details">
                <p className="ord-product-name">{item.product.name}</p>
                <p className="ord-product-quantity">Quantity: {item.quantity}</p>
                <p className="ord-product-price">Price: ₹{item.price}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>


  );
};

export default OrderDetails;