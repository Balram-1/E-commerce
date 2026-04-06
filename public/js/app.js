/**
 * 💎 AETHER CORE - 2025 PREMIUM 💎
 * Single Page Application Logic
 */

const API_URL = window.location.origin + '/api';

// ═══════════════════════════════════════════════════════════
// STATE MANAGEMENT
// ═══════════════════════════════════════════════════════════

const state = {
  user: JSON.parse(localStorage.getItem('aether_user')) || null,
  token: localStorage.getItem('aether_token') || null,
  cart: JSON.parse(localStorage.getItem('aether_cart')) || [],
  products: [],
  currentProduct: null
};

const saveState = () => {
  localStorage.setItem('aether_user', JSON.stringify(state.user));
  localStorage.setItem('aether_token', state.token || '');
  localStorage.setItem('aether_cart', JSON.stringify(state.cart));
};

// ═══════════════════════════════════════════════════════════
// API CORE
// ═══════════════════════════════════════════════════════════

async function api(endpoint, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (state.token) headers['Authorization'] = `Bearer ${state.token}`;
  
  try {
    const res = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
    const data = await res.json();
    if (res.status === 401) logout();
    return { res, data };
  } catch (err) {
    console.error('API Error:', err);
    return { res: { ok: false }, data: { message: 'Connection Error' } };
  }
}

// ═══════════════════════════════════════════════════════════
// PRODUCT GALLERY ENGINE
// ═══════════════════════════════════════════════════════════

const productGallery = {
  currentIndex: 0,
  next: () => {
    const list = state.currentProduct.images.gallery;
    if (!list || list.length < 2) return;
    productGallery.currentIndex = (productGallery.currentIndex + 1) % list.length;
    productGallery.update();
  },
  prev: () => {
    const list = state.currentProduct.images.gallery;
    if (!list || list.length < 2) return;
    productGallery.currentIndex = (productGallery.currentIndex - 1 + list.length) % list.length;
    productGallery.update();
  },
  set: (idx) => {
    productGallery.currentIndex = idx;
    productGallery.update();
  },
  update: () => {
    const list = state.currentProduct.images.gallery;
    const img = list[productGallery.currentIndex];
    const mainImg = document.querySelector('.detail-img-main');
    if (mainImg) mainImg.src = img;
    
    document.querySelectorAll('.gallery-thumb').forEach((thumb, i) => {
      thumb.classList.toggle('active', i === productGallery.currentIndex);
    });
  }
};

// ═══════════════════════════════════════════════════════════
// UI COMPONENTS
// ═══════════════════════════════════════════════════════════

