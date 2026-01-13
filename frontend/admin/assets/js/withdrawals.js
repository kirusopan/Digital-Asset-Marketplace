/* ============================================
   ADMIN WITHDRAWAL REQUESTS - JAVASCRIPT
   ============================================ */

(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {
        initSearch();
        initFilters();
        initSelectAll();
    });

    function initSearch() {
        const searchInput = document.querySelector('.search-box input');
        if (!searchInput) return;

        searchInput.addEventListener('input', function(e) {
            const query = e.target.value.toLowerCase();
            const rows = document.querySelectorAll('.withdrawal-table tbody tr');

            rows.forEach(row => {
                const requestId = row.querySelector('.request-id').textContent.toLowerCase();
                const seller = row.querySelector('.seller-info-mini strong').textContent.toLowerCase();
                const email = row.querySelector('.seller-info-mini p').textContent.toLowerCase();

                if (requestId.includes(query) || seller.includes(query) || email.includes(query)) {
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
                document.querySelector('input[type="date"]').value = '';
                document.querySelector('.search-box input').value = '';
                
                const rows = document.querySelectorAll('.withdrawal-table tbody tr');
                rows.forEach(row => row.style.display = '');
            });
        }
    }

    function initSelectAll() {
        const selectAll = document.getElementById('selectAll');
        if (!selectAll) return;

        selectAll.addEventListener('change', function() {
            const checkboxes = document.querySelectorAll('.withdrawal-table tbody .form-check-input');
            checkboxes.forEach(cb => cb.checked = this.checked);
        });
    }

})();

function viewWithdrawal(id) {
    console.log('View withdrawal:', id);
    window.location.href = `admin-withdrawal-details.html?id=${id}`;
}

function approveWithdrawal(id) {
    if (window.adminPanel && window.adminPanel.showConfirm) {
        window.adminPanel.showConfirm(
            'Approve Withdrawal',
            'Are you sure you want to approve this withdrawal request? The payment will be processed immediately.',
            () => {
                const row = event.target.closest('tr');
                const badge = row.querySelector('.badge-status');
                
                badge.classList.remove('badge-warning');
                badge.classList.add('badge-info');
                badge.textContent = 'Processing';
                
                const actions = row.querySelector('.withdrawal-actions');
                actions.innerHTML = `
                    <button class="btn btn-sm btn-outline-primary" onclick="viewWithdrawal(${id})">
                        <i class="bi bi-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-warning" onclick="updateStatus(${id})">
                        <i class="bi bi-arrow-repeat"></i>
                    </button>
                `;
                
                if (window.adminPanel.showNotification) {
                    window.adminPanel.showNotification('Withdrawal approved! Processing payment...', 'success');
                }
            }
        );
    }
}

function rejectWithdrawal(id) {
    if (window.adminPanel && window.adminPanel.showConfirm) {
        window.adminPanel.showConfirm(
            'Reject Withdrawal',
            'Are you sure you want to reject this withdrawal request? Please provide a reason for rejection.',
            () => {
                const row = event.target.closest('tr');
                const badge = row.querySelector('.badge-status');
                
                badge.classList.remove('badge-warning');
                badge.classList.add('badge-danger');
                badge.textContent = 'Rejected';
                
                const actions = row.querySelector('.withdrawal-actions');
                actions.innerHTML = `
                    <button class="btn btn-sm btn-outline-primary" onclick="viewWithdrawal(${id})">
                        <i class="bi bi-eye"></i>
                    </button>
                `;
                
                if (window.adminPanel.showNotification) {
                    window.adminPanel.showNotification('Withdrawal request rejected', 'error');
                }
            }
        );
    }
}

function processAllPending() {
    if (window.adminPanel && window.adminPanel.showConfirm) {
        window.adminPanel.showConfirm(
            'Process All Pending',
            'Are you sure you want to approve and process all pending withdrawal requests?',
            () => {
                if (window.adminPanel.showNotification) {
                    window.adminPanel.showNotification('Processing all pending withdrawals...', 'info');
                    
                    setTimeout(() => {
                        window.adminPanel.showNotification('All pending withdrawals processed successfully!', 'success');
                    }, 2000);
                }
            }
        );
    }
}

function updateStatus(id) {
    if (window.adminPanel && window.adminPanel.showNotification) {
        window.adminPanel.showNotification('Checking payment status...', 'info');
        
        setTimeout(() => {
            window.adminPanel.showNotification('Payment completed successfully!', 'success');
            
            const row = event.target.closest('tr');
            const badge = row.querySelector('.badge-status');
            
            badge.classList.remove('badge-info');
            badge.classList.add('badge-success');
            badge.textContent = 'Completed';
        }, 1500);
    }
}

function downloadReceipt(id) {
    if (window.adminPanel && window.adminPanel.showNotification) {
        window.adminPanel.showNotification('Generating receipt...', 'info');
        
        setTimeout(() => {
            window.adminPanel.showNotification('Receipt downloaded!', 'success');
        }, 1000);
    }
}