const Product = require('../models/Product');

exports.getAll = async (req, res) => {
  try {
    const { category, search, limit = 100, sort = '-createdAt' } = req.query;
    let query = { isActive: true };
    if (category) query.category = category;
    if (search) query.name = { $regex: search, $options: 'i' };
    const products = await Product.find(query).limit(Number(limit)).sort(sort);
    res.status(200).json({ success: true, count: products.length, products });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getOne = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    product.metadata.views += 1;
    await product.save();
    res.status(200).json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.create = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, product });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
