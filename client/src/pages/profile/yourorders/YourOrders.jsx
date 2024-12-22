import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './yourorders.css';

const YourOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users/user/orders', {
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (Array.isArray(data)) {
          const sortedOrders = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setOrders(sortedOrders);
        } else {
          console.error("Expected an array but got:", data);
          setOrders([]); // Handle non-array data
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError(error.message || 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const nextPage = () => {
    if (currentPage < Math.ceil(orders.length / ordersPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  console.log("Orders fetched:", orders);

  if (loading) return <div>Loading orders...</div>;
  if (error) return <div>Error fetching orders: {error}</div>;



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
                      <div className="home-pro-head con2">
                    <div className="section_left_title">Your Orders</div>
                    {/* <div className="items-count">{orders.length} orders in your bag.</div> */}
                </div>
      {/* <div className="text-nav-con container">
        <a href="/profile">Profile </a>&nbsp;&nbsp;&gt;
        &nbsp;&nbsp;<a href="/orders"> Your Orders</a>
      </div> */}
      <div className="pagination con2">
        <button onClick={prevPage} disabled={currentPage === 1}>&laquo; Previous</button>
        {Array.from({ length: Math.ceil(orders.length / ordersPerPage) }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => paginate(index + 1)}
            className={currentPage === index + 1 ? 'active' : ''}
          >
            {index + 1}
          </button>
        ))}
        <button onClick={nextPage} disabled={currentPage === Math.ceil(orders.length / ordersPerPage)}>Next &raquo;</button>
      </div>
      {currentOrders.length > 0 ? (
        <div className="ol-orders-grid con2">
          {currentOrders.map((order) => (
            <div key={order._id} className="ol-order-card">
              <div className="ol-order-details-left">
                <div className="ol-order-detail">
                  <span className="ol-order-detail-label">Order ID:</span>
                  <p className="ol-order-detail-value">{order._id}</p>
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
                    <span className="ol-item-name">{item.product?.name}</span>
                    <span className="ol-item-quantity">Qty: {item.quantity}</span>
                  </div>
                ))}
                <Link to={`/orders/${order._id}`}>
                  <button className="ol-view-details-btn">View Details</button>
                </Link>
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
