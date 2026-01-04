/* ============================================
   ADMIN PROFILE - JAVASCRIPT
   ============================================ */

function previewAvatar(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('profileImage').src = e.target.result;
        };
        reader.readAsDataURL(file);

        if (window.adminPanel && window.adminPanel.showNotification) {
            window.adminPanel.showNotification('Avatar updated! Remember to save changes.', 'info');
        }
    }
}

function saveProfile() {
    if (window.adminPanel && window.adminPanel.showNotification) {
        window.adminPanel.showNotification('Saving profile...', 'info');
        
        setTimeout(() => {
            window.adminPanel.showNotification('Profile updated successfully!', 'success');
        }, 1500);
    }
}

function cancelEdit() {
    if (window.adminPanel && window.adminPanel.showConfirm) {
        window.adminPanel.showConfirm(
            'Cancel Changes',
            'Are you sure you want to discard all unsaved changes?',
            () => {
                window.location.reload();
            }
        );
    }
}

function changePassword() {
    if (window.adminPanel && window.adminPanel.showNotification) {
        window.adminPanel.showNotification('Updating password...', 'info');
        
        setTimeout(() => {
            window.adminPanel.showNotification('Password updated successfully!', 'success');
        }, 1500);
    }
}

function disable2FA() {
    if (window.adminPanel && window.adminPanel.showConfirm) {
        window.adminPanel.showConfirm(
            'Disable Two-Factor Authentication',
            'Are you sure you want to disable 2FA? This will make your account less secure.',
            () => {
                if (window.adminPanel.showNotification) {
                    window.adminPanel.showNotification('Two-factor authentication disabled', 'warning');
                }
            }
        );
    }
}

function revokeSession(id) {
    if (window.adminPanel && window.adminPanel.showConfirm) {
        window.adminPanel.showConfirm(
            'Revoke Session',
            'Are you sure you want to revoke this session? The device will be logged out immediately.',
            () => {
                const sessionItem = event.target.closest('.session-item');
                sessionItem.style.opacity = '0';
                
                setTimeout(() => {
                    sessionItem.remove();
                    
                    if (window.adminPanel.showNotification) {
                        window.adminPanel.showNotification('Session revoked successfully', 'success');
                    }
                }, 300);
            }
        );
    }
}

function revokeAllSessions() {
    if (window.adminPanel && window.adminPanel.showConfirm) {
        window.adminPanel.showConfirm(
            'Revoke All Sessions',
            'This will log you out from all devices except your current session. Continue?',
            () => {
                if (window.adminPanel.showNotification) {
                    window.adminPanel.showNotification('All other sessions have been revoked', 'success');
                }
            }
        );
    }
}

function deleteAccount() {
    if (window.adminPanel && window.adminPanel.showConfirm) {
        window.adminPanel.showConfirm(
            'Delete Account',
            'WARNING: This action is permanent and cannot be undone. All your data will be permanently deleted. Are you absolutely sure?',
            () => {
                if (window.adminPanel.showNotification) {
                    window.adminPanel.showNotification('Account deletion initiated. You will be logged out shortly.', 'error');
                }
            }
        );
    }
}