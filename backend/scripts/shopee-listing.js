const fs = require('fs');

// ===== 1. Rewrite products/list.ejs =====
const listEjs = `<%
  const fmt = (p) => p ? Number(p).toLocaleString('vi-VN') : '0';
  const getImg = (p) => (p.images && p.images[0]) ? p.images[0] : 'https://picsum.photos/400/400?random=' + (p._id || Math.random());
  const getDiscount = (p) => p.salePrice ? Math.round((1 - p.salePrice / p.price) * 100) : 0;
%>
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><%= title %> | Fashion Store</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
  <link rel="stylesheet" href="/css/style.css">
  <link rel="stylesheet" href="/css/shopee.css">
  <link rel="stylesheet" href="/css/listing.css">
</head>
<body>
<% if (typeof success !== 'undefined' && success && success.length) { %><div class="flash flash-success"><i class="fas fa-check-circle"></i> <%= success[0] %></div><% } %>
<% if (typeof error !== 'undefined' && error && error.length) { %><div class="flash flash-error"><i class="fas fa-exclamation-circle"></i> <%= error[0] %></div><% } %>
<%- include('../partials/navbar') %>

<!-- Breadcrumb -->
<div class="sp-breadcrumb">
  <div class="container">
    <a href="/">Trang ch\u1EE7</a> <i class="fas fa-chevron-right"></i>
    <span>S\u1EA3n ph\u1EA9m</span>
    <% if (filters.q) { %> <i class="fas fa-chevron-right"></i> <span>T\u00ECm ki\u1EBFm: "<%= filters.q %>"</span><% } %>
    <% if (filters.gender) { %> <i class="fas fa-chevron-right"></i> <span><%= filters.gender==='male'?'Nam':filters.gender==='female'?'N\u1EEF':'Unisex' %></span><% } %>
  </div>
</div>

<div class="container spl-layout">
  <!-- LEFT SIDEBAR -->
  <aside class="spl-sidebar">
    <form action="/products" method="GET" id="filterForm">
      <% if (filters.q) { %><input type="hidden" name="q" value="<%= filters.q %>"><% } %>

      <div class="spl-filter-title"><i class="fas fa-filter"></i> B\u1ED8 L\u1ECCC T\u00CCM KI\u1EBEM</div>

      <!-- Gender -->
      <div class="spl-filter-group">
        <h4>Gi\u1EDBi t\u00EDnh</h4>
        <label class="spl-checkbox"><input type="radio" name="gender" value="" <%= !filters.gender?'checked':'' %> onchange="this.form.submit()"><span>T\u1EA5t c\u1EA3</span></label>
        <label class="spl-checkbox"><input type="radio" name="gender" value="male" <%= filters.gender==='male'?'checked':'' %> onchange="this.form.submit()"><span>Nam</span></label>
        <label class="spl-checkbox"><input type="radio" name="gender" value="female" <%= filters.gender==='female'?'checked':'' %> onchange="this.form.submit()"><span>N\u1EEF</span></label>
        <label class="spl-checkbox"><input type="radio" name="gender" value="unisex" <%= filters.gender==='unisex'?'checked':'' %> onchange="this.form.submit()"><span>Unisex</span></label>
      </div>

      <!-- Categories -->
      <div class="spl-filter-group">
        <h4>Danh m\u1EE5c</h4>
        <% if (typeof categories !== 'undefined') { %>
          <% categories.forEach(cat => { %>
            <label class="spl-checkbox">
              <input type="radio" name="category" value="<%= cat.Slug %>" <%= filters.category===cat.Slug?'checked':'' %> onchange="this.form.submit()">
              <span><%= cat.Name %></span>
            </label>
          <% }); %>
        <% } %>
      </div>

      <!-- Price -->
      <div class="spl-filter-group">
        <h4>Kho\u1EA3ng gi\u00E1</h4>
        <div class="spl-price-row">
          <input type="number" name="minPrice" placeholder="\u0110 T\u1EEB" value="<%= filters.minPrice||'' %>" class="spl-price-input">
          <span class="spl-price-sep">\u2014</span>
          <input type="number" name="maxPrice" placeholder="\u0110 \u0110\u1EBFn" value="<%= filters.maxPrice||'' %>" class="spl-price-input">
        </div>
        <button type="submit" class="spl-apply-btn">\u00C1P D\u1EE4NG</button>
      </div>

      <!-- Quick Price -->
      <div class="spl-price-tags">
        <button type="button" class="spl-tag" onclick="setPrice(0,200000)">D\u01B0\u1EDBi 200K</button>
        <button type="button" class="spl-tag" onclick="setPrice(200000,500000)">200K-500K</button>
        <button type="button" class="spl-tag" onclick="setPrice(500000,1000000)">500K-1M</button>
        <button type="button" class="spl-tag" onclick="setPrice(1000000,'')">Tr\u00EAn 1M</button>
      </div>

      <a href="/products" class="spl-clear-btn">X\u00F3a t\u1EA5t c\u1EA3</a>
    </form>
  </aside>

  <!-- RIGHT: Products -->
  <main class="spl-main">
    <!-- Search Result Header -->
    <% if (filters.q) { %>
      <div class="spl-search-result">
        <i class="fas fa-lightbulb"></i> K\u1EBFt qu\u1EA3 t\u00ECm ki\u1EBFm cho '<strong><%= filters.q %></strong>'
      </div>
    <% } %>

    <!-- Sort Tabs -->
    <div class="spl-sort-bar">
      <span class="spl-sort-label">S\u1EAFp x\u1EBFp theo</span>
      <a href="?<%= new URLSearchParams({...filters, sort:'-createdAt', page:1}).toString() %>" class="spl-sort-tab <%= !filters.sort||filters.sort==='-createdAt'?'active':'' %>">M\u1EDBi Nh\u1EA5t</a>
      <a href="?<%= new URLSearchParams({...filters, sort:'popular', page:1}).toString() %>" class="spl-sort-tab <%= filters.sort==='popular'?'active':'' %>">B\u00E1n Ch\u1EA1y</a>
      <a href="?<%= new URLSearchParams({...filters, sort:'rating', page:1}).toString() %>" class="spl-sort-tab <%= filters.sort==='rating'?'active':'' %>">\u0110\u00E1nh Gi\u00E1</a>
      <select class="spl-sort-select" onchange="applySort(this.value)">
        <option value="">Gi\u00E1</option>
        <option value="price-asc" <%= filters.sort==='price-asc'?'selected':'' %>>Gi\u00E1: Th\u1EA5p \u2192 Cao</option>
        <option value="price-desc" <%= filters.sort==='price-desc'?'selected':'' %>>Gi\u00E1: Cao \u2192 Th\u1EA5p</option>
      </select>
      <div class="spl-sort-right">
        <span class="spl-page-info"><%= typeof currentPage !== 'undefined' ? currentPage : 1 %>/<%= typeof totalPages !== 'undefined' ? totalPages : 1 %></span>
        <% if (typeof totalPages !== 'undefined' && totalPages > 1) { %>
          <a href="?<%= new URLSearchParams({...filters, page: Math.max(1,(currentPage||1)-1)}).toString() %>" class="spl-page-arrow"><i class="fas fa-chevron-left"></i></a>
          <a href="?<%= new URLSearchParams({...filters, page: Math.min(totalPages,(currentPage||1)+1)}).toString() %>" class="spl-page-arrow"><i class="fas fa-chevron-right"></i></a>
        <% } %>
      </div>
    </div>

    <!-- Products Grid -->
    <% if (products.length === 0) { %>
      <div class="spl-empty">
        <i class="fas fa-box-open"></i>
        <h3>Kh\u00F4ng t\u00ECm th\u1EA5y s\u1EA3n ph\u1EA9m</h3>
        <p>Th\u1EED \u0111i\u1EC1u ch\u1EC9nh b\u1ED9 l\u1ECDc ho\u1EB7c t\u1EEB kh\u00F3a t\u00ECm ki\u1EBFm</p>
        <a href="/products" class="btn btn-primary">Xem t\u1EA5t c\u1EA3</a>
      </div>
    <% } else { %>
      <div class="spl-grid">
        <% products.forEach(product => { %>
          <a href="/products/<%= product.slug %>" class="spl-card">
            <div class="spl-card-img">
              <img src="<%= getImg(product) %>" alt="<%= product.name %>" loading="lazy">
              <% if (getDiscount(product) > 0) { %>
                <span class="spl-badge-sale"><%= getDiscount(product) %>%<br><small>GI\u1EA2M</small></span>
              <% } %>
              <% if (product.isNewArrival) { %>
                <span class="spl-badge-new">M\u1EDBi</span>
              <% } %>
              <div class="spl-card-hover">
                <span><i class="fas fa-eye"></i> Xem nhanh</span>
              </div>
            </div>
            <div class="spl-card-body">
              <h3 class="spl-card-name"><%= product.name %></h3>
              <div class="spl-card-price">
                <% if (product.salePrice) { %>
                  <span class="spl-price-now">\u0111<%= fmt(product.salePrice) %></span>
                  <span class="spl-price-old">\u0111<%= fmt(product.price) %></span>
                <% } else { %>
                  <span class="spl-price-now">\u0111<%= fmt(product.price) %></span>
                <% } %>
              </div>
              <div class="spl-card-meta">
                <div class="spl-card-stars">
                  <% for(let i=1; i<=5; i++) { %>
                    <i class="fas fa-star <%= i<=Math.round(product.rating)?'filled':'' %>"></i>
                  <% } %>
                </div>
                <span class="spl-card-sold">\u0110\u00E3 b\u00E1n <%= product.Sold || product.sold || 0 %></span>
              </div>
            </div>
          </a>
        <% }); %>
      </div>

      <!-- Pagination -->
      <% if (typeof totalPages !== 'undefined' && totalPages > 1) { %>
        <div class="spl-pagination">
          <% if ((currentPage||1) > 1) { %>
            <a href="?<%= new URLSearchParams({...filters, page:(currentPage||1)-1}).toString() %>" class="spl-page-btn"><i class="fas fa-chevron-left"></i></a>
          <% } %>
          <% for(let i=1; i<=totalPages; i++) { %>
            <a href="?<%= new URLSearchParams({...filters, page:i}).toString() %>" class="spl-page-btn <%= i===(currentPage||1)?'active':'' %>"><%= i %></a>
          <% } %>
          <% if ((currentPage||1) < totalPages) { %>
            <a href="?<%= new URLSearchParams({...filters, page:(currentPage||1)+1}).toString() %>" class="spl-page-btn"><i class="fas fa-chevron-right"></i></a>
          <% } %>
        </div>
      <% } %>
    <% } %>
  </main>
</div>

<%- include('../partials/footer') %>
<button class="scroll-top" id="scrollTop" onclick="window.scrollTo({top:0,behavior:'smooth'})"><i class="fas fa-arrow-up"></i></button>

<script>
function applySort(val) {
  const url = new URL(window.location);
  url.searchParams.set('sort', val);
  url.searchParams.set('page', '1');
  window.location = url.toString();
}
function setPrice(min, max) {
  document.querySelector('[name=minPrice]').value = min;
  document.querySelector('[name=maxPrice]').value = max || '';
  document.getElementById('filterForm').submit();
}
</script>
<script src="/js/main.js"></script>
</body>
</html>`;

fs.writeFileSync('d:/Code/web/fashion-store/views/products/list.ejs', listEjs, 'utf8');
console.log('OK: list.ejs rewritten');

// Verify Vietnamese
const v = fs.readFileSync('d:/Code/web/fashion-store/views/products/list.ejs', 'utf8');
console.log('Has "Sắp xếp theo":', v.includes('S\u1EAFp x\u1EBFp theo'));
console.log('Has "Bán Chạy":', v.includes('B\u00E1n Ch\u1EA1y'));
console.log('Has "Danh mục":', v.includes('Danh m\u1EE5c'));
