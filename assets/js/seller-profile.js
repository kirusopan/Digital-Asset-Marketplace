/* ============================================
   SELLER PROFILE PAGE - JAVASCRIPT
   Add to your script.js or create seller-profile.js
   ============================================ */

(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {
        initSellerProfile();
    });

    function initSellerProfile() {
        initFollowButton();
        initContactButton();
        initProductFilters();
        initWishlistButtons();
        initSocialLinks();
        initLoadMore();
    }

    // ===== FOLLOW BUTTON =====
    function initFollowButton() {
        const followBtn = document.getElementById('followBtn');
        
        if (!followBtn) return;

        // Check if already following
        const sellerId = getSellerIdFromUrl();
        const isFollowing = checkIfFollowing(sellerId);
        
        if (isFollowing) {
            updateFollowButton(followBtn, true);
        }

        followBtn.addEventListener('click', function() {
            const currentlyFollowing = this.classList.contains('following');
            
            if (currentlyFollowing) {
                // Unfollow
                this.classList.remove('following');
                updateFollowButton(this, false);
                updateFollowerCount(-1);
                
                if (window.marketplace && window.marketplace.showNotification) {
                    window.marketplace.showNotification('Unfollowed seller', 'info');
                }
            } else {
                // Follow
                this.classList.add('following');
                updateFollowButton(this, true);
                updateFollowerCount(1);
                
                // Animation
                this.style.transform = 'scale(1.05)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 200);
                
                if (window.marketplace && window.marketplace.showNotification) {
                    window.marketplace.showNotification('Now following this seller!', 'success');
                }
            }

            // Save to localStorage
            saveFollowStatus(sellerId, !currentlyFollowing);
        });
    }

    function updateFollowButton(button, isFollowing) {
        if (isFollowing) {
            button.innerHTML = '<i class="bi bi-check-circle"></i> Following';
            button.classList.remove('btn-primary');
            button.classList.add('btn-outline-primary');
        } else {
            button.innerHTML = '<i class="bi bi-person-plus"></i> Follow';
            button.classList.remove('btn-outline-primary');
            button.classList.add('btn-primary');
        }
    }

    function updateFollowerCount(change) {
        const followersStat = Array.from(document.querySelectorAll('.stat-label'))
            .find(el => el.textContent === 'Followers');
        
        if (followersStat) {
            const valueEl = followersStat.previousElementSibling;
            let currentValue = parseInt(valueEl.textContent.replace('K', '00').replace(',', ''));
            currentValue += change;
            
            // Format number
            if (currentValue >= 1000) {
                valueEl.textContent = (currentValue / 1000).toFixed(1) + 'K';
            } else {
                valueEl.textContent = currentValue;
            }
        }
    }

    // ===== CONTACT BUTTON =====
    function initContactButton() {
        const contactBtn = document.getElementById('contactBtn');
        
        if (!contactBtn) return;

        contactBtn.addEventListener('click', function() {
            // Show contact modal or redirect to messaging
            if (window.marketplace && window.marketplace.showNotification) {
                window.marketplace.showNotification('Opening contact form...', 'info');
            }
            
            // Here you would open a contact/messaging modal
            console.log('Contact seller functionality');
        });
    }

    // ===== PRODUCT FILTERS =====
    function initProductFilters() {
        const categoryFilter = document.getElementById('categoryFilter');
        const sortProducts = document.getElementById('sortProducts');

        if (categoryFilter) {
            categoryFilter.addEventListener('change', function() {
                filterProducts(this.value);
            });
        }

        if (sortProducts) {
            sortProducts.addEventListener('change', function() {
                sortProductsGrid(this.value);
            });
        }
    }

    function filterProducts(category) {
        console.log('Filtering by category:', category);
        
        const productsGrid = document.querySelector('.seller-products-grid');
        if (!productsGrid) return;

        // Show loading
        productsGrid.style.opacity = '0.5';

        setTimeout(() => {
            productsGrid.style.opacity = '1';
            
            // Here you would:
            // 1. Filter products by category
            // 2. Update grid display
            
            if (window.marketplace && window.marketplace.showNotification) {
                window.marketplace.showNotification(`Showing ${category === 'all' ? 'all' : category} products`, 'info');
            }
        }, 300);
    }

    function sortProductsGrid(sortType) {
        console.log('Sorting by:', sortType);
        
        const productsGrid = document.querySelector('.seller-products-grid');
        if (!productsGrid) return;

        // Show loading
        productsGrid.style.opacity = '0.5';

        setTimeout(() => {
            productsGrid.style.opacity = '1';
            
            // Here you would:
            // 1. Sort products
            // 2. Re-render grid
        }, 300);
    }

    // ===== WISHLIST BUTTONS =====
    function initWishlistButtons() {
        const wishlistBtns = document.querySelectorAll('.btn-wishlist');

        wishlistBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                e.preventDefault();
                
                const isActive = this.classList.contains('active');

                if (isActive) {
                    this.classList.remove('active');
                    this.innerHTML = '<i class="bi bi-heart"></i>';
                } else {
                    this.classList.add('active');
                    this.innerHTML = '<i class="bi bi-heart-fill"></i>';
                    
                    // Animation
                    this.style.transform = 'scale(1.3)';
                    setTimeout(() => {
                        this.style.transform = '';
                    }, 300);
                }

                // Update wishlist
                if (window.marketplace && window.marketplace.wishlist) {
                    if (isActive) {
                        window.marketplace.wishlist.removeItem('1');
                    } else {
                        window.marketplace.wishlist.addItem({
                            id: '1',
                            name: 'Product',
                            price: 49
                        });
                    }
                }
            });
        });
    }

    // ===== SOCIAL LINKS =====
    function initSocialLinks() {
        const socialLinks = document.querySelectorAll('.social-link');

        socialLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                // Add click animation
                this.style.transform = 'translateX(10px)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 200);
            });
        });
    }

    // ===== LOAD MORE =====
    function initLoadMore() {
        const loadMoreBtns = document.querySelectorAll('.btn-outline-primary');

        loadMoreBtns.forEach(btn => {
            if (btn.textContent.includes('Load More')) {
                btn.addEventListener('click', function() {
                    const originalText = this.innerHTML;
                    
                    // Show loading
                    this.innerHTML = '<i class="bi bi-hourglass-split"></i> Loading...';
                    this.disabled = true;

                    setTimeout(() => {
                        this.innerHTML = originalText;
                        this.disabled = false;
                        
                        if (window.marketplace && window.marketplace.showNotification) {
                            window.marketplace.showNotification('More items loaded', 'success');
                        }
                    }, 1000);
                });
            }
        });
    }

    // ===== UTILITY FUNCTIONS =====
    function getSellerIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id') || '1';
    }

    function checkIfFollowing(sellerId) {
        const followers = JSON.parse(localStorage.getItem('followingSellers') || '[]');
        return followers.includes(sellerId);
    }

    function saveFollowStatus(sellerId, isFollowing) {
        let followers = JSON.parse(localStorage.getItem('followingSellers') || '[]');
        
        if (isFollowing) {
            if (!followers.includes(sellerId)) {
                followers.push(sellerId);
            }
        } else {
            followers = followers.filter(id => id !== sellerId);
        }
        
        localStorage.setItem('followingSellers', JSON.stringify(followers));
    }

})();