const Order = require('../models/order.model');
const User = require('../models/user.model');
const Product = require('../models/product.model');

const getDashboardStats = async (req, res) => {
  try {
    console.log('Fetching dashboard statistics...');
    // Basic Stats
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    console.log('Done fetching basic stats. Total orders:', totalOrders, ', total users:', totalUsers, ', total products:', totalProducts);

    // Orders by Status
    const orderStats = {
      pending: await Order.countDocuments({ status: 'pending' }),
      processing: await Order.countDocuments({ status: 'processing' }),
      shipped: await Order.countDocuments({ status: 'shipped' }),
      delivered: await Order.countDocuments({ status: 'delivered' }),
      cancelled: await Order.countDocuments({ status: 'cancelled' })
    };
    console.log('Done fetching order stats:', orderStats);

    // Payment Stats
    const paymentStats = await Order.aggregate([
      {
        $group: {
          _id: '$paymentMethod',
          count: { $sum: 1 },
          total: { $sum: '$finalPrice' }
        }
      }
    ]);
    console.log('Done fetching payment stats:', paymentStats);

    // Calculate total revenue from all orders
    const revenueData = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$finalPrice' }
        }
      }
    ]);
    const totalRevenue = revenueData[0]?.totalRevenue || 0;

    console.log('Done fetching total revenue:', totalRevenue);

    // Calculate monthly revenue for the last 12 months
    const monthlyRevenue = await Order.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          revenue: { $sum: '$finalPrice' }
        }
      },
      {
        $sort: { 
          '_id.year': -1, 
          '_id.month': -1 
        }
      },
      {
        $limit: 12
      },
      {
        $project: {
          _id: 0,
          month: {
            $concat: [
              { $toString: '$_id.year' },
              '-',
              {
                $cond: {
                  if: { $lt: ['$_id.month', 10] },
                  then: { $concat: ['0', { $toString: '$_id.month' }] },
                  else: { $toString: '$_id.month' }
                }
              }
            ]
          },
          amount: '$revenue'
        }
      }
    ]);

    // Calculate current month's revenue
    const currentMonth = new Date();
    currentMonth.setDate(1);
    const currentMonthRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: currentMonth }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$finalPrice' }
        }
      }
    ]);

    // Recent Orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('user', 'name')
      .select('orderNumber status finalPrice createdAt items');
    console.log('Done fetching recent orders:', recentOrders);

    // Growth Stats
    const thisMonth = new Date();
    thisMonth.setDate(1);
    const lastMonth = new Date(thisMonth);
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const newUsers = await User.countDocuments({ createdAt: { $gte: thisMonth } });
    const newOrders = await Order.countDocuments({ createdAt: { $gte: thisMonth } });
    console.log('Done fetching growth stats:', newUsers, newOrders);

    // Low Stock Alert
    const lowStockItems = await Product.countDocuments({ stock: { $lt: 10 } });
    console.log('Done fetching low stock items:', lowStockItems);

    res.json({
      totalOrders,
      totalUsers,
      totalProducts,
      totalRevenue,
      currentMonthRevenue: currentMonthRevenue[0]?.total || 0,
      orderStats,
      paymentStats,
      monthlyRevenue,
      recentOrders,
      newUsers,
      newOrders,
      lowStockItems
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Error fetching dashboard statistics' });
  }
};

module.exports = {
  getDashboardStats
};

