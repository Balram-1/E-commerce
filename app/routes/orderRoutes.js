const express = require('express');
const router = express.Router();
const { create, getMyOrders } = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

router.post('/', protect, create);
router.get('/my-orders', protect, getMyOrders);

module.exports = router;
