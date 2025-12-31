/* ============================================
   BLOG PAGES - JAVASCRIPT
   Add to your script.js or create blog.js
   ============================================ */

(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {
        initBlogCards();
        initSocialShare();
        initCommentForm();
        initCommentActions();
        initNewsletterForm();
        initReadingProgress();
    });

    // ===== BLOG CARDS INTERACTION =====
    function initBlogCards() {
        const blogCards = document.querySelectorAll('.blog-card, .related-post-card');

        blogCards.forEach(card => {
            card.addEventListener('click', function(e) {
                // Don't navigate if clicking a button or link
                if (e.target.closest('button') || e.target.closest('a')) {
                    return;
                }

                // Find the first link in the card
                const link = card.querySelector('.blog-title a, h4 a');
                if (link) {
                    window.location.href = link.href;
                }
            });

            // Add pointer cursor
            card.style.cursor = 'pointer';
        });
    }

    // ===== SOCIAL SHARE =====
    function initSocialShare() {
        const shareButtons = document.querySelectorAll('.btn-share');

        shareButtons.forEach(button => {
            button.addEventListener('click', function() {
                const platform = this.getAttribute('data-platform');
                const url = encodeURIComponent(window.location.href);
                const title = encodeURIComponent(document.title);

                let shareUrl = '';

                switch(platform) {
                    case 'facebook':
                        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                        break;
                    case 'twitter':
                        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
                        break;
                    case 'linkedin':
                        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
                        break;
                    case 'copy':
                        copyToClipboard(window.location.href);
                        if (window.marketplace && window.marketplace.showNotification) {
                            window.marketplace.showNotification('Link copied to clipboard!', 'success');
                        }
                        return;
                }

                if (shareUrl) {
                    window.open(shareUrl, '_blank', 'width=600,height=400');
                }
            });
        });
    }

    function copyToClipboard(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text);
        } else {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
        }
    }

    // ===== COMMENT FORM =====
    function initCommentForm() {
        const commentForm = document.querySelector('.comment-form');

        if (!commentForm) return;

        commentForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(this);
            const name = this.querySelector('input[type="text"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const comment = this.querySelector('textarea').value;

            // Validate
            if (!name || !email || !comment) {
                if (window.marketplace && window.marketplace.showNotification) {
                    window.marketplace.showNotification('Please fill in all fields', 'error');
                }
                return;
            }

            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalHTML = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Posting...';
            submitBtn.disabled = true;

            // Simulate posting comment
            setTimeout(() => {
                submitBtn.innerHTML = '<i class="bi bi-check-circle"></i> Posted!';

                if (window.marketplace && window.marketplace.showNotification) {
                    window.marketplace.showNotification('Comment posted successfully!', 'success');
                }

                // Reset form
                setTimeout(() => {
                    this.reset();
                    submitBtn.innerHTML = originalHTML;
                    submitBtn.disabled = false;
                }, 1500);
            }, 1000);
        });
    }

    // ===== COMMENT ACTIONS =====
    function initCommentActions() {
        const commentActions = document.querySelectorAll('.btn-comment-action');

        commentActions.forEach(button => {
            button.addEventListener('click', function() {
                const action = this.textContent.trim().toLowerCase();

                if (action.includes('like')) {
                    // Toggle like
                    const icon = this.querySelector('i');
                    const isLiked = icon.classList.contains('bi-hand-thumbs-up-fill');

                    if (isLiked) {
                        icon.classList.remove('bi-hand-thumbs-up-fill');
                        icon.classList.add('bi-hand-thumbs-up');
                    } else {
                        icon.classList.remove('bi-hand-thumbs-up');
                        icon.classList.add('bi-hand-thumbs-up-fill');
                        
                        // Animation
                        this.style.transform = 'scale(1.2)';
                        setTimeout(() => {
                            this.style.transform = '';
                        }, 200);
                    }
                } else if (action.includes('reply')) {
                    // Show reply form
                    showReplyForm(this.closest('.comment-item'));
                }
            });
        });
    }

    function showReplyForm(commentItem) {
        // Check if reply form already exists
        if (commentItem.querySelector('.reply-form-container')) {
            return;
        }

        const replyForm = document.createElement('div');
        replyForm.className = 'reply-form-container';
        replyForm.style.cssText = 'margin-top: 20px; padding: 20px; background: var(--gray-100); border-radius: var(--border-radius);';
        replyForm.innerHTML = `
            <h5 style="font-size: 1rem; margin-bottom: 16px;">Write a reply</h5>
            <form class="reply-form">
                <textarea class="form-control mb-2" rows="3" placeholder="Your reply..." required></textarea>
                <div class="d-flex gap-2">
                    <button type="submit" class="btn btn-primary btn-sm">
                        <i class="bi bi-send"></i> Post Reply
                    </button>
                    <button type="button" class="btn btn-outline-secondary btn-sm cancel-reply">
                        Cancel
                    </button>
                </div>
            </form>
        `;

        commentItem.querySelector('.comment-content').appendChild(replyForm);

        // Handle form submission
        const form = replyForm.querySelector('.reply-form');
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const textarea = this.querySelector('textarea');
            if (textarea.value.trim()) {
                if (window.marketplace && window.marketplace.showNotification) {
                    window.marketplace.showNotification('Reply posted!', 'success');
                }
                replyForm.remove();
            }
        });

        // Handle cancel
        replyForm.querySelector('.cancel-reply').addEventListener('click', function() {
            replyForm.remove();
        });
    }

    // ===== NEWSLETTER FORM =====
    function initNewsletterForm() {
        const newsletterForms = document.querySelectorAll('.newsletter-form');

        newsletterForms.forEach(form => {
            form.addEventListener('submit', function(e) {
                e.preventDefault();

                const emailInput = this.querySelector('input[type="email"]');
                const email = emailInput.value.trim();

                if (!isValidEmail(email)) {
                    if (window.marketplace && window.marketplace.showNotification) {
                        window.marketplace.showNotification('Please enter a valid email', 'error');
                    }
                    return;
                }

                // Show loading
                const submitBtn = this.querySelector('button[type="submit"]');
                const originalHTML = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Subscribing...';
                submitBtn.disabled = true;

                // Simulate subscription
                setTimeout(() => {
                    if (window.marketplace && window.marketplace.showNotification) {
                        window.marketplace.showNotification('Successfully subscribed!', 'success');
                    }
                    
                    emailInput.value = '';
                    submitBtn.innerHTML = originalHTML;
                    submitBtn.disabled = false;
                }, 1000);
            });
        });
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // ===== READING PROGRESS BAR =====
    function initReadingProgress() {
        // Only show on article pages
        const articleContent = document.querySelector('.article-content');
        if (!articleContent) return;

        // Create progress bar
        const progressBar = document.createElement('div');
        progressBar.className = 'reading-progress-bar';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 4px;
            background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
            z-index: 9999;
            transition: width 0.1s ease;
        `;
        document.body.appendChild(progressBar);

        // Update progress on scroll
        window.addEventListener('scroll', function() {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight - windowHeight;
            const scrolled = window.pageYOffset;
            const progress = (scrolled / documentHeight) * 100;

            progressBar.style.width = Math.min(progress, 100) + '%';
        });
    }

    // ===== ARTICLE LIKE BUTTON =====
    const likeButtons = document.querySelectorAll('.article-share .btn:first-child');
    likeButtons.forEach(button => {
        if (button.textContent.includes('Like')) {
            button.addEventListener('click', function() {
                const icon = this.querySelector('i');
                const isLiked = icon.classList.contains('bi-heart-fill');

                if (isLiked) {
                    icon.classList.remove('bi-heart-fill');
                    icon.classList.add('bi-heart');
                    this.classList.remove('btn-primary');
                    this.classList.add('btn-outline-primary');
                    
                    if (window.marketplace && window.marketplace.showNotification) {
                        window.marketplace.showNotification('Removed from liked articles', 'info');
                    }
                } else {
                    icon.classList.remove('bi-heart');
                    icon.classList.add('bi-heart-fill');
                    this.classList.remove('btn-outline-primary');
                    this.classList.add('btn-primary');

                    // Animation
                    this.style.transform = 'scale(1.1)';
                    setTimeout(() => {
                        this.style.transform = '';
                    }, 200);

                    if (window.marketplace && window.marketplace.showNotification) {
                        window.marketplace.showNotification('Added to liked articles!', 'success');
                    }
                }
            });
        }
    });

    // ===== SAVE/BOOKMARK BUTTON =====
    const saveButtons = document.querySelectorAll('.article-share .btn:last-child');
    saveButtons.forEach(button => {
        if (button.textContent.includes('Save')) {
            button.addEventListener('click', function() {
                const icon = this.querySelector('i');
                const isSaved = icon.classList.contains('bi-bookmark-fill');

                if (isSaved) {
                    icon.classList.remove('bi-bookmark-fill');
                    icon.classList.add('bi-bookmark');
                    
                    if (window.marketplace && window.marketplace.showNotification) {
                        window.marketplace.showNotification('Removed from saved articles', 'info');
                    }
                } else {
                    icon.classList.remove('bi-bookmark');
                    icon.classList.add('bi-bookmark-fill');

                    // Animation
                    this.style.transform = 'scale(1.1)';
                    setTimeout(() => {
                        this.style.transform = '';
                    }, 200);

                    if (window.marketplace && window.marketplace.showNotification) {
                        window.marketplace.showNotification('Article saved!', 'success');
                    }
                }
            });
        }
    });



})();