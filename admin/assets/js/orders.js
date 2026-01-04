/* ============================================
   ADMIN ORDERS & PAYMENTS - JAVASCRIPT
   ============================================ */

(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {
        initSearch();
        initFilters();
        initSelectAll();
        initDateFilters();
    });

    function initSearch() {
        const searchInput = document.querySelector('.search-box input');
        if (!searchInput) return;

        searchInput.addEventListener('input', function(e) {
            const query = e.target.value.toLowerCase();
            const rows = document.querySelectorAll('.orders-table tbody tr');

            rows.forEach(row => {
                const orderId = row.querySelector('.order-id').textContent.toLowerCase();
                const customer = row.querySelector('.customer-info strong').textContent.toLowerCase();
                const product = row.querySelector('.product-info span').textContent.toLowerCase();

                if (orderId.includes(query) || customer.includes(query) || product.includes(query)) {
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
            resetBtn.closest('button').addEventListener('click', function() {
                filters.forEach(filter => filter.value = '');
                document.querySelectorAll('input[type="date"]').forEach(input => input.value = '');
                document.querySelector('.search-box input').value = '';
                
                const rows = document.querySelectorAll('.orders-table tbody tr');
                rows.forEach(row => row.style.display = '');
            });
        }
    }

    function initSelectAll() {
        const selectAll = document.getElementById('selectAll');
        if (!selectAll) return;

        selectAll.addEventListener('change', function() {
            const checkboxes = document.querySelectorAll('.orders-table tbody .form-check-input');
            checkboxes.forEach(cb => cb.checked = this.checked);
        });
    }

    function initDateFilters() {
        const dateInputs = document.querySelectorAll('input[type="date"]');
        dateInputs.forEach(input => {
            input.addEventListener('change', function() {
                console.log('Date filter changed:', this.value);
            });
        });
    }

})();

function viewOrder(id) {
    console.log('View order:', id);
    window.location.href = `admin-order-details.html?id=${id}`;
}

function printInvoice(id) {
    if (window.adminPanel && window.adminPanel.showNotification) {
        window.adminPanel.showNotification('Generating invoice...', 'info');
        
        setTimeout(() => {
            window.adminPanel.showNotification('Invoice ready to print!', 'success');
            window.print();
        }, 1000);
    }
}

function sendReceipt(id) {
    if (window.adminPanel && window.adminPanel.showNotification) {
        window.adminPanel.showNotification('Sending receipt to customer...', 'info');
        
        setTimeout(() => {
            window.adminPanel.showNotification('Receipt sent successfully!', 'success');
        }, 1500);
    }
}

function refundOrder(id) {
    if (window.adminPanel && window.adminPanel.showConfirm) {
        window.adminPanel.showConfirm(
            'Refund Order',
            'Are you sure you want to refund this order? This action cannot be undone and the payment will be returned to the customer.',
            () => {
                const row = event.target.closest('tr');
                const badge = row.querySelector('.badge-status');
                
                badge.classList.remove('badge-success', 'badge-warning', 'badge-info');
                badge.classList.add('badge-danger');
                badge.textContent = 'Refunded';
                
                if (window.adminPanel.showNotification) {
                    window.adminPanel.showNotification('Order refunded successfully', 'success');
                }
            }
        );
    }
}