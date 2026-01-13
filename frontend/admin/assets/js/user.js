/* ============================================
   ADMIN USERS MANAGEMENT - JAVASCRIPT
   Add to admin.js or create users.js
   ============================================ */

(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {
        initSelectAll();
        initSearch();
        initFilters();
        initActions();
        initAddUserForm();
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

        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                const allChecked = Array.from(checkboxes).every(cb => cb.checked);
                if (selectAll) {
                    selectAll.checked = allChecked;
                }
            });
        });
    }

    // ===== SEARCH =====
    function initSearch() {
        const searchInput = document.getElementById('userSearch');
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
        const roleFilter = document.getElementById('roleFilter');
        const statusFilter = document.getElementById('statusFilter');
        const tableRows = document.querySelectorAll('tbody tr');

        if (roleFilter) {
            roleFilter.addEventListener('change', function() {
                const selectedRole = this.value.toLowerCase();

                tableRows.forEach(row => {
                    if (selectedRole === 'all') {
                        row.style.display = '';
                        return;
                    }

                    const roleBadge = row.querySelector('.role-badge');
                    if (roleBadge) {
                        const rowRole = roleBadge.textContent.toLowerCase();
                        row.style.display = rowRole === selectedRole ? '' : 'none';
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

                    const statusBadge = row.querySelector('.status-badge');
                    if (statusBadge) {
                        const rowStatus = statusBadge.textContent.toLowerCase();
                        row.style.display = rowStatus === selectedStatus ? '' : 'none';
                    }
                });
            });
        }
    }

    // ===== ACTIONS =====
    function initActions() {
        // View Profile
        const viewButtons = document.querySelectorAll('.btn-action:has(.bi-eye)');
        viewButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const modal = new bootstrap.Modal(document.getElementById('userDetailsModal'));
                modal.show();
            });
        });

        // Edit User
        const editButtons = document.querySelectorAll('.btn-action:has(.bi-pencil)');
        editButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const row = this.closest('tr');
                const userName = row.querySelector('.user-name').textContent;
                
                if (window.adminPanel && window.adminPanel.showNotification) {
                    window.adminPanel.showNotification('Opening edit form for ' + userName, 'info');
                }
            });
        });

        // Delete User
        const deleteButtons = document.querySelectorAll('.btn-action.text-danger');
        deleteButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const row = this.closest('tr');
                const userName = row.querySelector('.user-name').textContent;
                
                if (window.adminPanel && window.adminPanel.showConfirm) {
                    window.adminPanel.showConfirm(
                        'Delete User',
                        'Are you sure you want to delete ' + userName + '? This action cannot be undone.',
                        () => {
                            row.remove();
                            if (window.adminPanel.showNotification) {
                                window.adminPanel.showNotification('User deleted successfully', 'success');
                            }
                        }
                    );
                }
            });
        });
    }

    // ===== ADD USER FORM =====
    function initAddUserForm() {
        const form = document.getElementById('addUserForm');
        
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();

                const formData = new FormData(form);
                
                if (window.adminPanel && window.adminPanel.showNotification) {
                    window.adminPanel.showNotification('Adding new user...', 'info');
                    
                    setTimeout(() => {
                        window.adminPanel.showNotification('User added successfully!', 'success');
                        
                        const modal = bootstrap.Modal.getInstance(document.getElementById('addUserModal'));
                        modal.hide();
                        
                        form.reset();
                    }, 1500);
                }
            });
        }
    }

    // ===== EXPORT =====
    const exportBtn = document.querySelector('.btn-outline-secondary:has(.bi-download)');
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            if (window.adminPanel && window.adminPanel.showNotification) {
                window.adminPanel.showNotification('Exporting users data...', 'info');
                
                setTimeout(() => {
                    window.adminPanel.showNotification('Users data exported successfully!', 'success');
                }, 1500);
            }
        });
    }

})();