// Global functions for inline onclick handlers
window.toggleNav = function() {
    const navLinks = document.querySelector('.navbar-links');
    const hamburger = document.querySelector('.hamburger');
    if (navLinks) navLinks.classList.toggle('active');
    if (hamburger) hamburger.classList.toggle('active');
};

window.toggleSidebar = function() {
    const sidebar = document.getElementById('adminSidebar') || document.querySelector('.admin-sidebar');
    if (sidebar) {
        sidebar.classList.toggle('collapsed');
        sidebar.classList.toggle('show');
    }
};

document.addEventListener('DOMContentLoaded', () => {

    // Chatbot logic
    const cbToggle = document.getElementById('chatbotToggle');
    const cbWindow = document.getElementById('chatbotWindow');
    const cbClose = document.getElementById('chatbotClose');
    const cbInput = document.getElementById('chatbotInput');
    const cbSend = document.getElementById('chatbotSend');
    const cbBody = document.getElementById('chatbotBody');

    if (cbToggle && cbWindow) {
        cbToggle.addEventListener('click', () => cbWindow.classList.toggle('active'));
        cbClose.addEventListener('click', () => cbWindow.classList.remove('active'));
        
        const sendMsg = () => {
            const text = cbInput.value.trim();
            if (!text) return;
            cbBody.innerHTML += "<div class=\"chat-msg user\"><p>" + text.replace(/</g, "&lt;").replace(/>/g, "&gt;") + "</p></div>";
            cbInput.value = '';
            cbBody.scrollTop = cbBody.scrollHeight;
            
                        setTimeout(async () => {
                cbBody.innerHTML += '<div class="chat-msg bot" id="typing"><p>...</p></div>';
                cbBody.scrollTop = cbBody.scrollHeight;
                try {
                    const res = await fetch('/api/chat', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ message: text })
                    });
                    const data = await res.json();
                    document.getElementById('typing').remove();
                    cbBody.innerHTML += '<div class="chat-msg bot"><p>' + data.reply + '</p></div>';
                    cbBody.scrollTop = cbBody.scrollHeight;
                } catch(e) {
                    document.getElementById('typing').remove();
                    cbBody.innerHTML += '<div class="chat-msg bot"><p>Lỗi kết nối AI.</p></div>';
                }
            }, 500);
        };
        if(cbSend) cbSend.addEventListener('click', sendMsg);
        if(cbInput)     document.addEventListener('click', (e) => {
        if (e.target.classList.contains('chat-chip')) {
            cbInput.value = e.target.innerText;
            cbSend.click();
            e.target.parentElement.style.display = 'none'; // Hide suggestions after clicking
        }
    });
        cbInput.addEventListener('keypress', (e) => { if(e.key === 'Enter') sendMsg(); });
    }
    // 1. Mobile navbar toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.navbar-links');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', window.toggleNav);
    }

    // 17. User dropdown toggle
    const userDropdown = document.querySelector('.user-dropdown');
    const userDropdownMenu = document.querySelector('.user-dropdown-menu');
    if (userDropdown && userDropdownMenu) {
        userDropdown.addEventListener('click', (e) => {
            e.stopPropagation();
            userDropdownMenu.classList.toggle('show');
        });
        document.addEventListener('click', () => {
            userDropdownMenu.classList.remove('show');
        });
    }

    // 16. Navbar scroll state
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }
    });

    // 13. Scroll-to-top button
    const scrollTopBtn = document.querySelector('.scroll-top');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollTopBtn?.classList.add('visible');
        } else {
            scrollTopBtn?.classList.remove('visible');
        }
    });

    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // 14. Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // 15. Toast notification system (Flash messages)
    window.showToast = function(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `flash flash-${type}`;
        toast.innerHTML = `
            <span>${message}</span>
            <i class="fas fa-times flash-close"></i>
        `;
        document.body.appendChild(toast);
        
        toast.querySelector('.flash-close').addEventListener('click', () => {
            toast.remove();
        });

        setTimeout(() => toast.remove(), 4000);
    };

    // 8. Flash message auto-dismiss
    document.querySelectorAll('.flash').forEach(flash => {
        setTimeout(() => flash.remove(), 4000);
        const closeBtn = flash.querySelector('.flash-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => flash.remove());
        }
    });

    const addToCartForms = document.querySelectorAll('.add-to-cart-form');
    addToCartForms.forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            try {
                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());
                const res = await fetch('/cart/add', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                const result = await res.json();
                if (result.success) {
                    showToast('ÄÃ£ thÃªm vÃ o giá» hÃ ng!');
                    const badge = document.querySelector('.cart-badge');
                    if (badge) badge.textContent = result.cartCount;
                } else {
                    showToast(result.message || 'Lá»—i thÃªm vÃ o giá»', 'error');
                }
            } catch (err) {
                showToast('Lá»—i káº¿t ná»‘i', 'error');
            }
        });
    });

    // 2b. Add to cart via .add-cart-btn buttons on product cards
    document.querySelectorAll('.add-cart-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            const productId = btn.dataset.id;
            const color = btn.dataset.color || '';
            const size = btn.dataset.size || '';
            if (!productId) return;

            btn.disabled = true;
            const originalIcon = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

            try {
                const res = await fetch('/cart/add', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ productId, quantity: 1, color, size })
                });
                const result = await res.json();
                if (result.success) {
                    showToast('ÄÃ£ thÃªm vÃ o giá» hÃ ng! ðŸ›ï¸');
                    const badge = document.querySelector('.cart-badge');
                    if (badge) badge.textContent = result.cartCount || '';
                    btn.innerHTML = '<i class="fas fa-check"></i>';
                    setTimeout(() => { btn.innerHTML = originalIcon; btn.disabled = false; }, 1500);
                } else if (result.redirect) {
                    window.location.href = result.redirect;
                } else {
                    showToast(result.message || 'Lá»—i thÃªm vÃ o giá»', 'error');
                    btn.innerHTML = originalIcon;
                    btn.disabled = false;
                }
            } catch (err) {
                showToast('Lá»—i káº¿t ná»‘i', 'error');
                btn.innerHTML = originalIcon;
                btn.disabled = false;
            }
        });
    });

    // 3. Wishlist toggle AJAX
    const wishlistBtns = document.querySelectorAll('.wishlist-btn, .wishlist-btn-detail');
    wishlistBtns.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            const productId = btn.dataset.id;
            if (!productId) return;

            try {
                const res = await fetch('/auth/wishlist', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ productId })
                });
                const result = await res.json();
                
                if (result.success) {
                    btn.classList.toggle('wishlisted');
                    const icon = btn.querySelector('i');
                    if (icon) {
                        icon.classList.toggle('far');
                        icon.classList.toggle('fas');
                    }
                    showToast(result.message);
                } else {
                    if (res.status === 401) {
                        window.location.href = '/auth/login';
                    } else {
                        showToast(result.message, 'error');
                    }
                }
            } catch (err) {
                showToast('Network error', 'error');
            }
        });
    });

    // 4. & 5. Cart quantity update and remove
    const cartItems = document.querySelectorAll('.cart-item');
    cartItems.forEach(item => {
        const qtyInput = item.querySelector('.qty-input');
        const updateUrl = item.dataset.updateUrl;
        const removeBtn = item.querySelector('.cart-remove-btn');

        if (qtyInput && updateUrl) {
            qtyInput.addEventListener('change', async () => {
                const qty = parseInt(qtyInput.value);
                if (qty < 1) return;
                try {
                    const res = await fetch(updateUrl, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ quantity: qty })
                    });
                    if (res.ok) window.location.reload();
                } catch (e) {
                    showToast('Error updating cart', 'error');
                }
            });
        }

        if (removeBtn) {
            removeBtn.addEventListener('click', async () => {
                const removeUrl = removeBtn.dataset.url;
                if (!removeUrl) return;
                try {
                    const res = await fetch(removeUrl, { method: 'DELETE' });
                    if (res.ok) window.location.reload();
                } catch (e) {
                    showToast('Error removing item', 'error');
                }
            });
        }
    });

    // 6. Image gallery
    const mainImage = document.querySelector('.main-image');
    const thumbnails = document.querySelectorAll('.gallery-thumb');
    if (mainImage && thumbnails.length > 0) {
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', () => {
                thumbnails.forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');
                mainImage.src = thumb.querySelector('img').src;
            });
        });
    }

    // 7. Size/color selection
    document.querySelectorAll('.size-btn-detail').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.size-btn-detail').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const hiddenInput = document.querySelector('#selected-size');
            if (hiddenInput) hiddenInput.value = btn.dataset.value;
        });
    });
    document.querySelectorAll('.color-swatch').forEach(swatch => {
        swatch.addEventListener('click', () => {
            document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
            swatch.classList.add('active');
            const hiddenInput = document.querySelector('#selected-color');
            if (hiddenInput) hiddenInput.value = swatch.dataset.value;
        });
    });

    

        const prevBtn = document.querySelector('.slider-arrow.prev');
    const nextBtn = document.querySelector('.slider-arrow.next');
    if (prevBtn) prevBtn.addEventListener('click', () => { window.prevSlide(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { window.nextSlide(); });
    if (slides.length > 1) {
        startSlider();
        const sliderEl = document.querySelector('.hero-slider');
        if (sliderEl) {
            sliderEl.addEventListener('mouseenter', stopSlider);
            sliderEl.addEventListener('mouseleave', startSlider);
        }
    }

    // 18. toggleSidebar for admin mobile
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const adminSidebar = document.querySelector('.admin-sidebar');
    const adminMain = document.querySelector('.admin-main');
    if (sidebarToggle && adminSidebar) {
        sidebarToggle.addEventListener('click', () => {
            adminSidebar.classList.toggle('show');
            adminSidebar.classList.toggle('collapsed');
            if(adminMain) adminMain.classList.toggle('expanded');
        });
    }

    // 9. Admin order status update
    document.querySelectorAll('.status-select').forEach(select => {
        select.addEventListener('change', async (e) => {
            const orderId = e.target.dataset.id;
            const status = e.target.value;
            try {
                const res = await fetch(`/admin/orders/${orderId}/status`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status })
                });
                if (res.ok) showToast('Status updated');
                else showToast('Error updating status', 'error');
            } catch (err) {
                showToast('Network error', 'error');
            }
        });
    });

    // 10. Admin user toggle
    document.querySelectorAll('.toggle-user-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const userId = e.currentTarget.dataset.id;
            try {
                const res = await fetch(`/admin/users/${userId}/toggle`, { method: 'PUT' });
                if (res.ok) window.location.reload();
            } catch (err) {
                showToast('Error toggling user', 'error');
            }
        });
    });

    // 11. Admin delete product
    document.querySelectorAll('.delete-product-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            if (!confirm('Are you sure you want to delete this product?')) return;
            const productId = e.currentTarget.dataset.id;
            try {
                const res = await fetch(`/admin/products/${productId}`, { method: 'DELETE' });
                if (res.ok) window.location.reload();
            } catch (err) {
                showToast('Error deleting product', 'error');
            }
        });
    });

    // 12. Admin delete category
    document.querySelectorAll('.delete-category-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            if (!confirm('Are you sure you want to delete this category?')) return;
            const categoryId = e.currentTarget.dataset.id;
            try {
                const res = await fetch(`/admin/categories/${categoryId}`, { method: 'DELETE' });
                if (res.ok) window.location.reload();
            } catch (err) {
                showToast('Error deleting category', 'error');
            }
        });
    });

    // 20. Coupon code apply
    const applyCouponBtn = document.querySelector('.coupon-btn');
    if (applyCouponBtn) {
        applyCouponBtn.addEventListener('click', async () => {
            const code = document.querySelector('.coupon-input').value;
            if (!code) return;
            try {
                const res = await fetch('/cart/apply-coupon', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ code })
                });
                const result = await res.json();
                if (result.success) window.location.reload();
                else showToast(result.message || 'Invalid coupon', 'error');
            } catch (err) {
                showToast('Error applying coupon', 'error');
            }
        });
    }

    // 21. Coupon code remove
    const removeCouponBtn = document.querySelector('.coupon-remove');
    if (removeCouponBtn) {
        removeCouponBtn.addEventListener('click', async () => {
            try {
                const res = await fetch('/cart/remove-coupon', { method: 'POST' });
                if (res.ok) window.location.reload();
            } catch (err) {
                showToast('Error removing coupon', 'error');
            }
        });
    }

    // 22. Search overlay
    const searchOverlay = document.querySelector('.search-bar-overlay');
    const searchIcon = document.querySelector('.search-icon');
    const closeSearchBtn = document.querySelector('.close-search');

    window.closeSearch = function() {
        if (searchOverlay) searchOverlay.classList.remove('active');
    };

    if (searchIcon && searchOverlay) {
        searchIcon.addEventListener('click', (e) => {
            e.preventDefault();
            searchOverlay.classList.add('active');
            searchOverlay.querySelector('input')?.focus();
        });
    }
    if (closeSearchBtn) {
        closeSearchBtn.addEventListener('click', closeSearch);
    }
});






