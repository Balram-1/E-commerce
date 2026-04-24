const mongoose = require('mongoose');

const orderArchiveSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, index: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false, index: true },
  email: { type: String, required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    size: { type: String, required: true }
  }],
  shipping: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    zip: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String }
  },
  payment: {
    id: { type: String, default: null },
    status: { type: String, default: 'pending' },
    method: { type: String, default: 'card' }
  },
  status: { type: String, default: 'processing' },
  total: { type: Number, required: true },
  archivedAt: { type: Date, default: Date.now } // 💎 Track precisely when this was archived
}, { timestamps: true });

// Note: No pre-save orderNumber generation here as it should match the original order

module.exports = mongoose.model('OrderArchive', orderArchiveSchema);
