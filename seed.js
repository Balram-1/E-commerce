require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./app/models/Product');
const Order = require('./app/models/Order');
const User = require('./app/models/User');

const products = [
  {
    name: "AETHER MONOLITH HOODIE",
    description: "Heavyweight 500GSM cotton. Oversized architectural fit. Double-layered hood. Tonal high-density branding.",
    price: 180.00,
    category: "Hoodies",
    images: {
      hero: "/images/1a.jpg",
      gallery: ["/images/1a.jpg", "/images/1b.jpg", "/images/1c.jpg"]
    },
    inventory: [{ size: "M", stock: 15 }, { size: "L", stock: 20 }],
    isFeatured: true
  },
  {
    name: "AETHER BLACK PRINTED HOODIE",
    description: "Heavyweight 500GSM cotton. Oversized architectural fit. High-definition screen printed graphic. Double-layered hood. Tonal high-density branding.",
    price: 180.00,
    category: "Hoodies",
    images: {
      hero: "/images/2a.jpg",
      gallery: ["/images/2a.jpg", "/images/2b.jpg", "/images/2c.jpg"]
    },
    inventory: [{ size: "M", stock: 15 }, { size: "L", stock: 20 }],
    isFeatured: true
  },
  {
    name: "NIKE AIR FORCE 1 - WHITE",
    description: "The legend lives on in the AETHER collection. Classic all-white premium leather construction. Nike Air cushioning. Sleek, minimalist urban silhouette.",
    price: 110.00,
    category: "Shoes",
    images: {
      hero: "/images/3a.jpg",
      gallery: ["/images/3a.jpg", "/images/3b.jpg", "/images/3c.jpg", "/images/3d.jpg"]
    },
    inventory: [{ size: "8", stock: 10 }, { size: "9", stock: 15 }, { size: "10", stock: 20 }, { size: "11", stock: 10 }],
    isFeatured: true
  },
  {
    name: "ESSENCE GRAPHIC TEE",
    description: "Premium Peruvian Pima cotton. Relaxed cut. Silk-screened minimalist graphic on chest.",
    price: 65.00,
    category: "T-Shirts",
    images: {
      hero: "/images/4a.jpg",
      gallery: ["/images/4a.jpg", "/images/4b.jpg", "/images/4c.jpg"]
    },
    inventory: [{ size: "S", stock: 20 }, { size: "M", stock: 20 }, { size: "L", stock: 20 }],
    isFeatured: false
  },
  {
    name: "ZENITH OVERSIZED SHIRT",
    description: "Structured poplin shirt with dropped shoulders and a minimalist collar.",
    price: 110.00,
    category: "T-Shirts",
    images: {
      hero: "/images/5a.jpg",
      gallery: ["/images/5a.jpg", "/images/5b.jpg", "/images/5c.jpg"]
    },
    inventory: [{ size: "M", stock: 12 }, { size: "L", stock: 15 }],
    isFeatured: false
  },
  {
    name: "KINETIC TACTICAL JACKET",
    description: "Modular utility jacket. Windproof fabric. Integrated storage systems.",
    price: 320.00,
    category: "Jackets",
    images: {
      hero: "/images/6a.jpg",
      gallery: ["/images/6a.jpg", "/images/6b.jpg", "/images/6c.jpg"]
    },
    inventory: [{ size: "L", stock: 5 }, { size: "XL", stock: 8 }],
    isFeatured: true
  },
  {
    name: "PALM ANGELS COTTON TSHIRT",
    description: "A staple urban basic. Durable, comfortable, and perfectly proportioned.",
    price: 55.00,
    category: "T-Shirts",
    images: {
      hero: "/images/7a.jpg",
      gallery: ["/images/7a.jpg", "/images/7b.jpg"]
    },
    inventory: [{ size: "M", stock: 30 }, { size: "L", stock: 30 }],
    isFeatured: false
  },
  {
    name: "LANDON JACKET",
    description: "Structured minimalist jacket. Durable weather-resistant outer shell. Intricately detailed interior. Premium wool blend accents.",
    price: 145.00,
    category: "Jackets",
    images: {
      hero: "/images/8a.jpg",
      gallery: ["/images/8a.jpg", "/images/8b.jpg", "/images/8c.jpg"]
    },
    inventory: [{ size: "M", stock: 10 }, { size: "L", stock: 10 }],
    isFeatured: false
  },
  {
    name: "NIKE AIR FORCE 1 - BLACK",
    description: "The legendary AF-1 goes dark for the AETHER collection. Triple-black premium leather. Stealth-inspired urban performance and timeless silhouette.",
    price: 110.00,
    category: "Shoes",
    images: {
      hero: "/images/9a.jpg",
      gallery: ["/images/9a.jpg", "/images/9b.jpg", "/images/9c.jpg", "/images/9d.jpg"]
    },
    inventory: [{ size: "8", stock: 10 }, { size: "9", stock: 15 }, { size: "10", stock: 20 }, { size: "11", stock: 10 }],
    isFeatured: false
  },
  {
    name: "LOUIS VUITTON BIFOLD WALLET",
    description: "Iconic monogram LV canvas. Multiple card slots and premium leather interior. A timeless luxury essential added to the AETHER collection.",
    price: 495.00,
    category: "Accessories",
    images: {
      hero: "/images/10a.jpg",
      gallery: ["/images/10a.jpg", "/images/10b.jpg", "/images/10c.jpg"]
    },
    inventory: [{ size: "ONE SIZE", stock: 15 }],
    isFeatured: false
  },
  {
    name: "AETHER STEALTH BLACK JACKET",
    description: "Deep black, high-tenacity water-resistant textile. Ergonomic panelling and heavy-duty matte zip. The ultimate urban shield in our Jackets line.",
    price: 260.00,
    category: "Jackets",
    images: {
      hero: "/images/11a.jpg",
      gallery: ["/images/11a.jpg", "/images/11b.jpg", "/images/11c.jpg"]
    },
    inventory: [{ size: "M", stock: 10 }, { size: "L", stock: 15 }, { size: "XL", stock: 10 }],
    isFeatured: false
  },

];

const seed = async () => {
  try {
    // If not connected, connect
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('✅ Connected to AETHER Database for seeding');
    }

    await Product.deleteMany();
    await Order.deleteMany();
    await User.deleteMany();
    console.log('🧹 Purged Legacy Data (Products, Orders, Users)');

    // Insert Admin User
    await User.create({
      username: "admin",
      email: "admin@relayverse.site",
      password: "admin@relayverse.site", // Password now matches email as requested
      role: "admin",
      fullName: "Aether SysOp"
    });
    console.log('🛡️  Admin Account Primed: admin@relayverse.site');

    // Insert new products one by one to trigger pre-save hooks (slugs)
    for (const prod of products) {
      await Product.create(prod);
    }
    console.log(`🚀 AETHER Catalog Synchronized: ${products.length} Products`);

  } catch (err) {
    console.error('❌ Seeding Error:', err);
  }
};

if (require.main === module) {
  seed().then(() => {
    console.log('✅ Manual Seed Complete');
    process.exit(0);
  }).catch(err => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = seed;
