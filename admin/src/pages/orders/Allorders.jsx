import React, { useEffect, useState } from 'react';
import './allorders.css';
import OrderCard from "../../components/ordercard/OrderCard";

function AllOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/orders', {
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
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <div>Loading orders...</div>;
  if (error) return <div>Error fetching orders: {error}</div>;

  return (
    <div className="allorders-maincon">
      {orders.map(order => (
        <div key={order._id} className="order-row">
          <OrderCard order={order} />
        </div>
      ))}
    </div>
  );
}

export default AllOrders;
