import React, { useEffect, useState } from 'react';
import OrderCard from '../../../components/ordercard/OrderCard';
import './yourOrders.css';

const YourOrders = () => {
  // Dummy data for testing
  const dummyOrders = [
    {
      _id: '64a1db450d4c3d370f5c896e',
      createdAt: '2024-12-15T12:34:56Z',
      shippingStatus: 'Shipped',
      finalPrice: 1500.5,
      orderItems: [
        {
          product: 'product1', // Dummy product ID
          quantity: 2,
          price: 500,
        },
        {
          product: 'product2', // Dummy product ID
          quantity: 1,
          price: 500,
        },
      ],
    },
    {
      _id: '64a1db450d4c3d370f5c897f',
      createdAt: '2024-12-16T14:20:34Z',
      shippingStatus: 'Pending',
      finalPrice: 1000.0,
      orderItems: [
        {
          product: 'product3', // Dummy product ID
          quantity: 3,
          price: 300,
        },
        {
          product: 'product4', // Dummy product ID
          quantity: 2,
          price: 200,
        },
      ],
    },
  ];

  const [orders, setOrders] = useState(dummyOrders);

  useEffect(() => {
    // Simulate fetching orders by using the dummy data
    // Normally here you would fetch the data from the API, but for testing, we use the dummy data
    setOrders(dummyOrders);
  }, []);

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
