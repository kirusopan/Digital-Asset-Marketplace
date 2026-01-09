/* ============================================
   ADMIN BLOG POSTS PAGE - JAVASCRIPT
   Add to admin.js or create blog.js
   ============================================ */

(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {
        initSelectAll();
        initSearch();
        initFilters();
        initActions();
        initAddPostForm();
    });

    // ===== SELECT ALL =====
    function initSelectAll() {
        const selectAll = document.getElementById('selectAll');
        const checkboxes = document.querySelectorAll('tbody .form-check-input');

        if (selectAll) {
            selectAll.addEventListener('change', function() {
                checkboxes.forEach(checkbox => {
                    checkbox.checked = this.checked;
                });
            });
        }
    }

    // ===== SEARCH =====
    function initSearch() {
        const searchInput = document.getElementById('postSearch');
        const tableRows = document.querySelectorAll('tbody tr');

        if (searchInput) {
            searchInput.addEventListener('input', function() {
                const searchTerm = this.value.toLowerCase();

                tableRows.forEach(row => {
                    const text = row.textContent.toLowerCase();
                    row.style.display = text.includes(searchTerm) ? '' : 'none';
                });
            });
        }
    }

    // ===== FILTERS =====
    function initFilters() {
        const categoryFilter = document.getElementById('categoryFilter');
        const statusFilter = document.getElementById('statusFilter');
        const tableRows = document.querySelectorAll('tbody tr');

        if (categoryFilter) {
            categoryFilter.addEventListener('change', function() {
                const selectedCategory = this.value.toLowerCase();

                tableRows.forEach(row => {
                    if (selectedCategory === 'all') {
                        row.style.display = '';
                        return;
                    }

                    const categoryBadge = row.querySelector('.badge');
                    if (categoryBadge) {
                        const rowCategory = categoryBadge.textContent.toLowerCase().replace(/\s+/g, '');
                        row.style.display = rowCategory.includes(selectedCategory) ? '' : 'none';
                    }
                });
            });
        }

        if (statusFilter) {
            statusFilter.addEventListener('change', function() {
                const selectedStatus = this.value.toLowerCase();

                tableRows.forEach(row => {
                    if (selectedStatus === 'all') {
                        row.style.display = '';
                        return;
                    }

                    const statusSpan = row.querySelector('.post-status');
                    if (statusSpan) {
                        const rowStatus = statusSpan.textContent.toLowerCase();
                        row.style.display = rowStatus === selectedStatus ? '' : 'none';
                    }
                });
            });
        }
    }

    // ===== ACTIONS =====
    function initActions() {
        // View Post
        const viewButtons = document.querySelectorAll('.btn-action:has(.bi-eye)');
        viewButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const row = this.closest('tr');
                const postTitle = row.querySelector('.post-title').textContent;
                
                if (window.adminPanel && window.adminPanel.showNotification) {
                    window.adminPanel.showNotification('Opening preview for: ' + postTitle, 'info');
                }
            });
        });

        // Edit Post
        const editButtons = document.querySelectorAll('.btn-action:has(.bi-pencil)');
        editButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const row = this.closest('tr');
                const postTitle = row.querySelector('.post-title').textContent;
                
                if (window.adminPanel && window.adminPanel.showNotification) {
                    window.adminPanel.showNotification('Opening editor for: ' + postTitle, 'info');
                }
            });
        });

        // Delete Post
        const deleteButtons = document.querySelectorAll('.btn-action.text-danger');
        deleteButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const row = this.closest('tr');
                const postTitle = row.querySelector('.post-title').textContent;
                
                if (window.adminPanel && window.adminPanel.showConfirm) {
                    window.adminPanel.showConfirm(
                        'Delete Post',
                        'Are you sure you want to delete "' + postTitle + '"? This action cannot be undone.',
                        () => {
                            row.remove();
                            if (window.adminPanel.showNotification) {
                                window.adminPanel.showNotification('Post deleted successfully!', 'success');
                            }
                        }
                    );
                }
            });
        });
    }

    // ===== ADD POST FORM =====
    function initAddPostForm() {
        const form = document.getElementById('addPostForm');
        
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();

                if (window.adminPanel && window.adminPanel.showNotification) {
                    window.adminPanel.showNotification('Publishing post...', 'info');
                    
                    setTimeout(() => {
                        window.adminPanel.showNotification('Post published successfully!', 'success');
                        
                        const modal = bootstrap.Modal.getInstance(document.getElementById('addPostModal'));
                        modal.hide();
                        
                        form.reset();
                    }, 1500);
                }
            });
        }

        // Save as Draft
        const draftBtn = document.querySelector('.btn-outline-primary');
        if (draftBtn) {
            draftBtn.addEventListener('click', function() {
                if (window.adminPanel && window.adminPanel.showNotification) {
                    window.adminPanel.showNotification('Post saved as draft!', 'success');
                    
                    const modal = bootstrap.Modal.getInstance(document.getElementById('addPostModal'));
                    modal.hide();
                }
            });
        }
    }

    // ===== EXPORT =====
    const exportBtn = document.querySelector('.btn-outline-secondary:has(.bi-download)');
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            if (window.adminPanel && window.adminPanel.showNotification) {
                window.adminPanel.showNotification('Exporting posts data...', 'info');
                setTimeout(() => {
                    window.adminPanel.showNotification('Posts data exported successfully!', 'success');
                }, 1500);
            }
        });
    }

})();