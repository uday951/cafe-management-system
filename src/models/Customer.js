import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
  },
  addresses: [
    {
      street: String,
      city: String,
      zipCode: String,
      isDefault: { type: Boolean, default: false },
    }
  ],
  totalOrders: {
    type: Number,
    default: 0,
  },
  totalSpent: {
    type: Number,
    default: 0,
  },
  lastOrderDate: Date,
  notes: String,
}, { timestamps: true });

export default mongoose.model('Customer', customerSchema);
