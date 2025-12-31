/* ============================================
   AUTH PAGES (LOGIN & REGISTER) - JAVASCRIPT
   Add to your script.js or create auth.js
   ============================================ */

(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {
        initLoginForm();
        initRegisterForm();
        initPasswordToggle();
        initPasswordStrength();
        initSocialLogin();
    });

    // ===== LOGIN FORM =====
    function initLoginForm() {
        const loginForm = document.getElementById('loginForm');
        
        if (!loginForm) return;

        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form values
            const email = document.getElementById('loginEmail');
            const password = document.getElementById('loginPassword');
            const rememberMe = document.getElementById('rememberMe');

            // Validate
            let isValid = true;

            // Email validation
            if (!email.value.trim() || !isValidEmail(email.value)) {
                email.classList.add('is-invalid');
                isValid = false;
            } else {
                email.classList.remove('is-invalid');
                email.classList.add('is-valid');
            }

            // Password validation
            if (!password.value.trim()) {
                password.classList.add('is-invalid');
                isValid = false;
            } else {
                password.classList.remove('is-invalid');
                password.classList.add('is-valid');
            }

            if (!isValid) return;

            // Show loading state
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            const originalHTML = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="bi bi-hourglass-split"></i><span>Signing In...</span>';
            submitBtn.disabled = true;

            // Simulate login (replace with actual API call)
            setTimeout(() => {
                console.log('Login attempt:', {
                    email: email.value,
                    rememberMe: rememberMe.checked
                });

                if (window.marketplace && window.marketplace.showNotification) {
                    window.marketplace.showNotification('Login successful! Redirecting...', 'success');
                }

                // Redirect after success
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);

            }, 1500);
        });

        // Real-time validation
        const emailInput = document.getElementById('loginEmail');
        const passwordInput = document.getElementById('loginPassword');

        if (emailInput) {
            emailInput.addEventListener('blur', function() {
                if (this.value.trim() && isValidEmail(this.value)) {
                    this.classList.remove('is-invalid');
                    this.classList.add('is-valid');
                }
            });

            emailInput.addEventListener('input', function() {
                this.classList.remove('is-invalid', 'is-valid');
            });
        }

        if (passwordInput) {
            passwordInput.addEventListener('blur', function() {
                if (this.value.trim()) {
                    this.classList.remove('is-invalid');
                    this.classList.add('is-valid');
                }
            });

            passwordInput.addEventListener('input', function() {
                this.classList.remove('is-invalid', 'is-valid');
            });
        }
    }

    // ===== REGISTER FORM =====
    function initRegisterForm() {
        const registerForm = document.getElementById('registerForm');
        
        if (!registerForm) return;

        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form values
            const name = document.getElementById('registerName');
            const email = document.getElementById('registerEmail');
            const password = document.getElementById('registerPassword');
            const confirmPassword = document.getElementById('registerConfirmPassword');
            const agreeTerms = document.getElementById('agreeTerms');
            const accountType = document.querySelector('input[name="accountType"]:checked');

            // Validate
            let isValid = true;

            // Name validation
            if (!name.value.trim() || name.value.length < 3) {
                name.classList.add('is-invalid');
                isValid = false;
            } else {
                name.classList.remove('is-invalid');
                name.classList.add('is-valid');
            }

            // Email validation
            if (!email.value.trim() || !isValidEmail(email.value)) {
                email.classList.add('is-invalid');
                isValid = false;
            } else {
                email.classList.remove('is-invalid');
                email.classList.add('is-valid');
            }

            // Password validation
            const passwordStrength = checkPasswordStrength(password.value);
            if (!password.value.trim() || passwordStrength.score < 3) {
                password.classList.add('is-invalid');
                isValid = false;
            } else {
                password.classList.remove('is-invalid');
                password.classList.add('is-valid');
            }

            // Confirm password validation
            if (password.value !== confirmPassword.value) {
                confirmPassword.classList.add('is-invalid');
                isValid = false;
            } else {
                confirmPassword.classList.remove('is-invalid');
                confirmPassword.classList.add('is-valid');
            }

            // Terms validation
            if (!agreeTerms.checked) {
                if (window.marketplace && window.marketplace.showNotification) {
                    window.marketplace.showNotification('Please agree to the terms and conditions', 'error');
                }
                isValid = false;
            }

            if (!isValid) return;

            // Show loading state
            const submitBtn = registerForm.querySelector('button[type="submit"]');
            const originalHTML = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="bi bi-hourglass-split"></i><span>Creating Account...</span>';
            submitBtn.disabled = true;

            // Simulate registration (replace with actual API call)
            setTimeout(() => {
                console.log('Registration attempt:', {
                    name: name.value,
                    email: email.value,
                    accountType: accountType.value
                });

                if (window.marketplace && window.marketplace.showNotification) {
                    window.marketplace.showNotification('Account created successfully! Redirecting...', 'success');
                }

                // Redirect after success
                setTimeout(() => {
                    window.location.href = accountType.value === 'seller' ? 'seller-dashboard.html' : 'index.html';
                }, 1500);

            }, 1500);
        });

        // Real-time validation for confirm password
        const passwordInput = document.getElementById('registerPassword');
        const confirmPasswordInput = document.getElementById('registerConfirmPassword');

        if (confirmPasswordInput && passwordInput) {
            confirmPasswordInput.addEventListener('input', function() {
                if (this.value === passwordInput.value && this.value.length > 0) {
                    this.classList.remove('is-invalid');
                    this.classList.add('is-valid');
                } else if (this.value.length > 0) {
                    this.classList.add('is-invalid');
                    this.classList.remove('is-valid');
                } else {
                    this.classList.remove('is-invalid', 'is-valid');
                }
            });
        }
    }

    // ===== PASSWORD TOGGLE =====
    function initPasswordToggle() {
        const toggleButtons = document.querySelectorAll('.btn-toggle-password');

        toggleButtons.forEach(button => {
            button.addEventListener('click', function() {
                const targetId = this.getAttribute('data-target');
                const input = document.getElementById(targetId);
                const icon = this.querySelector('i');

                if (input.type === 'password') {
                    input.type = 'text';
                    icon.classList.remove('bi-eye');
                    icon.classList.add('bi-eye-slash');
                } else {
                    input.type = 'password';
                    icon.classList.remove('bi-eye-slash');
                    icon.classList.add('bi-eye');
                }
            });
        });
    }

    // ===== PASSWORD STRENGTH =====
    function initPasswordStrength() {
        const passwordInput = document.getElementById('registerPassword');
        
        if (!passwordInput) return;

        const strengthFill = document.getElementById('strengthFill');
        const strengthText = document.getElementById('strengthText');
        const requirements = {
            length: document.getElementById('req-length'),
            uppercase: document.getElementById('req-uppercase'),
            number: document.getElementById('req-number'),
            special: document.getElementById('req-special')
        };

        passwordInput.addEventListener('input', function() {
            const password = this.value;
            const strength = checkPasswordStrength(password);

            // Update strength bar
            if (strengthFill) {
                strengthFill.className = 'strength-fill';
                if (strength.score > 0) {
                    strengthFill.classList.add(strength.level);
                }
            }

            // Update strength text
            if (strengthText) {
                const texts = {
                    0: 'Password strength',
                    1: 'Weak password',
                    2: 'Fair password',
                    3: 'Good password',
                    4: 'Strong password'
                };
                strengthText.textContent = texts[strength.score];
            }

            // Update requirements
            updateRequirement(requirements.length, password.length >= 8);
            updateRequirement(requirements.uppercase, /[A-Z]/.test(password));
            updateRequirement(requirements.number, /[0-9]/.test(password));
            updateRequirement(requirements.special, /[!@#$%^&*(),.?":{}|<>]/.test(password));
        });
    }

    function checkPasswordStrength(password) {
        let score = 0;
        let level = '';

        if (!password) return { score: 0, level: '' };

        // Length check
        if (password.length >= 8) score++;
        if (password.length >= 12) score++;

        // Character variety checks
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;

        // Determine level
        if (score <= 1) level = 'weak';
        else if (score === 2) level = 'fair';
        else if (score === 3) level = 'good';
        else level = 'strong';

        return { 
            score: Math.min(score, 4), 
            level: level 
        };
    }

    function updateRequirement(element, isValid) {
        if (!element) return;

        if (isValid) {
            element.classList.add('valid');
        } else {
            element.classList.remove('valid');
        }
    }

    // ===== SOCIAL LOGIN =====
    function initSocialLogin() {
        const socialButtons = document.querySelectorAll('.btn-social');

        socialButtons.forEach(button => {
            button.addEventListener('click', function() {
                const platform = this.classList.contains('btn-google') ? 'Google' : 'Facebook';
                
                if (window.marketplace && window.marketplace.showNotification) {
                    window.marketplace.showNotification(`Redirecting to ${platform} login...`, 'info');
                }

                // In production, redirect to OAuth provider
                console.log(`Social login with ${platform}`);
                
                // Simulate loading
                const originalHTML = this.innerHTML;
                this.innerHTML = `<i class="bi bi-hourglass-split"></i><span>Connecting...</span>`;
                this.disabled = true;

                setTimeout(() => {
                    this.innerHTML = originalHTML;
                    this.disabled = false;
                }, 2000);
            });
        });
    }

    // ===== UTILITY FUNCTIONS =====
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // ===== ACCOUNT TYPE SELECTION ANIMATION =====
    const accountTypeCards = document.querySelectorAll('.account-type-card');
    accountTypeCards.forEach(card => {
        card.addEventListener('click', function() {
            // Add ripple effect
            const ripple = document.createElement('div');
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(99, 102, 241, 0.3);
                width: 20px;
                height: 20px;
                animation: ripple 0.6s ease-out;
                pointer-events: none;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            `;
            
            const cardContent = this.querySelector('.card-content');
            cardContent.style.position = 'relative';
            cardContent.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Add ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            from {
                transform: translate(-50%, -50%) scale(0);
                opacity: 1;
            }
            to {
                transform: translate(-50%, -50%) scale(20);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

})();