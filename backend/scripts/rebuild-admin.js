const fs = require('fs');
const path = require('path');

const adminDir = 'd:/Code/web/fashion-store/views/admin';

// ========== products.ejs ==========
const productsEjs = `<%
  const formatPrice = (price) => price ? Number(price).toLocaleString('vi-VN') + '\u0111' : '0\u0111';
  const getImg = (product) => {
    try {
      const imgs = JSON.parse(product.Images || '[]');
      return imgs[0] || '/images/product-default.jpg';
    } catch(e) {
      return '/images/product-default.jpg';
    }
  };
%>
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Qu\u1EA3n l\u00FD s\u1EA3n ph\u1EA9m | Admin</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
  <link rel="stylesheet" href="/css/style.css">
</head>
<body class="admin-body">
<%- include('../partials/admin-sidebar') %>

<div class="admin-main">
  <div class="admin-topbar">
    <button class="sidebar-toggle" onclick="toggleSidebar()"><i class="fas fa-bars"></i></button>
    <h2>Qu\u1EA3n l\u00FD S\u1EA3n ph\u1EA9m</h2>
    <div class="topbar-right">
      <a href="/admin/products/add" class="btn btn-primary"><i class="fas fa-plus"></i> Th\u00EAm s\u1EA3n ph\u1EA9m</a>
    </div>
  </div>

  <div class="admin-content">
    <% if (typeof success !== 'undefined' && success && success.length) { %><div class="flash flash-success"><i class="fas fa-check-circle"></i> <%= success[0] %></div><% } %>
    <% if (typeof error !== 'undefined' && error && error.length) { %><div class="flash flash-error"><i class="fas fa-exclamation-circle"></i> <%= error[0] %></div><% } %>

    <div class="admin-filters" style="margin-bottom: 2rem;">
      <form action="/admin/products" method="GET" class="filters-form">
        <input type="text" name="search" class="filter-input" placeholder="T\u00ECm theo t\u00EAn..." value="<%= filters.search||'' %>">
        <select name="sort" class="filter-select">
          <option value="-createdAt" <%= filters.sort==='-createdAt'?'selected':'' %>>M\u1EDBi nh\u1EA5t</option>
          <option value="price" <%= filters.sort==='price'?'selected':'' %>>Gi\u00E1 t\u0103ng d\u1EA7n</option>
          <option value="-price" <%= filters.sort==='-price'?'selected':'' %>>Gi\u00E1 gi\u1EA3m d\u1EA7n</option>
          <option value="-sold" <%= filters.sort==='-sold'?'selected':'' %>>B\u00E1n ch\u1EA1y</option>
        </select>
        <button type="submit" class="btn btn-outline">L\u1ECDc</button>
      </form>
    </div>

    <div class="admin-card">
      <div class="admin-table-wrap">
        <table class="admin-table">
          <thead>
            <tr>
              <th>H\u00ECnh \u1EA3nh</th>
              <th>T\u00EAn s\u1EA3n ph\u1EA9m</th>
              <th>Danh m\u1EE5c</th>
              <th>Gi\u1EDBi t\u00EDnh</th>
              <th>Gi\u00E1</th>
              <th>\u0110\u00E3 b\u00E1n</th>
              <th>Tr\u1EA1ng th\u00E1i</th>
              <th>H\u00E0nh \u0111\u1ED9ng</th>
            </tr>
          </thead>
          <tbody>
            <% products.forEach(product => { %>
            <tr id="prod-row-<%= product.Id %>">
              <td>
                <img src="<%= getImg(product) %>" alt="<%= product.Name %>" class="admin-product-thumb">
              </td>
              <td>
                <div style="max-width: 250px; white-space: normal;">
                  <strong><%= product.Name %></strong>
                  <% if (product.IsFeatured) { %><span class="badge badge-new" style="font-size:0.65rem; margin-left:8px;">N\u1ED5i b\u1EADt</span><% } %>
                </div>
              </td>
              <td><%= product.CategoryName || 'N/A' %></td>
              <td><%= product.Gender === 'male' ? 'Nam' : (product.Gender === 'female' ? 'N\u1EEF' : 'Unisex') %></td>
              <td>
                <% if (product.SalePrice) { %>
                  <div class="text-gold" style="font-weight:600;"><%= formatPrice(product.SalePrice) %></div>
                  <div class="text-gray" style="text-decoration:line-through; font-size:0.85rem;"><%= formatPrice(product.Price) %></div>
                <% } else { %>
                  <div style="font-weight:600;"><%= formatPrice(product.Price) %></div>
                <% } %>
              </td>
              <td><%= product.Sold %></td>
              <td>
                <span class="status-badge <%= product.IsActive?'status-delivered':'status-cancelled' %>">
                  <%= product.IsActive ? '\u0110ang b\u00E1n' : '\u1EA8n' %>
                </span>
              </td>
              <td>
                <div class="actions-cell">
                  <a href="/admin/products/<%= product.Id %>/edit" class="btn btn-outline btn-xs" title="Ch\u1EC9nh s\u1EEDa">
                    <i class="fas fa-edit"></i>
                  </a>
                  <button class="btn btn-danger btn-xs" onclick="deleteProduct('<%= product.Id %>')" title="X\u00F3a">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
            <% }); %>
          </tbody>
        </table>
      </div>

      <% if (totalPages > 1) { %>
      <div class="pagination" style="padding:1rem;">
        <% for(let i=1; i<=totalPages; i++) { %>
        <a href="?search=<%= filters.search||'' %>&sort=<%= filters.sort||'' %>&page=<%= i %>"
           class="page-btn <%= i===currentPage?'active':'' %>"><%= i %></a>
        <% } %>
      </div>
      <% } %>
    </div>
  </div>
</div>

<script>
function deleteProduct(id) {
  if (!confirm('\u1EA8n s\u1EA3n ph\u1EA9m n\u00E0y?')) return;
  fetch('/admin/products/' + id, { method: 'DELETE' })
    .then(r => r.json())
    .then(data => {
      if (data.success) {
        const row = document.getElementById('prod-row-' + id);
        if (row) row.remove();
        showAdminToast('\u0110\u00E3 \u1EA9n s\u1EA3n ph\u1EA9m', 'success');
      } else {
        showAdminToast(data.message || 'L\u1ED7i', 'error');
      }
    });
}
function showAdminToast(msg, type) {
  const d = document.createElement('div');
  d.className = 'flash flash-' + type;
  d.textContent = msg;
  document.body.appendChild(d);
  setTimeout(() => d.remove(), 3000);
}
function toggleSidebar() { document.getElementById('adminSidebar').classList.toggle('collapsed'); }
</script>
</body>
</html>`;

