/* ============================================
   ABOUT PAGE - JAVASCRIPT
   Add to your script.js or create about.js
   ============================================ */

(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {
        initCounterAnimation();
        initScrollAnimations();
        initTeamInteractions();
        initButtonAnimations();
    });

    // ===== COUNTER ANIMATION =====
    function initCounterAnimation() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        if (statNumbers.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseInt(entry.target.getAttribute('data-target'));
                    animateCounter(entry.target, target);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.5
        });

        statNumbers.forEach(number => observer.observe(number));
    }

    function animateCounter(element, target) {
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += increment;
            
            if (current < target) {
                element.textContent = formatNumber(Math.floor(current));
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = formatNumber(target);
            }
        };

        updateCounter();
    }

    function formatNumber(num) {
        if (num >= 1000) {
            return (num / 1000).toFixed(num >= 10000 ? 0 : 1) + 'K+';
        }
        return num.toString() + '+';
    }

    // ===== SCROLL ANIMATIONS =====
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.value-card, .team-card, .mv-card, .stat-card');
        
        if (animatedElements.length === 0) return;

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
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(element => observer.observe(element));
    }

    // ===== TEAM INTERACTIONS =====
    function initTeamInteractions() {
        const teamCards = document.querySelectorAll('.team-card');
        
        teamCards.forEach(card => {
            // Social links
            const socialLinks = card.querySelectorAll('.team-social .social-link');
            
            socialLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const memberName = card.querySelector('.team-name').textContent;
                    const platform = this.querySelector('i').className.split('-')[1];
                    
                    console.log(`${platform} link clicked for ${memberName}`);
                    
                    // Add click animation
                    this.style.transform = 'scale(0.9)';
                    setTimeout(() => {
                        this.style.transform = '';
                    }, 150);
                    
                    // In real app, would open social link
                    // window.open(this.href, '_blank');
                });
            });

            // Card click (optional - view full profile)
            card.addEventListener('click', function(e) {
                // Ignore if clicking social links
                if (e.target.closest('.team-social')) {
                    return;
                }
                
                const memberName = this.querySelector('.team-name').textContent;
                console.log(`Clicked on ${memberName}'s profile`);
                
                // In real app, would open team member profile
                // window.location.href = `team-member.html?name=${memberName}`;
            });

            card.style.cursor = 'pointer';
        });
    }

    // ===== BUTTON ANIMATIONS =====
    function initButtonAnimations() {
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(button => {
            button.addEventListener('click', function(e) {
                // Add ripple effect
                const ripple = document.createElement('span');
                ripple.classList.add('ripple-effect');
                
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                
                this.appendChild(ripple);
                
                setTimeout(() => ripple.remove(), 600);
            });
        });
    }

    // ===== VALUE CARD INTERACTIONS =====
    const valueCards = document.querySelectorAll('.value-card');
    
    valueCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // Add subtle pulse to icon
            const icon = this.querySelector('.value-icon');
            if (icon) {
                icon.style.transition = 'transform 0.5s ease';
            }
        });
    });

    // ===== MISSION & VISION CARD PARALLAX =====
    const mvCards = document.querySelectorAll('.mv-card');
    
    document.addEventListener('mousemove', function(e) {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        mvCards.forEach((card, index) => {
            const speed = (index + 1) * 2;
            const x = (mouseX - 0.5) * speed;
            const y = (mouseY - 0.5) * speed;
            
            card.style.transform = `translate(${x}px, ${y}px)`;
        });
    });

    // ===== STORY IMAGE PARALLAX =====
    const storyImage = document.querySelector('.story-image-wrapper');
    
    if (storyImage) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rect = storyImage.getBoundingClientRect();
            
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const parallax = (scrolled - rect.top) * 0.2;
                storyImage.querySelector('.story-image').style.transform = `translateY(${parallax}px)`;
            }
        });
    }

    // ===== ADD RIPPLE STYLES =====
    const rippleStyles = document.createElement('style');
    rippleStyles.textContent = `
        .ripple-effect {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple-animation 0.6s ease-out;
            pointer-events: none;
        }

        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }

        .btn {
            position: relative;
            overflow: hidden;
        }
    `;
    document.head.appendChild(rippleStyles);

    // ===== FEATURE ITEMS ANIMATION =====
    const featureItems = document.querySelectorAll('.feature-item');
    
    if (featureItems.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '0';
                        entry.target.style.transform = 'translateX(-20px)';
                        
                        setTimeout(() => {
                            entry.target.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateX(0)';
                        }, 50);
                    }, index * 100);
                    
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2
        });

        featureItems.forEach(item => observer.observe(item));
    }

    // ===== MV LIST ANIMATION =====
    const mvListItems = document.querySelectorAll('.mv-list li');
    
    if (mvListItems.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '0';
                        entry.target.style.transform = 'translateX(-20px)';
                        
                        setTimeout(() => {
                            entry.target.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateX(0)';
                        }, 50);
                    }, index * 80);
                    
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.3
        });

        mvListItems.forEach(item => observer.observe(item));
    }

    // ===== TRACK CTA CLICKS =====
    const ctaButtons = document.querySelectorAll('.about-cta-section .btn');
    
    ctaButtons.forEach(button => {
        button.addEventListener('click', function() {
            const buttonText = this.textContent.trim();
            console.log('CTA clicked:', buttonText);
            
            // Track in analytics
            if (window.ga) {
                ga('send', 'event', 'CTA', 'click', buttonText);
            }
        });
    });

})();