import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: {
    type: String,
    enum: ['books', 'electronics', 'clothing', 'other'],
    required: true,
    default: 'other',
  },
  description: { type: String }, // опціонально

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true // створює createdAt і updatedAt автоматично
});

export const Product = mongoose.model('Product', productSchema);
