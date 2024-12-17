import React, { useEffect, useState } from 'react'
import Ordercard from '../../../components/ordercard/Ordercard';
import './yourOrders.css'

const YourOrders = () => {
  const [orders, setOrders] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/users/user/orders`, {
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Failed to fetch order details');
        }
        const data = await response.json();
        setOrders(data);
        console.log(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className='youroders-main-con section'>
      <Ordercard />
    </div>
  )
}

export default YourOrders;