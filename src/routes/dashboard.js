import express from 'express';
import { protect, adminOnly } from '../middleware/auth.js';
import { getDashboardStats, getRecentOrders, getAnalytics } from '../controllers/analyticsController.js';

const router = express.Router();

router.get('/stats', protect, adminOnly, getDashboardStats);
router.get('/orders', protect, adminOnly, getRecentOrders);
router.get('/analytics', protect, adminOnly, getAnalytics);

export default router;
