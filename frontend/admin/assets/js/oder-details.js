/* ============================================
   ADMIN ORDER DETAILS PAGE - JAVASCRIPT
   Add to admin.js or create order-details.js
   ============================================ */

(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {
        initButtons();
        initActions();
    });

    // ===== BUTTONS =====
    function initButtons() {
        const printBtn = document.querySelector('.btn-outline-secondary:has(.bi-printer)');
        if (printBtn) {
            printBtn.addEventListener('click', function() {
                window.print();
            });
        }

        const invoiceBtn = document.querySelector('.btn-outline-secondary:has(.bi-download)');
        if (invoiceBtn) {
            invoiceBtn.addEventListener('click', function() {
                if (window.adminPanel && window.adminPanel.showNotification) {
                    window.adminPanel.showNotification('Downloading invoice...', 'info');
                    setTimeout(() => {
                        window.adminPanel.showNotification('Invoice downloaded successfully!', 'success');
                    }, 1500);
                }
            });
        }

        const emailBtn = document.querySelector('.btn-primary:has(.bi-send)');
        if (emailBtn) {
            emailBtn.addEventListener('click', function() {
                if (window.adminPanel && window.adminPanel.showNotification) {
                    window.adminPanel.showNotification('Sending email to customer...', 'info');
                    setTimeout(() => {
                        window.adminPanel.showNotification('Email sent successfully!', 'success');
                    }, 1500);
                }
            });
        }
    }

    // ===== ACTIONS =====
    function initActions() {
        const completeBtn = document.querySelector('.btn-success');
        if (completeBtn) {
            completeBtn.addEventListener('click', function() {
                if (window.adminPanel && window.adminPanel.showConfirm) {
                    window.adminPanel.showConfirm(
                        'Mark as Completed',
                        'Are you sure you want to mark this order as completed?',
                        () => {
                            if (window.adminPanel.showNotification) {
                                window.adminPanel.showNotification('Order marked as completed!', 'success');
                            }
                        }
                    );
                }
            });
        }

        const refundBtn = document.querySelector('.btn-warning');
        if (refundBtn) {
            refundBtn.addEventListener('click', function() {
                if (window.adminPanel && window.adminPanel.showConfirm) {
                    window.adminPanel.showConfirm(
                        'Process Refund',
                        'Are you sure you want to process refund for this order? The amount will be refunded to customer.',
                        () => {
                            if (window.adminPanel.showNotification) {
                                window.adminPanel.showNotification('Refund processed successfully!', 'success');
                            }
                        }
                    );
                }
            });
        }

        const cancelBtn = document.querySelector('.btn-danger:has(.bi-x-circle)');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', function() {
                if (window.adminPanel && window.adminPanel.showConfirm) {
                    window.adminPanel.showConfirm(
                        'Cancel Order',
                        'Are you sure you want to cancel this order? This action cannot be undone.',
                        () => {
                            if (window.adminPanel.showNotification) {
                                window.adminPanel.showNotification('Order cancelled successfully!', 'success');
                            }
                        }
                    );
                }
            });
        }
    }

})();