import express from 'express';
import { protect, adminOnly } from '../middleware/auth.js';
import { getTables, createTable, deleteTable } from '../controllers/tableController.js';

const router = express.Router();

router.get('/', protect, adminOnly, getTables);
router.post('/', protect, adminOnly, createTable);
router.delete('/:id', protect, adminOnly, deleteTable);

export default router;
