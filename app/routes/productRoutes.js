const express = require('express');
const router = express.Router();
const { getAll, getOne, create, updateStock } = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', getAll);
router.get('/:slug', getOne);
router.post('/', protect, adminOnly, create);
router.patch('/:id/stock', protect, adminOnly, updateStock);

module.exports = router;
