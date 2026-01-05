/* ============================================
   ADMIN DASHBOARD - JAVASCRIPT
   Add to admin.js or create dashboard.js
   ============================================ */

(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {
        initRevenueChart();
        initCategoryChart();
        initTableActions();
        animateStats();
    });

    // ===== REVENUE CHART =====
    function initRevenueChart() {
        const canvas = document.getElementById('revenueChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(99, 102, 241, 0.2)');
        gradient.addColorStop(1, 'rgba(99, 102, 241, 0)');

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Revenue',
                    data: [4200, 5100, 4800, 6200, 5800, 7100, 6500],
                    borderColor: '#6366f1',
                    backgroundColor: gradient,
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 6,
                    pointBackgroundColor: '#6366f1',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointHoverRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: '#1e293b',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        padding: 12,
                        borderRadius: 8,
                        displayColors: false,
                        callbacks: {
                            label: function(context) {
                                return '$' + context.parsed.y.toLocaleString();
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#64748b',
                            font: {
                                size: 12
                            }
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: '#f1f5f9',
                            borderDash: [5, 5]
                        },
                        ticks: {
                            color: '#64748b',
                            font: {
                                size: 12
                            },
                            callback: function(value) {
                                return '$' + (value / 1000) + 'k';
                            }
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });
    }

    // ===== CATEGORY CHART =====
    function initCategoryChart() {
        const canvas = document.getElementById('categoryChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['UI Kits', 'Templates', 'Graphics', 'Others'],
                datasets: [{
                    data: [35, 28, 22, 15],
                    backgroundColor: [
                        '#6366f1',
                        '#10b981',
                        '#f59e0b',
                        '#3b82f6'
                    ],
                    borderWidth: 0,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                // maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: '#1e293b',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        padding: 12,
                        borderRadius: 8,
                        displayColors: false,
                        callbacks: {
                            label: function(context) {
                                return context.parsed + '%';
                            }
                        }
                    }
                },
                cutout: '70%'
            }
        });
    }

    // ===== TABLE ACTIONS =====
    function initTableActions() {
        // Approve asset
        const approveButtons = document.querySelectorAll('.btn-success');
        approveButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const row = this.closest('tr');
                
                if (window.adminPanel && window.adminPanel.showConfirm) {
                    window.adminPanel.showConfirm(
                        'Approve Asset',
                        'Are you sure you want to approve this asset?',
                        () => {
                            row.remove();
                            if (window.adminPanel.showNotification) {
                                window.adminPanel.showNotification('Asset approved successfully!', 'success');
                            }
                        }
                    );
                }
            });
        });

        // Reject asset
        const rejectButtons = document.querySelectorAll('.btn-danger');
        rejectButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const row = this.closest('tr');
                
                if (window.adminPanel && window.adminPanel.showConfirm) {
                    window.adminPanel.showConfirm(
                        'Reject Asset',
                        'Are you sure you want to reject this asset?',
                        () => {
                            row.remove();
                            if (window.adminPanel.showNotification) {
                                window.adminPanel.showNotification('Asset rejected', 'error');
                            }
                        }
                    );
                }
            });
        });
    }

    // ===== ANIMATE STATS =====
    function animateStats() {
        const statsValues = document.querySelectorAll('.stats-value');
        
        statsValues.forEach(stat => {
            const text = stat.textContent;
            const isCurrency = text.includes('$');
            const value = parseFloat(text.replace(/[^0-9.]/g, ''));
            
            if (isNaN(value)) return;

            let current = 0;
            const increment = value / 50;
            const duration = 1000;
            const stepTime = duration / 50;

            const counter = setInterval(() => {
                current += increment;
                
                if (current >= value) {
                    current = value;
                    clearInterval(counter);
                }

                if (isCurrency) {
                    stat.textContent = '$' + Math.floor(current).toLocaleString();
                } else {
                    stat.textContent = Math.floor(current).toLocaleString();
                }
            }, stepTime);
        });
    }

    // ===== FILTER DROPDOWN =====
    const filterSelects = document.querySelectorAll('.card-actions select');
    filterSelects.forEach(select => {
        select.addEventListener('change', function() {
            console.log('Filter changed:', this.value);
            // Add your filter logic here
        });
    });

    // ===== EXPORT BUTTON =====
    const exportBtn = document.querySelector('.btn-outline-secondary');
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            if (window.adminPanel && window.adminPanel.showNotification) {
                window.adminPanel.showNotification('Exporting data...', 'info');
                
                setTimeout(() => {
                    window.adminPanel.showNotification('Data exported successfully!', 'success');
                }, 1500);
            }
        });
    }

    // ===== ADD NEW BUTTON =====
    const addNewBtn = document.querySelector('.btn-primary');
    if (addNewBtn && addNewBtn.textContent.includes('Add New')) {
        addNewBtn.addEventListener('click', function() {
            console.log('Add new clicked');
            // Redirect or open modal
        });
    }

})();