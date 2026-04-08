const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true, index: true },
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
    status: { type: String, default: 'pending', enum: ['pending', 'paid', 'failed'] },
    method: { type: String, default: 'card' }
  },
  status: { type: String, default: 'processing', enum: ['processing', 'shipped', 'delivered', 'cancelled'] },
  total: { type: Number, required: true }
}, { timestamps: true });

// 💎 AUTO-GENERATE ORDER NUMBER
orderSchema.pre('save', function(next) {
  if (!this.orderNumber || this.orderNumber === null) {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.orderNumber = `AE-${timestamp}${random}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
