/* ============================================
   SEARCH RESULTS PAGE - JAVASCRIPT
   Add to your script.js or create search-results.js
   ============================================ */

(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {
        initSearchResults();
    });

    function initSearchResults() {
        loadSearchQuery();
        initSearchForm();
        initViewToggle();
        initFilters();
        initSort();
        initPagination();
        initResultCards();
    }

    // ===== LOAD SEARCH QUERY =====
    function loadSearchQuery() {
        const urlParams = new URLSearchParams(window.location.search);
        const query = urlParams.get('q') || '';
        
        // Update search input and display
        const searchInput = document.getElementById('searchInput');
        const searchQueryDisplay = document.getElementById('searchQueryDisplay');
        
        if (searchInput && query) {
            searchInput.value = query;
        }
        
        if (searchQueryDisplay && query) {
            searchQueryDisplay.textContent = `"${query}"`;
        }
    }

    // ===== SEARCH FORM =====
    function initSearchForm() {
        const searchForm = document.querySelector('.search-form-inline');
        const searchInput = document.getElementById('searchInput');

        if (searchForm) {
            searchForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const query = searchInput.value.trim();
                
                if (query.length === 0) {
                    if (window.marketplace && window.marketplace.showNotification) {
                        window.marketplace.showNotification('Please enter a search term', 'warning');
                    }
                    return;
                }

                // Update URL and reload results
                const newUrl = `${window.location.pathname}?q=${encodeURIComponent(query)}`;
                window.history.pushState({}, '', newUrl);
                
                // Update display
                document.getElementById('searchQueryDisplay').textContent = `"${query}"`;
                
                // Simulate search
                performSearch(query);
            });
        }

        // Search suggestions
        const suggestionLinks = document.querySelectorAll('.suggestion-link');
        suggestionLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const suggestion = this.textContent.trim();
                if (searchInput) {
                    searchInput.value = suggestion;
                    searchForm.dispatchEvent(new Event('submit'));
                }
            });
        });

        // Related search tags
        const relatedTags = document.querySelectorAll('.related-tag');
        relatedTags.forEach(tag => {
            tag.addEventListener('click', function(e) {
                e.preventDefault();
                const tagText = this.textContent.trim();
                if (searchInput) {
                    searchInput.value = tagText;
                    searchForm.dispatchEvent(new Event('submit'));
                }
            });
        });
    }

    function performSearch(query) {
        console.log('Searching for:', query);
        
        // Show loading state
        const resultsGrid = document.getElementById('searchResultsGrid');
        if (resultsGrid) {
            resultsGrid.style.opacity = '0.5';
            
            setTimeout(() => {
                resultsGrid.style.opacity = '1';
                
                // Here you would:
                // 1. Fetch search results from API
                // 2. Update results grid
                // 3. Update results count
                // 4. Update pagination
                
                if (window.marketplace && window.marketplace.showNotification) {
                    window.marketplace.showNotification('Search completed', 'success');
                }
            }, 500);
        }
    }

    // ===== VIEW TOGGLE =====
    function initViewToggle() {
        const viewButtons = document.querySelectorAll('.view-toggle .btn');
        const resultsGrid = document.getElementById('searchResultsGrid');

        if (!resultsGrid) return;

        viewButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active from all
                viewButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active to clicked
                this.classList.add('active');

                // Get view type
                const viewType = this.getAttribute('data-view');

                // Toggle grid classes
                resultsGrid.classList.remove('grid-view', 'list-view');
                resultsGrid.classList.add(`${viewType}-view`);

                // Save preference
                localStorage.setItem('searchViewPreference', viewType);

                // Add animation
                resultsGrid.style.opacity = '0';
                setTimeout(() => {
                    resultsGrid.style.opacity = '1';
                }, 150);
            });
        });

        // Load saved preference
        const savedView = localStorage.getItem('searchViewPreference');
        if (savedView) {
            const button = document.querySelector(`.view-toggle [data-view="${savedView}"]`);
            if (button) {
                button.click();
            }
        }
    }

    // ===== FILTERS =====
    function initFilters() {
        const filterCheckboxes = document.querySelectorAll('.filter-checkbox input, .filter-radio input');
        const clearFiltersBtn = document.getElementById('clearFilters');

        // Filter change
        filterCheckboxes.forEach(input => {
            input.addEventListener('change', function() {
                applyFilters();
                updateActiveFilters();
            });
        });

        // Clear all filters
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', function() {
                // Uncheck all checkboxes
                document.querySelectorAll('.filter-checkbox input:checked').forEach(cb => {
                    if (cb.name !== 'category' || cb.value !== 'ui-kits') {
                        cb.checked = false;
                    }
                });

                // Reset radios
                document.querySelectorAll('.filter-radio input[value="all"]').forEach(radio => {
                    radio.checked = true;
                });

                applyFilters();
                updateActiveFilters();

                if (window.marketplace && window.marketplace.showNotification) {
                    window.marketplace.showNotification('Filters cleared', 'info');
                }
            });
        }

        // Remove individual filter tags
        document.querySelectorAll('.active-filters-sidebar .remove-tag').forEach(btn => {
            btn.addEventListener('click', function() {
                const filterTag = this.closest('.filter-tag');
                const filterName = filterTag.textContent.trim().replace('×', '').trim();
                
                // Uncheck corresponding filter
                const checkbox = Array.from(document.querySelectorAll('.filter-checkbox input')).find(cb => {
                    const label = cb.closest('.filter-checkbox').querySelector('.label-text');
                    return label && label.textContent.trim() === filterName;
                });
                
                if (checkbox) {
                    checkbox.checked = false;
                    applyFilters();
                    updateActiveFilters();
                }
            });
        });
    }

    function applyFilters() {
        const resultsGrid = document.getElementById('searchResultsGrid');
        if (!resultsGrid) return;

        console.log('Applying filters...');

        // Show loading
        resultsGrid.style.opacity = '0.5';

        setTimeout(() => {
            resultsGrid.style.opacity = '1';
            
            // Here you would:
            // 1. Get selected filters
            // 2. Send to API
            // 3. Update results
            
            updateResultsCount();
        }, 500);
    }

    function updateActiveFilters() {
        const activeFiltersContainer = document.getElementById('activeFiltersSidebar');
        if (!activeFiltersContainer) return;

        const checkedFilters = document.querySelectorAll('.filter-checkbox input:checked');
        let filtersHTML = '';

        checkedFilters.forEach(filter => {
            const label = filter.closest('.filter-checkbox').querySelector('.label-text');
            if (label) {
                filtersHTML += `
                    <div class="filter-tag">
                        ${label.textContent.trim()}
                        <button class="remove-tag"><i class="bi bi-x"></i></button>
                    </div>
                `;
            }
        });

        activeFiltersContainer.innerHTML = filtersHTML;

        // Re-attach event listeners
        initFilters();

        // Show/hide container
        if (filtersHTML) {
            activeFiltersContainer.style.display = 'flex';
        } else {
            activeFiltersContainer.style.display = 'none';
        }
    }

    function updateResultsCount() {
        const resultsCountEl = document.getElementById('resultsCount');
        const resultsInfo = document.querySelector('.results-info');
        
        // Simulate updated count
        const total = 156;
        const perPage = 24;
        
        if (resultsCountEl) {
            resultsCountEl.textContent = total;
        }
        
        if (resultsInfo) {
            resultsInfo.innerHTML = `Showing <strong>1-${perPage}</strong> of <strong>${total}</strong> results`;
        }
    }

    // ===== SORT =====
    function initSort() {
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
                    sortButton.textContent = this.textContent.trim();
                }

                // Apply sorting
                const sortType = this.textContent.trim();
                applySort(sortType);
            });
        });
    }

    function applySort(sortType) {
        console.log('Sorting by:', sortType);
        
        const resultsGrid = document.getElementById('searchResultsGrid');
        if (resultsGrid) {
            resultsGrid.style.opacity = '0.5';
            
            setTimeout(() => {
                resultsGrid.style.opacity = '1';
                
                if (window.marketplace && window.marketplace.showNotification) {
                    window.marketplace.showNotification(`Sorted by: ${sortType}`, 'info');
                }
            }, 500);
        }
    }

    // ===== PAGINATION =====
    function initPagination() {
        const pageLinks = document.querySelectorAll('.page-link');

        pageLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();

                const item = this.closest('.page-item');
                
                if (item.classList.contains('disabled') || item.classList.contains('active')) {
                    return;
                }

                // Remove active from all
                document.querySelectorAll('.page-item').forEach(i => {
                    i.classList.remove('active');
                });

                // Add active to clicked
                item.classList.add('active');

                // Scroll to top
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });

                // Load page
                const pageNumber = this.textContent.trim();
                loadPage(pageNumber);
            });
        });
    }

    function loadPage(pageNumber) {
        console.log('Loading page:', pageNumber);
        
        const resultsGrid = document.getElementById('searchResultsGrid');
        if (resultsGrid) {
            resultsGrid.style.opacity = '0.5';
            
            setTimeout(() => {
                resultsGrid.style.opacity = '1';
            }, 500);
        }
    }

    // ===== RESULT CARDS =====
    function initResultCards() {
        const cards = document.querySelectorAll('.result-card');

        cards.forEach(card => {
            // Click to view details
            card.addEventListener('click', function(e) {
                // Ignore if clicking on buttons
                if (e.target.closest('.btn-wishlist') ||
                    e.target.closest('.btn-quick-view') ||
                    e.target.closest('.btn-add-cart')) {
                    return;
                }

                // Redirect to details
                window.location.href = 'asset-details.html?id=1';
            });
        });

        // Wishlist buttons
        const wishlistBtns = document.querySelectorAll('.btn-wishlist');
        wishlistBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                
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
                            name: 'Asset',
                            price: 49
                        });
                    }
                }
            });
        });

        // Quick view buttons
        const quickViewBtns = document.querySelectorAll('.btn-quick-view');
        quickViewBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                
                // Show quick view modal (reuse from homepage)
                if (window.marketplace && window.marketplace.showNotification) {
                    window.marketplace.showNotification('Opening quick view...', 'info');
                }
            });
        });

        // Add to cart buttons
        const addToCartBtns = document.querySelectorAll('.btn-add-cart');
        addToCartBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();

                // Add loading animation
                const originalHTML = this.innerHTML;
                this.innerHTML = '<i class="bi bi-hourglass-split"></i>';
                this.disabled = true;

                setTimeout(() => {
                    this.innerHTML = '<i class="bi bi-check"></i>';

                    if (window.marketplace && window.marketplace.cart) {
                        window.marketplace.cart.addItem({
                            id: Date.now().toString(),
                            name: 'Asset',
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

    // ===== MOBILE FILTERS =====
    const mobileToggle = document.getElementById('mobileFilterToggle');
    const filtersSidebar = document.querySelector('.filters-sidebar');
    const closeFilters = document.getElementById('closeFilters');

    if (mobileToggle && filtersSidebar) {
        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'filter-overlay';
        document.body.appendChild(overlay);

        mobileToggle.addEventListener('click', function() {
            filtersSidebar.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

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

})();