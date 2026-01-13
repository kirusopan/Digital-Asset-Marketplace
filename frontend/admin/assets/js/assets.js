/* ============================================
   ADMIN ASSETS APPROVAL - JAVASCRIPT
   ============================================ */

(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {
        initSearch();
        initFilters();
        initViewToggle();
    });

    // ===== SEARCH FUNCTIONALITY =====
    function initSearch() {
        const searchInput = document.querySelector('.search-box input');
        if (!searchInput) return;

        searchInput.addEventListener('input', function(e) {
            const query = e.target.value.toLowerCase();
            const cards = document.querySelectorAll('.asset-approval-card');

            cards.forEach(card => {
                const name = card.querySelector('.asset-name').textContent.toLowerCase();
                const category = card.querySelector('.asset-category').textContent.toLowerCase();
                const seller = card.querySelector('.seller-name').textContent.toLowerCase();

                if (name.includes(query) || category.includes(query) || seller.includes(query)) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });

            updateResultsCount();
        });
    }

    // ===== FILTER FUNCTIONALITY =====
    function initFilters() {
        const filters = document.querySelectorAll('.form-select');
        
        filters.forEach(filter => {
            filter.addEventListener('change', function() {
                applyFilters();
            });
        });

        // Reset button
        const resetBtn = document.querySelector('.btn-outline-secondary[class*="Reset"]');
        if (resetBtn) {
            resetBtn.addEventListener('click', function() {
                filters.forEach(filter => filter.value = '');
                document.querySelector('.search-box input').value = '';
                
                const cards = document.querySelectorAll('.asset-approval-card');
                cards.forEach(card => card.style.display = '');
                
                updateResultsCount();
            });
        }
    }

    function applyFilters() {
        const statusFilter = document.querySelector('.form-select[value*="pending"]')?.value || '';
        const categoryFilter = document.querySelectorAll('.form-select')[1]?.value || '';
        const cards = document.querySelectorAll('.asset-approval-card');

        cards.forEach(card => {
            let show = true;

            // Status filter
            if (statusFilter) {
                const status = card.querySelector('.asset-status-badge').classList.contains(statusFilter);
                if (!status) show = false;
            }

            // Category filter
            if (categoryFilter) {
                const category = card.querySelector('.asset-category').textContent.toLowerCase();
                if (!category.includes(categoryFilter.toLowerCase())) show = false;
            }

            card.style.display = show ? '' : 'none';
        });

        updateResultsCount();
    }

    function updateResultsCount() {
        const visible = document.querySelectorAll('.asset-approval-card[style=""]').length;
        const total = document.querySelectorAll('.asset-approval-card').length;
        
        const info = document.querySelector('.pagination-info');
        if (info) {
            info.textContent = `Showing ${visible} of ${total} assets`;
        }

        const title = document.querySelector('.card-title');
        if (title) {
            title.textContent = `Pending Assets (${visible})`;
        }
    }

    // ===== VIEW TOGGLE =====
    function initViewToggle() {
        const toggleBtns = document.querySelectorAll('.view-toggle .btn');
        const grid = document.getElementById('assetsGrid');

        toggleBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                toggleBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');

                const view = this.getAttribute('data-view');
                
                if (view === 'list') {
                    grid.classList.remove('assets-grid');
                    grid.classList.add('assets-list');
                } else {
                    grid.classList.remove('assets-list');
                    grid.classList.add('assets-grid');
                }
            });
        });
    }

})();

// ===== GLOBAL FUNCTIONS =====

function viewAssetDetails(id) {
    console.log('View asset details:', id);
    
    if (window.adminPanel && window.adminPanel.showNotification) {
        window.adminPanel.showNotification('Opening asset details...', 'info');
    }
    
    setTimeout(() => {
        window.location.href = `admin-asset-details.html?id=${id}`;
    }, 500);
}

function approveAsset(id) {
    if (window.adminPanel && window.adminPanel.showConfirm) {
        window.adminPanel.showConfirm(
            'Approve Asset',
            'Are you sure you want to approve this asset? It will be published to the marketplace.',
            () => {
                const card = event.target.closest('.asset-approval-card');
                
                // Update status badge
                const badge = card.querySelector('.asset-status-badge');
                badge.classList.remove('pending');
                badge.classList.add('approved');
                badge.textContent = 'Approved';
                
                // Animate card removal
                card.style.opacity = '0';
                card.style.transform = 'scale(0.9)';
                
                setTimeout(() => {
                    card.remove();
                    updatePendingCount();
                    
                    if (window.adminPanel.showNotification) {
                        window.adminPanel.showNotification('Asset approved successfully!', 'success');
                    }
                }, 300);
            }
        );
    }
}

function rejectAsset(id) {
    if (window.adminPanel && window.adminPanel.showConfirm) {
        window.adminPanel.showConfirm(
            'Reject Asset',
            'Are you sure you want to reject this asset? The seller will be notified.',
            () => {
                const card = event.target.closest('.asset-approval-card');
                
                // Update status badge
                const badge = card.querySelector('.asset-status-badge');
                badge.classList.remove('pending');
                badge.classList.add('rejected');
                badge.textContent = 'Rejected';
                
                // Animate card removal
                card.style.opacity = '0';
                card.style.transform = 'scale(0.9)';
                
                setTimeout(() => {
                    card.remove();
                    updatePendingCount();
                    
                    if (window.adminPanel.showNotification) {
                        window.adminPanel.showNotification('Asset rejected', 'error');
                    }
                }, 300);
            }
        );
    }
}

function updatePendingCount() {
    const pendingCards = document.querySelectorAll('.asset-approval-card .asset-status-badge.pending');
    const count = pendingCards.length;
    
    // Update summary card
    const summaryCard = document.querySelector('.summary-card .summary-value');
    if (summaryCard && summaryCard.textContent === '12') {
        summaryCard.textContent = count;
    }
    
    // Update page title
    const cardTitle = document.querySelector('.card-title');
    if (cardTitle) {
        cardTitle.textContent = `Pending Assets (${count})`;
    }
    
    // Update pagination info
    const paginationInfo = document.querySelector('.pagination-info');
    if (paginationInfo) {
        paginationInfo.textContent = `Showing 1-${count} of ${count} assets`;
    }
}

// ===== EXPORT FUNCTIONALITY =====
document.addEventListener('DOMContentLoaded', function() {
    const exportBtn = document.querySelector('.btn-primary[class*="Export"]');
    
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            if (window.adminPanel && window.adminPanel.showNotification) {
                window.adminPanel.showNotification('Exporting asset data...', 'info');
                
                setTimeout(() => {
                    window.adminPanel.showNotification('Assets exported successfully!', 'success');
                }, 1500);
            }
        });
    }
});