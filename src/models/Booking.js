import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: true,
  },
  bookingNumber: {
    type: String,
    required: true,
    unique: true,
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
  },
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  customerEmail: String,
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true,
  },
  serviceName: { type: String, required: true },
  staffId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  bookingDate: {
    type: Date,
    required: true,
  },
  bookingTime: {
    type: String, // e.g. "14:30"
    required: true,
  },
  durationMinutes: Number,
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled', 'no-show'],
    default: 'pending',
  },
  totalPrice: { type: Number, required: true },
  specialNotes: String,
  rating: { type: Number, min: 1, max: 5 },
}, { timestamps: true });

export default mongoose.model('Booking', bookingSchema);
