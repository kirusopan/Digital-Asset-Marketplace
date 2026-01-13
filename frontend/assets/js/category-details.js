/* ============================================
   SINGLE CATEGORY PAGE - JAVASCRIPT
   Add to your script.js or create category-single.js
   ============================================ */

(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {
        initQuickActions();
        initSubcategoryPills();
        initViewToggle();
        initSortDropdown();
        initFilters();
        initAssetCards();
        initRelatedCategories();
        loadCategoryData();
    });

    // ===== LOAD CATEGORY DATA =====
    function loadCategoryData() {
        // Get category from URL parameter
        const urlParams = new URLSearchParams(window.location.search);
        const categorySlug = urlParams.get('cat') || 'ui-kits';
        
        // In real app, fetch category data from API
        console.log('Loading category:', categorySlug);
        
        // Update page title
        document.title = `${getCategoryName(categorySlug)} - AssetHub`;
    }

    function getCategoryName(slug) {
        const categories = {
            'ui-kits': 'UI Kits',
            'templates': 'Templates',
            'graphics': 'Graphics',
            'icons': 'Icons',
            'fonts': 'Fonts',
            'videos': 'Videos',
            'audio': 'Audio',
            'code': 'Source Code'
        };
        return categories[slug] || 'Category';
    }

    // ===== QUICK ACTIONS =====
    function initQuickActions() {
        const filterBtn = document.querySelector('.quick-actions-card .btn-primary');
        const saveBtn = document.querySelectorAll('.quick-actions-card .btn-outline-primary')[0];
        const notifyBtn = document.querySelectorAll('.quick-actions-card .btn-outline-primary')[1];

        // Filter button - scroll to filters
        if (filterBtn) {
            filterBtn.addEventListener('click', function() {
                const sidebar = document.querySelector('.category-sidebar');
                if (sidebar) {
                    sidebar.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        }

        // Save category button
        if (saveBtn) {
            saveBtn.addEventListener('click', function() {
                const isSaved = this.classList.contains('saved');
                
                if (isSaved) {
                    this.classList.remove('saved', 'btn-primary');
                    this.classList.add('btn-outline-primary');
                    this.innerHTML = '<i class="bi bi-bookmark me-2"></i>Save Category';
                    showNotification('Category removed from saved', 'info');
                } else {
                    this.classList.add('saved', 'btn-primary');
                    this.classList.remove('btn-outline-primary');
                    this.innerHTML = '<i class="bi bi-bookmark-fill me-2"></i>Saved';
                    showNotification('Category saved!', 'success');
                }
            });
        }

        // Get notifications button
        if (notifyBtn) {
            notifyBtn.addEventListener('click', function() {
                const isSubscribed = this.classList.contains('subscribed');
                
                if (isSubscribed) {
                    this.classList.remove('subscribed', 'btn-primary');
                    this.classList.add('btn-outline-primary');
                    this.innerHTML = '<i class="bi bi-bell me-2"></i>Get Notifications';
                    showNotification('Notifications turned off', 'info');
                } else {
                    this.classList.add('subscribed', 'btn-primary');
                    this.classList.remove('btn-outline-primary');
                    this.innerHTML = '<i class="bi bi-bell-fill me-2"></i>Notifications On';
                    showNotification('You\'ll get notified about new assets!', 'success');
                }
            });
        }
    }

    // ===== SUBCATEGORY PILLS =====
    function initSubcategoryPills() {
        const pills = document.querySelectorAll('.subcategory-pill');

        pills.forEach(pill => {
            pill.addEventListener('click', function(e) {
                e.preventDefault();

                // Remove active from all
                pills.forEach(p => p.classList.remove('active'));

                // Add active to clicked
                this.classList.add('active');

                // Get subcategory
                const subcategory = this.querySelector('span').textContent;

                // Filter assets by subcategory (simulate)
                filterBySubcategory(subcategory);

                // Add smooth scroll effect
                const assetsGrid = document.querySelector('.assets-grid');
                if (assetsGrid) {
                    assetsGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });

        // Add horizontal scroll with mouse wheel
        const scrollContainer = document.querySelector('.subcategories-scroll');
        if (scrollContainer) {
            scrollContainer.addEventListener('wheel', function(e) {
                if (e.deltaY !== 0) {
                    e.preventDefault();
                    this.scrollLeft += e.deltaY;
                }
            });
        }
    }

    function filterBySubcategory(subcategory) {
        console.log('Filtering by subcategory:', subcategory);

        const assetsGrid = document.querySelector('.assets-grid');
        if (!assetsGrid) return;

        // Show loading
        assetsGrid.style.opacity = '0.5';

        setTimeout(() => {
            assetsGrid.style.opacity = '1';
            
            // Update results count
            const resultsText = document.querySelector('.results-text');
            if (resultsText) {
                resultsText.innerHTML = `Showing <strong>1-24</strong> of <strong>2,156</strong> ${subcategory}`;
            }

            showNotification(`Showing ${subcategory}`, 'info');
        }, 500);
    }

    // ===== VIEW TOGGLE =====
    function initViewToggle() {
        const viewButtons = document.querySelectorAll('.view-toggle .btn');
        const assetsGrid = document.querySelector('.assets-grid');

        if (!assetsGrid) return;

        viewButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active from all
                viewButtons.forEach(btn => btn.classList.remove('active'));

                // Add active to clicked
                this.classList.add('active');

                // Get view type
                const viewType = this.getAttribute('data-view');

                // Toggle grid classes
                assetsGrid.classList.remove('grid-view', 'list-view');
                assetsGrid.classList.add(`${viewType}-view`);

                // Save preference
                localStorage.setItem('preferredView', viewType);

                // Animate
                assetsGrid.style.opacity = '0';
                setTimeout(() => {
                    assetsGrid.style.opacity = '1';
                }, 150);
            });
        });

        // Load saved preference
        const savedView = localStorage.getItem('preferredView');
        if (savedView) {
            const button = document.querySelector(`[data-view="${savedView}"]`);
            if (button) button.click();
        }
    }

    // ===== SORT DROPDOWN =====
    function initSortDropdown() {
        const sortItems = document.querySelectorAll('.sort-dropdown .dropdown-item');
        const sortButton = document.querySelector('.sort-dropdown .btn span');

        sortItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();

                // Remove active from all
                sortItems.forEach(i => i.classList.remove('active'));

                // Add active to clicked
                this.classList.add('active');

                // Update button text
                if (sortButton) {
                    sortButton.textContent = this.textContent;
                }

                // Apply sorting
                const sortValue = this.textContent.toLowerCase();
                applySorting(sortValue);
            });
        });
    }

    function applySorting(sortValue) {
        console.log('Sorting by:', sortValue);

        const assetsGrid = document.querySelector('.assets-grid');
        if (!assetsGrid) return;

        // Show loading
        assetsGrid.style.opacity = '0.5';

        setTimeout(() => {
            assetsGrid.style.opacity = '1';
            showNotification(`Sorted by: ${sortValue}`, 'info');
        }, 500);
    }

    // ===== FILTERS =====
    function initFilters() {
        const filterInputs = document.querySelectorAll('.category-sidebar input[type="radio"], .category-sidebar input[type="checkbox"]');

        filterInputs.forEach(input => {
            input.addEventListener('change', function() {
                applyFilters();
            });
        });

        // Tag cloud items
        const tagItems = document.querySelectorAll('.tag-cloud-item');
        tagItems.forEach(tag => {
            tag.addEventListener('click', function(e) {
                e.preventDefault();

                // Toggle active
                this.classList.toggle('active');

                // Apply filters
                applyFilters();
            });
        });
    }

    function applyFilters() {
        const assetsGrid = document.querySelector('.assets-grid');
        if (!assetsGrid) return;

        // Get selected filters
        const filters = getSelectedFilters();

        console.log('Applying filters:', filters);

        // Show loading
        assetsGrid.style.opacity = '0.5';

        setTimeout(() => {
            assetsGrid.style.opacity = '1';

            // Update results count
            const resultsText = document.querySelector('.results-text');
            if (resultsText) {
                const filteredCount = Math.floor(12450 * 0.6); // Simulate filtered count
                resultsText.innerHTML = `Showing <strong>1-24</strong> of <strong>${filteredCount.toLocaleString()}</strong> UI Kits`;
            }
        }, 500);
    }

    function getSelectedFilters() {
        const filters = {
            price: null,
            rating: [],
            formats: [],
            tags: []
        };

        // Get price
        const priceRadio = document.querySelector('input[name="price"]:checked');
        if (priceRadio) {
            filters.price = priceRadio.value;
        }

        // Get ratings
        document.querySelectorAll('input[name="rating"]:checked').forEach(cb => {
            filters.rating.push(cb.value);
        });

        // Get formats
        document.querySelectorAll('input[name="format"]:checked').forEach(cb => {
            filters.formats.push(cb.value);
        });

        // Get active tags
        document.querySelectorAll('.tag-cloud-item.active').forEach(tag => {
            filters.tags.push(tag.textContent);
        });

        return filters;
    }

    // ===== ASSET CARDS =====
    function initAssetCards() {
        const assetCards = document.querySelectorAll('.asset-card-listing');

        assetCards.forEach(card => {
            // Click to view details
            card.addEventListener('click', function(e) {
                // Ignore if clicking on buttons
                if (e.target.closest('.btn-wishlist') ||
                    e.target.closest('.btn-quick-view') ||
                    e.target.closest('.btn')) {
                    return;
                }

                window.location.href = 'asset-details.html?id=1';
            });

            card.style.cursor = 'pointer';
        });

        // Wishlist buttons
        const wishlistBtns = document.querySelectorAll('.btn-wishlist');
        wishlistBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();

                const isActive = this.classList.contains('active');

                if (isActive) {
                    this.classList.remove('active');
                    showNotification('Removed from wishlist', 'info');
                } else {
                    this.classList.add('active');
                    this.style.transform = 'scale(1.3)';
                    setTimeout(() => {
                        this.style.transform = '';
                    }, 300);
                    showNotification('Added to wishlist!', 'success');
                }
            });
        });

        // Quick view buttons
        const quickViewBtns = document.querySelectorAll('.btn-quick-view');
        quickViewBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();

                const originalHTML = this.innerHTML;
                this.innerHTML = '<i class="bi bi-hourglass-split"></i> Loading...';
                this.disabled = true;

                setTimeout(() => {
                    this.innerHTML = originalHTML;
                    this.disabled = false;

                    // Show quick view modal (if implemented)
                    console.log('Show quick view modal');
                }, 500);
            });
        });

        // Add to cart buttons
        const cartBtns = document.querySelectorAll('.btn-primary');
        cartBtns.forEach(btn => {
            if (btn.querySelector('.bi-cart-plus')) {
                btn.addEventListener('click', function(e) {
                    e.stopPropagation();

                    const originalHTML = this.innerHTML;
                    this.innerHTML = '<i class="bi bi-hourglass-split"></i>';
                    this.disabled = true;

                    setTimeout(() => {
                        this.innerHTML = '<i class="bi bi-check"></i>';
                        showNotification('Added to cart!', 'success');

                        setTimeout(() => {
                            this.innerHTML = originalHTML;
                            this.disabled = false;
                        }, 1000);
                    }, 500);
                });
            }
        });
    }

    // ===== RELATED CATEGORIES =====
    function initRelatedCategories() {
        const relatedCards = document.querySelectorAll('.related-category-card');

        relatedCards.forEach(card => {
            card.addEventListener('click', function(e) {
                e.preventDefault();

                // Add click animation
                this.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    this.style.transform = '';
                    window.location.href = this.getAttribute('href');
                }, 150);
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

    // ===== STICKY SUBCATEGORIES ON SCROLL =====
    window.addEventListener('scroll', function() {
        const subcategoriesSection = document.querySelector('.subcategories-pills-section');
        const heroSection = document.querySelector('.single-category-hero');

        if (!subcategoriesSection || !heroSection) return;

        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
        const scrollTop = window.pageYOffset;

        if (scrollTop > heroBottom) {
            subcategoriesSection.classList.add('is-sticky');
        } else {
            subcategoriesSection.classList.remove('is-sticky');
        }
    });

    // ===== ADD TAG ACTIVE STATE STYLES =====
    const tagStyles = document.createElement('style');
    tagStyles.textContent = `
        .tag-cloud-item.active {
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            color: var(--white);
        }

        .subcategories-pills-section.is-sticky {
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
    `;
    document.head.appendChild(tagStyles);

})();