const Components = {
  Hero: () => `
    <section class="hero container">
      <h1 class="hero-title">AETHER</h1>
      <p class="hero-subtitle">The urban essence. Redefined for the modern minimalist.</p>
      <button class="btn-premium mt-4" onclick="router.navigate('/shop')">EXPLORE COLLECTION</button>
    </section>
  `,
  
  ProductCard: (p) => `
    <div class="product-card" onclick="router.navigate('/product/${p.slug}')">
      <div class="product-image-container">
        <img src="${p.images.hero}" alt="${p.name}" class="product-image">
      </div>
      <div class="product-info">
        <div>
          <p class="product-category">${p.category}</p>
          <h3 class="product-name">${p.name}</h3>
        </div>
        <p class="product-price">$${p.price.toFixed(2)}</p>
      </div>
    </div>
  `,

  Shop: async (category = 'all') => {
    const endpoint = category === 'all' ? '/products' : `/products?category=${category}`;
    const { data } = await api(endpoint);
    state.products = data.products || [];
    
    const categories = ['all', 'T-Shirts', 'Shirts', 'Hoodies', 'Jackets', 'Shoes', 'Accessories'];
    const filterBar = `
      <div class="filter-bar">
        ${categories.map(cat => `
          <button class="filter-btn ${category === cat ? 'active' : ''}" 
                  onclick="router.navigate('/shop/${cat}')">
            ${cat}
          </button>
        `).join('')}
      </div>
    `;

    const grid = state.products.map(p => Components.ProductCard(p)).join('');
    return `
      <section class="section container">
        ${filterBar}
        <div class="product-grid">${grid}</div>
      </section>
    `;
  },

  ProductDetail: async (slug) => {
    const { data } = await api(`/products/${slug}`);
    if (!data.success) return `<h2>Product not found</h2>`;
    const p = data.product;
    state.currentProduct = p;
    productGallery.currentIndex = 0; // Reset index for new product view
    
    const list = p.images.gallery || [];
    const hasMultiple = list.length > 1;

    const navButtons = hasMultiple ? `
      <button class="gallery-nav prev" onclick="productGallery.prev()">&#10094;</button>
      <button class="gallery-nav next" onclick="productGallery.next()">&#10095;</button>
    ` : '';

    const galleryHtml = hasMultiple ? `
      <div class="detail-gallery">
        ${list.map((img, i) => `
          <img src="${img}" class="gallery-thumb ${i === 0 ? 'active' : ''}" onclick="productGallery.set(${i})">
        `).join('')}
      </div>` 
    : '';

    return `
      <section class="section container product-detail-grid">
        <div class="detail-img-container">
          <div class="main-img-viewport">
            <img src="${list[0] || p.images.hero}" class="detail-img-main" alt="${p.name}">
            ${navButtons}
          </div>
          ${galleryHtml}
        </div>
        <div class="detail-content">
          <p class="product-category">${p.category}</p>
          <h1 class="detail-name">${p.name}</h1>
          <p class="detail-price">$${p.price.toFixed(2)}</p>
          <p class="detail-description">${p.description}</p>
          
          <div class="size-selector">
            ${p.inventory.map(i => `<div class="size-chip" onclick="cart.selectSize('${i.size}')">${i.size}</div>`).join('')}
          </div>
          
          <button class="btn-premium" onclick="cart.add()">ADD TO CART</button>
        </div>
      </section>
    `;
  },

  Auth: (type) => `
    <section class="section container" style="max-width: 500px; padding-top: 10rem;">
      <h2 class="mb-4">${type === 'login' ? 'LOGIN' : 'JOIN AETHER'}</h2>
      <form id="auth-form" class="auth-form">
        ${type === 'register' ? '<input type="text" name="username" placeholder="USERNAME" required style="width:100%; padding:1rem; margin-bottom:1rem; border:1px solid #ddd;">' : ''}
        <input type="email" name="email" placeholder="EMAIL" required style="width:100%; padding:1rem; margin-bottom:1rem; border:1px solid #ddd;">
        <input type="password" name="password" placeholder="PASSWORD" required style="width:100%; padding:1rem; margin-bottom:1rem; border:1px solid #ddd;">
        <button type="submit" class="btn-premium w-100 mt-2" style="width:100%">${type === 'login' ? 'ENTER' : 'CREATE'}</button>
      </form>
      <p class="mt-4 text-center">
        ${type === 'login' ? 'NEW HERE? <a href="/signup" data-nav>CREATE ACCOUNT</a>' : 'ALREADY MEMBER? <a href="/login" data-nav>LOGIN</a>'}
      </p>
    </section>
  `,

  CartItem: (item, idx) => `
    <div class="cart-item">
      <img src="${item.image}" class="cart-item-img">
      <div class="cart-item-info-row" style="flex:1;">
        <h4 style="font-size:0.9rem; margin-bottom:0.25rem;">${item.name}</h4>
        <p style="font-size:0.75rem; color:var(--color-text-dim);">SIZE: ${item.size}</p>
        <p style="font-size:0.85rem; margin-top:0.25rem;">$${item.price.toFixed(2)}</p>
        <button onclick="cart.remove(${idx})" style="background:none; border:none; color:#ff3b3b; cursor:pointer; font-size:0.7rem; margin-top:0.5rem; padding:0; text-decoration:underline;">REMOVE</button>
      </div>
    </div>
  `,

  CheckoutSuccess: () => `
    <section class="section container text-center" style="padding-top: 15rem;">
      <h1 style="font-size: 8vw; font-weight: 900; letter-spacing: -4px;">AETHER <br> THANKS YOU.</h1>
      <p class="mt-4" style="color: var(--color-text-dim); max-width: 500px; margin: 2rem auto;">Your order was successfully processed and is being staged for dispatch in our urban hub.</p>
      <button class="btn-premium mt-4" onclick="router.navigate('/')">RETURN HOME</button>
    </section>
  `
};

// ═══════════════════════════════════════════════════════════
// CART ENGINE
// ═══════════════════════════════════════════════════════════