// ========== orders.ejs ==========
const ordersEjs = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Qu\u1EA3n l\u00FD \u0111\u01A1n h\u00E0ng | Admin</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
  <link rel="stylesheet" href="/css/style.css">
</head>
<body class="admin-body">
<%- include('../partials/admin-sidebar') %>

<div class="admin-main">
  <div class="admin-topbar">
    <button class="sidebar-toggle" onclick="toggleSidebar()"><i class="fas fa-bars"></i></button>
    <h2>Qu\u1EA3n l\u00FD \u0110\u01A1n h\u00E0ng</h2>
  </div>

  <div class="admin-content">
    <div class="order-tabs" style="margin-bottom:1.5rem">
      <a href="/admin/orders" class="order-tab <%= !status?'active':'' %>">T\u1EA5t c\u1EA3</a>
      <a href="/admin/orders?status=pending" class="order-tab <%= status==='pending'?'active':'' %>">Ch\u1EDD x\u00E1c nh\u1EADn</a>
      <a href="/admin/orders?status=confirmed" class="order-tab <%= status==='confirmed'?'active':'' %>">\u0110\u00E3 x\u00E1c nh\u1EADn</a>
      <a href="/admin/orders?status=shipping" class="order-tab <%= status==='shipping'?'active':'' %>">\u0110ang giao</a>
      <a href="/admin/orders?status=delivered" class="order-tab <%= status==='delivered'?'active':'' %>">\u0110\u00E3 giao</a>
      <a href="/admin/orders?status=cancelled" class="order-tab <%= status==='cancelled'?'active':'' %>">\u0110\u00E3 h\u1EE7y</a>
    </div>

    <div class="admin-card">
      <div class="admin-card-header">
        <p>T\u1ED5ng c\u1ED9ng: <strong><%= total %></strong> \u0111\u01A1n h\u00E0ng</p>
      </div>
      <div class="admin-table-wrap">
        <table class="admin-table">
          <thead>
            <tr>
              <th>M\u00E3 \u0110\u01A1n</th>
              <th>Kh\u00E1ch h\u00E0ng</th>
              <th>S\u1EA3n ph\u1EA9m</th>
              <th>T\u1ED5ng ti\u1EC1n</th>
              <th>Thanh to\u00E1n</th>
              <th>Tr\u1EA1ng th\u00E1i</th>
              <th>Ng\u00E0y \u0111\u1EB7t</th>
              <th>H\u00E0nh \u0111\u1ED9ng</th>
            </tr>
          </thead>
          <tbody>
            <% orders.forEach(order => { %>
            <tr>
              <td><span class="text-gold">#<%= order.OrderNumber %></span></td>
              <td>
                <strong><%= order.FullName %></strong><br>
                <small class="text-gray"><%= order.Phone || '' %></small>
              </td>
              <td><%= order.ItemCount %> s\u1EA3n ph\u1EA9m</td>
              <td><%= (Number(order.TotalPrice)||0).toLocaleString('vi-VN') %>\u0111</td>
              <td>
                <span class="<%= order.PaymentMethod==='vnpay'?'text-gold':'text-gray' %>">
                  <%= order.PaymentMethod==='vnpay'?'\u0110\u00E3 TT':'Ch\u01B0a TT' %>
                </span>
              </td>
              <td>
                <select class="status-select" onchange="updateOrderStatus('<%= order.Id %>', this.value)">
                  <% ['pending','confirmed','shipping','delivered','cancelled'].forEach(s => { %>
                  <option value="<%= s %>" <%= order.OrderStatus===s?'selected':'' %>>
                    <%= s==='pending'?'Ch\u1EDD x\u00E1c nh\u1EADn':s==='confirmed'?'\u0110\u00E3 x\u00E1c nh\u1EADn':s==='shipping'?'\u0110ang giao':s==='delivered'?'\u0110\u00E3 giao':'\u0110\u00E3 h\u1EE7y' %>
                  </option>
                  <% }); %>
                </select>
              </td>
              <td><%= new Date(order.CreatedAt).toLocaleDateString('vi-VN') %></td>
              <td>
                <a href="/orders/<%= order.Id %>" class="btn btn-outline btn-xs" target="_blank">
                  <i class="fas fa-eye"></i>
                </a>
              </td>
            </tr>
            <% }); %>
          </tbody>
        </table>
      </div>

      <% if (totalPages > 1) { %>
      <div class="pagination" style="padding:1rem">
        <% for(let i=1; i<=totalPages; i++) { %>
        <a href="?status=<%= status||'' %>&page=<%= i %>" class="page-btn <%= i===currentPage?'active':'' %>"><%= i %></a>
        <% } %>
      </div>
      <% } %>
    </div>
  </div>
