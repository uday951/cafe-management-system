import mongoose from 'mongoose';
import Order from '../models/Order.js';

const generateOrderNumber = () => `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

// POST /api/orders  — customer-facing, no auth
export const createOrder = async (req, res) => {
  try {
    const { businessId, tableNumber, items, paymentMethod = 'demo' } = req.body;
    if (!businessId || !tableNumber || !items?.length)
      return res.status(400).json({ message: 'businessId, tableNumber and items are required' });

    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const tax = parseFloat((subtotal * 0.05).toFixed(2));
    const total = subtotal + tax;

    const order = await Order.create({
      businessId,
      orderNumber: generateOrderNumber(),
      customerName: `Table ${tableNumber}`,
      customerPhone: '0000000000',
      tableNumber,
      items: items.map(i => ({
        menuItemId: i.menuItemId ? new mongoose.Types.ObjectId(i.menuItemId) : new mongoose.Types.ObjectId(),
        itemName: i.name,
        quantity: i.quantity,
        price: i.price,
        subtotal: i.price * i.quantity,
      })),
      subtotal,
      tax,
      total,
      paymentMethod,
      paymentStatus: 'paid',
      status: 'pending',
      timeline: [{ status: 'pending', timestamp: new Date() }],
    });

    const io = req.app.get('io');
    if (io) io.emit('new_order', order);

    res.status(201).json({ orderId: order._id, orderNumber: order.orderNumber, total, status: order.status });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// GET /api/orders/:orderId
export const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// GET /api/orders?businessId=&status=
export const getOrders = async (req, res) => {
  try {
    const { businessId, status, limit = 100 } = req.query;
    if (!businessId) return res.status(400).json({ message: 'businessId required' });
    const query = { businessId };
    if (status && status !== 'all') query.status = status;
    const orders = await Order.find(query).sort({ createdAt: -1 }).limit(parseInt(limit));
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// PATCH /api/orders/:orderId/status
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = status;
    order.timeline.push({ status, timestamp: new Date() });
    await order.save();

    const io = req.app.get('io');
    if (io) io.emit('order_updated', order);

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};
