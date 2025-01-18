import React, { useEffect, useState } from 'react';
import './allorders.css';
import OrderTable from "../../components/ordercard/OrderTable";

function Allorders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'all' || order.shippingStatus === filterStatus;
    const matchesSearch = order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.shippingAddress?.fullName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (loading) return <div className="loading-spinner">Loading orders...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div className="orders-container p-2">
         <h2>Orders</h2>
      <div className="filters-section mb-4 d-flex gap-3 align-items-center">
        <input
          type="text"
          className="form-control w-25"
          placeholder="Search by Order ID or Customer"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="form-select w-auto"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All Orders</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <span className="ms-3">
          Total Orders: {filteredOrders.length}
        </span>
      </div>

      <OrderTable orders={filteredOrders} refreshOrders={fetchOrders} />
    </div>
  );
}

export default Allorders;
