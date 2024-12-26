import React, { useEffect, useState } from 'react';
import OrderCard from '../../../components/ordercard/OrderCard';
import './yourOrders.css';

const YourOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          setOrders(data);
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

  console.log("Orders fetched:", orders);

  if (loading) return <div>Loading orders...</div>;
  if (error) return <div>Error fetching orders: {error}</div>;

  return (
    <div className='youroders-main-con section'>
      {orders?.length > 0 ? (
        <div className="order-list">
          {orders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
};

export default YourOrders;

