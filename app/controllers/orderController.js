const Order = require('../models/Order');
const OrderArchive = require('../models/OrderArchive'); // 💎 Import Archive model
const { sendReceipt } = require('../utils/emailService');
const Product = require('../models/Product'); // Import Product model

exports.create = async (req, res) => {
  try {
    const { items, shipping, payment, total, email } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No items in cart' });
    }

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    // 1. Validate all items handles and stock availability first
    const productsToUpdate = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product not found: ${item.product}` });
      }

      const inventoryItem = product.inventory.find(i => i.size === item.size);
      const requestedQty = parseInt(item.quantity) || 1;

      if (!inventoryItem || inventoryItem.stock < requestedQty) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name} (Size: ${item.size})`
        });
      }

      // Prepare for update
      inventoryItem.stock -= requestedQty;
      // Also update sales metadata
      product.metadata.sales += requestedQty;
      
      productsToUpdate.push(product);
    }

    // 2. Perform all updates if validation passed
    for (const product of productsToUpdate) {
      await product.save();
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

    // 💎 MIRROR TO PERMANENT ARCHIVE
    await OrderArchive.create({
      ...orderData,
      orderNumber: order.orderNumber // Sync the generated order number
    }).catch(err => console.error('Archive Failure (Non-Fatal):', err));

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
