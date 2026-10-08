const fs = require('fs');

// Common auth styles + background
const authCSS = `/* ================================================
   AUTH PAGES - Fashion Store (Shopee-inspired)
   ================================================ */
.auth-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: 'Inter', -apple-system, sans-serif;
  background: #f5f5f5;
}

/* Top Bar */
.auth-topbar {
  background: #fff;
  padding: 12px 0;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
}
.auth-topbar-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.auth-topbar-left {
  display: flex;
  align-items: center;
  gap: 16px;
}
.auth-topbar-logo {
  font-size: 1.5rem;
  font-weight: 700;
  color: #d4a574;
  text-decoration: none;
}
.auth-topbar-logo span { color: #333; }
.auth-topbar-title {
  font-size: 1.3rem;
  color: #333;
  font-weight: 400;
  border-left: 1px solid #d4a574;
  padding-left: 16px;
}
.auth-topbar-help {
  color: #d4a574;
  text-decoration: none;
  font-size: 0.85rem;
}

/* Main Section */
.auth-main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #fef5ed 0%, #fde8d4 30%, #d4a574 100%);
  background-size: cover;
  position: relative;
  overflow: hidden;
  min-height: 500px;
}

/* Background decoration */
.auth-bg-decor {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}
.auth-bg-image {
  position: absolute;
  left: 0;
  top: 0;
  width: 60%;
  height: 100%;
  background-size: cover;
  background-position: center;
  opacity: 0.35;
}
.auth-bg-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgba(212,165,116,0.3), rgba(212,165,116,0.7) 60%, rgba(212,165,116,0.95));
}

/* Promo side */
.auth-promo {
  position: absolute;
  left: 8%;
  top: 50%;
  transform: translateY(-50%);
  color: #fff;
  z-index: 2;
  max-width: 400px;
}
.auth-promo-logo {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 20px;
  text-shadow: 0 2px 8px rgba(0,0,0,0.15);
}
.auth-promo-logo i { margin-right: 8px; }
.auth-promo h2 {
  font-size: 2.8rem;
  font-weight: 700;
  line-height: 1.1;
  margin: 0 0 12px;
  text-shadow: 0 2px 12px rgba(0,0,0,0.15);
}
.auth-promo h2 em {
  font-style: normal;
  color: #fff3e0;
}
.auth-promo p {
  font-size: 1.1rem;
  opacity: 0.9;
  margin-bottom: 20px;
}
.auth-promo-tags {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.auth-promo-tag {
  background: rgba(255,255,255,0.2);
  backdrop-filter: blur(6px);
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  border: 1px solid rgba(255,255,255,0.3);
}

/* Form Card */
.auth-card-wrap {
  position: relative;
  z-index: 3;
  margin-left: auto;
  margin-right: 8%;
}
.auth-form-card {
  background: #fff;
  border-radius: 6px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.1);
  padding: 36px 32px;
  width: 380px;
}
.auth-form-card h1 {
  font-size: 1.3rem;
  font-weight: 500;
  color: #333;
  margin: 0 0 24px;
}
.auth-field {
  margin-bottom: 16px;
}
.auth-field label {
  display: block;
  font-size: 0.82rem;
  color: #666;
  margin-bottom: 6px;
  font-weight: 500;
}
.auth-input {
  width: 100%;
  padding: 11px 14px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
  font-family: 'Inter', sans-serif;
}
.auth-input:focus { border-color: #d4a574; }
.auth-input-icon {
  position: relative;
}
.auth-input-icon i {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #bbb;
  font-size: 0.85rem;
}
.auth-input-icon .auth-input {
  padding-left: 38px;
}

.auth-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  font-size: 0.82rem;
}
.auth-remember {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #666;
  cursor: pointer;
}
.auth-remember input { accent-color: #d4a574; }
.auth-forgot {
  color: #d4a574;
  text-decoration: none;
  font-size: 0.8rem;
}

.auth-submit {
  width: 100%;
  padding: 12px;
  background: #d4a574;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.auth-submit:hover { background: #c49565; }

.auth-divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 20px 0;
  color: #ccc;
  font-size: 0.8rem;
}
.auth-divider::before,
.auth-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #eee;
}

.auth-social {
  display: flex;
  gap: 10px;
}
.auth-social-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  text-decoration: none;
  color: #333;
  font-size: 0.82rem;
  font-weight: 500;
  transition: all 0.2s;
  background: #fff;
  cursor: pointer;
}
.auth-social-btn:hover { background: #f8f8f8; border-color: #bbb; }
.auth-social-btn i { font-size: 1.1rem; }
.auth-social-btn.fb i { color: #1877f2; }
.auth-social-btn.gg i { color: #ea4335; }

.auth-switch {
  text-align: center;
  margin-top: 20px;
  font-size: 0.85rem;
  color: #666;
}
.auth-switch a {
  color: #d4a574;
  text-decoration: none;
  font-weight: 600;
}
.auth-switch a:hover { text-decoration: underline; }

.auth-terms {
  text-align: center;
  margin-top: 14px;
  font-size: 0.72rem;
  color: #999;
  line-height: 1.5;
}
.auth-terms a { color: #d4a574; }

/* Footer */
.auth-footer {
  background: #fff;
  padding: 20px 0;
  text-align: center;
  font-size: 0.78rem;
  color: #999;
  border-top: 1px solid #eee;
}

/* Responsive */
@media (max-width: 900px) {
  .auth-promo { display: none; }
  .auth-card-wrap { margin: 0 auto; }
  .auth-bg-overlay { background: rgba(212,165,116,0.85); }
}
@media (max-width: 480px) {
  .auth-form-card { width: 90vw; padding: 24px 20px; }
  .auth-topbar-title { display: none; }
}
`;

