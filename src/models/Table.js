import mongoose from 'mongoose';

const tableSchema = new mongoose.Schema({
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  tableNumber: { type: Number, required: true },
  qrCode: { type: String }, // base64 data URL
}, { timestamps: true });

tableSchema.index({ businessId: 1, tableNumber: 1 }, { unique: true });

export default mongoose.model('Table', tableSchema);
