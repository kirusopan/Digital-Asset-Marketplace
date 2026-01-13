/* ============================================
   ADMIN PAYMENTS PAGE - JAVASCRIPT
   Add to admin.js or create payments.js
   ============================================ */

(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {
        initSelectAll();
        initSearch();
        initFilters();
        initActions();
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
        const searchInput = document.getElementById('paymentSearch');
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
        const statusFilter = document.getElementById('statusFilter');
        const methodFilter = document.getElementById('methodFilter');
        const tableRows = document.querySelectorAll('tbody tr');

        if (statusFilter) {
            statusFilter.addEventListener('change', function() {
                const selectedStatus = this.value.toLowerCase();

                tableRows.forEach(row => {
                    if (selectedStatus === 'all') {
                        row.style.display = '';
                        return;
                    }

                    const statusBadge = row.querySelector('.badge-status');
                    if (statusBadge) {
                        const rowStatus = statusBadge.textContent.toLowerCase();
                        row.style.display = rowStatus === selectedStatus ? '' : 'none';
                    }
                });
            });
        }

        if (methodFilter) {
            methodFilter.addEventListener('change', function() {
                const selectedMethod = this.value.toLowerCase();

                tableRows.forEach(row => {
                    if (selectedMethod === 'all') {
                        row.style.display = '';
                        return;
                    }

                    const methodBadge = row.querySelector('.payment-method-badge');
                    if (methodBadge) {
                        const rowMethod = methodBadge.textContent.toLowerCase();
                        row.style.display = rowMethod.includes(selectedMethod) ? '' : 'none';
                    }
                });
            });
        }
    }

    // ===== ACTIONS =====
    function initActions() {
        // View Details
        const viewButtons = document.querySelectorAll('.btn-action:has(.bi-eye)');
        viewButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const modal = new bootstrap.Modal(document.getElementById('paymentDetailsModal'));
                modal.show();
            });
        });

        // Download Receipt
        const downloadButtons = document.querySelectorAll('.btn-action:has(.bi-download)');
        downloadButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const row = this.closest('tr');
                const txnId = row.querySelector('strong').textContent;
                
                if (window.adminPanel && window.adminPanel.showNotification) {
                    window.adminPanel.showNotification('Downloading receipt for ' + txnId, 'info');
                    setTimeout(() => {
                        window.adminPanel.showNotification('Receipt downloaded successfully!', 'success');
                    }, 1500);
                }
            });
        });

        // Refund
        const refundButtons = document.querySelectorAll('.btn-action.text-warning');
        refundButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const row = this.closest('tr');
                const txnId = row.querySelector('strong').textContent;
                const amount = row.querySelectorAll('td')[4].textContent;
                
                if (window.adminPanel && window.adminPanel.showConfirm) {
                    window.adminPanel.showConfirm(
                        'Process Refund',
                        `Are you sure you want to refund ${amount} for transaction ${txnId}?`,
                        () => {
                            if (window.adminPanel.showNotification) {
                                window.adminPanel.showNotification('Refund processed successfully!', 'success');
                            }
                        }
                    );
                }
            });
        });
    }

    // ===== EXPORT =====
    const exportBtn = document.querySelector('.btn-outline-secondary:has(.bi-download)');
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            if (window.adminPanel && window.adminPanel.showNotification) {
                window.adminPanel.showNotification('Exporting payments data...', 'info');
                setTimeout(() => {
                    window.adminPanel.showNotification('Payments data exported successfully!', 'success');
                }, 1500);
            }
        });
    }

})();