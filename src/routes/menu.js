import express from 'express';
import { protect, adminOnly } from '../middleware/auth.js';
import { getMenuItems, createMenuItem, updateMenuItem, deleteMenuItem, toggleAvailability } from '../controllers/menuController.js';

const router = express.Router();

router.get('/', protect, adminOnly, getMenuItems);
router.post('/', protect, adminOnly, createMenuItem);
router.put('/:itemId', protect, adminOnly, updateMenuItem);
router.delete('/:itemId', protect, adminOnly, deleteMenuItem);
router.put('/:itemId/availability', protect, adminOnly, toggleAvailability);

export default router;
