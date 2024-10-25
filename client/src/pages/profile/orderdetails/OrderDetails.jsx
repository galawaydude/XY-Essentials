import React from 'react';
import './orderdetails.css';

const order = {
  orderId: "123456789",
  products: [
    {
      name: "Face Moisturizer",
      price: 499,
      quantity: 2,
      image: "https://example.com/moisturizer.jpg"
    },
    {
      name: "Beard Oil",
      price: 299,
      quantity: 1,
      image: "https://example.com/beard-oil.jpg"
    }
  ],
  totalPrice: 1297,
  shippingPrice: 50,
  taxPrice: 18,
  discount: 100,
  finalPrice: 1265,
  deliveryDate: "2024-10-10",
  orderDate: "2024-10-01",
  shippingAddress: {
    fullName: "John Doe",
    addressLine1: "123 Main St",
    addressLine2: "Apt 4B",
    city: "Mumbai",
    state: "Maharashtra",
    postalCode: "400001",
    country: "India",
    phoneNumber: "9876543210"
  },
  paymentMethod: "Credit Card",
  orderStatus: "Shipped",
  trackingNumber: "TRK123456789IN"
};

const OrderDetails = () => {
  // Since we're using a hardcoded order, no need to check for undefined
  const {
    orderId,
    products,
    totalPrice,
    shippingPrice,
    taxPrice,
    discount,
    finalPrice,
    deliveryDate,
    orderDate,
    shippingAddress,
    paymentMethod,
    orderStatus,
    trackingNumber,
  } = order;

  return (
    <div className="order-details-container">
      <h1 className="order-details-heading">Order #{orderId}</h1>

      {/* Order Status */}
      <div className="order-status-section">
        <p><strong>Order Status:</strong> {orderStatus}</p>
        {trackingNumber && (
          <p><strong>Tracking Number:</strong> {trackingNumber}</p>
        )}
        <p><strong>Delivery Date:</strong> {deliveryDate}</p>
      </div>

      {/* Products Section */}
      <div className="products-section">
        <h2>Products in this order</h2>
        {products.map((product, index) => (
          <div key={index} className="product-item">
            <img src={product.image} alt={product.name} className="product-image" />
            <div className="product-details">
              <p><strong>Product Name:</strong> {product.name}</p>
              <p><strong>Quantity:</strong> {product.quantity}</p>
              <p><strong>Price:</strong> ₹{product.price}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Pricing Breakdown */}
      <div className="pricing-breakdown">
        <h2>Price Breakdown</h2>
        <p><strong>Subtotal:</strong> ₹{totalPrice}</p>
        <p><strong>Shipping Price:</strong> ₹{shippingPrice}</p>
        <p><strong>Tax:</strong> ₹{taxPrice}</p>
        {discount > 0 && <p><strong>Discount:</strong> -₹{discount}</p>}
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
        <p><strong>Country:</strong> {shippingAddress.country}</p>
        <p><strong>Phone Number:</strong> {shippingAddress.phoneNumber}</p>
      </div>

      {/* Payment Information */}
      <div className="payment-section">
        <h2>Payment Information</h2>
        <p><strong>Payment Method:</strong> {paymentMethod}</p>
        <p><strong>Order Date:</strong> {orderDate}</p>
      </div>
    </div>
  );
};

export default OrderDetails;
