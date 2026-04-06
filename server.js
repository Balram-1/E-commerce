require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

/**
 * AETHER - Professional E-Commerce Assembly
 */
const app = express();

// ═══════════════════════════════════════════════════════════
// DATABASE
// ═══════════════════════════════════════════════════════════
const seed = require('./seed');

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('🛡️  AETHER Database Connected Successfully');
    // 🚀 Auto-Seed on Startup
    await seed();
  })
  .catch(err => console.error('❌ Database Sync Failure:', err));

// ═══════════════════════════════════════════════════════════
// MIDDLEWARE
// ═══════════════════════════════════════════════════════════
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ═══════════════════════════════════════════════════════════
// API ROUTES
// ═══════════════════════════════════════════════════════════
app.use('/api/auth', require('./app/routes/authRoutes'));
app.use('/api/products', require('./app/routes/productRoutes'));
app.use('/api/orders', require('./app/routes/orderRoutes'));

// ═══════════════════════════════════════════════════════════
// FRONTEND (SPA)
// ═══════════════════════════════════════════════════════════
app.get(['/', '/login', '/signup', '/cart', '/shop', '/account'], (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

// 404 & Error Handling
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) return res.status(404).json({ success: false, message: 'Endpoint not found' });
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'AETHER Internal Systems Error' });
});

// ═══════════════════════════════════════════════════════════
// EXECUTION
// ═══════════════════════════════════════════════════════════
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('═══════════════════════════════════════════════════');
  console.log('💎 AETHER PREMIUM SYSTEMS ONLINE');
  console.log(`📡 Port: ${PORT}`);
  console.log('Active on : http://localhost:5000');
  console.log('═══════════════════════════════════════════════════');
});
