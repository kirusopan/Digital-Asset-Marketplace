/* ============================================
   ADMIN PANEL - JAVASCRIPT
   Interactive Features & Functionality
   ============================================ */

(function() {
    'use strict';

    // ===== INITIALIZATION =====
    document.addEventListener('DOMContentLoaded', function() {
        initSidebar();
        initMobileMenu();
        initActiveNavItem();
        initNotifications();
        initTooltips();
    });

    // ===== SIDEBAR FUNCTIONALITY =====
    function initSidebar() {
        const sidebar = document.getElementById('adminSidebar');
        const sidebarToggle = document.getElementById('sidebarToggle');
        const overlay = document.getElementById('sidebarOverlay');

        if (!sidebar) return;

        // Desktop sidebar toggle (if implementing collapsed state)
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', function() {
                if (window.innerWidth > 991) {
                    sidebar.classList.toggle('collapsed');
                    document.querySelector('.admin-main').classList.toggle('sidebar-collapsed');
                } else {
                    // Mobile: close sidebar
                    sidebar.classList.remove('active');
                    overlay.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        }

        // Close sidebar when clicking overlay
        if (overlay) {
            overlay.addEventListener('click', function() {
                sidebar.classList.remove('active');
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        }
    }

    // ===== MOBILE MENU =====
    function initMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const sidebar = document.getElementById('adminSidebar');
        const overlay = document.getElementById('sidebarOverlay');

        if (!mobileMenuBtn || !sidebar || !overlay) return;

        mobileMenuBtn.addEventListener('click', function() {
            sidebar.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    // ===== ACTIVE NAV ITEM =====
    function initActiveNavItem() {
        const navItems = document.querySelectorAll('.nav-item');
        const currentPage = window.location.pathname.split('/').pop();

        navItems.forEach(item => {
            const href = item.getAttribute('href');
            
            // Set active based on current page
            if (href && href.includes(currentPage)) {
                item.classList.add('active');
            }

            // Handle click
            item.addEventListener('click', function(e) {
                // Remove active from all items
                navItems.forEach(nav => nav.classList.remove('active'));
                
                // Add active to clicked item
                this.classList.add('active');

                // Close mobile menu if open
                if (window.innerWidth <= 991) {
                    const sidebar = document.getElementById('adminSidebar');
                    const overlay = document.getElementById('sidebarOverlay');
                    
                    if (sidebar && overlay) {
                        sidebar.classList.remove('active');
                        overlay.classList.remove('active');
                        document.body.style.overflow = '';
                    }
                }
            });
        });
    }

    // ===== NOTIFICATIONS =====
    function initNotifications() {
        // Mark notification as read
        const notificationItems = document.querySelectorAll('.notification-item');
        
        notificationItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                this.classList.remove('unread');
                
                // Update notification badge count
                updateNotificationBadge();
            });
        });

        // Mark message as read
        const messageItems = document.querySelectorAll('.message-item');
        
        messageItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                this.classList.remove('unread');
                
                // Update message badge count
                updateMessageBadge();
            });
        });
    }

    function updateNotificationBadge() {
        const unreadCount = document.querySelectorAll('.notification-item.unread').length;
        const badge = document.querySelector('.header-icon-btn .icon-badge');
        
        if (badge) {
            if (unreadCount > 0) {
                badge.textContent = unreadCount;
                badge.style.display = 'block';
            } else {
                badge.style.display = 'none';
            }
        }
    }

    function updateMessageBadge() {
        const unreadCount = document.querySelectorAll('.message-item.unread').length;
        const badges = document.querySelectorAll('.header-icon-btn .icon-badge');
        
        if (badges[1]) {
            if (unreadCount > 0) {
                badges[1].textContent = unreadCount;
                badges[1].style.display = 'block';
            } else {
                badges[1].style.display = 'none';
            }
        }
    }

    // ===== TOOLTIPS =====
    function initTooltips() {
        const tooltipTriggerList = [].slice.call(
            document.querySelectorAll('[data-bs-toggle="tooltip"]')
        );
        
        tooltipTriggerList.map(function(tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }

    // ===== UTILITY FUNCTIONS =====

    // Show Admin Notification
    function showAdminNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `admin-notification admin-notification-${type}`;
        notification.innerHTML = `
            <div class="notification-icon">
                <i class="bi bi-${getNotificationIcon(type)}"></i>
            </div>
            <div class="notification-content">
                <p class="notification-message">${message}</p>
            </div>
            <button class="notification-close">
                <i class="bi bi-x"></i>
            </button>
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 5000);

        // Close button
        notification.querySelector('.notification-close').addEventListener('click', function() {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        });
    }

    function getNotificationIcon(type) {
        switch(type) {
            case 'success': return 'check-circle-fill';
            case 'error': return 'x-circle-fill';
            case 'warning': return 'exclamation-triangle-fill';
            default: return 'info-circle-fill';
        }
    }

    // Confirm Dialog
    function showConfirmDialog(title, message, onConfirm) {
        const dialog = document.createElement('div');
        dialog.className = 'admin-confirm-dialog';
        dialog.innerHTML = `
            <div class="dialog-overlay"></div>
            <div class="dialog-content">
                <div class="dialog-header">
                    <h4>${title}</h4>
                    <button class="dialog-close">
                        <i class="bi bi-x"></i>
                    </button>
                </div>
                <div class="dialog-body">
                    <p>${message}</p>
                </div>
                <div class="dialog-footer">
                    <button class="btn btn-secondary dialog-cancel">Cancel</button>
                    <button class="btn btn-primary dialog-confirm">Confirm</button>
                </div>
            </div>
        `;

        document.body.appendChild(dialog);

        // Animate in
        setTimeout(() => {
            dialog.classList.add('show');
        }, 10);

        // Event handlers
        const closeDialog = () => {
            dialog.classList.remove('show');
            setTimeout(() => dialog.remove(), 300);
        };

        dialog.querySelector('.dialog-close').addEventListener('click', closeDialog);
        dialog.querySelector('.dialog-cancel').addEventListener('click', closeDialog);
        dialog.querySelector('.dialog-overlay').addEventListener('click', closeDialog);
        
        dialog.querySelector('.dialog-confirm').addEventListener('click', () => {
            onConfirm();
            closeDialog();
        });
    }

    // Format Currency
    function formatCurrency(amount, currency = 'USD') {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(amount);
    }

    // Format Number
    function formatNumber(number) {
        return new Intl.NumberFormat('en-US').format(number);
    }

    // Format Date
    function formatDate(date, format = 'short') {
        const d = new Date(date);
        
        if (format === 'short') {
            return d.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        } else if (format === 'long') {
            return d.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }
        
        return d.toLocaleDateString();
    }

    // Debounce Function
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Copy to Clipboard
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            showAdminNotification('Copied to clipboard!', 'success');
        }).catch(err => {
            showAdminNotification('Failed to copy', 'error');
        });
    }

    // ===== MAKE FUNCTIONS GLOBALLY AVAILABLE =====
    window.adminPanel = {
        showNotification: showAdminNotification,
        showConfirm: showConfirmDialog,
        formatCurrency,
        formatNumber,
        formatDate,
        debounce,
        copyToClipboard
    };

    // ===== ADD NOTIFICATION STYLES =====
    const notificationStyles = document.createElement('style');
    notificationStyles.textContent = `
        .admin-notification {
            position: fixed;
            top: 90px;
            right: 30px;
            min-width: 320px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            padding: 16px;
            display: flex;
            align-items: center;
            gap: 12px;
            z-index: 9999;
            transform: translateX(400px);
            opacity: 0;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .admin-notification.show {
            transform: translateX(0);
            opacity: 1;
        }

        .admin-notification-success {
            border-left: 4px solid #10b981;
        }

        .admin-notification-error {
            border-left: 4px solid #ef4444;
        }

        .admin-notification-warning {
            border-left: 4px solid #f59e0b;
        }

        .admin-notification-info {
            border-left: 4px solid #3b82f6;
        }

        .admin-notification .notification-icon {
            width: 40px;
            height: 40px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.25rem;
            flex-shrink: 0;
        }

        .admin-notification-success .notification-icon {
            background: rgba(16, 185, 129, 0.1);
            color: #10b981;
        }

        .admin-notification-error .notification-icon {
            background: rgba(239, 68, 68, 0.1);
            color: #ef4444;
        }

        .admin-notification-warning .notification-icon {
            background: rgba(245, 158, 11, 0.1);
            color: #f59e0b;
        }

        .admin-notification-info .notification-icon {
            background: rgba(59, 130, 246, 0.1);
            color: #3b82f6;
        }

        .admin-notification .notification-content {
            flex: 1;
        }

        .notification-message {
            margin: 0;
            color: #1e293b;
            font-size: 0.875rem;
            font-weight: 500;
        }

        .notification-close {
            width: 28px;
            height: 28px;
            border: none;
            background: #f1f5f9;
            border-radius: 6px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
            flex-shrink: 0;
        }

        .notification-close:hover {
            background: #e2e8f0;
        }

        .admin-confirm-dialog {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 9999;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s, visibility 0.3s;
        }

        .admin-confirm-dialog.show {
            opacity: 1;
            visibility: visible;
        }

        .dialog-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(4px);
        }

        .dialog-content {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0.9);
            width: 90%;
            max-width: 450px;
            background: white;
            border-radius: 16px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
            transition: transform 0.3s;
        }

        .admin-confirm-dialog.show .dialog-content {
            transform: translate(-50%, -50%) scale(1);
        }

        .dialog-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 24px;
            border-bottom: 1px solid #e2e8f0;
        }

        .dialog-header h4 {
            margin: 0;
            font-size: 1.25rem;
            font-weight: 700;
            color: #1e293b;
        }

        .dialog-close {
            width: 32px;
            height: 32px;
            border: none;
            background: #f1f5f9;
            border-radius: 8px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
        }

        .dialog-close:hover {
            background: #e2e8f0;
        }

        .dialog-body {
            padding: 24px;
        }

        .dialog-body p {
            margin: 0;
            color: #64748b;
            line-height: 1.6;
        }

        .dialog-footer {
            display: flex;
            gap: 12px;
            padding: 20px 24px;
            border-top: 1px solid #e2e8f0;
            justify-content: flex-end;
        }

        @media (max-width: 767px) {
            .admin-notification {
                right: 15px;
                left: 15px;
                min-width: auto;
            }
        }
    `;
    document.head.appendChild(notificationStyles);

})();