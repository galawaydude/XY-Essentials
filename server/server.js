require('events').EventEmitter.defaultMaxListeners = 20;

const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { notFound, errorHandler } = require('./middlewares/error.middleware.js');

// dotenv.config({ path: path.resolve(__dirname, 'config/.env') });
dotenv.config({ path: path.resolve(__dirname, 'config/dev.env') });
// dotenv.config({ path: path.resolve(__dirname, 'config/pro.env') });
connectDB();

// Route Imports
const userRoutes = require('./routes/user.routes');
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const orderRoutes = require('./routes/order.routes');
const cartRoutes = require('./routes/cart.routes');
const mailRoutes = require('./routes/mail.routes');
const categoryRoutes = require('./routes/category.routes');
const couponRoutes = require('./routes/coupon.routes');
const comboRoutes = require('./routes/combo.routes.js');
const addressRoutes = require('./routes/address.routes');
const inventoryRoutes = require('./routes/inventory.routes');
const paymentRoutes = require('./routes/payment.routes');
const reviewRoutes = require('./routes/review.routes');
const blogRoutes = require('./routes/blog.routes');
const emailRoutes = require('./routes/email.routes');

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true, 
};

app.use(cors(corsOptions));

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/mails', mailRoutes);
app.use('/api/combos', comboRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/email', emailRoutes);

// Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server running on port ${PORT}`));
