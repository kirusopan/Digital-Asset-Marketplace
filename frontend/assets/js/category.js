
(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {
        initCategorySearch();
        initCategoryCards();
        initSubcategoryCards();
        initCategoryTags();
        initScrollAnimations();
    });

    // ===== CATEGORY SEARCH =====
    function initCategorySearch() {
        const searchForm = document.querySelector('.category-search .search-form');
        const searchInput = searchForm?.querySelector('input');

        if (!searchForm || !searchInput) return;

        // Handle form submission
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const query = searchInput.value.trim();
            
            if (query.length === 0) {
                showNotification('Please enter a search term', 'error');
                return;
            }

            // Redirect to search results
            window.location.href = `asset-listing.html?search=${encodeURIComponent(query)}`;
        });

        // Real-time search suggestions
        let searchTimeout;
        searchInput.addEventListener('input', function(e) {
            clearTimeout(searchTimeout);
            
            const query = e.target.value.trim();
            
            if (query.length > 2) {
                searchTimeout = setTimeout(() => {
                    showSearchSuggestions(query);
                }, 300);
            } else {
                hideSearchSuggestions();
            }
        });

        // Close suggestions when clicking outside
        document.addEventListener('click', function(e) {
            if (!searchForm.contains(e.target)) {
                hideSearchSuggestions();
            }
        });
    }

    function showSearchSuggestions(query) {
        // Remove existing suggestions
        hideSearchSuggestions();

        // Sample suggestions (in real app, fetch from API)
        const suggestions = [
            { name: 'UI Kits', count: 12450, icon: 'bi-palette' },
            { name: 'Templates', count: 8320, icon: 'bi-laptop' },
            { name: 'Icons', count: 20150, icon: 'bi-badge-3d' },
            { name: 'Graphics', count: 15890, icon: 'bi-images' }
        ].filter(item => item.name.toLowerCase().includes(query.toLowerCase()));

        if (suggestions.length === 0) return;

        // Create suggestions dropdown
        const dropdown = document.createElement('div');
        dropdown.className = 'search-suggestions';
        dropdown.innerHTML = suggestions.map(item => `
            <a href="asset-listing.html?category=${item.name.toLowerCase()}" class="suggestion-item">
                <i class="bi ${item.icon}"></i>
                <div class="suggestion-info">
                    <span class="suggestion-name">${item.name}</span>
                    <span class="suggestion-count">${item.count.toLocaleString()} assets</span>
                </div>
                <i class="bi bi-arrow-right"></i>
            </a>
        `).join('');

        const searchForm = document.querySelector('.category-search .search-form');
        searchForm.appendChild(dropdown);

        // Animate in
        setTimeout(() => dropdown.classList.add('show'), 10);
    }

    function hideSearchSuggestions() {
        const suggestions = document.querySelector('.search-suggestions');
        if (suggestions) {
            suggestions.classList.remove('show');
            setTimeout(() => suggestions.remove(), 300);
        }
    }

    // ===== CATEGORY CARDS =====
    function initCategoryCards() {
        const categoryCards = document.querySelectorAll('.category-card-large');

        categoryCards.forEach(card => {
            // Click to navigate
            card.addEventListener('click', function(e) {
                // Ignore if clicking on overlay button
                if (e.target.closest('.category-overlay .btn')) {
                    return;
                }

                // Get category from card
                const categoryName = this.querySelector('.category-name').textContent;
                const categorySlug = categoryName.toLowerCase().replace(/\s+/g, '-').replace(/&/g, '');

                // Navigate to listing page
                window.location.href = `asset-listing.html?category=${categorySlug}`;
            });

            // Add hover effect for icon
            card.addEventListener('mouseenter', function() {
                const icon = this.querySelector('.category-icon');
                if (icon) {
                    icon.style.transition = 'transform 0.5s ease';
                }
            });
        });

        // Overlay buttons
        const overlayButtons = document.querySelectorAll('.category-overlay .btn');
        overlayButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                
                // Add click animation
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            });
        });
    }

    // ===== SUBCATEGORY CARDS =====
    function initSubcategoryCards() {
        const subcategoryCards = document.querySelectorAll('.subcategory-card');

        subcategoryCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                // Animate icon rotation
                const icon = this.querySelector('.subcategory-icon');
                if (icon) {
                    icon.style.transition = 'transform 0.5s ease';
                }
            });

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

    // ===== CATEGORY TAGS =====
    function initCategoryTags() {
        const tags = document.querySelectorAll('.category-tags .tag');

        tags.forEach(tag => {
            tag.addEventListener('click', function(e) {
                e.stopPropagation();
                
                const tagText = this.textContent.trim();
                
                // Don't navigate if it's "+X more" tag
                if (tagText.includes('+')) {
                    // Show all tags modal or expand
                    showAllTagsModal(this.closest('.category-card-large'));
                    return;
                }

                // Navigate to filtered listing
                const categoryCard = this.closest('.category-card-large');
                const categoryName = categoryCard.querySelector('.category-name').textContent;
                const categorySlug = categoryName.toLowerCase().replace(/\s+/g, '-').replace(/&/g, '');

                window.location.href = `asset-listing.html?category=${categorySlug}&tag=${encodeURIComponent(tagText)}`;
            });
        });
    }

    function showAllTagsModal(categoryCard) {
        const categoryName = categoryCard.querySelector('.category-name').textContent;
        
        // Sample tags (in real app, fetch from API)
        const allTags = [
            'Dashboard', 'Mobile App', 'Admin Panel', 'E-commerce', 'Portfolio',
            'Landing Page', 'Corporate', 'SaaS', 'Startup', 'Creative',
            'Business', 'Agency', 'Personal', 'Blog', 'Magazine',
            'News', 'Education', 'Medical', 'Real Estate', 'Travel',
            'Restaurant', 'Hotel', 'Fitness', 'Fashion', 'Music'
        ];

        // Create modal
        const modal = document.createElement('div');
        modal.className = 'tags-modal';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <button class="modal-close"><i class="bi bi-x-lg"></i></button>
                <h3 class="modal-title">All Tags for ${categoryName}</h3>
                <div class="tags-grid">
                    ${allTags.map(tag => `
                        <a href="asset-listing.html?tag=${encodeURIComponent(tag)}" class="tag-item">
                            ${tag}
                        </a>
                    `).join('')}
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Animate in
        setTimeout(() => modal.classList.add('show'), 10);

        // Close handlers
        const closeBtn = modal.querySelector('.modal-close');
        const overlay = modal.querySelector('.modal-overlay');

        closeBtn.addEventListener('click', () => closeModal(modal));
        overlay.addEventListener('click', () => closeModal(modal));

        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }

    function closeModal(modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
            document.body.style.overflow = '';
        }, 300);
    }

    // ===== SCROLL ANIMATIONS =====
    function initScrollAnimations() {
        const elements = document.querySelectorAll('.category-card-large, .subcategory-card');

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

        elements.forEach(element => observer.observe(element));
    }

    // ===== UTILITY FUNCTIONS =====
    function showNotification(message, type = 'info') {
        if (window.marketplace && window.marketplace.showNotification) {
            window.marketplace.showNotification(message, type);
        } else {
            alert(message);
        }
    }

    // ===== ADD MODAL STYLES =====
    const modalStyles = document.createElement('style');
    modalStyles.textContent = `
        /* Search Suggestions */
        .search-suggestions {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: var(--white);
            border-radius: var(--border-radius);
            box-shadow: var(--shadow-xl);
            margin-top: 8px;
            overflow: hidden;
            opacity: 0;
            transform: translateY(-10px);
            transition: opacity 0.3s ease, transform 0.3s ease;
            z-index: 100;
        }

        .search-suggestions.show {
            opacity: 1;
            transform: translateY(0);
        }

        .suggestion-item {
            display: flex;
            align-items: center;
            gap: 16px;
            padding: 16px 20px;
            text-decoration: none;
            color: inherit;
            transition: var(--transition-fast);
            border-bottom: 1px solid var(--gray-200);
        }

        .suggestion-item:last-child {
            border-bottom: none;
        }

        .suggestion-item:hover {
            background: var(--gray-100);
            padding-left: 24px;
        }

        .suggestion-item > i:first-child {
            font-size: 1.5rem;
            color: var(--primary-color);
        }

        .suggestion-info {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .suggestion-name {
            font-size: 1rem;
            font-weight: 600;
            color: var(--gray-900);
        }

        .suggestion-count {
            font-size: 0.8125rem;
            color: var(--gray-600);
        }

        .suggestion-item > i:last-child {
            color: var(--gray-400);
            transition: var(--transition-fast);
        }

        .suggestion-item:hover > i:last-child {
            color: var(--primary-color);
            transform: translateX(4px);
        }

        /* Tags Modal */
        .tags-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 9999;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s ease, visibility 0.3s ease;
        }

        .tags-modal.show {
            opacity: 1;
            visibility: visible;
        }

        .tags-modal .modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(5px);
        }

        .tags-modal .modal-content {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0.9);
            width: 90%;
            max-width: 700px;
            max-height: 80vh;
            background: var(--white);
            border-radius: var(--border-radius-lg);
            padding: 40px;
            overflow-y: auto;
            transition: transform 0.3s ease;
        }

        .tags-modal.show .modal-content {
            transform: translate(-50%, -50%) scale(1);
        }

        .tags-modal .modal-close {
            position: absolute;
            top: 20px;
            right: 20px;
            width: 40px;
            height: 40px;
            background: var(--gray-100);
            border: none;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: var(--transition-fast);
        }

        .tags-modal .modal-close:hover {
            background: var(--danger-color);
            color: var(--white);
            transform: rotate(90deg);
        }

        .tags-modal .modal-title {
            font-size: 1.5rem;
            font-weight: 800;
            color: var(--gray-900);
            margin-bottom: 24px;
        }

        .tags-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            gap: 12px;
        }

        .tag-item {
            padding: 12px 20px;
            background: var(--gray-100);
            color: var(--gray-700);
            border-radius: var(--border-radius-sm);
            text-align: center;
            text-decoration: none;
            font-weight: 600;
            font-size: 0.875rem;
            transition: var(--transition-fast);
        }

        .tag-item:hover {
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            color: var(--white);
            transform: translateY(-2px);
        }

        @media (max-width: 767px) {
            .tags-modal .modal-content {
                width: 95%;
                padding: 30px 20px;
            }

            .tags-grid {
                grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
                gap: 8px;
            }

            .tag-item {
                padding: 10px 16px;
                font-size: 0.8125rem;
            }
        }
    `;
    document.head.appendChild(modalStyles);

})();