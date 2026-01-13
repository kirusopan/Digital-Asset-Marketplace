/* ============================================
   ADMIN CATEGORIES MANAGEMENT - JAVASCRIPT
   ============================================ */

(function() {
    'use strict';

    let editingCategoryId = null;

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
            const rows = document.querySelectorAll('.category-table tbody tr');

            rows.forEach(row => {
                const name = row.querySelector('.category-info strong').textContent.toLowerCase();
                const slug = row.querySelector('code').textContent.toLowerCase();
                const desc = row.querySelector('.category-desc').textContent.toLowerCase();

                if (name.includes(query) || slug.includes(query) || desc.includes(query)) {
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

        const resetBtn = document.querySelector('.btn-outline-secondary');
        if (resetBtn && resetBtn.textContent.includes('Reset')) {
            resetBtn.addEventListener('click', function() {
                filters.forEach(filter => filter.value = '');
                document.querySelector('.search-box input').value = '';
                
                const rows = document.querySelectorAll('.category-table tbody tr');
                rows.forEach(row => row.style.display = '');
            });
        }
    }

    function initSelectAll() {
        const selectAll = document.getElementById('selectAll');
        if (!selectAll) return;

        selectAll.addEventListener('change', function() {
            const checkboxes = document.querySelectorAll('.category-table tbody .form-check-input');
            checkboxes.forEach(cb => cb.checked = this.checked);
        });
    }

    function initAutoSlug() {
        const nameInput = document.getElementById('categoryName');
        const slugInput = document.getElementById('categorySlug');
        
        if (nameInput && slugInput) {
            nameInput.addEventListener('input', function() {
                const slug = this.value
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-+|-+$/g, '');
                slugInput.value = slug;
            });
        }
    }

    window.openAddCategoryModal = function() {
        editingCategoryId = null;
        document.getElementById('modalTitle').textContent = 'Add New Category';
        document.getElementById('categoryForm').reset();
        
        const modal = new bootstrap.Modal(document.getElementById('categoryModal'));
        modal.show();
    };

    window.editCategory = function(id) {
        editingCategoryId = id;
        document.getElementById('modalTitle').textContent = 'Edit Category';
        
        document.getElementById('categoryName').value = 'UI Kits';
        document.getElementById('categorySlug').value = 'ui-kits';
        document.getElementById('categoryDesc').value = 'User interface design kits and components';
        document.getElementById('categoryIcon').value = 'bi-palette';
        document.getElementById('categoryColor1').value = '#6366f1';
        document.getElementById('categoryColor2').value = '#818cf8';
        document.getElementById('categoryStatus').value = 'active';
        
        const modal = new bootstrap.Modal(document.getElementById('categoryModal'));
        modal.show();
    };

    window.saveCategory = function() {
        const form = document.getElementById('categoryForm');
        
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const name = document.getElementById('categoryName').value;
        const slug = document.getElementById('categorySlug').value;
        const desc = document.getElementById('categoryDesc').value;
        const icon = document.getElementById('categoryIcon').value;
        const status = document.getElementById('categoryStatus').value;

        if (editingCategoryId) {
            if (window.adminPanel && window.adminPanel.showNotification) {
                window.adminPanel.showNotification('Category updated successfully!', 'success');
            }
        } else {
            if (window.adminPanel && window.adminPanel.showNotification) {
                window.adminPanel.showNotification('Category added successfully!', 'success');
            }
        }

        const modal = bootstrap.Modal.getInstance(document.getElementById('categoryModal'));
        modal.hide();
        
        form.reset();
    };

    window.deleteCategory = function(id) {
        if (window.adminPanel && window.adminPanel.showConfirm) {
            window.adminPanel.showConfirm(
                'Delete Category',
                'Are you sure you want to delete this category? This action cannot be undone.',
                () => {
                    const row = event.target.closest('tr');
                    row.style.opacity = '0';
                    row.style.transform = 'scale(0.9)';
                    
                    setTimeout(() => {
                        row.remove();
                        
                        if (window.adminPanel.showNotification) {
                            window.adminPanel.showNotification('Category deleted successfully', 'success');
                        }
                    }, 300);
                }
            );
        }
    };

})();