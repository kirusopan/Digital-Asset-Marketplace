
(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {
        initImageGallery();
        initWishlist();
        initLicenseSelector();
        initPurchaseButtons();
        initShareButtons();
        initZoomImage();
        initSellerActions();
        initReviewActions();
    });

    // ===== IMAGE GALLERY =====
    function initImageGallery() {
        const mainImage = document.getElementById('mainPreviewImage');
        const thumbnails = document.querySelectorAll('.thumbnail');

        if (!mainImage || thumbnails.length === 0) return;

        thumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('click', function() {
                // Remove active from all
                thumbnails.forEach(t => t.classList.remove('active'));
                
                // Add active to clicked
                this.classList.add('active');

                // Change main image with fade effect
                mainImage.style.opacity = '0';
                
                setTimeout(() => {
                    const newImageUrl = this.getAttribute('data-image');
                    mainImage.src = newImageUrl;
                    mainImage.style.opacity = '1';
                }, 150);
            });
        });
    }

    // ===== ZOOM IMAGE =====
    function initZoomImage() {
        const zoomBtn = document.getElementById('zoomBtn');
        const mainImage = document.getElementById('mainPreviewImage');

        if (!zoomBtn || !mainImage) return;

        zoomBtn.addEventListener('click', function() {
            createImageModal(mainImage.src);
        });

        // Also allow clicking on main image
        mainImage.addEventListener('click', function() {
            createImageModal(this.src);
        });

        mainImage.style.cursor = 'zoom-in';
    }

    function createImageModal(imageSrc) {
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'image-zoom-modal';
        modal.innerHTML = `
            <div class="modal-backdrop"></div>
            <div class="modal-image-container">
                <img src="${imageSrc}" alt="Zoomed Preview">
                <button class="btn-close-modal">
                    <i class="bi bi-x-lg"></i>
                </button>
            </div>
        `;

        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';

        // Animate in
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);

        // Close handlers
        const closeBtn = modal.querySelector('.btn-close-modal');
        const backdrop = modal.querySelector('.modal-backdrop');

        function closeModal() {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.remove();
                document.body.style.overflow = '';
            }, 300);
        }

        closeBtn.addEventListener('click', closeModal);
        backdrop.addEventListener('click', closeModal);
        
        // ESC key to close
        document.addEventListener('keydown', function escHandler(e) {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', escHandler);
            }
        });
    }

    // ===== WISHLIST =====
    function initWishlist() {
        const wishlistBtn = document.getElementById('wishlistBtn');

        if (!wishlistBtn) return;

        // Check if already in wishlist
        const assetId = getAssetIdFromUrl();
        if (window.marketplace && window.marketplace.wishlist) {
            if (window.marketplace.wishlist.hasItem(assetId)) {
                wishlistBtn.classList.add('active');
            }
        }

        wishlistBtn.addEventListener('click', function() {
            const isActive = this.classList.contains('active');

            if (isActive) {
                this.classList.remove('active');
                
                if (window.marketplace && window.marketplace.wishlist) {
                    window.marketplace.wishlist.removeItem(assetId);
                }
            } else {
                this.classList.add('active');
                
                // Animation
                this.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 300);

                if (window.marketplace && window.marketplace.wishlist) {
                    window.marketplace.wishlist.addItem({
                        id: assetId,
                        name: document.querySelector('.product-title').textContent,
                        price: parsePrice()
                    });
                }
            }
        });
    }

    // ===== LICENSE SELECTOR =====
    function initLicenseSelector() {
        const licenseOptions = document.querySelectorAll('.license-option input');
        const currentPriceEl = document.querySelector('.current-price');
        const originalPriceEl = document.querySelector('.original-price');

        licenseOptions.forEach(option => {
            option.addEventListener('change', function() {
                if (this.value === 'personal') {
                    if (currentPriceEl) currentPriceEl.textContent = '$49';
                    if (originalPriceEl) originalPriceEl.textContent = '$79';
                } else if (this.value === 'commercial') {
                    if (currentPriceEl) currentPriceEl.textContent = '$99';
                    if (originalPriceEl) originalPriceEl.textContent = '$149';
                }

                // Add animation
                if (currentPriceEl) {
                    currentPriceEl.style.transform = 'scale(1.1)';
                    setTimeout(() => {
                        currentPriceEl.style.transform = '';
                    }, 200);
                }
            });
        });
    }

    // ===== PURCHASE BUTTONS =====
    function initPurchaseButtons() {
        const addToCartBtn = document.querySelector('.btn-purchase');
        const buyNowBtn = document.querySelector('.btn-buy-now');

        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', function() {
                const selectedLicense = document.querySelector('.license-option input:checked');
                const licenseName = selectedLicense ? selectedLicense.value : 'personal';
                
                // Show loading
                const originalHTML = this.innerHTML;
                this.innerHTML = '<i class="bi bi-hourglass-split"></i> Adding...';
                this.disabled = true;

                setTimeout(() => {
                    this.innerHTML = '<i class="bi bi-check"></i> Added to Cart!';

                    // Add to cart
                    if (window.marketplace && window.marketplace.cart) {
                        window.marketplace.cart.addItem({
                            id: getAssetIdFromUrl(),
                            name: document.querySelector('.product-title').textContent,
                            price: parsePrice(),
                            license: licenseName
                        });
                    }

                    setTimeout(() => {
                        this.innerHTML = originalHTML;
                        this.disabled = false;
                    }, 2000);
                }, 500);
            });
        }

        if (buyNowBtn) {
            buyNowBtn.addEventListener('click', function() {
                // Show loading
                const originalHTML = this.innerHTML;
                this.innerHTML = '<i class="bi bi-hourglass-split"></i> Processing...';
                this.disabled = true;

                setTimeout(() => {
                    // Redirect to checkout
                    window.location.href = 'checkout.html';
                }, 1000);
            });
        }
    }

    // ===== SELLER ACTIONS =====
    function initSellerActions() {
        const followBtn = document.querySelector('.seller-actions .btn-outline-primary');
        const contactBtn = document.querySelector('.seller-actions .btn-outline-secondary');

        if (followBtn) {
            followBtn.addEventListener('click', function() {
                const isFollowing = this.innerHTML.includes('Following');

                if (isFollowing) {
                    this.innerHTML = '<i class="bi bi-person-plus"></i> Follow Seller';
                    
                    if (window.marketplace && window.marketplace.showNotification) {
                        window.marketplace.showNotification('Unfollowed seller', 'info');
                    }
                } else {
                    this.innerHTML = '<i class="bi bi-check"></i> Following';
                    
                    if (window.marketplace && window.marketplace.showNotification) {
                        window.marketplace.showNotification('Now following this seller!', 'success');
                    }
                }
            });
        }

        if (contactBtn) {
            contactBtn.addEventListener('click', function() {
                if (window.marketplace && window.marketplace.showNotification) {
                    window.marketplace.showNotification('Opening contact form...', 'info');
                }
                
                // Here you would open a contact modal or redirect
                setTimeout(() => {
                    console.log('Contact seller functionality');
                }, 500);
            });
        }
    }

    // ===== SHARE BUTTONS =====
    function initShareButtons() {
        const shareButtons = document.querySelectorAll('.btn-share');
        const copyLinkBtn = document.getElementById('copyLinkBtn');

        shareButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const platform = this.getAttribute('data-platform');
                
                if (platform) {
                    shareOnPlatform(platform);
                }
            });
        });

        if (copyLinkBtn) {
            copyLinkBtn.addEventListener('click', function() {
                const url = window.location.href;
                
                // Copy to clipboard
                navigator.clipboard.writeText(url).then(() => {
                    if (window.marketplace && window.marketplace.showNotification) {
                        window.marketplace.showNotification('Link copied to clipboard!', 'success');
                    }

                    // Visual feedback
                    this.innerHTML = '<i class="bi bi-check"></i>';
                    setTimeout(() => {
                        this.innerHTML = '<i class="bi bi-link-45deg"></i>';
                    }, 2000);
                }).catch(err => {
                    console.error('Failed to copy:', err);
                });
            });
        }
    }

    function shareOnPlatform(platform) {
        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent(document.querySelector('.product-title').textContent);
        let shareUrl = '';

        switch(platform) {
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                break;
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
                break;
            case 'pinterest':
                const imageUrl = encodeURIComponent(document.getElementById('mainPreviewImage').src);
                shareUrl = `https://pinterest.com/pin/create/button/?url=${url}&media=${imageUrl}&description=${title}`;
                break;
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
                break;
        }

        if (shareUrl) {
            window.open(shareUrl, '_blank', 'width=600,height=400');
        }
    }

    // ===== REVIEW ACTIONS =====
    function initReviewActions() {
        const helpfulBtns = document.querySelectorAll('.btn-review-action');

        helpfulBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                if (this.innerHTML.includes('Helpful')) {
                    // Toggle helpful
                    const currentCount = parseInt(this.textContent.match(/\d+/)[0]);
                    const isMarked = this.classList.contains('marked');

                    if (isMarked) {
                        this.classList.remove('marked');
                        this.innerHTML = `<i class="bi bi-hand-thumbs-up"></i> Helpful (${currentCount - 1})`;
                    } else {
                        this.classList.add('marked');
                        this.innerHTML = `<i class="bi bi-hand-thumbs-up-fill"></i> Helpful (${currentCount + 1})`;
                    }
                } else if (this.innerHTML.includes('Reply')) {
                    if (window.marketplace && window.marketplace.showNotification) {
                        window.marketplace.showNotification('Reply functionality coming soon', 'info');
                    }
                }
            });
        });
    }

    // ===== UTILITY FUNCTIONS =====
    function getAssetIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id') || '1';
    }

    function parsePrice() {
        const priceEl = document.querySelector('.current-price');
        if (!priceEl) return 49;
        
        const priceText = priceEl.textContent.replace('$', '').trim();
        return parseFloat(priceText) || 49;
    }

    // ===== ADD MODAL STYLES =====
    const modalStyles = document.createElement('style');
    modalStyles.textContent = `
        .image-zoom-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 99999;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s ease, visibility 0.3s ease;
        }

        .image-zoom-modal.active {
            opacity: 1;
            visibility: visible;
        }

        .modal-backdrop {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
        }

        .modal-image-container {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0.9);
            max-width: 90vw;
            max-height: 90vh;
            transition: transform 0.3s ease;
        }

        .image-zoom-modal.active .modal-image-container {
            transform: translate(-50%, -50%) scale(1);
        }

        .modal-image-container img {
            max-width: 100%;
            max-height: 90vh;
            display: block;
            border-radius: 8px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        }

        .btn-close-modal {
            position: absolute;
            top: -50px;
            right: 0;
            width: 50px;
            height: 50px;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border: 2px solid rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .btn-close-modal:hover {
            background: rgba(255, 255, 255, 0.2);
            transform: rotate(90deg);
        }

        @media (max-width: 767px) {
            .btn-close-modal {
                top: 10px;
                right: 10px;
            }
        }
    `;
    document.head.appendChild(modalStyles);

})();