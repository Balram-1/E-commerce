const express = require('express');
const router = express.Router();
const { getAll, getOne, create } = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', getAll);
router.get('/:slug', getOne);
router.post('/', protect, adminOnly, create);

module.exports = router;