</div>

<script>
function updateOrderStatus(orderId, status) {
  fetch('/admin/orders/' + orderId + '/status', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderStatus: status })
  }).then(r => r.json()).then(data => {
    if (data.success) {
      showAdminToast('\u0110\u00E3 c\u1EADp nh\u1EADt tr\u1EA1ng th\u00E1i', 'success');
      setTimeout(() => window.location.reload(), 1000);
    }
  });
}
function showAdminToast(msg, type) {
  const d = document.createElement('div');
  d.className = 'flash flash-' + type;
  d.textContent = msg;
  document.body.appendChild(d);
  setTimeout(() => d.remove(), 3000);
}
function toggleSidebar() { document.getElementById('adminSidebar').classList.toggle('collapsed'); }
</script>
<script src="/js/main.js"></script>
</body>
</html>`;

// ========== users.ejs ==========
const usersEjs = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Qu\u1EA3n l\u00FD ng\u01B0\u1EDDi d\u00F9ng | Admin</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
  <link rel="stylesheet" href="/css/style.css">
</head>
<body class="admin-body">
<%- include('../partials/admin-sidebar') %>

<div class="admin-main">
  <div class="admin-topbar">
    <button class="sidebar-toggle" onclick="toggleSidebar()"><i class="fas fa-bars"></i></button>
    <h2>Qu\u1EA3n l\u00FD Ng\u01B0\u1EDDi d\u00F9ng</h2>
  </div>

  <div class="admin-content">
    <div class="admin-filters" style="margin-bottom: 2rem;">
      <form action="/admin/users" method="GET" class="filters-form">
        <input type="text" name="search" class="filter-input"
               placeholder="T\u00ECm theo t\u00EAn ho\u1EB7c email..." value="<%= filters.search||'' %>">
        <button type="submit" class="btn btn-outline">T\u00ECm ki\u1EBFm</button>
      </form>
    </div>

    <div class="admin-card">
      <div class="admin-table-wrap">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Avatar</th>
              <th>H\u1ECD t\u00EAn</th>
              <th>Email</th>
              <th>\u0110i\u1EC7n tho\u1EA1i</th>
              <th>Vai tr\u00F2</th>
              <th>Tr\u1EA1ng th\u00E1i</th>
              <th>Ng\u00E0y tham gia</th>
              <th>H\u00E0nh \u0111\u1ED9ng</th>
            </tr>
          </thead>
          <tbody>
            <% users.forEach(u => { %>
            <tr id="user-row-<%= u.Id %>">
              <td>
                <img src="<%= u.Avatar || 'https://ui-avatars.com/api/?name=' + u.Name + '&background=random' %>" alt="<%= u.Name %>" class="admin-user-avatar">
              </td>
              <td><strong><%= u.Name %></strong></td>
              <td><%= u.Email %></td>
              <td><%= u.Phone || '\u2014' %></td>
              <td>
                <span class="badge <%= u.Role==='admin'?'badge-sale':'badge-new' %>">
                  <%= u.Role === 'admin' ? 'Admin' : 'User' %>
                </span>
              </td>
              <td>
                <span class="status-badge <%= u.IsActive?'status-delivered':'status-cancelled' %>" id="status-<%= u.Id %>">
                  <%= u.IsActive ? 'Ho\u1EA1t \u0111\u1ED9ng' : 'B\u1ECB kh\u00F3a' %>
                </span>
              </td>
              <td><%= new Date(u.CreatedAt).toLocaleDateString('vi-VN') %></td>
              <td>
                <% if (u.Role !== 'admin') { %>
                  <button class="btn btn-outline btn-xs" onclick="toggleUser('<%= u.Id %>')" id="toggle-btn-<%= u.Id %>">
                    <i class="fas fa-<%= u.IsActive ? 'ban' : 'check' %>"></i>
                    <%= u.IsActive ? 'Kh\u00F3a' : 'M\u1EDF kh\u00F3a' %>
                  </button>
                <% } %>
              </td>
            </tr>
            <% }); %>
          </tbody>
        </table>
      </div>

      <% if (totalPages > 1) { %>
      <div class="pagination" style="padding:1rem;">
        <% for(let i=1; i<=totalPages; i++) { %>
        <a href="?search=<%= filters.search||'' %>&page=<%= i %>" class="page-btn <%= i===currentPage?'active':'' %>"><%= i %></a>
        <% } %>
      </div>
      <% } %>
    </div>
  </div>
</div>

<script>
function toggleUser(userId) {
  if (!confirm('Thay \u0111\u1ED5i tr\u1EA1ng th\u00E1i ng\u01B0\u1EDDi d\u00F9ng n\u00E0y?')) return;
  fetch('/admin/users/' + userId + '/toggle', { method: 'PUT' })
    .then(r => r.json())
    .then(data => {
      if (data.success) {
        const badge = document.getElementById('status-' + userId);
        const btn = document.getElementById('toggle-btn-' + userId);
        if (data.IsActive) {
          badge.textContent = 'Ho\u1EA1t \u0111\u1ED9ng'; badge.className = 'status-badge status-delivered';
          btn.innerHTML = '<i class="fas fa-ban"></i> Kh\u00F3a';
        } else {
          badge.textContent = 'B\u1ECB kh\u00F3a'; badge.className = 'status-badge status-cancelled';
          btn.innerHTML = '<i class="fas fa-check"></i> M\u1EDF kh\u00F3a';
        }
        showAdminToast('\u0110\u00E3 c\u1EADp nh\u1EADt', 'success');
      }
    });
}
function showAdminToast(msg, type) {
  const d = document.createElement('div');
  d.className = 'flash flash-' + type;
  d.textContent = msg;
  document.body.appendChild(d);
  setTimeout(() => d.remove(), 3000);
}
function toggleSidebar() { document.getElementById('adminSidebar').classList.toggle('collapsed'); }
</script>
</body>
</html>`;

