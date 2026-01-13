// Earnings Page - JavaScript

(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {
        initEarningsChart();
        addTableLabels();
        initWithdrawalCalc();
    });

    // Earnings Chart
    function initEarningsChart() {
        const ctx = document.getElementById('earningsChart');
        if (!ctx) return;

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
                datasets: [{
                    label: 'Net Earnings',
                    data: [2850, 3120, 2950, 3480, 3250, 3890, 3650, 4125, 3780, 3540, 3248, 3842],
                    backgroundColor: function(context) {
                        const chart = context.chart;
                        const {ctx, chartArea} = chart;
                        if (!chartArea) return null;
                        const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
                        gradient.addColorStop(0, 'rgba(99, 102, 241, 0.5)');
                        gradient.addColorStop(1, 'rgba(99, 102, 241, 0.9)');
                        return gradient;
                    },
                    borderColor: '#6366f1',
                    borderWidth: 2,
                    borderRadius: 8,
                    borderSkipped: false
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
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        borderRadius: 8,
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        callbacks: {
                            label: function(context) {
                                return 'Earnings: $' + context.parsed.y.toLocaleString();
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)',
                            drawBorder: false
                        },
                        ticks: {
                            callback: function(value) {
                                return '$' + value;
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false,
                            drawBorder: false
                        }
                    }
                }
            }
        });
    }

    // Add data labels for responsive table
    function addTableLabels() {
        const headers = [
            'Request ID', 'Amount', 'Method', 'Requested Date', 
            'Processed Date', 'Status', 'Actions'
        ];

        document.querySelectorAll('.withdrawal-table tbody tr').forEach(row => {
            const cells = row.querySelectorAll('td');
            cells.forEach((cell, index) => {
                cell.setAttribute('data-label', headers[index]);
            });
        });
    }

    // Withdrawal Calculator
    function initWithdrawalCalc() {
        const withdrawInput = document.querySelector('#withdrawModal input[type="number"]');
        if (!withdrawInput) return;

        withdrawInput.addEventListener('input', function() {
            const amount = parseFloat(this.value) || 0;
            const fee = 0; // No processing fee
            const netAmount = amount - fee;

            // Update summary
            const summary = document.querySelector('.withdrawal-summary');
            if (summary) {
                summary.querySelector('.d-flex:nth-child(1) strong').textContent = '$' + amount.toFixed(2);
                summary.querySelector('.d-flex:nth-child(2) strong').textContent = '$' + fee.toFixed(2);
                summary.querySelector('.d-flex:nth-child(3) h5').textContent = '$' + netAmount.toFixed(2);
            }
        });
    }

})();