fs.writeFileSync('d:/Code/web/fashion-store/public/css/auth.css', authCSS, 'utf8');
console.log('OK: auth.css');

// ===== LOGIN PAGE =====
const loginEjs = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>\u0110\u0103ng nh\u1EADp | Fashion Store</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
  <link rel="stylesheet" href="/css/auth.css">
</head>
<body class="auth-page">

<% if (typeof success !== 'undefined' && success && success.length) { %><div style="position:fixed;top:20px;right:20px;background:#4caf50;color:#fff;padding:12px 20px;border-radius:6px;z-index:9999;box-shadow:0 4px 12px rgba(0,0,0,0.15);font-size:0.88rem"><i class="fas fa-check-circle"></i> <%= success[0] %></div><% } %>
<% if (typeof error !== 'undefined' && error && error.length) { %><div style="position:fixed;top:20px;right:20px;background:#e74c3c;color:#fff;padding:12px 20px;border-radius:6px;z-index:9999;box-shadow:0 4px 12px rgba(0,0,0,0.15);font-size:0.88rem"><i class="fas fa-exclamation-circle"></i> <%= error[0] %></div><% } %>

<!-- Top Bar -->
<div class="auth-topbar">
  <div class="auth-topbar-inner">
    <div class="auth-topbar-left">
      <a href="/" class="auth-topbar-logo">\u2726 FASHION<span>STORE</span></a>
      <span class="auth-topbar-title">\u0110\u0103ng Nh\u1EADp</span>
    </div>
    <a href="/" class="auth-topbar-help">B\u1EA1n c\u1EA7n gi\u00FAp \u0111\u1EE1?</a>
  </div>
</div>

