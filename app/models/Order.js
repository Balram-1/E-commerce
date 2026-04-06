const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    size: { type: String, required: true }
  }],
  shipping: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    zip: { type: String, required: true }
  },
  payment: {
    id: { type: String, default: null },
    status: { type: String, default: 'pending', enum: ['pending', 'paid', 'failed'] },
    method: { type: String, default: 'card' }
  },
  status: { type: String, default: 'processing', enum: ['processing', 'shipped', 'delivered', 'cancelled'] },
  total: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
