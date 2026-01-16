// Profile Settings - JavaScript

(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {
        initPasswordStrength();
        initFormValidation();
    });

    // Password Strength Indicator
    function initPasswordStrength() {
        const passwordInput = document.querySelector('#securityTab input[placeholder*="new password"]');
        if (!passwordInput) return;

        passwordInput.addEventListener('input', function() {
            const password = this.value;
            const strength = calculatePasswordStrength(password);
            updatePasswordStrength(strength);
        });
    }

    function calculatePasswordStrength(password) {
        let strength = 0;
        
        if (password.length >= 8) strength += 25;
        if (password.length >= 12) strength += 25;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
        if (/\d/.test(password)) strength += 15;
        if (/[^a-zA-Z\d]/.test(password)) strength += 10;
        
        return Math.min(strength, 100);
    }

    function updatePasswordStrength(strength) {
        const progressBar = document.querySelector('.password-strength .progress-bar');
        const strengthText = document.querySelector('.password-strength small');
        
        if (!progressBar || !strengthText) return;

        progressBar.style.width = strength + '%';
        
        let text = 'Weak';
        let colorClass = 'bg-danger';
        
        if (strength >= 75) {
            text = 'Strong';
            colorClass = 'bg-success';
        } else if (strength >= 50) {
            text = 'Medium';
            colorClass = 'bg-warning';
        }
        
        progressBar.className = 'progress-bar ' + colorClass;
        strengthText.textContent = 'Password strength: ' + text;
    }

    // Form Validation
    function initFormValidation() {
        // Delete account confirmation
        const deleteInput = document.querySelector('#deleteAccountModal input[placeholder*="DELETE"]');
        const deleteBtn = document.querySelector('#deleteAccountModal .btn-danger');
        
        if (deleteInput && deleteBtn) {
            deleteInput.addEventListener('input', function() {
                deleteBtn.disabled = this.value !== 'DELETE';
            });
        }

        // Save changes button
        const saveBtn = document.querySelector('.page-header-section .btn-primary');
        if (saveBtn) {
            saveBtn.addEventListener('click', function() {
                showToast('Settings saved successfully!', 'success');
            });
        }
    }

    // Toast Notification
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `alert alert-${type} position-fixed`;
        toast.style.cssText = 'top: 100px; right: 20px; z-index: 9999; min-width: 300px; animation: slideInRight 0.3s;';
        toast.innerHTML = `
            <div class="d-flex align-items-center justify-content-between">
                <span>${message}</span>
                <button type="button" class="btn-close ms-3" onclick="this.parentElement.parentElement.remove()"></button>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

})();

// Animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);