/* ============================================
   ADMIN CMS PAGES - JAVASCRIPT
   ============================================ */

(function() {
    'use strict';

    let editingPageId = null;

    document.addEventListener('DOMContentLoaded', function() {
        initSearch();
        initFilters();
        initSelectAll();
        initAutoSlug();
    });

    function initSearch() {
        const searchInput = document.querySelector('.search-box input');
        if (!searchInput) return;

        searchInput.addEventListener('input', function(e) {
            const query = e.target.value.toLowerCase();
            const rows = document.querySelectorAll('.cms-table tbody tr');

            rows.forEach(row => {
                const title = row.querySelector('.page-info strong').textContent.toLowerCase();
                const slug = row.querySelector('.page-slug').textContent.toLowerCase();

                if (title.includes(query) || slug.includes(query)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }

    function initFilters() {
        const filters = document.querySelectorAll('.form-select');
        
        filters.forEach(filter => {
            filter.addEventListener('change', function() {
                console.log('Filter changed:', this.value);
            });
        });

        const resetBtn = document.querySelector('.btn-outline-secondary i.bi-arrow-clockwise');
        if (resetBtn) {
            resetBtn.parentElement.addEventListener('click', function() {
                filters.forEach(filter => filter.value = '');
                document.querySelector('.search-box input').value = '';
                
                const rows = document.querySelectorAll('.cms-table tbody tr');
                rows.forEach(row => row.style.display = '');
            });
        }
    }

    function initSelectAll() {
        const selectAll = document.getElementById('selectAll');
        if (!selectAll) return;

        selectAll.addEventListener('change', function() {
            const checkboxes = document.querySelectorAll('.cms-table tbody .form-check-input');
            checkboxes.forEach(cb => cb.checked = this.checked);
        });
    }

    function initAutoSlug() {
        const titleInput = document.getElementById('pageTitle');
        const slugInput = document.getElementById('pageSlug');
        
        if (titleInput && slugInput) {
            titleInput.addEventListener('input', function() {
                const slug = this.value
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-+|-+$/g, '');
                slugInput.value = slug;
            });
        }
    }

    window.openAddPageModal = function() {
        editingPageId = null;
        document.getElementById('modalTitle').textContent = 'Add New Page';
        document.getElementById('pageForm').reset();
        
        const modal = new bootstrap.Modal(document.getElementById('pageModal'));
        modal.show();
    };

    window.editPage = function(id) {
        editingPageId = id;
        document.getElementById('modalTitle').textContent = 'Edit Page';
        
        document.getElementById('pageTitle').value = 'About Us';
        document.getElementById('pageSlug').value = 'about-us';
        document.getElementById('pageType').value = 'standard';
        document.getElementById('pageMetaDesc').value = 'Learn more about our marketplace';
        document.getElementById('pageContent').value = 'Page content here...';
        document.getElementById('pageStatus').value = 'published';
        
        const modal = new bootstrap.Modal(document.getElementById('pageModal'));
        modal.show();
    };

    window.savePage = function() {
        const form = document.getElementById('pageForm');
        
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        if (editingPageId) {
            if (window.adminPanel && window.adminPanel.showNotification) {
                window.adminPanel.showNotification('Page updated and published!', 'success');
            }
        } else {
            if (window.adminPanel && window.adminPanel.showNotification) {
                window.adminPanel.showNotification('Page published successfully!', 'success');
            }
        }

        const modal = bootstrap.Modal.getInstance(document.getElementById('pageModal'));
        modal.hide();
        
        form.reset();
    };

    window.saveDraft = function() {
        const form = document.getElementById('pageForm');
        
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        if (window.adminPanel && window.adminPanel.showNotification) {
            window.adminPanel.showNotification('Draft saved successfully!', 'info');
        }

        const modal = bootstrap.Modal.getInstance(document.getElementById('pageModal'));
        modal.hide();
        
        form.reset();
    };

    window.deletePage = function(id) {
        if (window.adminPanel && window.adminPanel.showConfirm) {
            window.adminPanel.showConfirm(
                'Delete Page',
                'Are you sure you want to delete this page? This action cannot be undone.',
                () => {
                    const row = event.target.closest('tr');
                    row.style.opacity = '0';
                    row.style.transform = 'scale(0.9)';
                    
                    setTimeout(() => {
                        row.remove();
                        
                        if (window.adminPanel.showNotification) {
                            window.adminPanel.showNotification('Page deleted successfully', 'success');
                        }
                    }, 300);
                }
            );
        }
    };

})();