const Order = require('../models/Order');
const { sendReceipt } = require('../utils/emailService');

exports.create = async (req, res) => {
  try {
    const { items, shipping, payment, total, email } = req.body;
    
    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No items in cart' });
    }

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    // Create order with user ID if authenticated, else null for guest
    const orderData = {
      user: req.user ? req.user.id : null,
      email,
      items,
      shipping,
      payment,
      total
    };

    const order = await Order.create(orderData);

    // Trigger email receipt (async - don't block response)
    sendReceipt(order).catch(err => console.error('Delayed email failure:', err));

    res.status(201).json({ success: true, order });
  } catch (err) {
    console.error('Order Creation Error:', err);
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
