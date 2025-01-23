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
import PrivacyPolicy from './pages/miscellaneuos/privacypolicy/PrivacyPolicyPage';
import Disclaimer from './pages/miscellaneuos/disclaimer/Disclaimer';
import TermsOfService from './pages/miscellaneuos/tos/Tos';
import Comingsoon from './pages/comingsoon/Comingsoon';

const AppRoutes = () => {
    const location = useLocation();
    const [loading, setLoading] = useState(true);

    // Hide Navbar and Footer for specific routes
    const hideNavbarAndFooterRoutes = ['/loader', '/coming-soon']; // Add any other routes that should hide the Navbar and Footer
    const shouldShowNavbarAndFooter = !hideNavbarAndFooterRoutes.includes(location.pathname);

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

    // if (loading && isHomeRoute) {
    //     return <PreLoader />; // Only show PreLoader on Home route
    // }

    console.log(import.meta.env.VITE_REACT_CLIENT_URL);

    return (
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
            {shouldShowNavbarAndFooter && <Navbar />}
            <main className="main">
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/privacy" element={<PrivacyPolicy />} />
                    <Route path="/disclaimer" element={<Disclaimer />} />
                    <Route path="/terms" element={<TermsOfService />} />
                    <Route path="/coming-soon" element={<Comingsoon />} />
                    {/* <Route path="/loader" element={<PreLoader />} /> */}
                    <Route path="*" element={<Error404 />} />
                    <Route path="/shop" element={<ProductListing />} />
                    <Route path="/blogs" element={<BlogListing />} />
                    <Route path="/blogs/:id" element={<BlogDetails />} />
                    <Route path="/products/:id" element={<ProductDetails />} />
                    <Route path="/" element={<Home />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/account" element={<Account />} />
                    <Route path="/orders" element={<YourOrders />} />
                    <Route path="/orders/:id" element={<OrderDetails />} />

                    {/* Protected Routes */}
                    <Route element={<ProtectedRoutes />}>
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/checkout" element={<Checkout />} />
                        <Route path="/account" element={<Account />} />
                        <Route path="/orders" element={<YourOrders />} />
                        <Route path="/orders/:id" element={<OrderDetails />} />
                    </Route>
                </Routes>
            </main>
            {shouldShowNavbarAndFooter && <Footer />}
        </GoogleOAuthProvider>
    );
};

export default AppRoutes;
