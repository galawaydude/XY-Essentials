import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/navbar/Navbar';
import Footer from './components/footer/Footer';
import Home from './pages/home/Home';
import ProductDetails from './pages/product/productdetails/ProductDetails';
import ProductListing from './pages/product/productlisting/ProductListing';
import Cart from './pages/cart/Cart';
import BlogListing from './pages/blog/bloglisting/BlogListing';
import About from './pages/miscellaneuos/about/About';
import Contact from './pages/miscellaneuos/contact/Contact';
import BlogDetails from './pages/blog/blogdetails/BlogDetails';
import Login from './pages/onboarding/login/Login';
import Signup from './pages/onboarding/signup/Signup';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Checkout from './pages/checkout/Checkout';
import Account from './pages/profile/account/Account';
import OrderDetails from './pages/profile/orderdetails/OrderDetails';
import Combo from './pages/product/combos/Combo';
import ProtectedRoute from './context/ProtectedRoute';

const AppRoutes = () => {
    const location = useLocation();

    return (

        <GoogleOAuthProvider clientId="761680962938-ktmlcpfdf9rcessoi34225uug4fjjfm6.apps.googleusercontent.com">
            <Navbar />
            <main className="main">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/shop" element={<ProductListing />} />
                    <Route path="/products/:id" element={<ProductDetails />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/combos" element={<Combo />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/blogs" element={<BlogListing />} />
                    <Route path="/blogs/:id" element={<BlogDetails />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/account" element={<Account />} />
                    <Route path="/order-details" element={<OrderDetails />} />
                    <Route path="/order-details/:id" element={<OrderDetails />} />
                    {/* <Route path="/account" element={<ProtectedRoute element={<Account />} />} />
                    <Route path="/order-details" element={<ProtectedRoute element={<OrderDetails />} />} />
                    <Route path="/order-details/:id" element={<ProtectedRoute element={<OrderDetails />} />} /> */}

                </Routes>
            </main>
            <Footer />
        </GoogleOAuthProvider>

    );
};

export default AppRoutes;
