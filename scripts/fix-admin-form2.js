const fs = require('fs');

const productFormEjs = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><%= title %> | Admin</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
  <link rel="stylesheet" href="/css/style.css">
  <style>
    /* Admin Form Custom Styles */
    .admin-form-container {
      max-width: 900px;
      margin: 0 auto;
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.05);
      padding: 30px;
    }
    .admin-form-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid #f0f0f0;
    }
    .admin-form-header h3 {
      font-size: 1.25rem;
      color: #333;
      margin: 0;
      font-weight: 600;
    }
    .af-btn-back {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      border: 1px solid #ddd;
      border-radius: 4px;
      color: #555;
      text-decoration: none;
      font-size: 0.85rem;
      font-weight: 500;
      transition: all 0.2s;
      text-transform: none;
    }
    .af-btn-back:hover {
      background: #f8f9fa;
      border-color: #ccc;
      color: #333;
    }
    .af-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }
    .af-full {
      grid-column: 1 / -1;
    }
    .af-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .af-label {
      font-size: 0.85rem;
      font-weight: 600;
      color: #444;
    }
    .af-req {
      color: #dc3545;
    }
    .af-input, .af-select, .af-textarea {
      width: 100%;
      padding: 10px 14px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 0.9rem;
      font-family: 'Inter', sans-serif;
      outline: none;
      transition: border-color 0.2s;
      box-sizing: border-box;
    }
    .af-input:focus, .af-select:focus, .af-textarea:focus {
      border-color: #d4a574;
    }
    .af-textarea {
      resize: vertical;
      min-height: 100px;
    }
    .af-upload-area {
      border: 2px dashed #ddd;
      border-radius: 6px;
      padding: 30px;
      text-align: center;
      cursor: pointer;
      background: #fafafa;
      transition: all 0.2s;
    }
    .af-upload-area:hover {
      border-color: #d4a574;
      background: #fdfaf7;
    }
    .af-upload-area i {
      font-size: 2rem;
      color: #ccc;
      margin-bottom: 10px;
    }
    .af-upload-area p {
      margin: 0 0 5px 0;
      font-size: 0.95rem;
      color: #555;
    }
    .af-upload-area small {
      color: #999;
      font-size: 0.8rem;
    }
    .af-image-preview {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
      gap: 15px;
      margin-top: 15px;
    }
    .af-preview-item {
      aspect-ratio: 1;
      border-radius: 4px;
      overflow: hidden;
      border: 1px solid #eee;
    }
    .af-preview-item img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .af-variants {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .af-variant-row {
      display: flex;
      gap: 10px;
      align-items: center;
    }
    .af-variant-row .af-input {
      flex: 1;
    }
    .af-btn-add, .af-btn-remove {
      width: 38px;
      height: 38px;
      border: none;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: #fff;
    }
    .af-btn-add { background: #d4a574; }
    .af-btn-add:hover { background: #c49565; }
    .af-btn-remove { background: #dc3545; }
    .af-btn-remove:hover { background: #c82333; }
    
    .af-toggles {
      display: flex;
      gap: 24px;
      flex-wrap: wrap;
    }
    .af-toggle-label {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.9rem;
      color: #444;
      cursor: pointer;
    }
    .af-toggle-label input {
      accent-color: #d4a574;
      width: 16px;
      height: 16px;
    }
    .af-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #eee;
    }
    .af-btn {
      padding: 10px 24px;
      border-radius: 4px;
      font-weight: 600;
      font-size: 0.9rem;
      cursor: pointer;
      border: none;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      transition: background 0.2s;
    }
    .af-btn-cancel {
      background: #f1f3f5;
      color: #495057;
    }
    .af-btn-cancel:hover { background: #e9ecef; }
    .af-btn-submit {
      background: #d4a574;
      color: #fff;
    }
    .af-btn-submit:hover { background: #c49565; }
  </style>
</head>
<body class="admin-body">
<%- include('../partials/admin-sidebar') %>

<div class="admin-main">
  <div class="admin-topbar">
    <button class="sidebar-toggle" onclick="toggleSidebar()"><i class="fas fa-bars"></i></button>
    <h2><%= title %></h2>
    <div class="topbar-right">
      <span class="admin-user"><i class="fas fa-user-circle"></i> <%= user?.Name || 'Admin' %></span>
    </div>
  </div>

  <% if (typeof success !== 'undefined' && success && success.length) { %><div class="flash flash-success"><%= success[0] %></div><% } %>
  <% if (typeof error !== 'undefined' && error && error.length) { %><div class="flash flash-error"><%= error[0] %></div><% } %>

  <div class="admin-content">
    <div class="admin-form-container">
      <div class="admin-form-header">
        <h3><%= product ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới' %></h3>
        <a href="/admin/products" class="af-btn-back"><i class="fas fa-arrow-left"></i> Quay lại</a>
      </div>

      <form action="<%= product ? '/admin/products/' + product.Id + '/edit' : '/admin/products/add' %>"
            method="POST" enctype="multipart/form-data">

        <div class="af-grid">
          <div class="af-group af-full">
            <label class="af-label">Tên sản phẩm <span class="af-req">*</span></label>
            <input type="text" name="name" class="af-input" value="<%= product?.Name || '' %>" required placeholder="Nhập tên sản phẩm">
          </div>

          <div class="af-group">
            <label class="af-label">Danh mục <span class="af-req">*</span></label>
            <select name="categoryId" class="af-select" required>
              <option value="">Chọn danh mục</option>
              <% categories.forEach(cat => { %>
                <option value="<%= cat.Id %>" <%= product?.CategoryId?.toString()===cat.Id.toString()?'selected':'' %>><%= cat.Name %></option>
              <% }); %>
            </select>
          </div>

          <div class="af-group">
            <label class="af-label">Giới tính <span class="af-req">*</span></label>
            <select name="gender" class="af-select" required>
              <option value="">Chọn giới tính</option>
              <option value="male" <%= product?.Gender==='male'?'selected':'' %>>Nam</option>
              <option value="female" <%= product?.Gender==='female'?'selected':'' %>>Nữ</option>
              <option value="unisex" <%= product?.Gender==='unisex'?'selected':'' %>>Unisex</option>
            </select>
          </div>

          <div class="af-group">
            <label class="af-label">Giá gốc (đ) <span class="af-req">*</span></label>
            <input type="number" name="price" class="af-input" value="<%= product?.Price || '' %>" required min="0" placeholder="VD: 350000">
          </div>

          <div class="af-group">
            <label class="af-label">Giá khuyến mãi (đ)</label>
            <input type="number" name="salePrice" class="af-input" value="<%= product?.SalePrice || '' %>" min="0" placeholder="Để trống nếu không giảm giá">
          </div>
          
          <div class="af-group af-full">
            <label class="af-label">Thương hiệu</label>
            <input type="text" name="brand" class="af-input" value="<%= product?.Brand || 'Fashion Store' %>" placeholder="Thương hiệu">
          </div>

          <div class="af-group af-full">
            <label class="af-label">Mô tả sản phẩm <span class="af-req">*</span></label>
            <textarea name="description" class="af-textarea" required placeholder="Mô tả chi tiết về sản phẩm..."><%= product?.Description || '' %></textarea>
          </div>

          <div class="af-group af-full">
            <label class="af-label">Tags (cách nhau bằng dấu phẩy)</label>
            <input type="text" name="tags" class="af-input" value="<%= product?.Tags || '' %>" placeholder="áo, cotton, basic, summer">
          </div>

          <div class="af-group af-full">
            <label class="af-label">Hình ảnh sản phẩm</label>
            <div class="af-upload-area" onclick="document.getElementById('imageInput').click()">
              <i class="fas fa-cloud-upload-alt"></i>
              <p>Click để chọn ảnh hoặc kéo thả vào đây</p>
              <small>JPG, PNG, WebP – Tối đa 5MB mỗi ảnh</small>
            </div>
            <input type="file" id="imageInput" name="images" multiple accept="image/*" style="display:none" onchange="previewImages(this)">

            <div style="margin-top:12px">
              <label class="af-label" style="font-weight:500; font-size:0.8rem;">Hoặc nhập URL ảnh (mỗi URL một dòng)</label>
              <textarea name="imageUrls" class="af-textarea" style="min-height:80px; margin-top:6px;" placeholder="https://picsum.photos/600/600?random=1"><%= product ? (function(){ try { return JSON.parse(product.Images || '[]').join('\\n'); } catch(e) { return ''; } })() : '' %></textarea>
            </div>

            <div class="af-image-preview" id="imagePreview">
              <% if (product && product.Images) { %>
                <% (function(){ try { return JSON.parse(product.Images || '[]'); } catch(e) { return []; } })().forEach(img => { %>
                  <div class="af-preview-item"><img src="<%= img %>" alt="Product image"></div>
                <% }); %>
              <% } %>
            </div>
          </div>

          <div class="af-group af-full">
            <label class="af-label">Tùy chọn hiển thị</label>
            <div class="af-toggles">
              <label class="af-toggle-label">
                <input type="checkbox" name="isFeatured" <%= product?.IsFeatured?'checked':'' %>> Sản phẩm nổi bật
              </label>
              <label class="af-toggle-label">
                <input type="checkbox" name="isNewArrival" <%= product?.IsNewArrival?'checked':'' %>> Hàng mới về
              </label>
              <% if (product) { %>
              <label class="af-toggle-label">
                <input type="checkbox" name="isActive" <%= product?.IsActive?'checked':'' %>> Đang bán (Hiển thị)
              </label>
              <% } %>
            </div>
          </div>
        </div>

        <div class="af-actions">
          <a href="/admin/products" class="af-btn af-btn-cancel">Hủy bỏ</a>
          <button type="submit" class="af-btn af-btn-submit">
            <i class="fas fa-save"></i> <%= product ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm' %>
          </button>
        </div>
      </form>
    </div>
  </div>
</div>

<script>
function previewImages(input) {
  const preview = document.getElementById('imagePreview');
  preview.innerHTML = '';
  Array.from(input.files).forEach(file => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const div = document.createElement('div');
      div.className = 'af-preview-item';
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
console.log('product-form.ejs updated with new design.');