<!-- Main -->
<div class="auth-main">
  <div class="auth-bg-image" style="background-image:url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1600&auto=format&fit=crop')"></div>
  <div class="auth-bg-overlay"></div>

  <!-- Promo Side -->
  <div class="auth-promo">
    <div class="auth-promo-logo"><i class="fas fa-star"></i> FASHION STORE</div>
    <h2>TH\u1EDCI TRANG<br><em>PHONG C\u00C1CH</em><br>\u0110\u1EB2NG C\u1EA4P</h2>
    <p>Mua s\u1EAFm th\u1EDDi trang cao c\u1EA5p v\u1EDBi h\u00E0ng ngh\u00ECn s\u1EA3n ph\u1EA9m ch\u00EDnh h\u00E3ng</p>
    <div class="auth-promo-tags">
      <span class="auth-promo-tag">\u2728 FREESHIP \u0110\u01A0N T\u1EEA 300K</span>
      <span class="auth-promo-tag">\uD83C\uDF81 GI\u1EA2M 20% \u0110\u01A0N \u0110\u1EA6U</span>
      <span class="auth-promo-tag">\uD83D\uDEE1\uFE0F CH\u00CDNH H\u00C3NG 100%</span>
    </div>
  </div>

  <!-- Login Form -->
  <div class="auth-card-wrap">
    <div class="auth-form-card">
      <h1>\u0110\u0103ng Nh\u1EADp</h1>

      <form action="/auth/login" method="POST">
        <div class="auth-field">
          <div class="auth-input-icon">
            <i class="fas fa-envelope"></i>
            <input type="email" name="email" class="auth-input" placeholder="Email c\u1EE7a b\u1EA1n" required autofocus>
          </div>
        </div>

        <div class="auth-field">
          <div class="auth-input-icon">
            <i class="fas fa-lock"></i>
            <input type="password" name="password" class="auth-input" placeholder="M\u1EADt kh\u1EA9u" required>
          </div>
        </div>

        <div class="auth-options">
          <label class="auth-remember">
            <input type="checkbox" checked> Duy tr\u00EC \u0111\u0103ng nh\u1EADp
          </label>
          <a href="#" class="auth-forgot">Qu\u00EAn m\u1EADt kh\u1EA9u?</a>
        </div>

        <button type="submit" class="auth-submit">\u0110\u0102NG NH\u1EACP</button>
      </form>

      <div class="auth-divider">HO\u1EB6C</div>

      <div class="auth-social">
        <button class="auth-social-btn fb"><i class="fab fa-facebook"></i> Facebook</button>
        <button class="auth-social-btn gg"><i class="fab fa-google"></i> Google</button>
      </div>

      <div class="auth-switch">
        Ch\u01B0a c\u00F3 t\u00E0i kho\u1EA3n? <a href="/auth/register">\u0110\u0103ng k\u00FD ngay</a>
      </div>
    </div>
  </div>
</div>

<!-- Footer -->
<div class="auth-footer">
  &copy; 2024 Fashion Store. T\u1EA5t c\u1EA3 quy\u1EC1n \u0111\u01B0\u1EE3c b\u1EA3o l\u01B0u.
</div>

