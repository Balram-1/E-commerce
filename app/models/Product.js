const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, unique: true },
  slug: { type: String, unique: true, index: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  salePrice: { type: Number, default: null },
  category: { type: String, required: true, enum: ['T-Shirts', 'Shirts', 'Hoodies', 'Jackets', 'Shoes', 'Accessories'], index: true },
  inventory: [{
    size: { type: String, required: true },
    stock: { type: Number, default: 0 }
  }],
  images: {
    hero: { type: String, required: true },
    gallery: [{ type: String }]
  },
  isFeatured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  metadata: {
    views: { type: Number, default: 0 },
    sales: { type: Number, default: 0 }
  }
}, { timestamps: true });

productSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
