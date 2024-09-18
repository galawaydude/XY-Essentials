require('events').EventEmitter.defaultMaxListeners = 20;

const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); // Assuming you have a DB connection file
const { protect, admin } = require('./middlewares/auth.middleware.js');
const { notFound, errorHandler } = require('./middlewares/error.middleware.js');

// // Route Imports
const userRoutes = require('./routes/user.routes');
const productRoutes = require('./routes/product.routes');
const orderRoutes = require('./routes/order.routes');
const cartRoutes = require('./routes/cart.routes');
const categoryRoutes = require('./routes/category.routes');
const couponRoutes = require('./routes/coupon.routes');
const addressRoutes = require('./routes/address.routes');
const inventoryRoutes = require('./routes/inventory.routes');
const paymentRoutes = require('./routes/payment.routes');
const reviewRoutes = require('./routes/review.routes');
const blogRoutes = require('./routes/blog.routes');

dotenv.config({ path: path.resolve(__dirname, 'config/.env') });

connectDB();

const app = express();

app.use(express.json()); // Middleware to parse JSON bodies

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/blogs', blogRoutes);

// Middlewares
app.use(protect);
app.use(admin);
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server running on port ${PORT}`));
