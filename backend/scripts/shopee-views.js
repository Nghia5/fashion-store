const fs = require('fs');
const path = require('path');
const viewsDir = 'd:/Code/web/fashion-store/views';

// ===================== NAVBAR (Shopee-style) =====================
const navbar = `<div class="topbar">
  <div class="container topbar-inner">
    <div class="topbar-left">
      <a href="#">K\u00EAnh Ng\u01B0\u1EDDi B\u00E1n</a>
      <span class="topbar-sep">|</span>
      <a href="#">K\u1EBFt n\u1ED1i <i class="fab fa-facebook"></i> <i class="fab fa-instagram"></i></a>
    </div>
    <div class="topbar-right">
      <a href="#"><i class="fas fa-bell"></i> Th\u00F4ng B\u00E1o</a>
      <a href="#"><i class="fas fa-question-circle"></i> H\u1ED7 Tr\u1EE3</a>
      <% if (user) { %>
        <a href="/auth/profile"><i class="fas fa-user"></i> <%= user.Name || user.name %></a>
        <a href="/auth/logout">Tho\u00E1t</a>
      <% } else { %>
        <a href="/auth/register">\u0110\u0103ng K\u00FD</a>
        <span class="topbar-sep">|</span>
        <a href="/auth/login">\u0110\u0103ng Nh\u1EADp</a>
      <% } %>
    </div>
  </div>
</div>

<nav class="navbar" id="navbar">
  <div class="container navbar-inner">
    <a href="/" class="navbar-logo">
      <span class="logo-icon">\u2726</span>
      <span>FASHION<span class="logo-accent">STORE</span></span>
    </a>

    <div class="navbar-search">
      <form action="/products" method="GET" class="search-form-inline">
        <input type="text" name="q" placeholder="T\u00ECm ki\u1EBFm s\u1EA3n ph\u1EA9m..." class="search-input-main" autocomplete="off">
        <button type="submit" class="search-btn-main"><i class="fas fa-search"></i></button>
      </form>
      <div class="search-tags">
        <a href="/products?q=\u00E1o">Áo Th\u1EE5n</a>
        <a href="/products?q=qu\u1EA7n">Qu\u1EA7n Jean</a>
        <a href="/products?q=gi\u00E0y">Gi\u00E0y Sneaker</a>
        <a href="/products?gender=female">Th\u1EDDi Trang N\u1EEF</a>
        <a href="/products?sort=popular">B\u00E1n Ch\u1EA1y</a>
      </div>
    </div>

    <div class="navbar-actions">
      <a href="/cart" class="cart-icon-main" title="Gi\u1ECF h\u00E0ng">
        <i class="fas fa-shopping-cart"></i>
        <% if (typeof cartCount !== 'undefined' && cartCount > 0) { %>
          <span class="cart-badge-main"><%= cartCount %></span>
        <% } %>
      </a>
    </div>

    <button class="hamburger" id="hamburger" onclick="toggleNav()">
      <span></span><span></span><span></span>
    </button>
  </div>

  <div class="navbar-nav-row">
    <div class="container">
      <ul class="nav-links-row">
        <li><a href="/" class="<%= typeof currentPath !== 'undefined' && currentPath === '/' ? 'active' : '' %>">Trang ch\u1EE7</a></li>
        <li><a href="/products">T\u1EA5t c\u1EA3</a></li>
        <li><a href="/products?gender=male">Nam</a></li>
        <li><a href="/products?gender=female">N\u1EEF</a></li>
        <li><a href="/products?sort=popular">B\u00E1n ch\u1EA1y</a></li>
        <li><a href="/products?isNewArrival=true">H\u00E0ng m\u1EDBi</a></li>
        <% if (typeof user !== 'undefined' && user) { %>
          <li><a href="/orders">\u0110\u01A1n h\u00E0ng</a></li>
          <li><a href="/wishlist">Y\u00EAu th\u00EDch</a></li>
          <% if (user.Role === 'admin' || user.role === 'admin') { %>
            <li><a href="/admin/dashboard" style="color:var(--primary-gold)">Admin</a></li>
          <% } %>
        <% } %>
      </ul>
    </div>
  </div>
</nav>`;

