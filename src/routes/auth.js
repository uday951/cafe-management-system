import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  register,
  login,
  logout,
  verify,
  forgotPassword,
} from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', protect, logout);
router.get('/verify', protect, verify);
router.post('/forgot-password', forgotPassword);

export default router;