// ========== categories.ejs ==========
const categoriesEjs = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Qu\u1EA3n l\u00FD danh m\u1EE5c | Admin</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
  <link rel="stylesheet" href="/css/style.css">
</head>
<body class="admin-body">
<%- include('../partials/admin-sidebar') %>

<div class="admin-main">
  <div class="admin-topbar">
    <button class="sidebar-toggle" onclick="toggleSidebar()"><i class="fas fa-bars"></i></button>
    <h2>Qu\u1EA3n l\u00FD Danh m\u1EE5c</h2>
  </div>

  <div class="admin-content">
    <% if (typeof success !== 'undefined' && success && success.length) { %><div class="flash flash-success"><%= success[0] %></div><% } %>
    <% if (typeof error !== 'undefined' && error && error.length) { %><div class="flash flash-error"><%= error[0] %></div><% } %>

    <div class="admin-two-col">
      <div class="admin-card">
        <div class="admin-card-header"><h3>Th\u00EAm danh m\u1EE5c m\u1EDBi</h3></div>
        <form action="/admin/categories" method="POST" enctype="multipart/form-data" class="admin-form" style="padding:1.5rem">
          <div class="form-group">
            <label class="form-label">T\u00EAn danh m\u1EE5c <span class="required">*</span></label>
            <input type="text" name="name" class="form-input" required>
          </div>
          <div class="form-group">
            <label class="form-label">Gi\u1EDBi t\u00EDnh</label>
            <select name="gender" class="form-select">
              <option value="unisex">Unisex</option>
              <option value="male">Nam</option>
              <option value="female">N\u1EEF</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">M\u00F4 t\u1EA3</label>
            <textarea name="description" class="form-input" rows="3"></textarea>
          </div>
          <div class="form-group">
            <label class="form-label">H\u00ECnh \u1EA3nh</label>
            <input type="file" name="image" class="form-input" accept="image/*">
          </div>
          <button type="submit" class="btn btn-primary btn-full" style="margin-top:1rem">Th\u00EAm danh m\u1EE5c</button>
        </form>
      </div>

      <div class="admin-card">
        <div class="admin-card-header"><h3>Danh s\u00E1ch danh m\u1EE5c</h3></div>
        <div class="admin-table-wrap">
          <table class="admin-table">
            <thead>
              <tr>
                <th>\u1EA2nh</th>
                <th>T\u00EAn</th>
                <th>Gi\u1EDBi t\u00EDnh</th>
                <th>H\u00E0nh \u0111\u1ED9ng</th>
              </tr>
            </thead>
            <tbody>
              <% categories.forEach(cat => { %>
              <tr id="cat-<%= cat.Id %>">
                <td><img src="<%= cat.Image || 'https://via.placeholder.com/100x100?text=Cat' %>" alt="<%= cat.Name %>" style="width:50px;height:50px;object-fit:cover;border-radius:8px"></td>
                <td><strong><%= cat.Name %></strong></td>
                <td><%= cat.Gender==='male'?'Nam':(cat.Gender==='female'?'N\u1EEF':'Unisex') %></td>
                <td>
                  <button class="btn btn-danger btn-xs" onclick="deleteCategory('<%= cat.Id %>')" title="X\u00F3a">
                    <i class="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
              <% }); %>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</div>

