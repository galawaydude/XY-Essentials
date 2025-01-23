import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import './allorders.css';
import OrderTable from "../../components/ordercard/OrderTable";

function Allorders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

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
    const orderDate = new Date(order.createdAt);
    const matchesStatus = filterStatus === 'all' || order.shippingStatus === filterStatus;
    const matchesSearch = order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.shippingAddress?.fullName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDateRange = (!startDate || orderDate >= startDate) && 
                            (!endDate || orderDate <= new Date(endDate.setHours(23,59,59,999)));
    
    return matchesStatus && matchesSearch && matchesDateRange;
  });

  const clearDateFilter = () => {
    setStartDate(null);
    setEndDate(null);
  };

  if (loading) return <div className="loading-spinner">Loading orders...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div className="orders-container p-2">
         <h2>Orders</h2>
      <div className="filters-section mb-4">
        <div className="d-flex gap-3 align-items-center flex-wrap">
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
          <div className="date-range-picker d-flex gap-2 align-items-center">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              className="form-control"
              placeholderText="Start Date"
              dateFormat="dd/MM/yyyy"
            />
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              className="form-control"
              placeholderText="End Date"
              dateFormat="dd/MM/yyyy"
            />
            {(startDate || endDate) && (
              <button 
                className="btn btn-outline-secondary btn-sm"
                onClick={clearDateFilter}
              >
                Clear Dates
              </button>
            )}
          </div>
          <span className="ms-3">
            Total Orders: {filteredOrders.length}
          </span>
        </div>
      </div>

      <OrderTable orders={filteredOrders} refreshOrders={fetchOrders} />
    </div>
  );
}

export default Allorders;
