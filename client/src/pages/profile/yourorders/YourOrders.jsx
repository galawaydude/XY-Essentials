import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './yourOrders.css';

const YourOrders = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  //ITL: ACCESS CODES
  const ITL_ACCESS_TOKEN = import.meta.env.VITE_ITL_ACCESS_TOKEN;
  const ITL_SECRET_KEY = import.meta.env.VITE_ITL_SECRET_KEY;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itlOrderDetails, setItlOrderDetails] = useState(null);
  const [currentOrders, setCurrentOrders] = useState([]);
  const ordersPerPage = 5;

    const [profile, setProfile] = useState(null);
    const navigate = useNavigate();
  
    useEffect(() => {
      const fetchProfile = async () => {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/profile/`, {
          credentials: 'include',
        });
        const data = await response.json();
        setProfile(data);
  
        if (!response.ok) {
          navigate('/login');
          console.error('Failed to fetch profile');
        }
      };
  
      fetchProfile();
    }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/user/orders`, {
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

  // const indexOfLastOrder = currentPage * ordersPerPage;
  // const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  // const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

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


// Add currentOrders state to store paginated orders

// Update pagination logic
const indexOfLastOrder = currentPage * ordersPerPage;
const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
const currentPageOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

useEffect(() => {
  setCurrentOrders(currentPageOrders);
}, [currentPageOrders]);


  // ITL: ORDER DETAILS 
useEffect(() => {
  const getItlOrderDetails = async () => {
    if (!currentOrders?.length) {
      console.error("No orders on current page");
      return;
    }

    // console.log("Fetching order details for current orders:", currentOrders);

    // Filter orders with waybills
    const validOrders = currentOrders.filter(order => order.waybill);
    const waybillList = validOrders.map(order => order.waybill).join(',');

    if (!waybillList) {
      console.error("No waybills found for current orders");
      return;
    }

    const url = `${import.meta.env.VITE_ITL_URL}/api_v3/order/get_details.json`;

    const payload = {
      data: {
        awb_number_list: waybillList,
        order_no: "",
        start_date: "2022-04-01",
        end_date: "3022-05-12",
        access_token: ITL_ACCESS_TOKEN,
        secret_key: ITL_SECRET_KEY,
      },
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      console.log("Order Details Response:", result.data);
      setItlOrderDetails(result.data);
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  if (currentOrders?.length) {
    getItlOrderDetails();
  }
}, [ITL_ACCESS_TOKEN, ITL_SECRET_KEY, currentOrders, currentPage]);

  // ITL: ORDER DETAILS END

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
      <div className="pagination">
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
                <h4 className="ol-order-items-title">Order Details</h4>
                <div className="ol-order-detail">
                  <span className="ol-order-detail-label">Order ID:</span>
                  <p className="ol-order-detail-value">{order._id}</p>
                </div>
                <div className="ol-order-detail">
                  <span className="ol-order-detail-label">Shipping Status:</span>
                  <p className="ol-order-detail-value">{order.shippingStatus}</p>
                </div>
                <div className="ol-order-detail">
                  <span className="ol-order-detail-label">Delivery Date:</span>
                  <p className="ol-order-detail-value">{formatDate(order.createdAt)}</p>
                </div>
                <div className="ol-order-detail">
                  <span className="ol-order-detail-label">Total Price:</span>
                  <p className="ol-order-detail-value">&#x20B9;{order.finalPrice.toFixed(2)}</p>
                </div>
                <div className="ol-order-detail">
                  <span className="ol-order-detail-label">Order Date:</span>
                  <p className="ol-order-detail-value">{formatDate(order.createdAt)}</p>
                </div>
                <div className="ol-order-detail">
                  <span className="ol-order-detail-label">Payment Status:</span>
                  <p className="ol-order-detail-value">{order.paymentStatus}</p>
                </div>
                <div className="ol-order-detail">
                  <span className="ol-order-detail-label">Payment Method:</span>
                  <p className="ol-order-detail-value">{order.paymentMethod === 'cod' ? 'Pay On Delivery' : order.paymentMethod}</p>
                </div>
              </div>
              <div className="ol-order-details-right">
                <h4 className="ol-order-items-title">Products</h4>
                {order.orderItems.map((item, index) => (
                  <div key={index} className="ol-order-item">
                    <span className="ol-item-name">{item.productName}</span>
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
