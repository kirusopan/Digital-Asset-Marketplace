/* ============================================
   CONTACT PAGE - JAVASCRIPT
   Add to your script.js or create contact.js
   ============================================ */

(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {
        initContactForm();
        initSmoothScroll();
        initMapInteractions();
        initAccordion();
    });

    // ===== CONTACT FORM =====
    function initContactForm() {
        const form = document.getElementById('contactForm');
        const successMessage = document.getElementById('successMessage');

        if (!form) return;

        // Form submission
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            // Validate form
            if (!validateForm(form)) {
                return;
            }

            // Get form data
            const formData = {
                name: form.name.value.trim(),
                email: form.email.value.trim(),
                phone: form.phone.value.trim(),
                subject: form.subject.value,
                message: form.message.value.trim(),
                newsletter: form.newsletter.checked
            };

            // Submit form
            submitForm(formData, form, successMessage);
        });

        // Real-time validation
        const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });

            input.addEventListener('input', function() {
                if (this.classList.contains('is-invalid')) {
                    validateField(this);
                }
            });
        });

        // Character counter for message
        const messageField = form.message;
        if (messageField) {
            const formText = messageField.closest('.form-group').querySelector('.form-text');
            
            messageField.addEventListener('input', function() {
                const length = this.value.length;
                const minLength = 10;
                
                if (formText) {
                    if (length < minLength) {
                        formText.innerHTML = `<i class="bi bi-info-circle"></i> ${minLength - length} more characters needed`;
                        formText.style.color = 'var(--warning-color)';
                    } else {
                        formText.innerHTML = `<i class="bi bi-check-circle"></i> Minimum characters met`;
                        formText.style.color = 'var(--success-color)';
                    }
                }
            });
        }
    }

    function validateForm(form) {
        let isValid = true;
        const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');

        inputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    function validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = 'This field is required';

        // Check if empty
        if (!value) {
            isValid = false;
        }
        // Email validation
        else if (field.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }
        // Message validation (minimum 10 characters)
        else if (field.name === 'message') {
            if (value.length < 10) {
                isValid = false;
                errorMessage = 'Message must be at least 10 characters long';
            }
        }
        // Select validation
        else if (field.tagName === 'SELECT') {
            if (!value || value === '') {
                isValid = false;
                errorMessage = 'Please select an option';
            }
        }

        // Update UI
        if (!isValid) {
            field.classList.add('is-invalid');
            field.classList.remove('is-valid');
            
            const feedback = field.closest('.form-group').querySelector('.invalid-feedback');
            if (feedback) {
                feedback.textContent = errorMessage;
            }
        } else {
            field.classList.remove('is-invalid');
            field.classList.add('is-valid');
        }

        return isValid;
    }

    function submitForm(formData, form, successMessage) {
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Sending...';

        // Simulate API call
        setTimeout(() => {
            // Success
            console.log('Form submitted:', formData);

            // Show success message
            successMessage.classList.remove('d-none');
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // Reset form
            form.reset();
            form.querySelectorAll('.is-valid').forEach(el => el.classList.remove('is-valid'));

            // Reset button
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;

            // Show notification
            if (window.marketplace && window.marketplace.showNotification) {
                window.marketplace.showNotification('Message sent successfully!', 'success');
            }

            // Hide success message after 10 seconds
            setTimeout(() => {
                successMessage.classList.add('d-none');
            }, 10000);

        }, 2000); // Simulate 2 second delay
    }

    // ===== SMOOTH SCROLL =====
    function initSmoothScroll() {
        const scrollLinks = document.querySelectorAll('a[href^="#"]');

        scrollLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                if (href === '#' || href === '#contactForm') {
                    e.preventDefault();
                    
                    let target;
                    if (href === '#contactForm') {
                        target = document.getElementById('contactForm');
                    } else if (href === '#map') {
                        target = document.getElementById('map');
                    }

                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            });
        });
    }

    // ===== MAP INTERACTIONS =====
    function initMapInteractions() {
        const mapOverlayCard = document.querySelector('.map-overlay-card');
        const directionsBtn = mapOverlayCard?.querySelector('.btn');

        if (directionsBtn) {
            directionsBtn.addEventListener('click', function(e) {
                // Add click animation
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            });
        }

        // Make map interactive on click (disable default scroll behavior)
        const mapWrapper = document.querySelector('.map-wrapper');
        if (mapWrapper) {
            const iframe = mapWrapper.querySelector('iframe');
            
            if (iframe) {
                // Prevent accidental scrolling on map
                mapWrapper.addEventListener('mouseenter', function() {
                    iframe.style.pointerEvents = 'auto';
                });

                mapWrapper.addEventListener('mouseleave', function() {
                    iframe.style.pointerEvents = 'none';
                });
            }
        }
    }

    // ===== ACCORDION INTERACTIONS =====
    function initAccordion() {
        const accordionButtons = document.querySelectorAll('.accordion-button');

        accordionButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Add smooth scroll to accordion item
                setTimeout(() => {
                    this.scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest'
                    });
                }, 300);
            });
        });
    }

    // ===== INFO CARDS ANIMATIONS =====
    const infoCards = document.querySelectorAll('.contact-info-card');
    
    if (infoCards.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '0';
                        entry.target.style.transform = 'translateY(30px)';
                        
                        setTimeout(() => {
                            entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateY(0)';
                        }, 100);
                    }, index * 100);
                    
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });

        infoCards.forEach(card => observer.observe(card));
    }

    // ===== SOCIAL LINKS TRACKING =====
    const socialLinks = document.querySelectorAll('.social-link');
    
    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const platform = this.className.split(' ')[1];
            console.log('Social link clicked:', platform);
            
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
                // Open link in new tab
                window.open(this.href, '_blank');
            }, 150);
        });
    });

    // ===== QUICK LINKS TRACKING =====
    const quickLinks = document.querySelectorAll('.quick-link-item');
    
    quickLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Add click animation
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
                window.location.href = this.getAttribute('href');
            }, 150);
        });
    });

    // ===== FAQ ANALYTICS =====
    const faqItems = document.querySelectorAll('.accordion-item');
    
    faqItems.forEach(item => {
        const button = item.querySelector('.accordion-button');
        const collapse = item.querySelector('.accordion-collapse');
        
        if (button && collapse) {
            collapse.addEventListener('shown.bs.collapse', function() {
                const question = button.textContent.trim();
                console.log('FAQ opened:', question);
                
                // Track most viewed FAQs
                const viewCount = localStorage.getItem(`faq-views-${question}`) || 0;
                localStorage.setItem(`faq-views-${question}`, parseInt(viewCount) + 1);
            });
        }
    });

})();