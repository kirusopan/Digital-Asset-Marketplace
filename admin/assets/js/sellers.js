/* ============================================
   ADMIN SELLERS MANAGEMENT - JAVASCRIPT
   ============================================ */

(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {
        initSearch();
        initFilters();
        initViewToggle();
    });

    function initSearch() {
        const searchInput = document.querySelector('.search-box input');
        if (!searchInput) return;

        searchInput.addEventListener('input', function(e) {
            const query = e.target.value.toLowerCase();
            const cards = document.querySelectorAll('.seller-card');

            cards.forEach(card => {
                const name = card.querySelector('.seller-name').textContent.toLowerCase();
                const title = card.querySelector('.seller-title').textContent.toLowerCase();
                const email = card.querySelector('.info-item span').textContent.toLowerCase();

                if (name.includes(query) || title.includes(query) || email.includes(query)) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    function initFilters() {
        const filters = document.querySelectorAll('.form-select');
        
        filters.forEach(filter => {
            filter.addEventListener('change', function() {
                applyFilters();
            });
        });

        const resetBtn = document.querySelector('.btn-outline-secondary');
        if (resetBtn && resetBtn.textContent.includes('Reset')) {
            resetBtn.addEventListener('click', function() {
                filters.forEach(filter => filter.value = '');
                document.querySelector('.search-box input').value = '';
                
                const cards = document.querySelectorAll('.seller-card');
                cards.forEach(card => card.style.display = '');
            });
        }
    }

    function applyFilters() {
        const cards = document.querySelectorAll('.seller-card');
        
        cards.forEach(card => {
            card.style.display = '';
        });
    }

    function initViewToggle() {
        const toggleBtns = document.querySelectorAll('.view-toggle .btn');
        const grid = document.getElementById('sellersGrid');

        toggleBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                toggleBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');

                const view = this.getAttribute('data-view');
                
                if (view === 'list') {
                    grid.classList.remove('sellers-grid');
                    grid.classList.add('sellers-list');
                } else {
                    grid.classList.remove('sellers-list');
                    grid.classList.add('sellers-grid');
                }
            });
        });
    }

})();

function viewSeller(id) {
    console.log('View seller:', id);
    window.location.href = `admin-seller-details.html?id=${id}`;
}

function editSeller(id) {
    console.log('Edit seller:', id);
    if (window.adminPanel && window.adminPanel.showNotification) {
        window.adminPanel.showNotification('Opening seller editor...', 'info');
    }
}

function suspendSeller(id) {
    if (window.adminPanel && window.adminPanel.showConfirm) {
        window.adminPanel.showConfirm(
            'Suspend Seller',
            'Are you sure you want to suspend this seller? They will not be able to sell until reactivated.',
            () => {
                const card = event.target.closest('.seller-card');
                const badge = card.querySelector('.seller-status-badge');
                
                badge.classList.remove('active');
                badge.classList.add('suspended');
                badge.textContent = 'Suspended';
                
                if (window.adminPanel.showNotification) {
                    window.adminPanel.showNotification('Seller suspended successfully', 'warning');
                }
            }
        );
    }
}

function approveSeller(id) {
    if (window.adminPanel && window.adminPanel.showConfirm) {
        window.adminPanel.showConfirm(
            'Approve Seller',
            'Are you sure you want to approve this seller application?',
            () => {
                const card = event.target.closest('.seller-card');
                const badge = card.querySelector('.seller-status-badge');
                
                badge.classList.remove('pending');
                badge.classList.add('active');
                badge.textContent = 'Active';
                
                const actions = card.querySelector('.seller-actions');
                actions.innerHTML = `
                    <button class="btn btn-sm btn-outline-primary" onclick="viewSeller(${id})">
                        <i class="bi bi-eye"></i> View
                    </button>
                    <button class="btn btn-sm btn-outline-secondary" onclick="editSeller(${id})">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="suspendSeller(${id})">
                        <i class="bi bi-ban"></i>
                    </button>
                `;
                
                if (window.adminPanel.showNotification) {
                    window.adminPanel.showNotification('Seller approved successfully!', 'success');
                }
            }
        );
    }
}

function rejectSeller(id) {
    if (window.adminPanel && window.adminPanel.showConfirm) {
        window.adminPanel.showConfirm(
            'Reject Seller',
            'Are you sure you want to reject this seller application? This action cannot be undone.',
            () => {
                const card = event.target.closest('.seller-card');
                
                card.style.opacity = '0';
                card.style.transform = 'scale(0.9)';
                
                setTimeout(() => {
                    card.remove();
                    
                    if (window.adminPanel.showNotification) {
                        window.adminPanel.showNotification('Seller application rejected', 'error');
                    }
                }, 300);
            }
        );
    }
}