// My Assets - Minimal JavaScript

(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {
        initViewToggle();
        initSearch();
        initTooltips();
    });

    // View Toggle (Grid/List)
    function initViewToggle() {
        const viewButtons = document.querySelectorAll('.btn-group .btn');
        
        viewButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                viewButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                const assetGrid = document.querySelector('.row.g-4');
                if (!assetGrid) return;
                
                if (this.querySelector('.bi-list-ul')) {
                    // List view
                    assetGrid.className = 'row g-3';
                    document.querySelectorAll('.asset-card').forEach(card => {
                        card.closest('.col-lg-4').className = 'col-12';
                        card.style.display = 'flex';
                        card.style.flexDirection = 'row';
                        card.querySelector('.asset-card-image').style.width = '250px';
                        card.querySelector('.asset-card-image').style.height = 'auto';
                    });
                } else {
                    // Grid view
                    assetGrid.className = 'row g-4';
                    document.querySelectorAll('.asset-card').forEach(card => {
                        card.closest('.col-12').className = 'col-lg-4 col-md-6';
                        card.style.display = 'flex';
                        card.style.flexDirection = 'column';
                        card.querySelector('.asset-card-image').style.width = '100%';
                        card.querySelector('.asset-card-image').style.height = '220px';
                    });
                }
            });
        });
    }

    // Search Filter
    function initSearch() {
        const searchInput = document.querySelector('.search-box input');
        
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                const searchTerm = this.value.toLowerCase();
                const assetCards = document.querySelectorAll('.asset-card');
                
                assetCards.forEach(card => {
                    const title = card.querySelector('.asset-card-title').textContent.toLowerCase();
                    const category = card.querySelector('.text-muted.small').textContent.toLowerCase();
                    
                    if (title.includes(searchTerm) || category.includes(searchTerm)) {
                        card.closest('.col-lg-4, .col-md-6, .col-12').style.display = '';
                    } else {
                        card.closest('.col-lg-4, .col-md-6, .col-12').style.display = 'none';
                    }
                });
            });
        }
    }

    // Initialize Bootstrap Tooltips
    function initTooltips() {
        const tooltipTriggerList = [].slice.call(
            document.querySelectorAll('[data-bs-toggle="tooltip"]')
        );
        
        tooltipTriggerList.map(function(tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }

})();