<script>setTimeout(() => { document.querySelectorAll('[style*="fixed"]').forEach(el => el.remove()); }, 4000);</script>
</body>
</html>`;

// ===== REGISTER PAGE =====
const registerEjs = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>\u0110\u0103ng k\u00FD | Fashion Store</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
  <link rel="stylesheet" href="/css/auth.css">
</head>
<body class="auth-page">

<% if (typeof success !== 'undefined' && success && success.length) { %><div style="position:fixed;top:20px;right:20px;background:#4caf50;color:#fff;padding:12px 20px;border-radius:6px;z-index:9999;box-shadow:0 4px 12px rgba(0,0,0,0.15);font-size:0.88rem"><i class="fas fa-check-circle"></i> <%= success[0] %></div><% } %>
<% if (typeof error !== 'undefined' && error && error.length) { %><div style="position:fixed;top:20px;right:20px;background:#e74c3c;color:#fff;padding:12px 20px;border-radius:6px;z-index:9999;box-shadow:0 4px 12px rgba(0,0,0,0.15);font-size:0.88rem"><i class="fas fa-exclamation-circle"></i> <%= error[0] %></div><% } %>

<!-- Top Bar -->
<div class="auth-topbar">
  <div class="auth-topbar-inner">
    <div class="auth-topbar-left">
      <a href="/" class="auth-topbar-logo">\u2726 FASHION<span>STORE</span></a>
      <span class="auth-topbar-title">\u0110\u0103ng K\u00FD</span>
    </div>
    <a href="/" class="auth-topbar-help">B\u1EA1n c\u1EA7n gi\u00FAp \u0111\u1EE1?</a>
  </div>
</div>

<!-- Main -->
<div class="auth-main">
  <div class="auth-bg-image" style="background-image:url('https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1600&auto=format&fit=crop')"></div>
  <div class="auth-bg-overlay"></div>

  <!-- Promo Side -->
  <div class="auth-promo">
    <div class="auth-promo-logo"><i class="fas fa-star"></i> FASHION STORE</div>
    <h2>TR\u1EDE TH\u00C0NH<br><em>TH\u00C0NH VI\u00CAN</em><br>H\u00D4M NAY</h2>
    <p>\u0110\u0103ng k\u00FD \u0111\u1EC3 nh\u1EADn ngay \u01B0u \u0111\u00E3i \u0111\u1EB7c bi\u1EC7t d\u00E0nh cho th\u00E0nh vi\u00EAn m\u1EDBi</p>
    <div class="auth-promo-tags">
      <span class="auth-promo-tag">\uD83C\uDF89 GI\u1EA2M 20% \u0110\u01A0N \u0110\u1EA6U</span>
      <span class="auth-promo-tag">\u2728 FREESHIP M\u1ECEI \u0110\u01A0N</span>
      <span class="auth-promo-tag">\uD83D\uDC8E T\u00CDCH \u0110I\u1EC2M TH\u01AF\u1EDENG</span>
    </div>
  </div>

  <!-- Register Form -->
  <div class="auth-card-wrap">
    <div class="auth-form-card">
      <h1>\u0110\u0103ng K\u00FD</h1>

      <form action="/auth/register" method="POST">
        <div class="auth-field">
          <div class="auth-input-icon">
            <i class="fas fa-user"></i>
            <input type="text" name="name" class="auth-input" placeholder="H\u1ECD v\u00E0 t\u00EAn" required autofocus>
          </div>
        </div>

        <div class="auth-field">
          <div class="auth-input-icon">
            <i class="fas fa-envelope"></i>
            <input type="email" name="email" class="auth-input" placeholder="Email c\u1EE7a b\u1EA1n" required>
          </div>
        </div>

        <div class="auth-field">
          <div class="auth-input-icon">
            <i class="fas fa-phone"></i>
            <input type="tel" name="phone" class="auth-input" placeholder="S\u1ED1 \u0111i\u1EC7n tho\u1EA1i">
          </div>
        </div>

        <div class="auth-field">
          <div class="auth-input-icon">
            <i class="fas fa-lock"></i>
            <input type="password" name="password" class="auth-input" placeholder="M\u1EADt kh\u1EA9u (t\u1ED1i thi\u1EC3u 6 k\u00FD t\u1EF1)" required minlength="6">
          </div>
        </div>

        <button type="submit" class="auth-submit">\u0110\u0102NG K\u00DD</button>
      </form>

      <div class="auth-divider">HO\u1EB6C</div>

      <div class="auth-social">
        <button class="auth-social-btn fb"><i class="fab fa-facebook"></i> Facebook</button>
        <button class="auth-social-btn gg"><i class="fab fa-google"></i> Google</button>
      </div>

      <div class="auth-terms">
        B\u1EB1ng vi\u1EC7c \u0111\u0103ng k\u00FD, b\u1EA1n \u0111\u00E3 \u0111\u1ED3ng \u00FD v\u1EDBi
        <a href="#">\u0110i\u1EC1u kho\u1EA3n d\u1ECBch v\u1EE5</a> &
        <a href="#">Ch\u00EDnh s\u00E1ch b\u1EA3o m\u1EADt</a>
      </div>

      <div class="auth-switch">
        \u0110\u00E3 c\u00F3 t\u00E0i kho\u1EA3n? <a href="/auth/login">\u0110\u0103ng nh\u1EADp</a>
      </div>
    </div>
  </div>
</div>

<!-- Footer -->
<div class="auth-footer">
  &copy; 2024 Fashion Store. T\u1EA5t c\u1EA3 quy\u1EC1n \u0111\u01B0\u1EE3c b\u1EA3o l\u01B0u.
</div>

<script>setTimeout(() => { document.querySelectorAll('[style*="fixed"]').forEach(el => el.remove()); }, 4000);</script>
</body>
</html>`;

fs.writeFileSync('d:/Code/web/fashion-store/views/auth/login.ejs', loginEjs, 'utf8');
console.log('OK: login.ejs');

fs.writeFileSync('d:/Code/web/fashion-store/views/auth/register.ejs', registerEjs, 'utf8');
console.log('OK: register.ejs');

// Verify Vietnamese text
const vl = fs.readFileSync('d:/Code/web/fashion-store/views/auth/login.ejs', 'utf8');
const vr = fs.readFileSync('d:/Code/web/fashion-store/views/auth/register.ejs', 'utf8');
console.log('Login has "\u0110\u0103ng Nh\u1EADp":', vl.includes('\u0110\u0103ng Nh\u1EADp'));
console.log('Register has "\u0110\u0103ng K\u00FD":', vr.includes('\u0110\u0103ng K\u00FD'));
console.log('Login has "M\u1EADt kh\u1EA9u":', vl.includes('M\u1EADt kh\u1EA9u'));