// ===================== INDEX.EJS (Shopee-style Homepage) =====================
const indexEjs = `<%
  const formatPrice = (price) => price ? price.toLocaleString('vi-VN') : '0';
  const getImg = (product) => (product.images && product.images[0]) ? product.images[0] : 'https://picsum.photos/400/400?random=' + Math.random();
  const getDiscount = (p) => p.salePrice ? Math.round((1 - p.salePrice / p.price) * 100) : 0;
%>
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><%= title %></title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
  <link rel="stylesheet" href="/css/style.css">
  <link rel="stylesheet" href="/css/shopee.css">
</head>
<body>

<%- include('partials/navbar') %>

<!-- Flash Messages -->
<% if (typeof success !== 'undefined' && success && success.length) { %>
  <div class="flash flash-success"><i class="fas fa-check-circle"></i> <%= success[0] %></div>
<% } %>
<% if (typeof error !== 'undefined' && error && error.length) { %>
  <div class="flash flash-error"><i class="fas fa-exclamation-circle"></i> <%= error[0] %></div>
<% } %>

<!-- Hero Banner Slider -->
<section class="sp-banner-section">
  <div class="container">
    <div class="sp-banner-grid">
      <div class="sp-banner-main">
        <div class="sp-slider" id="heroSlider">
          <div class="sp-slide active" style="background-image: url('https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1200&auto=format&fit=crop');"></div>
          <div class="sp-slide" style="background-image: url('https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=1200&auto=format&fit=crop');"></div>
          <div class="sp-slide" style="background-image: url('https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200&auto=format&fit=crop');"></div>
        </div>
        <button class="sp-slider-arrow sp-prev" onclick="prevSlide()"><i class="fas fa-chevron-left"></i></button>
        <button class="sp-slider-arrow sp-next" onclick="nextSlide()"><i class="fas fa-chevron-right"></i></button>
        <div class="sp-slider-dots" id="sliderDots"></div>
      </div>
      <div class="sp-banner-side">
        <div class="sp-side-banner" style="background-image: url('https://images.unsplash.com/photo-1558618666-fcd25c85f82e?q=80&w=600&auto=format&fit=crop');">
          <div class="sp-side-overlay">
            <span>B\u1ED9 S\u01B0u T\u1EADp M\u1EDBi</span>
            <strong>GI\u1EA2M \u0110\u1EBEN 50%</strong>
          </div>
        </div>
        <div class="sp-side-banner" style="background-image: url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=600&auto=format&fit=crop');">
          <div class="sp-side-overlay">
            <span>Xu h\u01B0\u1EDBng 2024</span>
            <strong>FREESHIP \u0110\u01A0N T\u1EEA 300K</strong>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Service Icons Row -->
<section class="sp-services">
  <div class="container">
    <div class="sp-services-grid">
      <a href="/products?sort=popular" class="sp-service-item">
        <div class="sp-service-icon"><i class="fas fa-fire"></i></div>
        <span>B\u00E1n Ch\u1EA1y</span>
      </a>
      <a href="/products" class="sp-service-item">
        <div class="sp-service-icon"><i class="fas fa-tags"></i></div>
        <span>Gi\u1EA3m Gi\u00E1 S\u1ED1c</span>
      </a>
      <a href="/products?isNewArrival=true" class="sp-service-item">
        <div class="sp-service-icon"><i class="fas fa-star"></i></div>
        <span>H\u00E0ng M\u1EDBi V\u1EC1</span>
      </a>
      <a href="#" class="sp-service-item">
        <div class="sp-service-icon"><i class="fas fa-truck"></i></div>
        <span>Mi\u1EC5n Ph\u00ED Ship</span>
      </a>
      <a href="#" class="sp-service-item">
        <div class="sp-service-icon"><i class="fas fa-percent"></i></div>
        <span>M\u00E3 Gi\u1EA3m Gi\u00E1</span>
      </a>
      <a href="#" class="sp-service-item">
        <div class="sp-service-icon"><i class="fas fa-shield-alt"></i></div>
        <span>H\u00E0ng Ch\u00EDnh H\u00E3ng</span>
      </a>
    </div>
  </div>
</section>

<!-- Categories Grid (Shopee-style) -->
<section class="sp-categories">
  <div class="container">
    <div class="sp-section-header">
      <h2>DANH M\u1EE4C</h2>
    </div>
    <div class="sp-cat-grid">
      <% const catIcons = {'ao-nam':'fa-shirt','quan-nam':'fa-person','giay-nam':'fa-shoe-prints','phu-kien-nam':'fa-glasses','ao-nu':'fa-shirt','quan-nu':'fa-person-dress','giay-nu':'fa-shoe-prints','phu-kien-nu':'fa-gem'}; %>
      <% if (typeof categories !== 'undefined' && categories.length > 0) { %>
        <% categories.forEach(cat => { %>
          <a href="/products?category=<%= cat.Slug %>" class="sp-cat-item">
            <div class="sp-cat-icon">
              <i class="fas <%= catIcons[cat.Slug] || 'fa-tag' %>"></i>
            </div>
            <span><%= cat.Name %></span>
          </a>
        <% }); %>
      <% } else { %>
        <% const defaultCats = [
          {name:'Th\u1EDDi Trang Nam',icon:'fa-shirt',url:'/products?gender=male'},
          {name:'Th\u1EDDi Trang N\u1EEF',icon:'fa-person-dress',url:'/products?gender=female'},
          {name:'Gi\u00E0y D\u00E9p',icon:'fa-shoe-prints',url:'/products?category=giay'},
          {name:'Ph\u1EE5 Ki\u1EC7n',icon:'fa-gem',url:'/products?category=phu-kien'},
          {name:'\u0110\u1ED3ng H\u1ED3',icon:'fa-clock',url:'/products?category=dong-ho'},
          {name:'T\u00FAi X\u00E1ch',icon:'fa-bag-shopping',url:'/products?category=tui-xach'},
          {name:'Th\u1EBF Thao',icon:'fa-dumbbell',url:'/products?category=the-thao'},
          {name:'B\u00E1n Ch\u1EA1y',icon:'fa-fire',url:'/products?sort=popular'}
        ]; %>
        <% defaultCats.forEach(c => { %>
          <a href="<%= c.url %>" class="sp-cat-item">
            <div class="sp-cat-icon"><i class="fas <%= c.icon %>"></i></div>
            <span><%= c.name %></span>
          </a>
        <% }); %>
      <% } %>
    </div>
  </div>
</section>

<!-- Flash Sale Section -->
<% if (typeof bestSellers !== 'undefined' && bestSellers.length > 0) { %>
<section class="sp-flash-sale">
  <div class="container">
    <div class="sp-section-header sp-flash-header">
      <div class="sp-flash-title">
        <i class="fas fa-bolt"></i> FLASH SALE
        <div class="sp-countdown">
          <span class="sp-cd-box" id="cd-h">00</span>
          <span class="sp-cd-sep">:</span>
          <span class="sp-cd-box" id="cd-m">00</span>
          <span class="sp-cd-sep">:</span>
          <span class="sp-cd-box" id="cd-s">00</span>
        </div>
      </div>
      <a href="/products" class="sp-view-all">Xem t\u1EA5t c\u1EA3 <i class="fas fa-chevron-right"></i></a>
    </div>
    <div class="sp-flash-grid">
      <% bestSellers.slice(0,6).forEach(product => { %>
        <a href="/products/<%= product.slug %>" class="sp-flash-card">
          <div class="sp-flash-img">
            <img src="<%= getImg(product) %>" alt="<%= product.name %>" loading="lazy">
            <% if (getDiscount(product) > 0) { %>
              <span class="sp-discount-badge"><%= getDiscount(product) %>% GI\u1EA2M</span>
            <% } %>
          </div>
          <div class="sp-flash-price">
            <span class="sp-price-now">\u0111<%= formatPrice(product.salePrice || product.price) %></span>
          </div>
          <div class="sp-sold-bar">
            <div class="sp-sold-fill" style="width:<%= Math.min((product.Sold || product.sold || 0) * 3, 100) %>%"></div>
            <span>\u0110\u00E3 b\u00E1n <%= product.Sold || product.sold || 0 %></span>
          </div>
        </a>
      <% }); %>
    </div>
  </div>
</section>
<% } %>

<!-- Featured Products -->
<section class="sp-products-section">
  <div class="container">
    <div class="sp-section-header">
      <h2>S\u1EA2N PH\u1EA8M N\u1ED4I B\u1EACT</h2>
      <a href="/products?isFeatured=true" class="sp-view-all">Xem t\u1EA5t c\u1EA3 <i class="fas fa-chevron-right"></i></a>
    </div>
    <div class="sp-product-grid">
      <% if (featuredProducts && featuredProducts.length > 0) { %>
        <% featuredProducts.forEach(product => { %>
          <a href="/products/<%= product.slug %>" class="sp-product-card">
            <div class="sp-card-img">
              <img src="<%= getImg(product) %>" alt="<%= product.name %>" loading="lazy">
              <% if (getDiscount(product) > 0) { %>
                <span class="sp-badge-discount">-<%= getDiscount(product) %>%</span>
              <% } %>
              <% if (product.isNewArrival) { %>
                <span class="sp-badge-new">M\u1EDBi</span>
              <% } %>
            </div>
            <div class="sp-card-info">
              <h3 class="sp-card-name"><%= product.name %></h3>
              <div class="sp-card-price-row">
                <% if (product.salePrice) { %>
                  <span class="sp-card-price">\u0111<%= formatPrice(product.salePrice) %></span>
                  <span class="sp-card-original">\u0111<%= formatPrice(product.price) %></span>
                <% } else { %>
                  <span class="sp-card-price">\u0111<%= formatPrice(product.price) %></span>
                <% } %>
              </div>
              <div class="sp-card-bottom">
                <div class="sp-card-rating">
                  <% for(let i=1; i<=5; i++) { %>
                    <i class="fas fa-star <%= i <= Math.round(product.rating) ? 'filled' : '' %>"></i>
                  <% } %>
                </div>
                <span class="sp-card-sold">\u0110\u00E3 b\u00E1n <%= product.Sold || product.sold || 0 %></span>
              </div>
            </div>
          </a>
        <% }); %>
      <% } %>
    </div>
  </div>
</section>

<!-- New Arrivals -->
<section class="sp-products-section sp-bg-gray">
  <div class="container">
    <div class="sp-section-header">
      <h2>H\u00C0NG M\u1EDAI V\u1EC0</h2>
      <a href="/products?isNewArrival=true" class="sp-view-all">Xem t\u1EA5t c\u1EA3 <i class="fas fa-chevron-right"></i></a>
    </div>
    <div class="sp-product-grid">
      <% if (newArrivals && newArrivals.length > 0) { %>
        <% newArrivals.forEach(product => { %>
          <a href="/products/<%= product.slug %>" class="sp-product-card">
            <div class="sp-card-img">
              <img src="<%= getImg(product) %>" alt="<%= product.name %>" loading="lazy">
              <% if (getDiscount(product) > 0) { %>
                <span class="sp-badge-discount">-<%= getDiscount(product) %>%</span>
              <% } %>
              <span class="sp-badge-new">M\u1EDBi</span>
            </div>
            <div class="sp-card-info">
              <h3 class="sp-card-name"><%= product.name %></h3>
              <div class="sp-card-price-row">
                <% if (product.salePrice) { %>
                  <span class="sp-card-price">\u0111<%= formatPrice(product.salePrice) %></span>
                  <span class="sp-card-original">\u0111<%= formatPrice(product.price) %></span>
                <% } else { %>
                  <span class="sp-card-price">\u0111<%= formatPrice(product.price) %></span>
                <% } %>
              </div>
              <div class="sp-card-bottom">
                <div class="sp-card-rating">
                  <% for(let i=1; i<=5; i++) { %>
                    <i class="fas fa-star <%= i <= Math.round(product.rating) ? 'filled' : '' %>"></i>
                  <% } %>
                </div>
                <span class="sp-card-sold">\u0110\u00E3 b\u00E1n <%= product.Sold || product.sold || 0 %></span>
              </div>
            </div>
          </a>
        <% }); %>
      <% } %>
    </div>
  </div>
</section>

<!-- All Products Feed (Shopee "G\u1ee3i \u00dd H\u00f4m Nay" style) -->
<section class="sp-products-section">
  <div class="container">
    <div class="sp-section-header sp-daily-header">
      <h2>G\u1EE2I \u00DD H\u00D4M NAY</h2>
    </div>
    <div class="sp-product-grid">
      <% if (typeof allProducts !== 'undefined' && allProducts.length > 0) { %>
        <% allProducts.forEach(product => { %>
          <a href="/products/<%= product.slug %>" class="sp-product-card">
            <div class="sp-card-img">
              <img src="<%= getImg(product) %>" alt="<%= product.name %>" loading="lazy">
              <% if (getDiscount(product) > 0) { %>
                <span class="sp-badge-discount">-<%= getDiscount(product) %>%</span>
              <% } %>
            </div>
            <div class="sp-card-info">
              <h3 class="sp-card-name"><%= product.name %></h3>
              <div class="sp-card-price-row">
                <% if (product.salePrice) { %>
                  <span class="sp-card-price">\u0111<%= formatPrice(product.salePrice) %></span>
                  <span class="sp-card-original">\u0111<%= formatPrice(product.price) %></span>
                <% } else { %>
                  <span class="sp-card-price">\u0111<%= formatPrice(product.price) %></span>
                <% } %>
              </div>
              <div class="sp-card-bottom">
                <div class="sp-card-rating">
                  <% for(let i=1; i<=5; i++) { %>
                    <i class="fas fa-star <%= i <= Math.round(product.rating) ? 'filled' : '' %>"></i>
                  <% } %>
                </div>
                <span class="sp-card-sold">\u0110\u00E3 b\u00E1n <%= product.Sold || product.sold || 0 %></span>
              </div>
            </div>
          </a>
        <% }); %>
      <% } %>
    </div>
    <div class="sp-load-more">
      <a href="/products" class="sp-load-more-btn">Xem Th\u00EAm <i class="fas fa-chevron-down"></i></a>
    </div>
  </div>
</section>

<%- include('partials/footer') %>

<button class="scroll-top" id="scrollTop" onclick="window.scrollTo({top:0,behavior:'smooth'})"><i class="fas fa-arrow-up"></i></button>

<script>
// Slider
let currentSlide = 0;
const slides = document.querySelectorAll('.sp-slide');
const dotsContainer = document.getElementById('sliderDots');
if (slides.length) {
  slides.forEach((_, i) => {
    const dot = document.createElement('span');
    dot.className = 'sp-dot' + (i === 0 ? ' active' : '');
    dot.onclick = () => goToSlide(i);
    dotsContainer.appendChild(dot);
  });
}
function goToSlide(n) {
  slides.forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.sp-dot').forEach(d => d.classList.remove('active'));
  currentSlide = n;
  slides[currentSlide].classList.add('active');
  document.querySelectorAll('.sp-dot')[currentSlide].classList.add('active');
}
function nextSlide() { goToSlide((currentSlide + 1) % slides.length); }
function prevSlide() { goToSlide((currentSlide - 1 + slides.length) % slides.length); }
setInterval(nextSlide, 5000);

// Countdown timer (fake flash sale)
function updateCD() {
  const now = new Date();
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);
  const diff = end - now;
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  const hEl = document.getElementById('cd-h');
  const mEl = document.getElementById('cd-m');
  const sEl = document.getElementById('cd-s');
  if (hEl) hEl.textContent = String(h).padStart(2, '0');
  if (mEl) mEl.textContent = String(m).padStart(2, '0');
  if (sEl) sEl.textContent = String(s).padStart(2, '0');
}
updateCD();
setInterval(updateCD, 1000);

// Scroll top
window.addEventListener('scroll', () => {
  const btn = document.getElementById('scrollTop');
  if (btn) btn.style.display = window.scrollY > 300 ? 'flex' : 'none';
});
</script>
<script src="/js/main.js"></script>
</body>
</html>`;

// Write files
fs.writeFileSync(path.join(viewsDir, 'partials/navbar.ejs'), navbar, 'utf8');
console.log('OK: navbar.ejs');

fs.writeFileSync(path.join(viewsDir, 'index.ejs'), indexEjs, 'utf8');
console.log('OK: index.ejs');

console.log('\nViews rebuilt with Shopee layout!');
