const fs = require('fs');

// ===== 1. Rewrite product-form.ejs =====
const productFormEjs = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><%= title %> | Admin</title>
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
    <h2><%= title %></h2>
    <div class="topbar-right">
      <a href="/admin/products" class="btn btn-outline btn-sm"><i class="fas fa-arrow-left"></i> Quay l\u1EA1i</a>
    </div>
  </div>

  <% if (typeof success !== 'undefined' && success && success.length) { %><div class="flash flash-success"><%= success[0] %></div><% } %>
  <% if (typeof error !== 'undefined' && error && error.length) { %><div class="flash flash-error"><%= error[0] %></div><% } %>

  <div class="admin-content">
    <div class="admin-card" style="max-width:900px;margin:0 auto">
      <form action="<%= product ? '/admin/products/' + product.Id + '/edit' : '/admin/products/add' %>"
            method="POST" enctype="multipart/form-data" class="admin-product-form">

        <div class="form-grid">
          <div class="form-group form-group-full">
            <label class="form-label">T\u00EAn s\u1EA3n ph\u1EA9m <span class="required">*</span></label>
            <input type="text" name="name" class="form-input" value="<%= product?.Name || '' %>" required
                   placeholder="Nh\u1EADp t\u00EAn s\u1EA3n ph\u1EA9m">
          </div>

          <div class="form-group">
            <label class="form-label">Danh m\u1EE5c <span class="required">*</span></label>
            <select name="categoryId" class="form-input form-select" required>
              <option value="">Ch\u1ECDn danh m\u1EE5c</option>
              <% categories.forEach(cat => { %>
                <option value="<%= cat.Id %>" <%= product?.CategoryId?.toString()===cat.Id.toString()?'selected':'' %>><%= cat.Name %></option>
              <% }); %>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Gi\u1EDBi t\u00EDnh <span class="required">*</span></label>
            <select name="gender" class="form-input form-select" required>
              <option value="">Ch\u1ECDn gi\u1EDBi t\u00EDnh</option>
              <option value="male" <%= product?.Gender==='male'?'selected':'' %>>Nam</option>
              <option value="female" <%= product?.Gender==='female'?'selected':'' %>>N\u1EEF</option>
              <option value="unisex" <%= product?.Gender==='unisex'?'selected':'' %>>Unisex</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Th\u01B0\u01A1ng hi\u1EC7u</label>
            <input type="text" name="brand" class="form-input" value="<%= product?.Brand || 'Fashion Store' %>"
                   placeholder="Nh\u1EADp th\u01B0\u01A1ng hi\u1EC7u">
          </div>

          <div class="form-group">
            <label class="form-label">Gi\u00E1 g\u1ED1c (\u0111) <span class="required">*</span></label>
            <input type="number" name="price" class="form-input" value="<%= product?.Price || '' %>" required min="0"
                   placeholder="V\u00ED d\u1EE5: 350000">
          </div>

          <div class="form-group">
            <label class="form-label">Gi\u00E1 khuy\u1EBFn m\u00E3i (\u0111)</label>
            <input type="number" name="salePrice" class="form-input" value="<%= product?.SalePrice || '' %>" min="0"
                   placeholder="\u0110\u1EC3 tr\u1ED1ng n\u1EBFu kh\u00F4ng gi\u1EA3m gi\u00E1">
          </div>

          <div class="form-group form-group-full">
            <label class="form-label">M\u00F4 t\u1EA3 s\u1EA3n ph\u1EA9m <span class="required">*</span></label>
            <textarea name="description" class="form-input" rows="6" required
                      placeholder="M\u00F4 t\u1EA3 chi ti\u1EBFt v\u1EC1 s\u1EA3n ph\u1EA9m..."><%= product?.Description || '' %></textarea>
          </div>

          <div class="form-group form-group-full">
            <label class="form-label">Tags (c\u00E1ch nhau b\u1EB1ng d\u1EA5u ph\u1EA9y)</label>
            <input type="text" name="tags" class="form-input"
                   value="<%= product?.Tags || '' %>" placeholder="\u00E1o, cotton, basic, summer">
          </div>

          <!-- Bi\u1EBFn th\u1EC3 s\u1EA3n ph\u1EA9m -->
          <div class="form-group form-group-full">
            <label class="form-label">Bi\u1EBFn th\u1EC3 (M\u00E0u s\u1EAFc / Size / T\u1ED3n kho)</label>
            <div class="variants-builder" id="variantsBuilder">
              <div class="variant-row">
                <input type="text" name="colors" class="form-input" placeholder="M\u00E0u s\u1EAFc (vd: \u0110en)">
                <input type="text" name="sizes" class="form-input" placeholder="Size (vd: M)">
                <input type="number" name="stocks" class="form-input" placeholder="T\u1ED3n kho" min="0">
                <button type="button" class="btn btn-primary btn-sm" onclick="addVariant()"><i class="fas fa-plus"></i></button>
              </div>
            </div>
          </div>

          <!-- T\u1EA3i \u1EA3nh l\u00EAn -->
          <div class="form-group form-group-full">
            <label class="form-label">H\u00ECnh \u1EA3nh s\u1EA3n ph\u1EA9m</label>
            <div class="image-upload-area" onclick="document.getElementById('imageInput').click()">
              <i class="fas fa-cloud-upload-alt"></i>
              <p>Click \u0111\u1EC3 ch\u1ECDn \u1EA3nh ho\u1EB7c k\u00E9o th\u1EA3 v\u00E0o \u0111\u00E2y</p>
              <small>JPG, PNG, WebP \u2013 T\u1ED1i \u0111a 5MB m\u1ED7i \u1EA3nh</small>
            </div>
            <input type="file" id="imageInput" name="images" multiple accept="image/*" style="display:none"
                   onchange="previewImages(this)">

            <div style="margin-top:10px">
              <label class="form-label">Ho\u1EB7c nh\u1EADp URL \u1EA3nh (m\u1ED7i URL m\u1ED9t d\u00F2ng)</label>
              <textarea name="imageUrls" class="form-input" rows="3" placeholder="https://picsum.photos/600/600?random=1&#10;https://picsum.photos/600/600?random=2"><%= product ? (function(){ try { return JSON.parse(product.Images || '[]').join('\\n'); } catch(e) { return ''; } })() : '' %></textarea>
            </div>

            <div class="image-preview-grid" id="imagePreview">
              <% if (product && product.Images) { %>
                <% (function(){ try { return JSON.parse(product.Images || '[]'); } catch(e) { return []; } })().forEach(img => { %>
                  <div class="image-preview-item">
                    <img src="<%= img %>" alt="Product image">
                  </div>
                <% }); %>
              <% } %>
            </div>
          </div>

          <!-- T\u00F9y ch\u1ECDn -->
          <div class="form-group form-group-full">
            <div class="toggle-options">
              <label class="toggle-label">
                <input type="checkbox" name="isFeatured" <%= product?.IsFeatured?'checked':'' %>>
                <span class="toggle-slider"></span>
                S\u1EA3n ph\u1EA9m n\u1ED5i b\u1EADt
              </label>
              <label class="toggle-label">
                <input type="checkbox" name="isNewArrival" <%= product?.IsNewArrival?'checked':'' %>>
                <span class="toggle-slider"></span>
                H\u00E0ng m\u1EDBi v\u1EC1
              </label>
              <% if (product) { %>
              <label class="toggle-label">
                <input type="checkbox" name="isActive" <%= product?.IsActive?'checked':'' %>>
                <span class="toggle-slider"></span>
                Hi\u1EC3n th\u1ECB s\u1EA3n ph\u1EA9m
              </label>
              <% } %>
            </div>
          </div>
        </div>

        <div class="form-actions">
          <a href="/admin/products" class="btn btn-outline">H\u1EE7y b\u1ECF</a>
          <button type="submit" class="btn btn-primary">
            <i class="fas fa-save"></i> <%= product ? 'C\u1EADp nh\u1EADt s\u1EA3n ph\u1EA9m' : 'Th\u00EAm s\u1EA3n ph\u1EA9m' %>
          </button>
        </div>
      </form>
    </div>
  </div>
