import React from 'react';
import { useNavigate } from 'react-router-dom';
import './dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <h1>Admin Dashboard</h1>

      <div className="dashboard-group">
        <h2>Products</h2>
        <div className="dashboard-buttons">
          <div className="button-card" onClick={() => navigate('/admin/inventory')}>
            <h3>All Products</h3>
          </div>
          <div className="button-card" onClick={() => navigate('/admin/add-product')}>
            <h3>Add Product</h3>
          </div>
        </div>
      </div>

      <div className="dashboard-group">
        <h2>Blogs</h2>
        <div className="dashboard-buttons">
          <div className="button-card" onClick={() => navigate('/admin/blogs')}>
            <h3>All Blogs</h3>
          </div>
          <div className="button-card" onClick={() => navigate('/admin/add-blog')}>
            <h3>Add Blog</h3>
          </div>
        </div>
      </div>

      <div className="dashboard-group">
        <h2>Coupons</h2>
        <div className="dashboard-buttons">
          <div className="button-card" onClick={() => navigate('/admin/coupons')}>
            <h3>All Coupons</h3>
          </div>
        </div>
      </div>

      <div className="dashboard-group">
        <h2>Orders</h2>
        <div className="dashboard-buttons">
          <div className="button-card" onClick={() => navigate('/admin/orders')}>
            <h3>All Orders</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
