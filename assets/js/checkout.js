/* ============================================
   CHECKOUT PAGE - JAVASCRIPT
   Add to your script.js or create checkout.js
   ============================================ */

(function() {
    'use strict';

    // Checkout state
    let checkoutData = {
        subtotal: 88.00,
        discount: 0,
        discountCode: null,
        tax: 0,
        total: 88.00,
        paymentMethod: 'card'
    };

    document.addEventListener('DOMContentLoaded', function() {
        initPaymentMethods();
        initCardFormatting();
        initCouponCode();
        initPlaceOrder();
        initFormValidation();
        loadCheckoutData();
    });

    // ===== LOAD CHECKOUT DATA =====
    function loadCheckoutData() {
        // Load cart data if saved
        if (window.marketplace && window.marketplace.storage) {
            const savedCart = window.marketplace.storage.get('checkout_cart');
            if (savedCart) {
                try {
                    const cartData = JSON.parse(savedCart);
                    checkoutData.subtotal = cartData.subtotal || 88.00;
                    checkoutData.discount = cartData.discount || 0;
                    checkoutData.discountCode = cartData.discountCode || null;
                    updateCheckoutSummary();
                } catch(e) {
                    console.error('Error loading cart data', e);
                }
            }
        }
    }

    // ===== PAYMENT METHODS =====
    function initPaymentMethods() {
        const paymentRadios = document.querySelectorAll('input[name="paymentMethod"]');
        const cardForm = document.getElementById('cardForm');
        const paypalForm = document.getElementById('paypalForm');
        const stripeForm = document.getElementById('stripeForm');

        paymentRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                checkoutData.paymentMethod = this.value;

                // Hide all forms
                cardForm.style.display = 'none';
                paypalForm.style.display = 'none';
                stripeForm.style.display = 'none';

                // Show selected form
                if (this.value === 'card') {
                    cardForm.style.display = 'block';
                } else if (this.value === 'paypal') {
                    paypalForm.style.display = 'block';
                } else if (this.value === 'stripe') {
                    stripeForm.style.display = 'block';
                }
            });
        });
    }

    // ===== CARD FORMATTING =====
    function initCardFormatting() {
        const cardNumber = document.getElementById('cardNumber');
        const cardExpiry = document.getElementById('cardExpiry');
        const cardCvv = document.getElementById('cardCvv');

        if (cardNumber) {
            // Format card number (1234 5678 9012 3456)
            cardNumber.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\s/g, '');
                let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
                e.target.value = formattedValue;
            });

            // Only allow numbers
            cardNumber.addEventListener('keypress', function(e) {
                if (!/[0-9]/.test(e.key) && e.key !== 'Backspace') {
                    e.preventDefault();
                }
            });
        }

        if (cardExpiry) {
            // Format expiry (MM/YY)
            cardExpiry.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length >= 2) {
                    value = value.substring(0, 2) + '/' + value.substring(2, 4);
                }
                e.target.value = value;
            });

            cardExpiry.addEventListener('keypress', function(e) {
                if (!/[0-9]/.test(e.key) && e.key !== 'Backspace') {
                    e.preventDefault();
                }
            });
        }

        if (cardCvv) {
            // Only allow numbers for CVV
            cardCvv.addEventListener('keypress', function(e) {
                if (!/[0-9]/.test(e.key) && e.key !== 'Backspace') {
                    e.preventDefault();
                }
            });
        }
    }

    // ===== COUPON CODE =====
    function initCouponCode() {
        const couponInput = document.getElementById('checkoutCoupon');
        const applyBtn = document.getElementById('applyCheckoutCoupon');

        if (!couponInput || !applyBtn) return;

        applyBtn.addEventListener('click', function() {
            const code = couponInput.value.trim().toUpperCase();
            
            if (!code) {
                showNotification('Please enter a coupon code', 'error');
                return;
            }

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
        // Simulate coupon validation
        const validCoupons = {
            'SAVE10': { type: 'percentage', value: 10 },
            'SAVE20': { type: 'percentage', value: 20 },
            'WELCOME': { type: 'fixed', value: 15 }
        };

        if (validCoupons[code]) {
            const coupon = validCoupons[code];
            checkoutData.discountCode = code;
            
            // Calculate discount
            if (coupon.type === 'percentage') {
                checkoutData.discount = (checkoutData.subtotal * coupon.value) / 100;
            } else {
                checkoutData.discount = coupon.value;
            }

            updateCheckoutSummary();
            showNotification(`Coupon "${code}" applied successfully!`, 'success');
        } else {
            showNotification('Invalid coupon code', 'error');
            checkoutData.discountCode = null;
            checkoutData.discount = 0;
            updateCheckoutSummary();
        }
    }

    function updateCheckoutSummary() {
        // Calculate total
        checkoutData.total = checkoutData.subtotal - checkoutData.discount + checkoutData.tax;

        // Update DOM
        document.getElementById('checkoutSubtotal').textContent = '$' + checkoutData.subtotal.toFixed(2);
        document.getElementById('checkoutTax').textContent = '$' + checkoutData.tax.toFixed(2);
        document.getElementById('checkoutTotal').textContent = '$' + checkoutData.total.toFixed(2);
        document.getElementById('orderTotalBtn').textContent = '$' + checkoutData.total.toFixed(2);

        // Show/hide discount row
        const discountRow = document.getElementById('checkoutDiscountRow');
        const discountAmount = document.getElementById('checkoutDiscount');
        const discountCode = document.getElementById('checkoutDiscountCode');

        if (checkoutData.discount > 0) {
            discountRow.style.display = 'flex';
            discountAmount.textContent = '-$' + checkoutData.discount.toFixed(2);
            discountCode.textContent = checkoutData.discountCode;
        } else {
            discountRow.style.display = 'none';
        }
    }

    // ===== FORM VALIDATION =====
    function initFormValidation() {
        const requiredFields = document.querySelectorAll('[required]');

        requiredFields.forEach(field => {
            field.addEventListener('blur', function() {
                validateField(this);
            });
        });
    }

    function validateField(field) {
        const value = field.value.trim();
        
        // Remove previous validation
        field.classList.remove('is-invalid', 'is-valid');

        if (!value) {
            field.classList.add('is-invalid');
            return false;
        }

        // Email validation
        if (field.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                field.classList.add('is-invalid');
                return false;
            }
        }

        field.classList.add('is-valid');
        return true;
    }

    function validateAllFields() {
        const firstName = document.getElementById('firstName');
        const lastName = document.getElementById('lastName');
        const email = document.getElementById('email');
        const country = document.getElementById('country');
        const city = document.getElementById('city');
        const agreeTerms = document.getElementById('agreeTerms');

        let isValid = true;

        // Validate required fields
        if (!validateField(firstName)) isValid = false;
        if (!validateField(lastName)) isValid = false;
        if (!validateField(email)) isValid = false;
        if (!validateField(country)) isValid = false;
        if (!validateField(city)) isValid = false;

        // Check terms agreement
        if (!agreeTerms.checked) {
            showNotification('Please agree to the Terms of Service', 'error');
            agreeTerms.focus();
            isValid = false;
        }

        // Validate payment method
        if (checkoutData.paymentMethod === 'card') {
            const cardNumber = document.getElementById('cardNumber');
            const cardName = document.getElementById('cardName');
            const cardExpiry = document.getElementById('cardExpiry');
            const cardCvv = document.getElementById('cardCvv');

            if (!cardNumber.value.replace(/\s/g, '').match(/^\d{16}$/)) {
                showNotification('Please enter a valid card number', 'error');
                cardNumber.focus();
                isValid = false;
            }

            if (!cardName.value.trim()) {
                showNotification('Please enter cardholder name', 'error');
                cardName.focus();
                isValid = false;
            }

            if (!cardExpiry.value.match(/^\d{2}\/\d{2}$/)) {
                showNotification('Please enter valid expiry date (MM/YY)', 'error');
                cardExpiry.focus();
                isValid = false;
            }

            if (!cardCvv.value.match(/^\d{3,4}$/)) {
                showNotification('Please enter valid CVV', 'error');
                cardCvv.focus();
                isValid = false;
            }
        }

        return isValid;
    }

    // ===== PLACE ORDER =====
    function initPlaceOrder() {
        const placeOrderBtn = document.getElementById('placeOrderBtn');

        if (!placeOrderBtn) return;

        placeOrderBtn.addEventListener('click', function() {
            // Validate all fields
            if (!validateAllFields()) {
                return;
            }

            // Show loading state
            const originalHTML = this.innerHTML;
            this.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Processing...';
            this.disabled = true;

            // Simulate payment processing
            setTimeout(() => {
                processPayment();
            }, 2000);
        });
    }

    function processPayment() {
        // Collect form data
        const orderData = {
            customer: {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                email: document.getElementById('email').value
            },
            billing: {
                country: document.getElementById('country').value,
                city: document.getElementById('city').value,
                state: document.getElementById('state').value,
                address: document.getElementById('address').value,
                zipCode: document.getElementById('zipCode').value,
                company: document.getElementById('company').value
            },
            payment: {
                method: checkoutData.paymentMethod,
                amount: checkoutData.total
            },
            order: {
                subtotal: checkoutData.subtotal,
                discount: checkoutData.discount,
                discountCode: checkoutData.discountCode,
                tax: checkoutData.tax,
                total: checkoutData.total
            }
        };

        console.log('Processing order:', orderData);

        // Simulate successful payment
        setTimeout(() => {
            showSuccessModal(orderData);
            
            // Clear cart
            if (window.marketplace && window.marketplace.storage) {
                window.marketplace.storage.remove('checkout_cart');
            }
        }, 1000);
    }

    function showSuccessModal(orderData) {
        const modal = document.getElementById('successModal');
        const orderNumber = generateOrderNumber();
        
        // Update modal content
        document.getElementById('orderNumber').textContent = '#' + orderNumber;
        document.getElementById('orderAmount').textContent = '$' + orderData.order.total.toFixed(2);
        document.getElementById('orderEmail').textContent = orderData.customer.email;

        // Show modal
        modal.style.display = 'flex';

        // Prevent body scroll
        document.body.style.overflow = 'hidden';

        // Confetti effect (optional)
        triggerConfetti();
    }

    function generateOrderNumber() {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        return timestamp.toString().slice(-8) + random;
    }

    function triggerConfetti() {
        // Simple confetti effect (you can enhance this)
        console.log('🎉 Order completed successfully!');
    }

    // ===== UTILITY FUNCTIONS =====
    function showNotification(message, type = 'info') {
        if (window.marketplace && window.marketplace.showNotification) {
            window.marketplace.showNotification(message, type);
        } else {
            alert(message);
        }
    }

    // Add validation styles
    const validationStyles = document.createElement('style');
    validationStyles.textContent = `
        .form-control.is-invalid,
        .form-select.is-invalid {
            border-color: var(--danger-color);
        }

        .form-control.is-valid,
        .form-select.is-valid {
            border-color: var(--success-color);
        }

        .form-control.is-invalid:focus,
        .form-select.is-invalid:focus {
            box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
        }

        .form-control.is-valid:focus,
        .form-select.is-valid:focus {
            box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
        }
    `;
    document.head.appendChild(validationStyles);

})();