(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {
        initThemeToggle();
        initSidebarToggle();
        initMenuActive();
        initTableResponsive();
        initCharts();
    });

    // Theme Toggle
    function initThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        if (!themeToggle) return;

        const currentTheme = localStorage.getItem('sellerTheme') || 'light';
        document.documentElement.setAttribute('data-theme', currentTheme);
        updateThemeIcon(currentTheme);

        themeToggle.addEventListener('click', function() {
            let theme = document.documentElement.getAttribute('data-theme');
            let newTheme = theme === 'light' ? 'dark' : 'light';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('sellerTheme', newTheme);
            updateThemeIcon(newTheme);
        });

        function updateThemeIcon(theme) {
            const icon = themeToggle.querySelector('i');
            if (theme === 'dark') {
                icon.classList.remove('bi-moon-stars');
                icon.classList.add('bi-sun');
            } else {
                icon.classList.remove('bi-sun');
                icon.classList.add('bi-moon-stars');
            }
        }
    }

    // Sidebar Toggle for Mobile
    function initSidebarToggle() {
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'btn btn-primary sidebar-toggle d-lg-none';
        toggleBtn.innerHTML = '<i class="bi bi-list"></i>';
        toggleBtn.style.cssText = 'position: fixed; bottom: 20px; left: 20px; z-index: 1001; width: 50px; height: 50px; border-radius: 50%; padding: 0;';
        
        document.body.appendChild(toggleBtn);

        const sidebar = document.querySelector('.sidebar');
        const overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        overlay.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 999; display: none;';
        document.body.appendChild(overlay);

        toggleBtn.addEventListener('click', function() {
            sidebar.classList.toggle('show');
            overlay.style.display = sidebar.classList.contains('show') ? 'block' : 'none';
        });

        overlay.addEventListener('click', function() {
            sidebar.classList.remove('show');
            overlay.style.display = 'none';
        });
    }

    // Active Menu Item
    function initMenuActive() {
        const currentPage = window.location.pathname.split('/').pop();
        const menuItems = document.querySelectorAll('.menu-item');
        
        menuItems.forEach(item => {
            const link = item.querySelector('a');
            if (link && link.getAttribute('href') === currentPage) {
                item.classList.add('active');
            }
        });
    }

    // Responsive Table
    function initTableResponsive() {
        const tables = document.querySelectorAll('.table');
        
        tables.forEach(table => {
            const headers = Array.from(table.querySelectorAll('thead th')).map(th => th.textContent);
            const rows = table.querySelectorAll('tbody tr');
            
            rows.forEach(row => {
                const cells = row.querySelectorAll('td');
                cells.forEach((cell, index) => {
                    cell.setAttribute('data-label', headers[index]);
                });
            });
        });
    }

    // Initialize Charts (Placeholder)
    function initCharts() {
        // Chart initialization would go here
        console.log('Charts initialized');
    }

    // Format Currency
    window.formatCurrency = function(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    // Format Number
    window.formatNumber = function(num) {
        return new Intl.NumberFormat('en-US').format(num);
    };

    // Show Toast Notification
    window.showToast = function(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `alert alert-${type} position-fixed top-0 end-0 m-3`;
        toast.style.cssText = 'z-index: 9999; min-width: 300px;';
        toast.innerHTML = `
            <div class="d-flex align-items-center justify-content-between">
                <span>${message}</span>
                <button type="button" class="btn-close ms-3" onclick="this.parentElement.parentElement.remove()"></button>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 5000);
    };

})();