import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { Server } from 'socket.io';

import authRoutes from './routes/auth.js';
import qrRoutes from './routes/qr.js';
import menuRoutes from './routes/menu.js';
import orderRoutes from './routes/orders.js';
import dashboardRoutes from './routes/dashboard.js';
import tableRoutes from './routes/tables.js';
import categoryRoutes from './routes/categories.js';

dotenv.config();

const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL,
].filter(Boolean);

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
  },
});

app.set('io', io);

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) cb(null, true);
    else cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/api/auth', authRoutes);
app.use('/api/qr', qrRoutes);
app.use('/api/admin/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin/dashboard', dashboardRoutes);
app.use('/api/tables', tableRoutes);
app.use('/api/categories', categoryRoutes);

// Public menu route (no auth) — used by customer QR page
app.get('/api/public/menu', async (req, res) => {
  try {
    const { businessId } = req.query;
    if (!businessId) return res.status(400).json({ message: 'businessId required' });
    const { default: MenuItem } = await import('./models/MenuItem.js');
    const items = await MenuItem.find({ businessId, isAvailable: true }).select('-__v');
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

app.use((req, res) => res.status(404).json({ message: `Route ${req.method} ${req.url} not found` }));

io.on('connection', (socket) => {
  console.log('🔌 Client connected:', socket.id);
  socket.on('disconnect', () => console.log('🔌 Client disconnected:', socket.id));
});

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ DB error:', err.message);
  }
};

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, async () => {
  await connectDB();
  console.log(`🚀 Server running on port ${PORT}`);

  // Self-ping to prevent Render free tier sleep
  setInterval(async () => {
    try {
      await fetch(`http://localhost:${PORT}/api/health`);
      console.log('🏓 Self-ping OK');
    } catch (err) {
      console.warn('⚠️ Self-ping failed:', err.message);
    }
  }, 5000);
});
