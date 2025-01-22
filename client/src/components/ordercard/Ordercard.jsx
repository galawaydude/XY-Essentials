import React, { useEffect, useState } from 'react';
import './ordercard.css';

const OrderCard = ({ order }) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch product details based on orderItems
    const fetchProducts = async () => {
      if (order?.orderItems?.length) {
        try {
          const response = await Promise.all(
            order.orderItems.map(item => 
              fetch(`/api/products/${item.product}`)  // Assuming a route that returns product details by ID
                .then(res => res.json())
                .then(data => ({
                  ...data,
                  quantity: item.quantity,
                  price: item.price
                }))
            )
          );
          setProducts(response);
        } catch (error) {
          console.error("Error fetching product details:", error);
        }
      }
    };

    fetchProducts();
  }, [order]);

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

      <div className="order-products">
        {products.map((product, index) => (
          <div key={index} className="order-product">
            <img loading="lazy" src={product.images[0]} alt={product.name} className="product-image" />
            <div className="product-details">
              <span className="product-name">{product.name}</span>
              <span className="product-quantity">Qty: {product.quantity}</span>
              <span className="product-price">₹{(product.price * product.quantity).toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>

      <button className="order-view-btn">View Details</button>
    </div>
  );
};

export default OrderCard;
