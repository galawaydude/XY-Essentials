import React, { useEffect, useState } from 'react';
import './allorders.css';
import OrderCard from "../../../../client/src/components/ordercard/OrderCard";

function AllOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/orders');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setOrders(data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };
    
    fetchOrders();
}, []);

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
