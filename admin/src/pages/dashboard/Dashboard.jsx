import React, { useState, useEffect } from 'react';
import { Chart as ChartJS } from 'chart.js/auto';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { FaUsers, FaShoppingCart, FaRupeeSign, FaBoxOpen, FaTruck, FaClock, FaTimesCircle } from 'react-icons/fa';
import './dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    activeUsers: 0,
    lowStockItems: 0,
    orderStats: {
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0
    },
    paymentStats: {
      cod: 0,
      online: 0,
      upi: 0
    },
    recentOrders: [],
    monthlyRevenue: [],
    productCategories: []
  });

  useEffect(() => {
    console.log('Fetching dashboard data...');
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/', {
        credentials: 'include'
      });
      const data = await response.json();
      console.log('Dashboard data fetched:', data);
      setStats(data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Chart Data
  const orderStatusChart = {
    labels: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    datasets: [{
      data: [
        stats.orderStats.pending,
        stats.orderStats.processing,
        stats.orderStats.shipped,
        stats.orderStats.delivered,
        stats.orderStats.cancelled
      ],
      backgroundColor: ['#ffc107', '#17a2b8', '#007bff', '#28a745', '#dc3545']
    }]
  };

  const paymentMethodChart = {
    labels: ['Pay on Delivery', 'Razorpay'],
    datasets: [{
      data: [stats.paymentStats[1].count, stats.paymentStats[0].count],
      backgroundColor: ['#20c997', '#fd7e14']
    }]
  };

  const revenueChartData = {
    labels: stats.monthlyRevenue?.map(item => {
      const [year, month] = item.month.split('-');
      return new Date(year, month - 1).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    }) || [],
    datasets: [{
      label: 'Monthly Revenue',
      data: stats.monthlyRevenue?.map(item => item.amount) || [],
      borderColor: '#0d6efd',
      backgroundColor: 'rgba(13, 110, 253, 0.1)',
      borderWidth: 2,
      fill: true,
      tension: 0.4
    }]
  };

  const revenueChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context) => `Revenue: ${formatCurrency(context.raw)}`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => formatCurrency(value)
        }
      }
    }
  };

  console.log('Chart data:', { orderStatusChart, paymentMethodChart, revenueChartData });

  return (
    <div className="dashboard-container">
      {/* Summary Stats */}
      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-icon"><FaUsers /></div>
          <div className="stat-details">
            <h3>Total Users</h3>
            <p>{stats.totalUsers}</p>
            <small>+{stats.newUsers} this month</small>
          </div>
        </div>
        <div className="stat-card success">
          <div className="stat-icon"><FaShoppingCart /></div>
          <div className="stat-details">
            <h3>Total Orders</h3>
            <p>{stats.totalOrders}</p>
            <small>+{stats.newOrders} this month</small>
          </div>
        </div>
        <div className="stat-card warning">
          <div className="stat-icon"><FaRupeeSign /></div>
          <div className="stat-details">
            <h3>Total Revenue</h3>
            <p>{formatCurrency(stats.totalRevenue || 0)}</p>
            <small className="revenue-change">
              {formatCurrency(stats.currentMonthRevenue || 0)} this month
            </small>
          </div>
        </div>
        <div className="stat-card danger">
          <div className="stat-icon"><FaBoxOpen /></div>
          <div className="stat-details">
            <h3>Low Stock Items</h3>
            <p>{stats.lowStockItems}</p>
            <small>Products below threshold</small>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        <div className="chart-card wide">
          <h3>Revenue Trend</h3>
          <Line data={revenueChartData} options={revenueChartOptions} />
        </div>
        {/* <div className="chart-card">
          <h3>Order Status Distribution</h3>
          <Pie data={orderStatusChart} options={{ responsive: true }} />
        </div> */}
        <div className="chart-card">
          <h3>Payment Methods</h3>
          <Pie data={paymentMethodChart} options={{ responsive: true }} />
        </div>
      </div>

      {/* Recent Orders */}
      {/* <div className="recent-orders-section">
        <h3>Recent Orders</h3>
        <div className="table-responsive">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Products</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.map(order => (
                <tr key={order._id}>
                  <td>#{order._id.slice(-6)}</td>
                  <td>{order.customerName}</td>
                  <td>{order.items} items</td>
                  <td>₹{order.amount}</td>
                  <td>
                    <span className={`status-badge ${order.status}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>{new Date(order.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div> */}
    </div>
  );
};

export default Dashboard;

