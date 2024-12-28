import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import AddProduct from './pages/product/addproduct/AddProduct';
import Dashboard from './pages/dashboard/Dashboard';
import { GoogleOAuthProvider } from '@react-oauth/google';
import EditProduct from './pages/product/editproduct/EditProduct';
import AddBlog from './pages/blog/addblog/AddBlog';
import EditBlog from './pages/blog/editblog/EditBlog';
import Inventory from './pages/inventory/Inventory';
import AllOrders from './pages/orders/Allorders';
import Blogs from './pages/blog/allblogs/AllBlogs.jsx';
import Coupons from './pages/coupons/Coupons';
import Login from './pages/login/Login';
import Reviews from './pages/reviews/Reviews';
import Users from './pages/Users/Users.jsx';
import UserDetails from './pages/Users/UserDetails.jsx';
import OrderDetails from './pages/orders/OrderDetails.jsx';

const AppRoutes = () => {
    const location = useLocation();

    return (

        <GoogleOAuthProvider clientId="761680962938-ktmlcpfdf9rcessoi34225uug4fjjfm6.apps.googleusercontent.com">
     
            <main className="main">

                <Routes>
                    <Route path="/admin/add-product" element={<AddProduct />} />
                    <Route path="/admin/inventory" element={<Inventory />} />
                    <Route path="/admin/edit-product/:id" element={<EditProduct />} />
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/admin/add-blog" element={<AddBlog />} />
                    <Route path="/admin/edit-blog/:id" element={<EditBlog />} />
                    <Route path="/admin/blogs" element={<Blogs />} />
                    <Route path="/admin/users" element={<Users />} />
                    <Route path="/admin/users/:id" element={<UserDetails />} />
                    <Route path="/admin/orders" element={<AllOrders />} />
                    <Route path="/admin/orders/:id" element={<OrderDetails />} />
                    <Route path="/admin/reviews" element={<Reviews />} />
                    <Route path="/admin/coupons" element={<Coupons />} />
                    <Route path="/login" element={<Login />} />
                </Routes>
            </main>
      
        </GoogleOAuthProvider>

    );
};

export default AppRoutes;
