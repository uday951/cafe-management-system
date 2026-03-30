import mongoose from 'mongoose';
import Order from '../models/Order.js';

export const getDashboardStats = async (req, res) => {
  try {
    const { businessId } = req.query;
    if (!businessId) return res.status(400).json({ message: 'businessId required' });

    const bId = new mongoose.Types.ObjectId(businessId);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalOrders, todayOrders, revenueAgg, todayRevenueAgg, activeOrders] = await Promise.all([
      Order.countDocuments({ businessId: bId }),
      Order.countDocuments({ businessId: bId, createdAt: { $gte: today } }),
      Order.aggregate([{ $match: { businessId: bId, status: 'completed' } }, { $group: { _id: null, total: { $sum: '$total' } } }]),
      Order.aggregate([{ $match: { businessId: bId, status: 'completed', createdAt: { $gte: today } } }, { $group: { _id: null, total: { $sum: '$total' } } }]),
      Order.countDocuments({ businessId: bId, status: { $in: ['pending', 'preparing'] } }),
    ]);

    res.json({
      totalRevenue: revenueAgg[0]?.total || 0,
      todayRevenue: todayRevenueAgg[0]?.total || 0,
      totalOrders,
      todayOrders,
      activeOrders,
      totalCustomers: 0,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getRecentOrders = async (req, res) => {
  try {
    const { businessId, limit = 10 } = req.query;
    if (!businessId) return res.status(400).json({ message: 'businessId required' });
    const orders = await Order.find({ businessId: new mongoose.Types.ObjectId(businessId) })
      .sort({ createdAt: -1 }).limit(parseInt(limit));
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getAnalytics = async (req, res) => {
  try {
    const { businessId, days = 7 } = req.query;
    const bId = new mongoose.Types.ObjectId(businessId);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const revenueTrend = await Order.aggregate([
      { $match: { businessId: bId, status: 'completed', createdAt: { $gte: startDate } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, revenue: { $sum: '$total' }, orders: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    res.json({ revenueTrend, topItems: [] });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};
