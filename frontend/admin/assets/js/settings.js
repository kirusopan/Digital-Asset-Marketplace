/* ============================================
   ADMIN SITE SETTINGS - JAVASCRIPT
   ============================================ */

(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {
        initSettingsNav();
    });

    function initSettingsNav() {
        const navItems = document.querySelectorAll('.settings-nav-item');
        const sections = document.querySelectorAll('.settings-section');

        navItems.forEach(item => {
            item.addEventListener('click', function() {
                const sectionId = this.getAttribute('data-section');

                navItems.forEach(nav => nav.classList.remove('active'));
                this.classList.add('active');

                sections.forEach(section => section.classList.remove('active'));
                document.getElementById(sectionId).classList.add('active');

                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        });
    }

})();

function saveAllSettings() {
    if (window.adminPanel && window.adminPanel.showNotification) {
        window.adminPanel.showNotification('Saving settings...', 'info');
        
        setTimeout(() => {
            window.adminPanel.showNotification('Settings saved successfully!', 'success');
        }, 1500);
    }
}

function resetSettings() {
    if (window.adminPanel && window.adminPanel.showConfirm) {
        window.adminPanel.showConfirm(
            'Reset Settings',
            'Are you sure you want to reset all settings to default values?',
            () => {
                if (window.adminPanel.showNotification) {
                    window.adminPanel.showNotification('Settings reset to default', 'info');
                }
            }
        );
    }
}

function testEmail() {
    if (window.adminPanel && window.adminPanel.showNotification) {
        window.adminPanel.showNotification('Sending test email...', 'info');
        
        setTimeout(() => {
            window.adminPanel.showNotification('Test email sent successfully!', 'success');
        }, 2000);
    }
}