import React, { useState } from 'react';
import './ordertable.css';

const OrderTable = ({ orders, refreshOrders }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 20;

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  const sortedOrders = [...orders].sort((a, b) => {
    if (sortConfig.key === 'createdAt') {
      return sortConfig.direction === 'asc' 
        ? new Date(a.createdAt) - new Date(b.createdAt)
        : new Date(b.createdAt) - new Date(a.createdAt);
    }
    return sortConfig.direction === 'asc'
      ? a[sortConfig.key] > b[sortConfig.key] ? 1 : -1
      : a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
  });

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = sortedOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(sortedOrders.length / ordersPerPage);

  const pageNumbers = [];
  const maxDisplayedPages = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxDisplayedPages / 2));
  let endPage = Math.min(totalPages, startPage + maxDisplayedPages - 1);

  if (endPage - startPage + 1 < maxDisplayedPages) {
    startPage = Math.max(1, endPage - maxDisplayedPages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  const getStatusBadgeClass = (status) => {
    const statusClasses = {
      pending: 'bg-warning',
      processing: 'bg-info',
      shipped: 'bg-primary',
      delivered: 'bg-success',
      cancelled: 'bg-danger'
    };
    return `badge ${statusClasses[status.toLowerCase()]} text-black`;
  };

  return (
    <>
      <div className="table-responsive">
        <table className="table table-hover table-bordered">
          <thead className="table-light">
            <tr>
              <th className="cursor-pointer">Order ID</th>
              <th onClick={() => handleSort('createdAt')} className="cursor-pointer">Date ↕</th>
              <th>Customer</th>
              <th>Items</th>
              <th onClick={() => handleSort('finalPrice')} className="cursor-pointer">Amount ↕</th>
              <th>Payment</th>
              <th>Shipping</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.map((order) => (
              <tr key={order._id} className="align-middle">
                <td className="text-nowrap">#{order._id.slice(-6)}</td>
                <td className="text-nowrap">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className="text-nowrap">{order.shippingAddress?.fullName}</div>
                  <small className="text-muted">{order.shippingAddress?.email}</small>
                </td>
                <td>
                  <div className="items-cell">
                    {order.orderItems.map((item, idx) => (
                      <div key={idx} className="text-nowrap">
                        {item.quantity}x {item.productName}
                      </div>
                    ))}
                  </div>
                </td>
                <td className="text-nowrap">₹{order.finalPrice.toFixed(2)}</td>
                <td>
                  <span className={getStatusBadgeClass(order.shippingStatus)}>
                    {order.paymentStatus}
                  </span>
                </td>
                <td>
                  <span className={getStatusBadgeClass(order.shippingStatus)}>
                    {order.shippingStatus}
                  </span>
                </td>
                <td>
                  <div className="btn-group">
                    <button className="btn btn-sm btn-outline-success">
                      View
                    </button>
                    <button className="btn btn-sm btn-outline-success">
                      Invoice
                    </button>
                    <button className="btn btn-sm btn-outline-success">
                      Manifest
                    </button>
                    <button className="btn btn-sm btn-outline-success">
                      Label
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination-container">
        <div className="pagination-info">
          Showing {indexOfFirstOrder + 1} to {Math.min(indexOfLastOrder, orders.length)} of {orders.length} orders
        </div>
        <div className="pagination">
          <button 
            onClick={prevPage} 
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            &laquo; Previous
          </button>

          {startPage > 1 && (
            <>
              <button onClick={() => paginate(1)} className="pagination-btn">1</button>
              {startPage > 2 && <span className="pagination-ellipsis">...</span>}
            </>
          )}

          {pageNumbers.map(number => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={`pagination-btn ${currentPage === number ? 'active' : ''}`}
            >
              {number}
            </button>
          ))}

          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <span className="pagination-ellipsis">...</span>}
              <button onClick={() => paginate(totalPages)} className="pagination-btn">
                {totalPages}
              </button>
            </>
          )}

          <button 
            onClick={nextPage} 
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            Next &raquo;
          </button>
        </div>
      </div>
    </>
  );
};

export default OrderTable;
