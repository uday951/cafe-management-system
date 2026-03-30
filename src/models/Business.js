import mongoose from 'mongoose';

const businessSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  businessType: {
    type: String,
    enum: ['restaurant', 'salon', 'retail', 'service'],
    required: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
  },
  address: {
    type: String,
  },
  city: String,
  state: String,
  zipCode: String,
  logoImage: {
    data: String,       // Base64 string
    contentType: String,
  },
  description: String,
  hoursOfOperation: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {
      monday: { open: '09:00', close: '17:00', isOpen: true },
      tuesday: { open: '09:00', close: '17:00', isOpen: true },
      wednesday: { open: '09:00', close: '17:00', isOpen: true },
      thursday: { open: '09:00', close: '17:00', isOpen: true },
      friday: { open: '09:00', close: '17:00', isOpen: true },
      saturday: { open: '10:00', close: '15:00', isOpen: true },
      sunday: { open: '00:00', close: '00:00', isOpen: false },
    }
  },
  paymentMethods: {
    type: [String],
    enum: ['card', 'upi', 'wallet', 'cash'],
    default: ['cash'],
  },
  totalRevenue: {
    type: Number,
    default: 0,
  },
  totalOrders: {
    type: Number,
    default: 0,
  },
  subscriptionPlan: {
    type: String,
    enum: ['starter', 'pro', 'enterprise'],
    default: 'starter',
  }
}, { timestamps: true });

export default mongoose.model('Business', businessSchema);
