const Order = require('../models/Order');

exports.create = async (req, res) => {
  try {
    const { items, shipping, payment, total } = req.body;
    if (!items || items.length === 0) return res.status(400).json({ success: false, message: 'No items' });
    const order = await Order.create({ user: req.user.id, items, shipping, payment, total });
    res.status(201).json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort('-createdAt');
    res.status(200).json({ success: true, count: orders.length, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
