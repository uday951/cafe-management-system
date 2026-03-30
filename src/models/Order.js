import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  orderNumber: { type: String, required: true, unique: true },
  tableNumber: { type: Number },
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  customerEmail: String,
  items: [{
    menuItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
    itemName: String,
    quantity: { type: Number, default: 1 },
    price: Number,
    subtotal: Number,
  }],
  subtotal: { type: Number, required: true },
  tax: { type: Number, default: 0 },
  total: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'preparing', 'completed', 'cancelled'],
    default: 'pending',
  },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'refunded'], default: 'pending' },
  paymentMethod: { type: String, required: true },
  specialInstructions: String,
  timeline: [{ status: String, timestamp: { type: Date, default: Date.now } }],
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
