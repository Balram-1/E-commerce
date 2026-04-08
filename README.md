# AETHER - Premium Urban Essence 💎

A state-of-the-art, ultra-minimalist e-commerce storefront designed for the modern individual. Built with architectural integrity, visual excellence, and production-ready features.

---

## 🚀 **Key Features**
- **Architecture**: Modular MVC Backend (Node.js/Express) with a Vanilla ES6+ SPA Frontend.
- **Email Receipts**: Automated HTML order confirmations via **Brevo SMTP**.
- **Guest Checkout**: Seamless purchasing flow for non-registered users.
- **Account Management**: Secure Profile dashboard and JWT-based session handling.
- **Dynamic Catalog**: Intelligent product discovery with size selection and inventory logic.

---

## 🎨 **Design Philosophy**
AETHER follows the core principles of premium minimalist design:
- **Typography-First**: Bold, cinematic headlines convey brand identity without visual clutter.
- **Glassmorphic UI**: Translucent, floating navigation creates a sense of depth.
- **Aesthetic Precision**: A monochromatic palette (Pure White & Onyx Black) with sharp Electric Blue accents.

---

## 🛠️ **Getting Started**

### **1. Prerequisites**
Ensure you have **Node.js** and **MongoDB** installed locally.

### **2. Setup**
```bash
npm install
```

### **3. Environment Config**
Copy `.env.example` to `.env` and fill in your MongoDB and Brevo SMTP credentials.
```bash
cp .env.example .env
```

### **4. Seeding the Catalog**
To populate the store and clear old data:
```bash
node seed.js
```

### **5. Launching the Store**
```bash
npm start
```
Access the storefront at: **[http://localhost:5000](http://localhost:5000)**

---

## 📦 **Directory Structure**
- **`app/`**: Models, Controllers, Routes, and Middleware.
- **`public/`**: The SPA frontend (Assets, CSS, Core Logic).
- **`seed.js`**: Universal data synchronization script.

---

## 👨‍💻 **Developed with Antigravity**
Built to deliver a professional-grade urban streetwear experience with 100% focus on stability and aesthetics.
