/* ============================================
   ADMIN REPORTS - JAVASCRIPT
   ============================================ */

(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {
        initRevenueChart();
        initCategoriesChart();
    });

    function initRevenueChart() {
        const canvas = document.getElementById('revenueOverviewChart');
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
                    data: [6200, 7100, 6800, 8200, 7800, 9100, 8500],
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
                        padding: 12,
                        borderRadius: 8,
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

    function initCategoriesChart() {
        const canvas = document.getElementById('categoriesChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['UI Kits', 'Templates', 'Graphics', 'Icons', 'Others'],
                datasets: [{
                    data: [35, 28, 22, 10, 5],
                    backgroundColor: [
                        '#6366f1',
                        '#10b981',
                        '#f59e0b',
                        '#3b82f6',
                        '#94a3b8'
                    ],
                    borderWidth: 0,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
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
                                return context.label + ': ' + context.parsed + '%';
                            }
                        }
                    }
                },
                cutout: '65%'
            }
        });
    }

})();

function openReport(type) {
    console.log('Opening report:', type);
    if (window.adminPanel && window.adminPanel.showNotification) {
        window.adminPanel.showNotification(`Loading ${type} report...`, 'info');
    }
}

function generateCustomReport() {
    const modal = new bootstrap.Modal(document.getElementById('customReportModal'));
    modal.show();
}

function generateReport() {
    if (window.adminPanel && window.adminPanel.showNotification) {
        window.adminPanel.showNotification('Generating report...', 'info');
        
        setTimeout(() => {
            window.adminPanel.showNotification('Report generated successfully!', 'success');
            
            const modal = bootstrap.Modal.getInstance(document.getElementById('customReportModal'));
            modal.hide();
        }, 2000);
    }
}

function downloadReport(id) {
    if (window.adminPanel && window.adminPanel.showNotification) {
        window.adminPanel.showNotification('Downloading report...', 'info');
        
        setTimeout(() => {
            window.adminPanel.showNotification('Report downloaded!', 'success');
        }, 1000);
    }
}

function viewReport(id) {
    console.log('View report:', id);
    window.location.href = `admin-report-details.html?id=${id}`;
}