/* ============================================
   SHOPPING CART PAGE - JAVASCRIPT
   Add to your script.js or create cart.js
   ============================================ */

(function() {
    'use strict';

    // Cart state
    let cartData = {
        items: [],
        subtotal: 0,
        discount: 0,
        discountCode: null,
        tax: 0,
        total: 0
    };

    document.addEventListener('DOMContentLoaded', function() {
        initCart();
        initQuantityControls();
        initRemoveButtons();
        initLicenseSelectors();
        initCouponCode();
        initCheckout();
        initClearCart();
        initRecommended();
        loadCartFromDOM();
        updateCartSummary();
    });

    // ===== LOAD CART FROM DOM =====
    function loadCartFromDOM() {
        const cartItems = document.querySelectorAll('.cart-item');
        
        cartItems.forEach(item => {
            const itemId = item.getAttribute('data-item-id');
            const priceElement = item.querySelector('.price-value');
            const quantityInput = item.querySelector('.quantity-input');
            const licenseSelect = item.querySelector('.license-select');
            
            const price = parseFloat(priceElement.getAttribute('data-price') || 0);
            const quantity = parseInt(quantityInput.value);
            const selectedOption = licenseSelect.options[licenseSelect.selectedIndex];
            
            cartData.items.push({
                id: itemId,
                price: price,
                quantity: quantity,
                licenseType: selectedOption.value,
                element: item
            });
        });
    }

    // ===== QUANTITY CONTROLS =====
    function initQuantityControls() {
        const increaseButtons = document.querySelectorAll('.btn-increase');
        const decreaseButtons = document.querySelectorAll('.btn-decrease');
        const quantityInputs = document.querySelectorAll('.quantity-input');

        increaseButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const itemId = this.getAttribute('data-item-id');
                const input = document.querySelector(`.quantity-input[data-item-id="${itemId}"]`);
                const currentValue = parseInt(input.value);
                const maxValue = parseInt(input.getAttribute('max'));

                if (currentValue < maxValue) {
                    input.value = currentValue + 1;
                    updateItemQuantity(itemId, currentValue + 1);
                }
            });
        });

        decreaseButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const itemId = this.getAttribute('data-item-id');
                const input = document.querySelector(`.quantity-input[data-item-id="${itemId}"]`);
                const currentValue = parseInt(input.value);
                const minValue = parseInt(input.getAttribute('min'));

                if (currentValue > minValue) {
                    input.value = currentValue - 1;
                    updateItemQuantity(itemId, currentValue - 1);
                }
            });
        });

        quantityInputs.forEach(input => {
            input.addEventListener('change', function() {
                const itemId = this.getAttribute('data-item-id');
                let value = parseInt(this.value);
                const min = parseInt(this.getAttribute('min'));
                const max = parseInt(this.getAttribute('max'));

                // Validate
                if (isNaN(value) || value < min) {
                    value = min;
                } else if (value > max) {
                    value = max;
                }

                this.value = value;
                updateItemQuantity(itemId, value);
            });
        });
    }

    function updateItemQuantity(itemId, quantity) {
        const item = cartData.items.find(i => i.id === itemId);
        if (item) {
            item.quantity = quantity;
            updateItemTotal(itemId);
            updateCartSummary();
            showNotification(`Quantity updated to ${quantity}`, 'info');
        }
    }

    function updateItemTotal(itemId) {
        const item = cartData.items.find(i => i.id === itemId);
        if (!item) return;

        const total = item.price * item.quantity;
        const totalElement = item.element.querySelector('.total-value');
        
        if (item.price === 0) {
            totalElement.textContent = 'Free';
            totalElement.classList.add('free');
        } else {
            totalElement.textContent = '$' + total.toFixed(2);
            totalElement.classList.remove('free');
        }
    }

    // ===== REMOVE ITEMS =====
    function initRemoveButtons() {
        const removeButtons = document.querySelectorAll('.btn-remove');

        removeButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const itemId = this.getAttribute('data-item-id');
                removeItem(itemId);
            });
        });
    }

    function removeItem(itemId) {
        const item = cartData.items.find(i => i.id === itemId);
        if (!item) return;

        // Remove from DOM with animation
        item.element.style.opacity = '0';
        item.element.style.transform = 'translateX(100px)';
        
        setTimeout(() => {
            item.element.remove();
            
            // Remove from cart data
            cartData.items = cartData.items.filter(i => i.id !== itemId);
            
            // Update cart
            updateCartCount();
            updateCartSummary();
            
            // Check if cart is empty
            if (cartData.items.length === 0) {
                showEmptyCart();
            }

            showNotification('Item removed from cart', 'info');
        }, 300);
    }

    // ===== LICENSE SELECTORS =====
    function initLicenseSelectors() {
        const licenseSelects = document.querySelectorAll('.license-select');

        licenseSelects.forEach(select => {
            select.addEventListener('change', function() {
                const itemId = this.getAttribute('data-item-id');
                const selectedOption = this.options[this.selectedIndex];
                const newPrice = parseFloat(selectedOption.getAttribute('data-price'));
                
                updateItemPrice(itemId, newPrice, selectedOption.value);
            });
        });
    }

    function updateItemPrice(itemId, newPrice, licenseType) {
        const item = cartData.items.find(i => i.id === itemId);
        if (!item) return;

        item.price = newPrice;
        item.licenseType = licenseType;

        // Update price display
        const priceElement = item.element.querySelector('.price-value');
        priceElement.textContent = '$' + newPrice.toFixed(2);
        priceElement.setAttribute('data-price', newPrice);

        // Update total
        updateItemTotal(itemId);
        updateCartSummary();

        showNotification('License updated', 'success');
    }

    // ===== COUPON CODE =====
    function initCouponCode() {
        const applyBtn = document.getElementById('applyCouponBtn');
        const couponInput = document.getElementById('couponInput');
        const couponMessage = document.getElementById('couponMessage');

        if (!applyBtn || !couponInput) return;

        applyBtn.addEventListener('click', function() {
            const code = couponInput.value.trim().toUpperCase();
            
            if (!code) {
                showCouponMessage('Please enter a coupon code', 'error');
                return;
            }

            // Validate coupon (simulate)
            validateCoupon(code);
        });

        couponInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                applyBtn.click();
            }
        });
    }

    function validateCoupon(code) {
        const couponMessage = document.getElementById('couponMessage');
        
        // Simulate coupon validation
        const validCoupons = {
            'SAVE10': { type: 'percentage', value: 10, description: '10% off' },
            'SAVE20': { type: 'percentage', value: 20, description: '20% off' },
            'WELCOME': { type: 'fixed', value: 15, description: '$15 off' }
        };

        if (validCoupons[code]) {
            const coupon = validCoupons[code];
            cartData.discountCode = code;
            
            // Calculate discount
            if (coupon.type === 'percentage') {
                cartData.discount = (cartData.subtotal * coupon.value) / 100;
            } else {
                cartData.discount = coupon.value;
            }

            showCouponMessage(`Coupon "${code}" applied! You saved ${coupon.description}`, 'success');
            updateCartSummary();
        } else {
            showCouponMessage('Invalid coupon code', 'error');
            cartData.discountCode = null;
            cartData.discount = 0;
            updateCartSummary();
        }
    }

    function showCouponMessage(message, type) {
        const couponMessage = document.getElementById('couponMessage');
        couponMessage.textContent = message;
        couponMessage.className = 'coupon-message ' + type;
        
        if (type === 'error') {
            setTimeout(() => {
                couponMessage.className = 'coupon-message';
            }, 3000);
        }
    }

    // ===== UPDATE CART SUMMARY =====
    function updateCartSummary() {
        // Calculate subtotal
        cartData.subtotal = cartData.items.reduce((sum, item) => {
            return sum + (item.price * item.quantity);
        }, 0);

        // Calculate tax (0% for digital products)
        cartData.tax = 0;

        // Calculate total
        cartData.total = cartData.subtotal - cartData.discount + cartData.tax;

        // Update DOM
        document.getElementById('subtotalPrice').textContent = '$' + cartData.subtotal.toFixed(2);
        document.getElementById('taxAmount').textContent = '$' + cartData.tax.toFixed(2);
        document.getElementById('totalPrice').textContent = '$' + cartData.total.toFixed(2);

        // Show/hide discount row
        const discountRow = document.getElementById('discountRow');
        const discountAmount = document.getElementById('discountAmount');
        const discountBadge = document.getElementById('discountBadge');

        if (cartData.discount > 0) {
            discountRow.style.display = 'flex';
            discountAmount.textContent = '-$' + cartData.discount.toFixed(2);
            discountBadge.textContent = cartData.discountCode;
        } else {
            discountRow.style.display = 'none';
        }
    }

    function updateCartCount() {
        const count = cartData.items.length;
        const countElement = document.getElementById('cartItemCount');
        if (countElement) {
            countElement.textContent = count;
        }

        // Update header cart badge
        const headerBadges = document.querySelectorAll('.navbar .badge-count');
        headerBadges.forEach(badge => {
            if (badge.closest('a[href*="cart"]')) {
                badge.textContent = count;
            }
        });
    }

    // ===== EMPTY CART STATE =====
    function showEmptyCart() {
        document.getElementById('cartItemsContainer').style.display = 'none';
        document.getElementById('cartFooter').style.display = 'none';
        document.getElementById('emptyCartState').style.display = 'block';
        document.getElementById('orderSummary').style.display = 'none';
        
        // Hide recommended section
        const recommendedSection = document.querySelector('.recommended-section');
        if (recommendedSection) {
            recommendedSection.style.display = 'none';
        }
    }

    // ===== CLEAR CART =====
    function initClearCart() {
        const clearBtn = document.getElementById('clearCartBtn');
        
        if (!clearBtn) return;

        clearBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to clear your cart?')) {
                clearCart();
            }
        });
    }

    function clearCart() {
        // Remove all items with animation
        cartData.items.forEach((item, index) => {
            setTimeout(() => {
                item.element.style.opacity = '0';
                item.element.style.transform = 'translateX(100px)';
                
                setTimeout(() => {
                    item.element.remove();
                }, 300);
            }, index * 100);
        });

        // Clear cart data
        setTimeout(() => {
            cartData.items = [];
            cartData.discount = 0;
            cartData.discountCode = null;
            
            updateCartCount();
            updateCartSummary();
            showEmptyCart();
            
            showNotification('Cart cleared', 'info');
        }, cartData.items.length * 100 + 300);
    }

    // ===== CHECKOUT =====
    function initCheckout() {
        const checkoutBtn = document.getElementById('checkoutBtn');
        
        if (!checkoutBtn) return;

        checkoutBtn.addEventListener('click', function() {
            if (cartData.items.length === 0) {
                showNotification('Your cart is empty', 'error');
                return;
            }

            // Save cart to session/localStorage
            if (window.marketplace && window.marketplace.storage) {
                window.marketplace.storage.set('checkout_cart', JSON.stringify(cartData));
            }

            // Redirect to checkout
            window.location.href = 'checkout.html';
        });
    }

    // ===== RECOMMENDED PRODUCTS =====
    function initRecommended() {
        const recommendedCards = document.querySelectorAll('.recommended-card');

        recommendedCards.forEach(card => {
            const addBtn = card.querySelector('.btn-sm');
            const quickAddBtn = card.querySelector('.btn-quick-add');

            if (addBtn) {
                addBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    const title = card.querySelector('.recommended-title').textContent;
                    
                    // Add animation
                    this.innerHTML = '<i class="bi bi-check"></i> Added!';
                    this.disabled = true;

                    setTimeout(() => {
                        this.innerHTML = 'Add to Cart';
                        this.disabled = false;
                    }, 2000);

                    showNotification(`"${title}" added to cart`, 'success');
                });
            }

            if (quickAddBtn) {
                quickAddBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    
                    const title = card.querySelector('.recommended-title').textContent;
                    
                    // Add animation
                    this.style.transform = 'scale(1.3)';
                    setTimeout(() => {
                        this.style.transform = '';
                    }, 300);

                    showNotification(`"${title}" added to cart`, 'success');
                });
            }
        });

        // Card click to view details
        recommendedCards.forEach(card => {
            card.addEventListener('click', function(e) {
                if (e.target.closest('.btn-sm') || e.target.closest('.btn-quick-add')) {
                    return;
                }
                window.location.href = 'asset-details.html?id=1';
            });
        });
    }

    // ===== INIT CART =====
    function initCart() {
        // Check if cart is empty on load
        if (document.querySelectorAll('.cart-item').length === 0) {
            showEmptyCart();
        }

        // Item title click to view details
        document.querySelectorAll('.item-title').forEach(title => {
            title.addEventListener('click', function() {
                window.location.href = 'asset-details.html?id=1';
            });
        });
    }

    // ===== UTILITY FUNCTIONS =====
    function showNotification(message, type = 'info') {
        if (window.marketplace && window.marketplace.showNotification) {
            window.marketplace.showNotification(message, type);
        } else {
            console.log(`[${type}] ${message}`);
        }
    }

})();