/* ============================================
   BECOME A SELLER PAGE - JAVASCRIPT
   Add to your script.js or create seller.js
   ============================================ */

(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {
        initSmoothScroll();
        initSellerForm();
        initAccordion();
        initAnimations();
        initPricingCards();
    });

    // ===== SMOOTH SCROLL =====
    function initSmoothScroll() {
        const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');

        smoothScrollLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                // Don't scroll for bootstrap collapse/accordion
                if (href.startsWith('#faq') || href === '#') return;
                
                e.preventDefault();
                
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 100;
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ===== SELLER APPLICATION FORM =====
    function initSellerForm() {
        const sellerForm = document.getElementById('sellerForm');

        if (!sellerForm) return;

        sellerForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Validate form
            if (!validateSellerForm()) {
                return;
            }

            // Get form data
            const formData = new FormData(sellerForm);
            const data = Object.fromEntries(formData);

            console.log('Seller application data:', data);

            // Show loading state
            const submitBtn = sellerForm.querySelector('button[type="submit"]');
            const originalHTML = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Submitting...';
            submitBtn.disabled = true;

            // Simulate API call
            setTimeout(() => {
                showSuccessMessage();
                sellerForm.reset();
                
                // Reset button
                submitBtn.innerHTML = originalHTML;
                submitBtn.disabled = false;
            }, 2000);
        });
    }

    function validateSellerForm() {
        const form = document.getElementById('sellerForm');
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.classList.add('is-invalid');
                isValid = false;
            } else {
                field.classList.remove('is-invalid');
                field.classList.add('is-valid');
            }
        });

        // Check terms checkbox
        const termsCheckbox = document.getElementById('agreeSellerTerms');
        if (!termsCheckbox.checked) {
            showNotification('Please agree to the Seller Terms', 'error');
            termsCheckbox.focus();
            isValid = false;
        }

        if (!isValid) {
            showNotification('Please fill in all required fields', 'error');
        }

        return isValid;
    }

    function showSuccessMessage() {
        showNotification('Application submitted successfully! We\'ll review it and get back to you within 24 hours.', 'success');
        
        // Scroll to top
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // ===== ACCORDION =====
    function initAccordion() {
        // Bootstrap handles accordion functionality
        // This is just for custom animations if needed
        const accordionButtons = document.querySelectorAll('.accordion-button');

        accordionButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Custom logic if needed
            });
        });
    }

    // ===== SCROLL ANIMATIONS =====
    function initAnimations() {
        const animatedElements = document.querySelectorAll('.benefit-card, .step-item, .pricing-card, .story-card');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '0';
                    entry.target.style.transform = 'translateY(30px)';
                    
                    setTimeout(() => {
                        entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, 100);

                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }

    // ===== PRICING CARDS =====
    function initPricingCards() {
        const pricingCards = document.querySelectorAll('.pricing-card');

        pricingCards.forEach(card => {
            const button = card.querySelector('.btn');
            
            if (button) {
                button.addEventListener('click', function(e) {
                    const planName = card.querySelector('.plan-name').textContent;
                    
                    // Track which plan was selected
                    console.log('Selected plan:', planName);

                    // If it's a contact sales link, let it proceed normally
                    if (this.textContent.includes('Contact')) {
                        return;
                    }

                    // For other plans, you could:
                    // 1. Scroll to application form
                    // 2. Show a signup modal
                    // 3. Redirect to registration with plan pre-selected
                    
                    if (this.getAttribute('href') === '#application-form') {
                        e.preventDefault();
                        const appForm = document.getElementById('application-form');
                        if (appForm) {
                            appForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                    }
                });
            }
        });
    }

    // ===== UTILITY FUNCTIONS =====
    function showNotification(message, type = 'info') {
        if (window.marketplace && window.marketplace.showNotification) {
            window.marketplace.showNotification(message, type);
        } else {
            alert(message);
        }
    }

    // Add field validation styles
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
    `;
    document.head.appendChild(validationStyles);

    // ===== COUNTER ANIMATION FOR STATS =====
    function animateCounter(element, target, duration = 2000) {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            
            if (current >= target) {
                element.textContent = formatNumber(target);
                clearInterval(timer);
            } else {
                element.textContent = formatNumber(Math.floor(current));
            }
        }, 16);
    }

    function formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M+';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K+';
        }
        return num.toString();
    }

    // Trigger counter animations when stats are visible
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const statNumbers = entry.target.querySelectorAll('.stat-number');
                    
                    statNumbers.forEach((stat, index) => {
                        const text = stat.textContent;
                        let value = parseFloat(text.replace(/[^0-9.]/g, ''));
                        
                        setTimeout(() => {
                            if (text.includes('K')) {
                                animateCounter(stat, value * 1000, 2000);
                            } else if (text.includes('M')) {
                                animateCounter(stat, value * 1000000, 2000);
                            } else {
                                animateCounter(stat, value, 2000);
                            }
                        }, index * 200);
                    });
                    
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statsObserver.observe(heroStats);
    }

})();