</div>

<script>
function addVariant() {
  const container = document.getElementById('variantsBuilder');
  const row = document.createElement('div');
  row.className = 'variant-row';
  row.innerHTML = \`
    <input type="text" name="colors" class="form-input" placeholder="M\u00E0u s\u1EAFc">
    <input type="text" name="sizes" class="form-input" placeholder="Size">
    <input type="number" name="stocks" class="form-input" placeholder="T\u1ED3n kho" min="0">
    <button type="button" class="btn btn-danger btn-sm" onclick="this.parentElement.remove()"><i class="fas fa-trash"></i></button>
  \`;
  container.appendChild(row);
}
function previewImages(input) {
  const preview = document.getElementById('imagePreview');
  preview.innerHTML = '';
  Array.from(input.files).forEach(file => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const div = document.createElement('div');
      div.className = 'image-preview-item';
      div.innerHTML = \`<img src="\${e.target.result}" alt="Preview">\`;
      preview.appendChild(div);
    };
    reader.readAsDataURL(file);
  });
}
function toggleSidebar() {
  document.getElementById('adminSidebar').classList.toggle('collapsed');
}
</script>
<script src="/js/main.js"></script>
</body>
</html>`;

fs.writeFileSync('d:/Code/web/fashion-store/views/admin/product-form.ejs', productFormEjs, 'utf8');
console.log('OK: product-form.ejs rewritten');

// Verify - check for mojibake patterns
const verify = fs.readFileSync('d:/Code/web/fashion-store/views/admin/product-form.ejs', 'utf8');
const badChars = verify.match(/Ã¡|Ã |Ã¢|Ã£|Ãª|áº|á»|Ä[Ã¡Ã Ã¢Ã£Ãª]/g);
console.log('Mojibake remaining:', badChars ? badChars.length : 0);

// Check some Vietnamese text is correct
if (verify.includes('Tên sản phẩm')) console.log('Vietnamese OK: Tên sản phẩm');
if (verify.includes('Màu sắc')) console.log('Vietnamese OK: Màu sắc');
if (verify.includes('Tồn kho')) console.log('Vietnamese OK: Tồn kho');
if (verify.includes('kéo thả vào đây')) console.log('Vietnamese OK: kéo thả vào đây');
