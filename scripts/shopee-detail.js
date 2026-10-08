const fs = require('fs');

const detailEjs = `<%
  function fmt(p) { return p ? Number(p).toLocaleString('vi-VN') : '0'; }
  function img0(p) { return (p.images && p.images[0]) ? p.images[0] : 'https://picsum.photos/600/600?random=' + Math.random(); }
  const discount = product.salePrice ? Math.round((1 - product.salePrice / product.price) * 100) : 0;
%>
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><%= product.name %> | Fashion Store</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
  <link rel="stylesheet" href="/css/style.css">
  <link rel="stylesheet" href="/css/shopee.css">
  <link rel="stylesheet" href="/css/detail.css">
</head>
<body>
<% if (typeof success !== 'undefined' && success && success.length) { %><div class="flash flash-success"><i class="fas fa-check-circle"></i> <%= success[0] %></div><% } %>
<% if (typeof error !== 'undefined' && error && error.length) { %><div class="flash flash-error"><i class="fas fa-exclamation-circle"></i> <%= error[0] %></div><% } %>
<%- include('../partials/navbar') %>

<!-- Breadcrumb -->
<div class="sp-breadcrumb">
  <div class="container">
    <a href="/">Trang ch\\u1EE7</a>
    <i class="fas fa-chevron-right"></i>
    <a href="/products">S\\u1EA3n ph\\u1EA9m</a>
    <% if (product.category && product.category.name) { %>
      <i class="fas fa-chevron-right"></i>
      <a href="/products?category=<%= product.category._id %>"><%= product.category.name %></a>
    <% } %>
    <i class="fas fa-chevron-right"></i>
    <span><%= product.name %></span>
  </div>
</div>

<!-- Main Product Section -->
<div class="container">
  <div class="spd-main">
    <!-- LEFT: Gallery -->
    <div class="spd-gallery">
      <div class="spd-main-img">
        <img src="<%= img0(product) %>" alt="<%= product.name %>" id="mainImage">
        <% if (discount > 0) { %>
          <span class="spd-discount-badge"><%= discount %>% GI\\u1EA2M</span>
        <% } %>
      </div>
      <div class="spd-thumbs">
        <% var imgList = (product.images && product.images.length) ? product.images : [img0(product)]; %>
        <% for(var gi=0; gi < imgList.length; gi++) { %>
          <div class="spd-thumb <%= gi===0?'active':'' %>" onclick="changeImage('<%= imgList[gi] %>', this)">
            <img src="<%= imgList[gi] %>" alt="thumb">
          </div>
        <% } %>
      </div>
      <div class="spd-share">
        <span>Chia s\\u1EBB:</span>
        <a href="#"><i class="fab fa-facebook"></i></a>
        <a href="#"><i class="fab fa-instagram"></i></a>
        <a href="#"><i class="fab fa-twitter"></i></a>
        <div class="spd-wishlist-inline">
          <button class="spd-wish-btn wishlist-btn <%= isWishlisted?'wishlisted':'' %>" data-id="<%= product.Id %>">
            <i class="<%= isWishlisted?'fas':'far' %> fa-heart"></i>
            \\u0110\\u00E3 th\\u00EDch
          </button>
        </div>
      </div>
    </div>

    <!-- RIGHT: Product Info -->
    <div class="spd-info">
      <h1 class="spd-title">
        <% if (product.isFeatured) { %><span class="spd-mall-badge">N\\u1ED5i b\\u1EADt</span><% } %>
        <%= product.name %>
      </h1>

      <div class="spd-rating-row">
        <div class="spd-rating-score">
          <span class="spd-rating-num"><%= product.rating.toFixed(1) %></span>
          <div class="spd-stars">
            <% for(var si=1; si<=5; si++) { %>
              <i class="fas fa-star" style="color:<%= si<=Math.round(product.rating)?'#ffc107':'#ddd' %>"></i>
            <% } %>
          </div>
        </div>
        <div class="spd-sep"></div>
        <div class="spd-stat">
          <span class="spd-stat-num"><%= product.numReviews %></span>
          <span class="spd-stat-label">\\u0110\\u00E1nh Gi\\u00E1</span>
        </div>
        <div class="spd-sep"></div>
        <div class="spd-stat">
          <span class="spd-stat-num"><%= product.Sold || 0 %></span>
          <span class="spd-stat-label">\\u0110\\u00E3 B\\u00E1n</span>
        </div>
      </div>

      <!-- Price -->
      <div class="spd-price-box">
        <% if (product.salePrice) { %>
          <span class="spd-price-original">\\u0111<%= fmt(product.price) %></span>
          <span class="spd-price-sale">\\u0111<%= fmt(product.salePrice) %></span>
          <span class="spd-price-discount"><%= discount %>% GI\\u1EA2M</span>
        <% } else { %>
          <span class="spd-price-sale">\\u0111<%= fmt(product.price) %></span>
        <% } %>
      </div>

      <!-- Shipping -->
      <div class="spd-info-row">
        <span class="spd-label">V\\u1EADn Chuy\\u1EC3n</span>
        <div class="spd-value">
          <div><i class="fas fa-truck" style="color:#26aa99;margin-right:6px"></i> Mi\\u1EC5n ph\\u00ED v\\u1EADn chuy\\u1EC3n cho \\u0111\\u01A1n t\\u1EEB 500.000\\u0111</div>
          <div style="font-size:0.8rem;color:#999;margin-top:4px"><i class="fas fa-shield-alt" style="margin-right:4px"></i> Tr\\u1EA3 h\\u00E0ng mi\\u1EC5n ph\\u00ED 15 ng\\u00E0y \\u2022 Ch\\u00EDnh h\\u00E3ng 100%</div>
        </div>
      </div>

      <!-- Color Selection -->
      <% if (colors && colors.length > 0) { %>
      <div class="spd-info-row">
        <span class="spd-label">M\\u00E0u S\\u1EAFc</span>
        <div class="spd-value">
          <div class="spd-options" id="colorOptions">
            <% for(var ci=0; ci<colors.length; ci++) { %>
              <button type="button" class="spd-opt-btn <%= ci===0?'active':'' %>" onclick="selectColor(this, '<%= colors[ci] %>')" data-color="<%= colors[ci] %>">
                <%= colors[ci] %>
              </button>
            <% } %>
          </div>
        </div>
      </div>
      <% } %>

      <!-- Size Selection -->
      <% if (sizes && sizes.length > 0) { %>
      <div class="spd-info-row">
        <span class="spd-label">
          K\\u00EDch C\\u1EE1
          <a href="#" id="openSizeGuide" class="spd-size-guide"><i class="fas fa-ruler"></i> B\\u1EA3ng size</a>
        </span>
        <div class="spd-value">
          <div class="spd-options" id="sizeOptions">
            <% for(var szi=0; szi<sizes.length; szi++) { %>
              <button type="button" class="spd-opt-btn <%= szi===0?'active':'' %>" onclick="selectSize(this, '<%= sizes[szi] %>')" data-size="<%= sizes[szi] %>">
                <%= sizes[szi] %>
              </button>
            <% } %>
          </div>
        </div>
      </div>
      <% } %>

      <!-- Quantity -->
      <div class="spd-info-row">
        <span class="spd-label">S\\u1ED1 L\\u01B0\\u1EE3ng</span>
        <div class="spd-value">
          <div class="spd-qty">
            <button type="button" onclick="changeQty(-1)" class="spd-qty-btn">-</button>
            <input type="number" id="qtyInput" value="1" min="1" max="99" class="spd-qty-input">
            <button type="button" onclick="changeQty(1)" class="spd-qty-btn">+</button>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="spd-actions">
        <button class="spd-add-cart" onclick="addToCartDetail()">
          <i class="fas fa-cart-plus"></i> Th\\u00EAm V\\u00E0o Gi\\u1ECF H\\u00E0ng
        </button>
        <button class="spd-buy-now" onclick="addToCartDetail(); window.location.href='/cart';">
          Mua Ngay
        </button>
      </div>

      <div class="spd-guarantees">
        <span><i class="fas fa-shield-alt"></i> H\\u00E0ng ch\\u00EDnh h\\u00E3ng</span>
        <span><i class="fas fa-undo"></i> \\u0110\\u1ED5i tr\\u1EA3 7 ng\\u00E0y</span>
        <span><i class="fas fa-truck"></i> Giao h\\u00E0ng nhanh</span>
      </div>
    </div>
  </div>

  <!-- Product Details Table (Shopee-style) -->
  <div class="spd-details-section">
    <div class="spd-details-card">
      <h2>CHI TI\\u1EBET S\\u1EA2N PH\\u1EA8M</h2>
      <table class="spd-specs-table">
        <tr>
          <td class="spd-spec-label">Danh M\\u1EE5c</td>
          <td><%= product.category && product.category.name ? product.category.name : 'N/A' %></td>
        </tr>
        <% if (product.Brand) { %>
        <tr>
          <td class="spd-spec-label">Th\\u01B0\\u01A1ng hi\\u1EC7u</td>
          <td><%= product.Brand %></td>
        </tr>
        <% } %>
        <tr>
          <td class="spd-spec-label">Gi\\u1EDBi t\\u00EDnh</td>
          <td><%= product.Gender==='male'?'Nam':product.Gender==='female'?'N\\u1EEF':'Unisex' %></td>
        </tr>
        <% if (colors && colors.length) { %>
        <tr>
          <td class="spd-spec-label">M\\u00E0u s\\u1EAFc</td>
          <td><%= colors.join(', ') %></td>
        </tr>
        <% } %>
        <% if (sizes && sizes.length) { %>
        <tr>
          <td class="spd-spec-label">K\\u00EDch c\\u1EE1</td>
          <td><%= sizes.join(', ') %></td>
        </tr>
        <% } %>
      </table>
    </div>

    <div class="spd-details-card">
      <h2>M\\u00D4 T\\u1EA2 S\\u1EA2N PH\\u1EA8M</h2>
      <div class="spd-description">
        <%= product.description || 'Ch\\u01B0a c\\u00F3 m\\u00F4 t\\u1EA3 s\\u1EA3n ph\\u1EA9m.' %>
      </div>
    </div>
  </div>

  <!-- Reviews Section -->
  <div class="spd-details-card">
    <h2>\\u0110\\u00C1NH GI\\u00C1 S\\u1EA2N PH\\u1EA8M</h2>
    <div class="spd-review-summary">
      <div class="spd-review-score">
        <span class="spd-big-score"><%= product.rating.toFixed(1) %></span>
        <span>tr\\u00EAn 5</span>
        <div class="spd-stars-lg">
          <% for(var si=1; si<=5; si++) { %>
            <i class="fas fa-star" style="color:<%= si<=Math.round(product.rating)?'#ffc107':'#ddd' %>"></i>
          <% } %>
        </div>
      </div>
    </div>

    <% if (user) { %>
    <div class="spd-review-form">
      <form action="/products/review" method="POST">
        <input type="hidden" name="productId" value="<%= product.Id %>">
        <div class="spd-star-select">
          <label>\\u0110\\u00E1nh gi\\u00E1 c\\u1EE7a b\\u1EA1n:</label>
          <div class="spd-star-input">
            <% for(var ri=5; ri>=1; ri--) { %>
              <input type="radio" name="rating" value="<%= ri %>" id="star<%= ri %>" <%= ri===5?'checked':'' %>>
              <label for="star<%= ri %>"><i class="fas fa-star"></i></label>
            <% } %>
          </div>
        </div>
        <textarea name="comment" placeholder="Chia s\\u1EBB tr\\u1EA3i nghi\\u1EC7m c\\u1EE7a b\\u1EA1n v\\u1EC1 s\\u1EA3n ph\\u1EA9m..." rows="4" class="spd-review-textarea"></textarea>
        <button type="submit" class="spd-submit-review">G\\u1EEDi \\u0111\\u00E1nh gi\\u00E1</button>
      </form>
    </div>
    <% } else { %>
    <div class="spd-login-prompt">
      <a href="/auth/login">\\u0110\\u0103ng nh\\u1EADp</a> \\u0111\\u1EC3 vi\\u1EBFt \\u0111\\u00E1nh gi\\u00E1
    </div>
    <% } %>

    <div class="spd-reviews-list">
      <% if (reviews && reviews.length > 0) { %>
        <% reviews.forEach(function(rev) { %>
        <div class="spd-review-item">
          <div class="spd-reviewer-avatar">
            <%= rev.UserName ? rev.UserName.charAt(0).toUpperCase() : 'U' %>
          </div>
          <div class="spd-review-content">
            <strong><%= rev.UserName || 'Kh\\u00E1ch h\\u00E0ng' %></strong>
            <div class="spd-review-stars">
              <% for(var sti=1; sti<=5; sti++) { %>
                <i class="fas fa-star" style="color:<%= sti<=rev.Rating?'#ffc107':'#ddd' %>; font-size:0.75rem"></i>
              <% } %>
            </div>
            <span class="spd-review-date"><%= rev.CreatedAt ? new Date(rev.CreatedAt).toLocaleDateString('vi-VN') : '' %></span>
            <p><%= rev.Comment %></p>
          </div>
        </div>
        <% }); %>
      <% } else { %>
        <div class="spd-no-reviews">
          <i class="fas fa-comment-slash"></i>
          <p>Ch\\u01B0a c\\u00F3 \\u0111\\u00E1nh gi\\u00E1 n\\u00E0o</p>
        </div>
      <% } %>
    </div>
  </div>

  <!-- Related Products -->
  <% if (relatedProducts && relatedProducts.length > 0) { %>
  <div class="spd-details-card">
    <h2>S\\u1EA2N PH\\u1EA8M LI\\u00CAN QUAN</h2>
    <div class="sp-product-grid">
      <% relatedProducts.forEach(function(rp) { %>
        <a href="/products/<%= rp.slug %>" class="sp-product-card">
          <div class="sp-card-img">
            <img src="<%= img0(rp) %>" alt="<%= rp.name %>" loading="lazy">
            <% if (rp.salePrice) { %>
              <span class="sp-badge-discount">-<%= Math.round((1-rp.salePrice/rp.price)*100) %>%</span>
            <% } %>
          </div>
          <div class="sp-card-info">
            <h3 class="sp-card-name"><%= rp.name %></h3>
            <div class="sp-card-price-row">
              <% if (rp.salePrice) { %>
                <span class="sp-card-price">\\u0111<%= fmt(rp.salePrice) %></span>
                <span class="sp-card-original">\\u0111<%= fmt(rp.price) %></span>
              <% } else { %>
                <span class="sp-card-price">\\u0111<%= fmt(rp.price) %></span>
              <% } %>
            </div>
            <div class="sp-card-bottom">
              <span class="sp-card-sold">\\u0110\\u00E3 b\\u00E1n <%= rp.Sold || rp.sold || 0 %></span>
            </div>
          </div>
        </a>
      <% }); %>
    </div>
  </div>
  <% } %>
</div>

<%- include('../partials/footer') %>
<button class="scroll-top" id="scrollTop" onclick="window.scrollTo({top:0,behavior:'smooth'})"><i class="fas fa-arrow-up"></i></button>

<!-- Size Guide Modal -->
<div id="sizeGuideModal" class="spd-modal" style="display:none">
  <div class="spd-modal-content">
    <button onclick="document.getElementById('sizeGuideModal').style.display='none'" class="spd-modal-close">&times;</button>
    <h3>B\\u1EA3ng h\\u01B0\\u1EDBng d\\u1EABn ch\\u1ECDn size</h3>
    <table class="spd-size-table">
      <thead>
        <tr><th>Size</th><th>Chi\\u1EC1u cao (cm)</th><th>C\\u00E2n n\\u1EB7ng (kg)</th><th>Ng\\u1EF1c (cm)</th><th>Eo (cm)</th></tr>
      </thead>
      <tbody>
        <tr><td>XS</td><td>150 - 155</td><td>40 - 45</td><td>78 - 82</td><td>60 - 64</td></tr>
        <tr><td>S</td><td>155 - 160</td><td>45 - 50</td><td>82 - 86</td><td>64 - 68</td></tr>
        <tr><td>M</td><td>160 - 168</td><td>50 - 58</td><td>86 - 92</td><td>68 - 74</td></tr>
        <tr><td>L</td><td>168 - 175</td><td>58 - 68</td><td>92 - 98</td><td>74 - 80</td></tr>
        <tr><td>XL</td><td>175 - 182</td><td>68 - 78</td><td>98 - 104</td><td>80 - 86</td></tr>
        <tr><td>XXL</td><td>> 182</td><td>> 78</td><td>> 104</td><td>> 86</td></tr>
      </tbody>
    </table>
    <p style="font-size:0.8rem;color:#999;margin-top:12px;font-style:italic">* B\\u1EA3ng size ch\\u1EC9 mang t\\u00EDnh tham kh\\u1EA3o</p>
  </div>
</div>

<script>
var selectedColor = "<% if(colors && colors[0]) { %><%= colors[0] %><% } %>";
var selectedSize = "<% if(sizes && sizes[0]) { %><%= sizes[0] %><% } %>";

function selectColor(btn, val) {
  document.querySelectorAll('#colorOptions .spd-opt-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  selectedColor = val;
}
function selectSize(btn, val) {
  document.querySelectorAll('#sizeOptions .spd-opt-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  selectedSize = val;
}
function changeQty(delta) {
  var input = document.getElementById('qtyInput');
  var val = parseInt(input.value) + delta;
  if (val < 1) val = 1; if (val > 99) val = 99;
  input.value = val;
}
function addToCartDetail() {
  var qty = document.getElementById('qtyInput').value;
  fetch('/cart/add', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ productId: "<%= product.Id %>", quantity: qty, color: selectedColor, size: selectedSize })
  }).then(r => r.json()).then(data => {
    if (data.success) {
      var badge = document.querySelector('.cart-badge-main');
      if (badge) badge.textContent = data.cartCount || '';
      alert(data.message || 'Th\\u00EAm v\\u00E0o gi\\u1ECF h\\u00E0ng th\\u00E0nh c\\u00F4ng!');
    } else if (data.redirect) {
      window.location.href = data.redirect;
    } else {
      alert(data.message || 'C\\u00F3 l\\u1ED7i x\\u1EA3y ra');
    }
  }).catch(() => alert('L\\u1ED7i k\\u1EBFt n\\u1ED1i'));
}
function changeImage(src, thumb) {
  document.getElementById('mainImage').src = src;
  document.querySelectorAll('.spd-thumb').forEach(t => t.classList.remove('active'));
  if (thumb) thumb.classList.add('active');
}
document.getElementById('openSizeGuide')?.addEventListener('click', function(e) {
  e.preventDefault();
  document.getElementById('sizeGuideModal').style.display = 'flex';
});
</script>
<script src="/js/main.js"></script>
</body>
</html>`;

fs.writeFileSync('d:/Code/web/fashion-store/views/products/detail.ejs', detailEjs, 'utf8');
console.log('OK: detail.ejs rewritten with Shopee style');
