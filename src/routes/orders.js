import express from 'express';
import { protect, adminOnly } from '../middleware/auth.js';
import { createOrder, getOrder, getOrders, updateOrderStatus } from '../controllers/orderController.js';

const router = express.Router();

router.post('/', createOrder);
router.get('/', protect, adminOnly, getOrders);
router.get('/:orderId', getOrder);
router.patch('/:orderId/status', protect, adminOnly, updateOrderStatus);

export default router;
