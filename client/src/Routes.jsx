import React, { useState, useEffect } from 'react';
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
import ProtectedRoutes from './utils/ProtectedRoutes';
import YourOrders from './pages/profile/yourorders/YourOrders';
import Ordercard from './components/ordercard/Ordercard';
import PreLoader from './components/preloader/PreLoader';
import Error404 from './pages/notfound404/error404';

const AppRoutes = () => {
    const location = useLocation();
    const [loading, setLoading] = useState(true);

    // Hide Navbar for specific routes
    const hideNavbarRoutes = ['/loader']; // Add any other routes that should hide the Navbar
    const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname);

    // Check if the current route is the Home route ("/")
    const isHomeRoute = location.pathname === "/";

    // Simulate loading state for Home route only
    useEffect(() => {
        if (isHomeRoute) {
            const timer = setTimeout(() => setLoading(false), 2000); // 2 seconds delay for preloader
            return () => clearTimeout(timer); // Cleanup the timer
        } else {
            setLoading(false); // If it's not the Home route, immediately set loading to false
        }
    }, [isHomeRoute]); // Depend on `isHomeRoute` to trigger effect when route changes

    if (loading && isHomeRoute) {
        return <PreLoader />; // Only show PreLoader on Home route
    }

    return (
        <GoogleOAuthProvider clientId="761680962938-ktmlcpfdf9rcessoi34225uug4fjjfm6.apps.googleusercontent.com">
            {shouldShowNavbar && <Navbar />}
            <main className="main">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/shop" element={<ProductListing />} />
                    <Route path="/products/:id" element={<ProductDetails />} />
                    {/* <Route path="/combos" element={<Combo />} /> */}
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/blogs" element={<BlogListing />} />
                    <Route path="/blogs/:id" element={<BlogDetails />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/loader" element={<PreLoader />} />
                    <Route path="*" element={<Error404 />} />
                    
                    {/* <Route path='/order' element={<Ordercard />}/> */}

                    <Route element={<ProtectedRoutes />}>
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/account" element={<Account />} />
                        <Route path="/orders" element={<YourOrders />} />
                        <Route path="/orders/:id" element={<OrderDetails />} />
                    </Route>
                </Routes>
            </main>
            <Footer />
        </GoogleOAuthProvider>

    );
};

export default AppRoutes;