const cart = {
  selectedSize: null,
  
  toggle: (open) => {
    document.getElementById('cart-drawer').classList.toggle('active', open);
    document.body.classList.toggle('no-scroll', open);
    if (open) cart.render();
  },

  selectSize: (size) => {
    cart.selectedSize = size;
    document.querySelectorAll('.size-chip').forEach(c => {
      c.classList.toggle('active', c.innerText === size);
    });
  },

  add: () => {
    if (!cart.selectedSize) return alert('Please select a size');
    const p = state.currentProduct;
    state.cart.push({
      id: p._id,
      name: p.name,
      price: p.price,
      image: p.images.hero,
      size: cart.selectedSize
    });
    saveState();
    updateNavUI();
    cart.toggle(true);
    alertSystem.show(`${p.name} ADDED TO CART`);
  },

  remove: (idx) => {
    state.cart.splice(idx, 1);
    saveState();
    updateNavUI();
    cart.render();
  },

  render: () => {
    const container = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total-value');
    if (!container) return;
    
    container.innerHTML = state.cart.length 
      ? state.cart.map((item, i) => Components.CartItem(item, i)).join('')
      : '<p class="text-center mt-4">YOUR CART IS EMPTY</p>';
      
    const total = state.cart.reduce((sum, item) => sum + item.price, 0);
    totalEl.textContent = `$${total.toFixed(2)}`;
  },

  checkout: () => {
    if (state.cart.length === 0) return alert('Your cart is empty');
    state.cart = [];
    saveState();
    updateNavUI();
    router.navigate('/checkout-success');
  }
};

// ═══════════════════════════════════════════════════════════
// ROUTER
// ═══════════════════════════════════════════════════════════

const router = {
  navigate: (path) => {
    window.history.pushState({}, '', path);
    router.resolve();
  },
  
  resolve: async () => {
    const path = window.location.pathname;
    const app = document.getElementById('app-router');
    document.body.classList.remove('no-scroll');
    cart.toggle(false);
    
    window.scrollTo(0, 0);

    if (path === '/') app.innerHTML = Components.Hero();
    else if (path.startsWith('/shop')) {
      const category = path.split('/')[2] || 'all';
      app.innerHTML = await Components.Shop(category);
    }
    else if (path.startsWith('/product/')) {
      const slug = path.split('/').pop();
      app.innerHTML = await Components.ProductDetail(slug);
    }
    else if (path === '/login') app.innerHTML = Components.Auth('login');
    else if (path === '/signup') app.innerHTML = Components.Auth('register');
    else if (path === '/checkout-success') app.innerHTML = Components.CheckoutSuccess();
    else if (path === '/cart') { cart.toggle(true); router.navigate('/shop'); } // Redirect to shop but open cart
    else app.innerHTML = `<div class="container section"><h2>404 Systems Error</h2></div>`;
    
    updateNavUI();
    attachListeners();
  }
};

// ═══════════════════════════════════════════════════════════
// ACTIONS & UTILS
// ═══════════════════════════════════════════════════════════

function updateNavUI() {
  const loginLink = document.getElementById('login-link');
  const accountLink = document.getElementById('account-link');
  const cartCount = document.getElementById('cart-count');
  
  if (state.user) {
    if (loginLink) loginLink.style.display = 'none';
    if (accountLink) accountLink.style.display = 'block';
  } else {
    if (loginLink) loginLink.style.display = 'block';
    if (accountLink) accountLink.style.display = 'none';
  }
  
  if (cartCount) cartCount.textContent = state.cart.length;
}

function attachListeners() {
  document.querySelectorAll('[data-nav]').forEach(link => {
    link.onclick = (e) => {
      e.preventDefault();
      router.navigate(link.getAttribute('href'));
    };
  });

  const authForm = document.getElementById('auth-form');
  if (authForm) {
    authForm.onsubmit = async (e) => {
      e.preventDefault();
      const formData = new FormData(authForm);
      const payload = Object.fromEntries(formData);
      const isLogin = window.location.pathname === '/login';
      
      const { res, data } = await api(`/auth/${isLogin ? 'login' : 'register'}`, {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        state.user = data.user;
        state.token = data.token;
        saveState();
        router.navigate('/');
      } else {
        alert(data.message || 'Auth failure');
      }
    };
  }
}

const alertSystem = {
  show: (msg) => {
    const el = document.createElement('div');
    el.className = 'alert';
    el.innerText = msg;
    document.getElementById('alert-system').appendChild(el);
    setTimeout(() => el.remove(), 3000);
  }
};

function logout() {
  state.user = null;
  state.token = null;
  saveState();
  router.navigate('/login');
}

// ═══════════════════════════════════════════════════════════
// INITIALIZATION
// ═══════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  router.resolve();
  window.onpopstate = () => router.resolve();

  document.getElementById('close-cart').onclick = () => cart.toggle(false);
  document.getElementById('checkout-btn').onclick = () => cart.checkout();
});

// Export globally
window.router = router;
window.cart = cart;
window.productGallery = productGallery;
