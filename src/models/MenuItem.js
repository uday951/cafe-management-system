import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema({
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
  description: {
    type: String,
    maxLength: 200,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    required: true,
  },
  image: {
    data: String,       // Base64
    contentType: String,
    size: Number,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  preparationTime: {
    type: Number, // in minutes
    default: 15,
  },
  customizations: [
    {
      name: String, // e.g., "Size"
      options: [
        {
          name: String, // e.g., "Small", "Medium"
          priceAdjustment: Number, // e.g., 0, 50
        }
      ]
    }
  ],
  addons: [
    {
      name: String, // e.g., "Extra Cheese"
      price: Number, // e.g., 50
    }
  ]
}, { timestamps: true });

export default mongoose.model('MenuItem', menuItemSchema);
