/* ============================================
   ADMIN COMMISSION MANAGEMENT - JAVASCRIPT
   ============================================ */

(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {
        initCommissionChart();
        initSearch();
        initFilters();
    });

    function initCommissionChart() {
        const canvas = document.getElementById('commissionChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                datasets: [
                    {
                        label: 'Commission',
                        data: [3200, 4100, 3800, 3472],
                        backgroundColor: 'rgba(99, 102, 241, 0.8)',
                        borderRadius: 8
                    },
                    {
                        label: 'Seller Earnings',
                        data: [7800, 9100, 8200, 8502],
                        backgroundColor: 'rgba(16, 185, 129, 0.8)',
                        borderRadius: 8
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            padding: 15
                        }
                    },
                    tooltip: {
                        backgroundColor: '#1e293b',
                        padding: 12,
                        borderRadius: 8,
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': $' + context.parsed.y.toLocaleString();
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: '#f1f5f9',
                            borderDash: [5, 5]
                        },
                        ticks: {
                            callback: function(value) {
                                return '$' + (value / 1000) + 'k';
                            }
                        }
                    }
                }
            }
        });
    }

    function initSearch() {
        const searchInput = document.querySelector('.search-box input');
        if (!searchInput) return;

        searchInput.addEventListener('input', function(e) {
            const query = e.target.value.toLowerCase();
            const rows = document.querySelectorAll('.commission-table tbody tr');

            rows.forEach(row => {
                const txnId = row.querySelector('.txn-id').textContent.toLowerCase();
                const seller = row.querySelector('.seller-mini strong').textContent.toLowerCase();
                const product = row.querySelector('.product-mini span').textContent.toLowerCase();

                if (txnId.includes(query) || seller.includes(query) || product.includes(query)) {
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
                
                const rows = document.querySelectorAll('.commission-table tbody tr');
                rows.forEach(row => row.style.display = '');
            });
        }
    }

})();

function openCommissionSettings() {
    const modal = new bootstrap.Modal(document.getElementById('commissionSettingsModal'));
    modal.show();
}

function saveCommissionSettings() {
    if (window.adminPanel && window.adminPanel.showNotification) {
        window.adminPanel.showNotification('Commission settings updated successfully!', 'success');
    }
    
    const modal = bootstrap.Modal.getInstance(document.getElementById('commissionSettingsModal'));
    modal.hide();
}