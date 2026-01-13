
(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {
        initMobileFilters();
        initViewToggle();
        initSortDropdown();
        initFilters();
        initActiveFilters();
        initPagination();
        initListingCards();
    });

    // ===== MOBILE FILTERS ===== 
    function initMobileFilters() {
        const mobileToggle = document.getElementById('mobileFilterToggle');
        const filtersSidebar = document.querySelector('.filters-sidebar');
        const closeFilters = document.getElementById('closeFilters');
        
        if (!mobileToggle) return;

        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'filter-overlay';
        document.body.appendChild(overlay);

        // Open filters
        mobileToggle.addEventListener('click', function() {
            filtersSidebar.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        // Close filters
        function closeFiltersSidebar() {
            filtersSidebar.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }

        if (closeFilters) {
            closeFilters.addEventListener('click', closeFiltersSidebar);
        }

        overlay.addEventListener('click', closeFiltersSidebar);
    }

    // ===== VIEW TOGGLE (GRID/LIST) =====
    function initViewToggle() {
        const viewButtons = document.querySelectorAll('.view-toggle .btn');
        const assetsGrid = document.getElementById('assetsGrid');

        if (!assetsGrid) return;

        viewButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active from all buttons
                viewButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active to clicked button
                this.classList.add('active');

                // Get view type
                const viewType = this.getAttribute('data-view');

                // Toggle grid classes
                assetsGrid.classList.remove('grid-view', 'list-view');
                assetsGrid.classList.add(`${viewType}-view`);

                // Save preference
                localStorage.setItem('preferredView', viewType);

                // Add animation
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
            if (button) {
                button.click();
            }
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
                    sortButton.textContent = `Sort By: ${this.textContent}`;
                }

                // Get sort value
                const sortValue = this.getAttribute('data-sort');
                
                // Apply sorting (simulate)
                applySorting(sortValue);

                // Show notification
                if (window.marketplace && window.marketplace.showNotification) {
                    window.marketplace.showNotification(`Sorted by: ${this.textContent}`, 'info');
                }
            });
        });
    }

    function applySorting(sortValue) {
        console.log('Applying sort:', sortValue);
        
        // Show loading state
        const assetsGrid = document.getElementById('assetsGrid');
        if (assetsGrid) {
            assetsGrid.style.opacity = '0.5';
            
            setTimeout(() => {
                assetsGrid.style.opacity = '1';
                
                // Here you would typically:
                // 1. Fetch sorted data from API
                // 2. Re-render the assets grid
                // 3. Update pagination
                
                console.log('Assets sorted by:', sortValue);
            }, 500);
        }
    }

    // ===== FILTERS =====
    function initFilters() {
        const filterCheckboxes = document.querySelectorAll('.filter-checkbox input, .filter-radio input');
        const filterSearch = document.getElementById('filterSearch');
        const clearFiltersBtn = document.getElementById('clearFilters');
        const priceInputs = document.querySelectorAll('.price-range input');

        // Checkbox/Radio change
        filterCheckboxes.forEach(input => {
            input.addEventListener('change', function() {
                applyFilters();
                updateActiveFilters();
            });
        });

        // Search filter
        if (filterSearch) {
            let searchTimeout;
            filterSearch.addEventListener('input', function() {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    applyFilters();
                }, 500);
            });
        }

        // Price range
        priceInputs.forEach(input => {
            let priceTimeout;
            input.addEventListener('input', function() {
                clearTimeout(priceTimeout);
                priceTimeout = setTimeout(() => {
                    applyFilters();
                }, 500);
            });
        });

        // Clear all filters
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', function() {
                // Uncheck all checkboxes
                document.querySelectorAll('.filter-checkbox input:checked').forEach(cb => {
                    cb.checked = false;
                });

                // Reset radios to "all"
                document.querySelectorAll('.filter-radio input[value="all"]').forEach(radio => {
                    radio.checked = true;
                });

                // Clear search
                if (filterSearch) {
                    filterSearch.value = '';
                }

                // Reset price range
                priceInputs.forEach((input, index) => {
                    input.value = index === 0 ? '0' : '200';
                });

                // Apply filters
                applyFilters();
                updateActiveFilters();

                // Show notification
                if (window.marketplace && window.marketplace.showNotification) {
                    window.marketplace.showNotification('All filters cleared', 'info');
                }
            });
        }
    }

    function applyFilters() {
        const assetsGrid = document.getElementById('assetsGrid');
        if (!assetsGrid) return;

        // Get selected filters
        const filters = getSelectedFilters();
        
        console.log('Applying filters:', filters);

        // Show loading
        assetsGrid.style.opacity = '0.5';

        setTimeout(() => {
            assetsGrid.style.opacity = '1';
            
            // Here you would typically:
            // 1. Send filters to API
            // 2. Get filtered results
            // 3. Re-render assets grid
            // 4. Update results count
            
            updateResultsCount(filters);
        }, 500);
    }

    function getSelectedFilters() {
        const filters = {
            categories: [],
            price: null,
            rating: [],
            fileTypes: [],
            search: '',
            priceRange: { min: 0, max: 200 }
        };

        // Get categories
        document.querySelectorAll('.filter-checkbox input[name="category"]:checked').forEach(cb => {
            filters.categories.push(cb.value);
        });

        // Get price type
        const priceRadio = document.querySelector('.filter-radio input[name="price"]:checked');
        if (priceRadio) {
            filters.price = priceRadio.value;
        }

        // Get ratings
        document.querySelectorAll('.filter-checkbox input[name="rating"]:checked').forEach(cb => {
            filters.rating.push(cb.value);
        });

        // Get file types
        document.querySelectorAll('.filter-checkbox input[name="filetype"]:checked').forEach(cb => {
            filters.fileTypes.push(cb.value);
        });

        // Get search
        const searchInput = document.getElementById('filterSearch');
        if (searchInput) {
            filters.search = searchInput.value.trim();
        }

        // Get price range
        const priceInputs = document.querySelectorAll('.price-range input');
        if (priceInputs.length === 2) {
            filters.priceRange.min = parseInt(priceInputs[0].value) || 0;
            filters.priceRange.max = parseInt(priceInputs[1].value) || 200;
        }

        return filters;
    }

    function updateResultsCount(filters) {
        const resultsCount = document.querySelector('.results-count');
        if (!resultsCount) return;

        // Simulate filtered count
        const totalResults = 12450;
        const filteredResults = Math.floor(totalResults * 0.7); // Simulate 70% match

        resultsCount.innerHTML = `Showing <strong>1-24</strong> of <strong>${filteredResults.toLocaleString()}</strong> results`;
    }

    // ===== ACTIVE FILTERS =====
    function updateActiveFilters() {
        const activeFiltersContainer = document.getElementById('activeFilters');
        if (!activeFiltersContainer) return;

        const filters = getSelectedFilters();
        let filtersHTML = '';

        // Category filters
        filters.categories.forEach(cat => {
            const label = cat.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            filtersHTML += `
                <span class="filter-tag">
                    ${label}
                    <button class="remove-tag" data-filter="category" data-value="${cat}">
                        <i class="bi bi-x"></i>
                    </button>
                </span>
            `;
        });

        // Price filter
        if (filters.price && filters.price !== 'all') {
            filtersHTML += `
                <span class="filter-tag">
                    ${filters.price === 'free' ? 'Free' : 'Paid'}
                    <button class="remove-tag" data-filter="price" data-value="${filters.price}">
                        <i class="bi bi-x"></i>
                    </button>
                </span>
            `;
        }

        // Rating filters
        filters.rating.forEach(rating => {
            filtersHTML += `
                <span class="filter-tag">
                    ${rating}★ & up
                    <button class="remove-tag" data-filter="rating" data-value="${rating}">
                        <i class="bi bi-x"></i>
                    </button>
                </span>
            `;
        });

        // File type filters
        filters.fileTypes.forEach(type => {
            filtersHTML += `
                <span class="filter-tag">
                    ${type.toUpperCase()}
                    <button class="remove-tag" data-filter="filetype" data-value="${type}">
                        <i class="bi bi-x"></i>
                    </button>
                </span>
            `;
        });

        activeFiltersContainer.innerHTML = filtersHTML;

        // Add click handlers to remove buttons
        activeFiltersContainer.querySelectorAll('.remove-tag').forEach(btn => {
            btn.addEventListener('click', function() {
                const filterType = this.getAttribute('data-filter');
                const filterValue = this.getAttribute('data-value');
                removeFilter(filterType, filterValue);
            });
        });

        // Show/hide container
        if (filtersHTML) {
            activeFiltersContainer.style.display = 'flex';
        } else {
            activeFiltersContainer.style.display = 'none';
        }
    }

    function removeFilter(filterType, filterValue) {
        // Uncheck the corresponding checkbox/radio
        const input = document.querySelector(`.filter-checkbox input[name="${filterType}"][value="${filterValue}"], .filter-radio input[name="${filterType}"][value="${filterValue}"]`);
        
        if (input) {
            input.checked = false;
            applyFilters();
            updateActiveFilters();
        }
    }

    // ===== PAGINATION =====
    function initPagination() {
        const pageLinks = document.querySelectorAll('.page-link');

        pageLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();

                // Don't do anything for disabled or current page
                if (this.closest('.page-item').classList.contains('disabled') ||
                    this.closest('.page-item').classList.contains('active')) {
                    return;
                }

                // Remove active from all
                document.querySelectorAll('.page-item').forEach(item => {
                    item.classList.remove('active');
                });

                // Add active to clicked
                this.closest('.page-item').classList.add('active');

                // Scroll to top
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });

                // Load new page (simulate)
                loadPage(this.textContent);
            });
        });
    }

    function loadPage(pageNumber) {
        const assetsGrid = document.getElementById('assetsGrid');
        if (!assetsGrid) return;

        console.log('Loading page:', pageNumber);

        // Show loading
        assetsGrid.style.opacity = '0.5';

        setTimeout(() => {
            assetsGrid.style.opacity = '1';
            
            // Here you would typically:
            // 1. Fetch page data from API
            // 2. Re-render assets grid
            // 3. Update pagination
            
            console.log('Page loaded:', pageNumber);
        }, 500);
    }

    // ===== LISTING CARDS INTERACTION =====
    function initListingCards() {
        const cards = document.querySelectorAll('.asset-card-listing');

        cards.forEach(card => {
            // Click to view details
            card.addEventListener('click', function(e) {
                // Ignore if clicking on buttons
                if (e.target.closest('.btn-wishlist') ||
                    e.target.closest('.btn-quick-view') ||
                    e.target.closest('.btn-add-cart')) {
                    return;
                }

                // Redirect to details page
                window.location.href = 'asset-details.html?id=1';
            });
        });

        // Wishlist buttons
        const wishlistBtns = document.querySelectorAll('.asset-card-listing .btn-wishlist');
        wishlistBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                
                const assetId = this.getAttribute('data-id');
                const isActive = this.classList.contains('active');

                if (isActive) {
                    this.classList.remove('active');
                    
                    if (window.marketplace && window.marketplace.wishlist) {
                        window.marketplace.wishlist.removeItem(assetId);
                    }
                } else {
                    this.classList.add('active');
                    
                    // Animation
                    this.style.transform = 'scale(1.3)';
                    setTimeout(() => {
                        this.style.transform = '';
                    }, 300);

                    if (window.marketplace && window.marketplace.wishlist) {
                        window.marketplace.wishlist.addItem({
                            id: assetId,
                            name: 'Asset Name',
                            price: 49
                        });
                    }
                }
            });
        });

        // Quick view buttons
        const quickViewBtns = document.querySelectorAll('.asset-card-listing .btn-quick-view');
        quickViewBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                
                const assetId = this.getAttribute('data-id');
                
                // Add loading effect
                const originalHTML = this.innerHTML;
                this.innerHTML = '<i class="bi bi-hourglass-split"></i> Loading...';
                this.disabled = true;

                // Simulate loading
                setTimeout(() => {
                    this.innerHTML = originalHTML;
                    this.disabled = false;
                    
                    // Show quick view (reuse from homepage)
                    if (window.showQuickViewModal) {
                        window.showQuickViewModal(assetId);
                    }
                }, 500);
            });
        });

        // Add to cart buttons
        const addToCartBtns = document.querySelectorAll('.asset-card-listing .btn-add-cart');
        addToCartBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();

                // Add loading animation
                const originalHTML = this.innerHTML;
                this.innerHTML = '<i class="bi bi-hourglass-split"></i>';
                this.disabled = true;

                // Simulate adding to cart
                setTimeout(() => {
                    this.innerHTML = '<i class="bi bi-check"></i><span>Added!</span>';

                    if (window.marketplace && window.marketplace.cart) {
                        window.marketplace.cart.addItem({
                            id: Math.random().toString(36).substr(2, 9),
                            name: 'Asset Name',
                            price: 49
                        });
                    }

                    setTimeout(() => {
                        this.innerHTML = originalHTML;
                        this.disabled = false;
                    }, 1500);
                }, 500);
            });
        });
    }

    // Initialize on page load
    updateActiveFilters();

})();