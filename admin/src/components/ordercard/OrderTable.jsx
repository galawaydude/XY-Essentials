import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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

  const callApi = async (type, awbNumber) => {
    if (!awbNumber) {
      alert('No waybill number available for this order');
      return;
    }
  
    const urlMap = {
      invoice: 'https://pre-alpha.ithinklogistics.com/api_v3/shipping/invoice.json',
      manifest: 'https://pre-alpha.ithinklogistics.com/api_v3/shipping/manifest.json',
      label: 'https://pre-alpha.ithinklogistics.com/api_v3/shipping/label.json',
    };
  
    try {
      const response = await fetch(urlMap[type], {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            awb_numbers: awbNumber,
            access_token: import.meta.env.VITE_ITL_ACCESS_TOKEN,
            secret_key: import.meta.env.VITE_ITL_SECRET_KEY,
          },
        }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const contentType = response.headers.get('Content-Type');
  
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        throw new Error(`Unexpected response type. Response: ${textResponse}`);
      }
  
      const data = await response.json();
  
      if (!data || !data.file_name) {
        throw new Error('Invalid response format: file_name is missing.');
      }
  
      // Download file
      const link = document.createElement('a');
      link.href = data.file_name;
      link.download = `${type}_${awbNumber}.pdf`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  
    } catch (error) {
      console.error(`${type} Error:`, error);
      alert(`Failed to generate ${type}. Error: ${error.message}`);
    }
  };
  

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
      cancelled: 'bg-danger',
      completed: 'bg-success'
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
                  <span className={getStatusBadgeClass(order.paymentStatus)}>
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
                    <Link to={`/admin/orders/${order._id}`} className="btn btn-sm btn-outline-success">
                      View
                    </Link>
                    <button
                      onClick={() => callApi('invoice', order.waybill)}
                      className="btn btn-sm btn-outline-success"
                    >
                      Invoice
                    </button>
                    <button
                      onClick={() => callApi('manifest', order.waybill)}
                      className="btn btn-sm btn-outline-success"
                    >
                      Manifest
                    </button>
                    <button
                      onClick={() => callApi('label', order.waybill)}
                      className="btn btn-sm btn-outline-success"
                    >
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
