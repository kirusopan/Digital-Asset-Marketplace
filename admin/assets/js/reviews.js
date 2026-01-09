/* ============================================
   ADMIN REVIEWS PAGE - JAVASCRIPT
   Add to admin.js or create reviews.js
   ============================================ */

(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {
        initSearch();
        initFilters();
        initActions();
    });

    // ===== SEARCH =====
    function initSearch() {
        const searchInput = document.getElementById('reviewSearch');
        const reviewItems = document.querySelectorAll('.review-item');

        if (searchInput) {
            searchInput.addEventListener('input', function() {
                const searchTerm = this.value.toLowerCase();

                reviewItems.forEach(item => {
                    const text = item.textContent.toLowerCase();
                    item.style.display = text.includes(searchTerm) ? '' : 'none';
                });
            });
        }
    }

    // ===== FILTERS =====
    function initFilters() {
        const ratingFilter = document.getElementById('ratingFilter');
        const statusFilter = document.getElementById('statusFilter');
        const reviewItems = document.querySelectorAll('.review-item');

        if (ratingFilter) {
            ratingFilter.addEventListener('change', function() {
                const selectedRating = this.value;

                reviewItems.forEach(item => {
                    if (selectedRating === 'all') {
                        item.style.display = '';
                        return;
                    }

                    const ratingValue = item.querySelector('.rating-value');
                    if (ratingValue) {
                        const itemRating = Math.floor(parseFloat(ratingValue.textContent));
                        item.style.display = itemRating == selectedRating ? '' : 'none';
                    }
                });
            });
        }

        if (statusFilter) {
            statusFilter.addEventListener('change', function() {
                const selectedStatus = this.value.toLowerCase();

                reviewItems.forEach(item => {
                    if (selectedStatus === 'all') {
                        item.style.display = '';
                        return;
                    }

                    const statusBadge = item.querySelector('.badge');
                    if (statusBadge) {
                        const itemStatus = statusBadge.textContent.toLowerCase();
                        item.style.display = itemStatus === selectedStatus ? '' : 'none';
                    }
                });
            });
        }
    }

    // ===== ACTIONS =====
    function initActions() {
        // Approve Review
        const approveButtons = document.querySelectorAll('.approve-review');
        approveButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const reviewItem = this.closest('.review-item');
                const statusBadge = reviewItem.querySelector('.badge');
                
                if (window.adminPanel && window.adminPanel.showConfirm) {
                    window.adminPanel.showConfirm(
                        'Approve Review',
                        'Are you sure you want to approve this review?',
                        () => {
                            statusBadge.className = 'badge bg-success';
                            statusBadge.textContent = 'Approved';
                            
                            if (window.adminPanel.showNotification) {
                                window.adminPanel.showNotification('Review approved successfully!', 'success');
                            }
                        }
                    );
                }
            });
        });

        // Reject Review
        const rejectButtons = document.querySelectorAll('.reject-review');
        rejectButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const reviewItem = this.closest('.review-item');
                const statusBadge = reviewItem.querySelector('.badge');
                
                if (window.adminPanel && window.adminPanel.showConfirm) {
                    window.adminPanel.showConfirm(
                        'Reject Review',
                        'Are you sure you want to reject this review?',
                        () => {
                            statusBadge.className = 'badge bg-danger';
                            statusBadge.textContent = 'Rejected';
                            
                            if (window.adminPanel.showNotification) {
                                window.adminPanel.showNotification('Review rejected', 'error');
                            }
                        }
                    );
                }
            });
        });

        // Delete Review
        const deleteButtons = document.querySelectorAll('.dropdown-item.text-danger');
        deleteButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const reviewItem = this.closest('.review-item');
                
                if (window.adminPanel && window.adminPanel.showConfirm) {
                    window.adminPanel.showConfirm(
                        'Delete Review',
                        'Are you sure you want to delete this review? This action cannot be undone.',
                        () => {
                            reviewItem.remove();
                            
                            if (window.adminPanel.showNotification) {
                                window.adminPanel.showNotification('Review deleted successfully!', 'success');
                            }
                        }
                    );
                }
            });
        });

        // Reply Button
        const replyButtons = document.querySelectorAll('.review-footer .btn-outline-secondary');
        replyButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                if (window.adminPanel && window.adminPanel.showNotification) {
                    window.adminPanel.showNotification('Reply feature coming soon!', 'info');
                }
            });
        });

        // Helpful Buttons
        const helpfulButtons = document.querySelectorAll('.btn-helpful');
        helpfulButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                this.classList.add('active');
                const count = parseInt(this.textContent.match(/\d+/)[0]);
                this.innerHTML = this.innerHTML.replace(/\d+/, count + 1);
            });
        });
    }

    // ===== EXPORT =====
    const exportBtn = document.querySelector('.btn-outline-secondary:has(.bi-download)');
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            if (window.adminPanel && window.adminPanel.showNotification) {
                window.adminPanel.showNotification('Exporting reviews data...', 'info');
                setTimeout(() => {
                    window.adminPanel.showNotification('Reviews data exported successfully!', 'success');
                }, 1500);
            }
        });
    }

})();