<script>
function deleteCategory(id) {
  if (!confirm('\u1EA8n danh m\u1EE5c n\u00E0y?')) return;
  fetch('/admin/categories/' + id, { method: 'DELETE' })
    .then(r => r.json())
    .then(data => {
      if (data.success) { document.getElementById('cat-' + id)?.remove(); }
      else { alert(data.message || 'L\u1ED7i'); }
    });
}
function toggleSidebar() { document.getElementById('adminSidebar').classList.toggle('collapsed'); }
</script>
</body>
</html>`;

// Write all files
fs.writeFileSync(path.join(adminDir, 'products.ejs'), productsEjs, 'utf8');
console.log('OK: products.ejs');

fs.writeFileSync(path.join(adminDir, 'orders.ejs'), ordersEjs, 'utf8');
console.log('OK: orders.ejs');

fs.writeFileSync(path.join(adminDir, 'users.ejs'), usersEjs, 'utf8');
console.log('OK: users.ejs');

fs.writeFileSync(path.join(adminDir, 'categories.ejs'), categoriesEjs, 'utf8');
console.log('OK: categories.ejs');

// Also fix product-form.ejs Images parsing
const formPath = path.join(adminDir, 'product-form.ejs');
if (fs.existsSync(formPath)) {
  let formContent = fs.readFileSync(formPath, 'utf8');
  formContent = formContent.replace(
    /product\.Images\.forEach/g,
    "(typeof product.Images === 'string' ? JSON.parse(product.Images || '[]') : (product.Images || [])).forEach"
  );
  fs.writeFileSync(formPath, formContent, 'utf8');
  console.log('OK: product-form.ejs (fixed Images parsing)');
}

console.log('\nAll admin views rebuilt successfully!');
