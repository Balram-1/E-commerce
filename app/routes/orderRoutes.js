const express = require('express');
const router = express.Router();
const { create, getMyOrders } = require('../controllers/orderController');
const { protect, optionalProtect } = require('../middleware/auth');

router.post('/', optionalProtect, create);
router.get('/my-orders', protect, getMyOrders);

module.exports = router;
