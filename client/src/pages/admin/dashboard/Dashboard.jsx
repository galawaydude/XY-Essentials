import React, { useEffect, useState } from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, ArcElement, Tooltip, Legend } from 'chart.js';
import axios from 'axios';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ArcElement, Tooltip, Legend);

const Dashboard = () => {
  // State for dashboard data
  const [users, setUsers] = useState(0);
  const [products, setProducts] = useState(0);
  const [orders, setOrders] = useState([]);
  const [sales, setSales] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [userGrowth, setUserGrowth] = useState([]);
  const [stockData, setStockData] = useState([]);
  
  useEffect(() => {
    // Fetching data for users, products, and orders from your backend
    const fetchData = async () => {
      try {
        const usersData = await axios.get('/api/users');  // Number of users
        const productsData = await axios.get('/api/products');  // Number of products
        const ordersData = await axios.get('/api/orders');  // Order data

        setUsers(usersData.data.length);
        setProducts(productsData.data.length);
        setOrders(ordersData.data);

        // Calculate sales per month
        const salesPerMonth = ordersData.data.reduce((acc, order) => {
          const month = new Date(order.createdAt).getMonth();
          acc[month] = (acc[month] || 0) + order.totalPrice;
          return acc;
        }, []);
        setSales(salesPerMonth);

        // Example: Fetch Top Products (sorted by sales count)
        const topSellingProducts = productsData.data
          .sort((a, b) => b.salesCount - a.salesCount)
          .slice(0, 5);  // top 5 products
        setTopProducts(topSellingProducts);

        // Example: Fetch User Growth (user signups per month)
        const userGrowthPerMonth = usersData.data.reduce((acc, user) => {
          const month = new Date(user.createdAt).getMonth();
          acc[month] = (acc[month] || 0) + 1;
          return acc;
        }, []);
        setUserGrowth(userGrowthPerMonth);

        // Stock Levels for Products
        const lowStockProducts = productsData.data.filter(product => product.stock < 10);
        setStockData(lowStockProducts);
      } catch (error) {
        console.log(error);
      }
    };
    
    fetchData();
  }, []);

  // Data for Charts
  const usersData = {
    labels: ['Users'],
    datasets: [
      {
        label: 'Total Users',
        data: [users],
        backgroundColor: ['#36A2EB'],
        hoverBackgroundColor: ['#36A2EB'],
      }
    ]
  };

  const productsData = {
    labels: ['Products'],
    datasets: [
      {
        label: 'Total Products',
        data: [products],
        backgroundColor: ['#FF6384'],
        hoverBackgroundColor: ['#FF6384'],
      }
    ]
  };

  const salesData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    datasets: [
      {
        label: 'Sales Per Month',
        data: sales,
        backgroundColor: '#4BC0C0',
        borderColor: '#4BC0C0',
        fill: false,
        tension: 0.1,
      }
    ]
  };

  const ordersData = {
    labels: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    datasets: [
      {
        label: 'Orders Status',
        data: [
          orders.filter(order => order.status === 'pending').length,
          orders.filter(order => order.status === 'processing').length,
          orders.filter(order => order.status === 'shipped').length,
          orders.filter(order => order.status === 'delivered').length,
          orders.filter(order => order.status === 'cancelled').length,
        ],
        backgroundColor: ['#FFCE56', '#36A2EB', '#FF6384', '#4BC0C0', '#9966FF'],
        hoverBackgroundColor: ['#FFCE56', '#36A2EB', '#FF6384', '#4BC0C0', '#9966FF'],
      }
    ]
  };

  // Top Products
  const topProductsData = {
    labels: topProducts.map(product => product.name),
    datasets: [
      {
        label: 'Top Selling Products',
        data: topProducts.map(product => product.salesCount),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
      }
    ]
  };

  // User Growth per Month
  const userGrowthData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    datasets: [
      {
        label: 'User Growth Per Month',
        data: userGrowth,
        backgroundColor: '#9966FF',
        borderColor: '#9966FF',
        fill: false,
        tension: 0.1,
      }
    ]
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Admin Dashboard</h1>
      <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
        {/* Total Users */}
        <div style={{ width: '30%', margin: '20px' }}>
          <h3>Total Users</h3>
          <Pie data={usersData} />
        </div>

        {/* Total Products */}
        <div style={{ width: '30%', margin: '20px' }}>
          <h3>Total Products</h3>
          <Pie data={productsData} />
        </div>

        {/* Orders by Status */}
        <div style={{ width: '30%', margin: '20px' }}>
          <h3>Orders by Status</h3>
          <Pie data={ordersData} />
        </div>

        {/* Sales per Month */}
        <div style={{ width: '100%', margin: '20px' }}>
          <h3>Sales per Month</h3>
          <Line data={salesData} />
        </div>

        {/* Top Products */}
        <div style={{ width: '100%', margin: '20px' }}>
          <h3>Top 5 Selling Products</h3>
          <Bar data={topProductsData} />
        </div>

        {/* User Growth */}
        <div style={{ width: '100%', margin: '20px' }}>
          <h3>User Growth per Month</h3>
          <Line data={userGrowthData} />
        </div>

        {/* Low Stock Warnings */}
        <div style={{ width: '100%', margin: '20px', backgroundColor: '#f9f9f9', padding: '10px', borderRadius: '8px' }}>
          <h3>Low Stock Products</h3>
          <ul>
            {stockData.map((product) => (
              <li key={product._id}>
                {product.name}: {product.stock} items remaining
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
