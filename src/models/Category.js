import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  name: { type: String, required: true, trim: true },
}, { timestamps: true });

export default mongoose.model('Category', categorySchema);
