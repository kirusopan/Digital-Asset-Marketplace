(function () {
  "use strict";

  // ===== INITIALIZATION =====
  document.addEventListener("DOMContentLoaded", function () {
    initScrollTop();
    initThemeToggle();
    initNavbarScroll();
    initSearchBar();
    initNewsletterForm();
    initDropdowns();
    initTooltips();
    initAnimations();
  });

  // ===== SCROLL TO TOP BUTTON =====
  function initScrollTop() {
    const scrollTopBtn = document.getElementById("scrollTop");

    if (!scrollTopBtn) return;

    // Show/hide scroll button
    window.addEventListener("scroll", function () {
      if (window.pageYOffset > 300) {
        scrollTopBtn.classList.add("show");
      } else {
        scrollTopBtn.classList.remove("show");
      }
    });

    // Scroll to top on click
    scrollTopBtn.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  // ===== THEME TOGGLE (DARK MODE) =====
  function initThemeToggle() {
    const themeToggle = document.getElementById("themeToggle");

    if (!themeToggle) return;

    // Check for saved theme preference
    const currentTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", currentTheme);
    updateThemeIcon(currentTheme);

    // Toggle theme on click
    themeToggle.addEventListener("click", function () {
      let theme = document.documentElement.getAttribute("data-theme");
      let newTheme = theme === "light" ? "dark" : "light";

      document.documentElement.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);
      updateThemeIcon(newTheme);

      // Add transition effect
      document.body.style.transition = "background-color 0.3s ease";
    });

    function updateThemeIcon(theme) {
      const icon = themeToggle.querySelector("i");
      if (theme === "dark") {
        icon.classList.remove("bi-moon-stars");
        icon.classList.add("bi-sun");
      } else {
        icon.classList.remove("bi-sun");
        icon.classList.add("bi-moon-stars");
      }
    }
  }

  // ===== NAVBAR SCROLL EFFECT =====
  function initNavbarScroll() {
    const navbar = document.querySelector(".navbar");

    if (!navbar) return;

    window.addEventListener("scroll", function () {
      if (window.pageYOffset > 50) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    });
  }

  // ===== SEARCH BAR FUNCTIONALITY =====
  function initSearchBar() {
    const searchForm = document.querySelector(".search-form");
    const searchInput = searchForm?.querySelector("input");

    if (!searchForm || !searchInput) return;

    // Search suggestions (can be enhanced with API)
    searchInput.addEventListener("input", function (e) {
      const query = e.target.value.trim();

      if (query.length > 2) {
        // Here you can add logic to show search suggestions
        console.log("Searching for:", query);
      }
    });

    // Handle search form submission
    searchForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const query = searchInput.value.trim();

      if (query) {
        // Redirect to search results page
        window.location.href = `search-results.html?q=${encodeURIComponent(
          query
        )}`;
      }
    });

    // Clear search on ESC key
    searchInput.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        searchInput.value = "";
        searchInput.blur();
      }
    });
  }

  // ===== NEWSLETTER FORM =====
  function initNewsletterForm() {
    const newsletterForm = document.querySelector(".newsletter-form");

    if (!newsletterForm) return;

    newsletterForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const emailInput = newsletterForm.querySelector('input[type="email"]');
      const email = emailInput.value.trim();

      if (!isValidEmail(email)) {
        showNotification("Please enter a valid email address", "error");
        return;
      }

      // Simulate newsletter subscription
      showNotification("Thank you for subscribing!", "success");
      emailInput.value = "";
    });
  }

  // ===== DROPDOWNS =====
  function initDropdowns() {
    // Bootstrap 5 handles dropdowns automatically
    // This function can be used for custom dropdown logic if needed
    const dropdowns = document.querySelectorAll(".dropdown-toggle");

    dropdowns.forEach((dropdown) => {
      dropdown.addEventListener("click", function (e) {
        // Custom dropdown logic can go here
      });
    });
  }

  // ===== TOOLTIPS =====
  function initTooltips() {
    // Initialize Bootstrap tooltips if any exist
    const tooltipTriggerList = [].slice.call(
      document.querySelectorAll('[data-bs-toggle="tooltip"]')
    );
    tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });
  }

  // ===== SCROLL ANIMATIONS =====
  function initAnimations() {
    // Add fade-in animation to elements on scroll
    const animateOnScroll = function () {
      const elements = document.querySelectorAll(".animate-on-scroll");

      elements.forEach((element) => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;

        if (elementTop < window.innerHeight && elementBottom > 0) {
          element.classList.add("animated");
        }
      });
    };

    window.addEventListener("scroll", animateOnScroll);
    animateOnScroll(); // Run once on load
  }

  // ===== UTILITY FUNCTIONS =====

  // Email Validation
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Show Notification
  function showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `alert alert-${
      type === "error" ? "danger" : type
    } notification-toast`;
    notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 9999;
            min-width: 300px;
            animation: slideInRight 0.3s ease;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        `;
    notification.innerHTML = `
            <div class="d-flex align-items-center justify-content-between">
                <span>${message}</span>
                <button type="button" class="btn-close ms-3" onclick="this.parentElement.parentElement.remove()"></button>
            </div>
        `;

    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
      notification.style.animation = "slideOutRight 0.3s ease";
      setTimeout(() => notification.remove(), 300);
    }, 5000);
  }

  // Format Currency
  function formatCurrency(amount, currency = "USD") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  }

  // Format Number
  function formatNumber(number) {
    return new Intl.NumberFormat("en-US").format(number);
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

  // Get URL Parameters
  function getUrlParameter(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    const regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
    const results = regex.exec(location.search);
    return results === null
      ? ""
      : decodeURIComponent(results[1].replace(/\+/g, " "));
  }

  // Local Storage Helper
  const storage = {
    set: function (key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (e) {
        console.error("Error saving to localStorage", e);
        return false;
      }
    },
    get: function (key) {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
      } catch (e) {
        console.error("Error reading from localStorage", e);
        return null;
      }
    },
    remove: function (key) {
      try {
        localStorage.removeItem(key);
        return true;
      } catch (e) {
        console.error("Error removing from localStorage", e);
        return false;
      }
    },
    clear: function () {
      try {
        localStorage.clear();
        return true;
      } catch (e) {
        console.error("Error clearing localStorage", e);
        return false;
      }
    },
  };

  // ===== CART FUNCTIONS =====
  const cart = {
    // Get cart items
    getItems: function () {
      return storage.get("cart") || [];
    },

    // Add item to cart
    addItem: function (item) {
      const items = this.getItems();
      const existingItem = items.find((i) => i.id === item.id);

      if (existingItem) {
        showNotification("Item already in cart", "info");
        return false;
      }

      items.push(item);
      storage.set("cart", items);
      this.updateCartCount();
      showNotification("Added to cart!", "success");
      return true;
    },

    // Remove item from cart
    removeItem: function (itemId) {
      let items = this.getItems();
      items = items.filter((i) => i.id !== itemId);
      storage.set("cart", items);
      this.updateCartCount();
      showNotification("Removed from cart", "info");
    },

    // Update cart count in UI
    updateCartCount: function () {
      const items = this.getItems();
      const badges = document.querySelectorAll(".nav-link .badge-count");
      badges.forEach((badge) => {
        if (badge.closest(".nav-link").href.includes("cart.html")) {
          badge.textContent = items.length;
        }
      });
    },

    // Clear cart
    clear: function () {
      storage.set("cart", []);
      this.updateCartCount();
    },

    // Get total
    getTotal: function () {
      const items = this.getItems();
      return items.reduce((total, item) => total + (item.price || 0), 0);
    },
  };

  // ===== WISHLIST FUNCTIONS =====
  const wishlist = {
    // Get wishlist items
    getItems: function () {
      return storage.get("wishlist") || [];
    },

    // Add item to wishlist
    addItem: function (item) {
      const items = this.getItems();
      const existingItem = items.find((i) => i.id === item.id);

      if (existingItem) {
        showNotification("Already in wishlist", "info");
        return false;
      }

      items.push(item);
      storage.set("wishlist", items);
      this.updateWishlistCount();
      showNotification("Added to wishlist!", "success");
      return true;
    },

    // Remove item from wishlist
    removeItem: function (itemId) {
      let items = this.getItems();
      items = items.filter((i) => i.id !== itemId);
      storage.set("wishlist", items);
      this.updateWishlistCount();
      showNotification("Removed from wishlist", "info");
    },

    // Toggle wishlist
    toggleItem: function (item) {
      const items = this.getItems();
      const existingItem = items.find((i) => i.id === item.id);

      if (existingItem) {
        this.removeItem(item.id);
        return false;
      } else {
        this.addItem(item);
        return true;
      }
    },

    // Update wishlist count in UI
    updateWishlistCount: function () {
      const items = this.getItems();
      const badges = document.querySelectorAll(".nav-link .badge-count");
      badges.forEach((badge) => {
        if (badge.closest(".nav-link").href.includes("wishlist.html")) {
          badge.textContent = items.length;
        }
      });
    },

    // Check if item is in wishlist
    hasItem: function (itemId) {
      const items = this.getItems();
      return items.some((i) => i.id === itemId);
    },
  };

  // ===== MAKE FUNCTIONS GLOBALLY AVAILABLE =====
  window.marketplace = {
    showNotification,
    formatCurrency,
    formatNumber,
    debounce,
    getUrlParameter,
    storage,
    cart,
    wishlist,
  };

  // Initialize cart and wishlist counts on page load
  cart.updateCartCount();
  wishlist.updateWishlistCount();
})();

// ===== ADDITIONAL CSS FOR ANIMATIONS =====
const style = document.createElement("style");
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
    
    .animate-on-scroll {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .animate-on-scroll.animated {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);

/* ============================================
   HERO SECTION - JAVASCRIPT
   ============================================ */

(function () {
  "use strict";

  // ===== INITIALIZATION =====
  document.addEventListener("DOMContentLoaded", function () {
    initHeroAnimations();
    initHeroSearch();
    initCategoryPills();
    initHeroParallax();
  });

  // ===== HERO SCROLL ANIMATIONS =====
  function initHeroAnimations() {
    const animateElements = document.querySelectorAll(".animate-on-scroll");

    if (animateElements.length === 0) return;

    // Intersection Observer for scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animated");
        }
      });
    }, observerOptions);

    animateElements.forEach((element) => {
      observer.observe(element);
    });

    // Trigger animations immediately for elements in viewport
    setTimeout(() => {
      animateElements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          element.classList.add("animated");
        }
      });
    }, 100);
  }

  // ===== HERO SEARCH FUNCTIONALITY =====
  function initHeroSearch() {
    const heroSearchForm = document.querySelector(".hero-search-form");
    const heroSearchInput = heroSearchForm?.querySelector("input");

    if (!heroSearchForm || !heroSearchInput) return;

    // Handle form submission
    heroSearchForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const query = heroSearchInput.value.trim();

      if (query.length === 0) {
        showSearchError("Please enter a search term");
        return;
      }

      // Redirect to search results page
      window.location.href = `search-results.html?q=${encodeURIComponent(
        query
      )}`;
    });

    // Real-time search suggestions (optional enhancement)
    let searchTimeout;
    heroSearchInput.addEventListener("input", function (e) {
      clearTimeout(searchTimeout);

      const query = e.target.value.trim();

      if (query.length > 2) {
        searchTimeout = setTimeout(() => {
          // Here you can show search suggestions
          console.log("Search suggestions for:", query);
          // showSearchSuggestions(query);
        }, 300);
      }
    });

    // Popular search tags
    const searchTags = document.querySelectorAll(".search-tag");
    searchTags.forEach((tag) => {
      tag.addEventListener("click", function (e) {
        e.preventDefault();
        const searchTerm = this.textContent.trim();
        heroSearchInput.value = searchTerm;

        // Add visual feedback
        this.style.transform = "scale(0.95)";
        setTimeout(() => {
          this.style.transform = "";
          heroSearchForm.dispatchEvent(new Event("submit"));
        }, 150);
      });
    });
  }

  // Show search error
  function showSearchError(message) {
    // Use the global notification function if available
    if (window.marketplace && window.marketplace.showNotification) {
      window.marketplace.showNotification(message, "error");
    } else {
      alert(message);
    }
  }

  // ===== CATEGORY PILLS INTERACTION =====
  function initCategoryPills() {
    const categoryPills = document.querySelectorAll(".category-pill");

    if (categoryPills.length === 0) return;

    categoryPills.forEach((pill) => {
      // Add click handler
      pill.addEventListener("click", function () {
        const categoryTitle = this.querySelector(".pill-title").textContent;

        // Add click animation
        this.style.transform = "scale(0.98)";
        setTimeout(() => {
          this.style.transform = "";
        }, 150);

        // Redirect to category page
        const categorySlug = categoryTitle.toLowerCase().replace(/\s+/g, "-");
        window.location.href = `category.html?cat=${categorySlug}`;
      });

      // Add hover effect for icon
      pill.addEventListener("mouseenter", function () {
        const icon = this.querySelector(".pill-icon");
        icon.style.transform = "rotate(360deg) scale(1.1)";
        icon.style.transition = "transform 0.5s ease";
      });

      pill.addEventListener("mouseleave", function () {
        const icon = this.querySelector(".pill-icon");
        icon.style.transform = "rotate(0deg) scale(1)";
      });
    });
  }

  // ===== HERO PARALLAX EFFECT =====
  function initHeroParallax() {
    const heroSection = document.querySelector(".hero-section");
    const heroShapes = document.querySelectorAll(".hero-shapes .shape");
    const featuredCards = document.querySelectorAll(".featured-card");
    const decorators = document.querySelectorAll(".decorator");

    if (!heroSection) return;

    // Parallax on mouse move
    heroSection.addEventListener("mousemove", function (e) {
      const mouseX = e.clientX / window.innerWidth;
      const mouseY = e.clientY / window.innerHeight;

      // Move shapes
      heroShapes.forEach((shape, index) => {
        const speed = (index + 1) * 10;
        const x = (mouseX - 0.5) * speed;
        const y = (mouseY - 0.5) * speed;
        shape.style.transform = `translate(${x}px, ${y}px)`;
      });

      // Move featured cards slightly
      featuredCards.forEach((card, index) => {
        const speed = (index + 1) * 5;
        const x = (mouseX - 0.5) * speed;
        const y = (mouseY - 0.5) * speed;
        card.style.transform = `translate(${x}px, ${y}px)`;
      });

      // Move decorators
      decorators.forEach((decorator, index) => {
        const speed = (index + 1) * 15;
        const x = (mouseX - 0.5) * speed;
        const y = (mouseY - 0.5) * speed;
        decorator.style.transform = `translate(${x}px, ${y}px)`;
      });
    });
  }

  // ===== HERO STATS COUNTER ANIMATION =====
  function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
      current += increment;

      if (current >= target) {
        element.textContent = formatStatNumber(target);
        clearInterval(timer);
      } else {
        element.textContent = formatStatNumber(Math.floor(current));
      }
    }, 16);
  }

  function formatStatNumber(num) {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K+";
    }
    return num.toString();
  }

  // Trigger counter animation when stats are visible
  const statsSection = document.querySelector(".hero-stats");
  if (statsSection) {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll(".stat-number");
            statNumbers.forEach((stat, index) => {
              const text = stat.textContent;
              const value = parseFloat(text.replace(/[^0-9.]/g, ""));

              setTimeout(() => {
                if (text.includes("K")) {
                  animateCounter(stat, value * 1000, 2000);
                } else {
                  animateCounter(stat, value, 2000);
                }
              }, index * 200);
            });
            statsObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    statsObserver.observe(statsSection);
  }

  // ===== FEATURED CARDS INTERACTION =====
  const featuredCards = document.querySelectorAll(".featured-card");
  featuredCards.forEach((card) => {
    card.addEventListener("click", function () {
      // Redirect to asset details
      window.location.href = "asset-details.html?id=1";
    });

    // Add pointer cursor
    card.style.cursor = "pointer";

    // Add ripple effect on click
    card.addEventListener("click", function (e) {
      const ripple = document.createElement("div");
      ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.6);
                width: 20px;
                height: 20px;
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;

      const rect = this.getBoundingClientRect();
      ripple.style.left = e.clientX - rect.left - 10 + "px";
      ripple.style.top = e.clientY - rect.top - 10 + "px";

      this.appendChild(ripple);

      setTimeout(() => ripple.remove(), 600);
    });
  });

  // ===== CTA BANNER INTERACTION =====
  const ctaButton = document.querySelector(".cta-banner .btn");
  if (ctaButton) {
    ctaButton.addEventListener("click", function (e) {
      // Add click animation
      this.style.transform = "scale(0.95)";
      setTimeout(() => {
        this.style.transform = "";
      }, 150);
    });
  }

  // ===== ADD RIPPLE ANIMATION CSS =====
  const style = document.createElement("style");
  style.textContent = `
        @keyframes ripple {
            from {
                transform: scale(0);
                opacity: 1;
            }
            to {
                transform: scale(20);
                opacity: 0;
            }
        }
    `;
  document.head.appendChild(style);
})();

// ===== MAKE HERO FUNCTIONS GLOBALLY AVAILABLE =====
window.heroSection = {
  animateCounter: function (element, target, duration) {
    // Counter animation logic
  },
};

/* ============================================
   ALL HOMEPAGE SECTIONS
   ============================================ */

(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    initAssetCards();
    initCategoryCards();
    initSellerCards();
    initQuickView();
    initWishlist();
    initAddToCart();
  });

  // ===== ASSET CARDS INTERACTION =====
  function initAssetCards() {
    const assetCards = document.querySelectorAll(".asset-card");

    assetCards.forEach((card) => {
      // Click to view details
      card.addEventListener("click", function (e) {
        // Ignore if clicking on buttons
        if (
          e.target.closest(".btn-wishlist") ||
          e.target.closest(".btn-quick-view") ||
          e.target.closest(".btn-add-cart")
        ) {
          return;
        }

        // Redirect to asset details page
        window.location.href = "asset-details.html?id=1";
      });

      // Add hover effect
      card.style.cursor = "pointer";
    });
  }

  // ===== CATEGORY CARDS =====
  function initCategoryCards() {
    const categoryCards = document.querySelectorAll(".category-card");

    categoryCards.forEach((card) => {
      card.addEventListener("click", function () {
        const categoryName = this.querySelector(".category-name").textContent;
        const categorySlug = categoryName.toLowerCase().replace(/\s+/g, "-");

        // Add click animation
        this.style.transform = "scale(0.98)";
        setTimeout(() => {
          this.style.transform = "";
          window.location.href = `category.html?cat=${categorySlug}`;
        }, 150);
      });
    });
  }

  // ===== SELLER CARDS =====
  function initSellerCards() {
    const sellerCards = document.querySelectorAll(".seller-card");

    sellerCards.forEach((card) => {
      card.addEventListener("click", function (e) {
        // Ignore if clicking on follow button
        if (e.target.closest(".btn-follow")) {
          return;
        }

        // Redirect to seller profile
        window.location.href = "seller-profile.html?id=1";
      });

      // Follow button
      const followBtn = card.querySelector(".btn-follow");
      if (followBtn) {
        followBtn.addEventListener("click", function (e) {
          e.stopPropagation();

          const isFollowing = this.classList.contains("following");

          if (isFollowing) {
            this.classList.remove("following");
            this.classList.remove("btn-primary");
            this.classList.add("btn-outline-primary");
            this.innerHTML = '<i class="bi bi-plus-circle me-2"></i>Follow';

            if (window.marketplace && window.marketplace.showNotification) {
              window.marketplace.showNotification("Unfollowed seller", "info");
            }
          } else {
            this.classList.add("following");
            this.classList.remove("btn-outline-primary");
            this.classList.add("btn-primary");
            this.innerHTML = '<i class="bi bi-check-circle me-2"></i>Following';

            if (window.marketplace && window.marketplace.showNotification) {
              window.marketplace.showNotification(
                "Now following this seller!",
                "success"
              );
            }
          }
        });
      }
    });
  }

  // ===== QUICK VIEW MODAL =====
  function initQuickView() {
    const quickViewBtns = document.querySelectorAll(".btn-quick-view");

    quickViewBtns.forEach((btn) => {
      btn.addEventListener("click", function (e) {
        e.stopPropagation();

        const assetId = this.getAttribute("data-id");

        // Add loading effect
        this.innerHTML = '<i class="bi bi-hourglass-split"></i> Loading...';
        this.disabled = true;

        // Simulate loading
        setTimeout(() => {
          showQuickViewModal(assetId);

          // Reset button
          this.innerHTML = '<i class="bi bi-eye"></i> Quick View';
          this.disabled = false;
        }, 500);
      });
    });
  }

  function showQuickViewModal(assetId) {
    // Create modal HTML
    const modal = document.createElement("div");
    modal.className = "quick-view-modal";
    modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <button class="modal-close"><i class="bi bi-x-lg"></i></button>
                <div class="modal-body">
                    <div class="row g-4">
                        <div class="col-md-6">
                            <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=450&fit=crop" alt="Asset Preview" class="modal-image">
                            <div class="modal-actions">
                                    <button class="btn btn-primary btn-lg w-100 mb-2">
                                        <i class="bi bi-cart-plus me-2"></i>Add to Cart
                                    </button>
                                    <a href="asset-details.html?id=${assetId}" class="btn btn-outline-primary btn-lg w-100">
                                        View Full Details
                                    </a>
                            </div>
                        </div>
                        
                        <div class="col-md-6">
                            <div class="modal-info">
                                <span class="modal-category">UI Kits</span>
                                <h3 class="modal-title">Modern Dashboard UI Kit</h3>
                                <div class="modal-rating">
                                    <i class="bi bi-star-fill"></i>
                                    <i class="bi bi-star-fill"></i>
                                    <i class="bi bi-star-fill"></i>
                                    <i class="bi bi-star-fill"></i>
                                    <i class="bi bi-star-fill"></i>
                                    <span>(256 reviews)</span>
                                </div>
                                <div class="modal-price">
                                    <span class="price-current">$49</span>
                                    <span class="price-original">$79</span>
                                </div>
                                <p class="modal-description">
                                    A comprehensive dashboard UI kit with 50+ screens, components, and elements. 
                                    Perfect for building modern web applications with a clean and professional design.
                                </p>
                                <div class="modal-features">
                                    <div class="feature-item">
                                        <i class="bi bi-check-circle-fill"></i>
                                        <span>50+ Screens</span>
                                    </div>
                                    <div class="feature-item">
                                        <i class="bi bi-check-circle-fill"></i>
                                        <span>Fully Customizable</span>
                                    </div>
                                    <div class="feature-item">
                                        <i class="bi bi-check-circle-fill"></i>
                                        <span>Free Updates</span>
                                    </div>
                                </div>
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

    document.body.appendChild(modal);

    // Animate in
    setTimeout(() => {
      modal.classList.add("active");
    }, 10);

    // Close handlers
    const closeBtn = modal.querySelector(".modal-close");
    const overlay = modal.querySelector(".modal-overlay");

    closeBtn.addEventListener("click", () => closeModal(modal));
    overlay.addEventListener("click", () => closeModal(modal));

    // Prevent body scroll
    document.body.style.overflow = "hidden";
  }

  function closeModal(modal) {
    modal.classList.remove("active");
    setTimeout(() => {
      modal.remove();
      document.body.style.overflow = "";
    }, 300);
  }

  // ===== WISHLIST FUNCTIONALITY =====
  function initWishlist() {
    const wishlistBtns = document.querySelectorAll(".btn-wishlist");

    wishlistBtns.forEach((btn) => {
      btn.addEventListener("click", function (e) {
        e.stopPropagation();

        const assetId = this.getAttribute("data-id");
        const isActive = this.classList.contains("active");

        if (isActive) {
          this.classList.remove("active");

          if (window.marketplace && window.marketplace.wishlist) {
            window.marketplace.wishlist.removeItem(assetId);
          }
        } else {
          this.classList.add("active");

          // Add animation
          this.style.transform = "scale(1.3)";
          setTimeout(() => {
            this.style.transform = "";
          }, 300);

          if (window.marketplace && window.marketplace.wishlist) {
            window.marketplace.wishlist.addItem({
              id: assetId,
              name: "Asset Name",
              price: 49,
            });
          }
        }
      });
    });
  }

  // ===== ADD TO CART =====
  function initAddToCart() {
    const addToCartBtns = document.querySelectorAll(".btn-add-cart");

    addToCartBtns.forEach((btn) => {
      btn.addEventListener("click", function (e) {
        e.stopPropagation();

        // Add loading animation
        const originalHTML = this.innerHTML;
        this.innerHTML = '<i class="bi bi-hourglass-split"></i>';
        this.disabled = true;

        // Simulate adding to cart
        setTimeout(() => {
          this.innerHTML = '<i class="bi bi-check"></i>';

          if (window.marketplace && window.marketplace.cart) {
            window.marketplace.cart.addItem({
              id: Math.random().toString(36).substr(2, 9),
              name: "Asset Name",
              price: 49,
            });
          }

          setTimeout(() => {
            this.innerHTML = originalHTML;
            this.disabled = false;
          }, 1000);
        }, 500);
      });
    });
  }

  // ===== ADD MODAL STYLES =====
  const modalStyles = document.createElement("style");
  modalStyles.textContent = `
        .quick-view-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 9999;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s ease, visibility 0.3s ease;
        }

        .quick-view-modal.active {
            opacity: 1;
            visibility: visible;
        }

        .modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.85);
            backdrop-filter: blur(10px);
        }

        .modal-content {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0.9);
            width: 90%;
            max-width: 900px;
            max-height: 90vh;
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            transition: transform 0.3s ease;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
        }

        .quick-view-modal.active .modal-content {
            transform: translate(-50%, -50%) scale(1);
        }

        /* Custom Scrollbar for Modal */
        .modal-content::-webkit-scrollbar {
            display: none;
        }

        .modal-content {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }

        .modal-close {
            position: absolute;
            top: 20px;
            right: 20px;
            width: 44px;
            height: 44px;
            background: #ffffff;
            border: none;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 10;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            transition: all 0.3s ease;
            color: #475569;
        }

        .modal-close:hover {
            background: #ef4444;
            color: #ffffff;
            transform: rotate(90deg) scale(1.1);
        }

        .modal-body {
            padding: 50px 40px;
            background: #ffffff;
            max-height: 90vh;
            overflow-y: auto;
            overflow-x: hidden;
        }

        /* Beautiful Custom Scrollbar */
        .modal-body::-webkit-scrollbar {
            width: 8px;
        }

        .modal-body::-webkit-scrollbar-track {
            background: #f1f5f9;
            border-radius: 10px;
        }

        .modal-body::-webkit-scrollbar-thumb {
            background: linear-gradient(135deg, #6366f1, #ec4899);
            border-radius: 10px;
            transition: background 0.3s ease;
        }

        .modal-body::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(135deg, #4f46e5, #db2777);
        }

        /* Firefox Scrollbar */
        .modal-body {
            scrollbar-width: thin;
            scrollbar-color: #6366f1 #f1f5f9;
        }

        .modal-image {
            width: 100%;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }

        .modal-info {
            padding: 20px 0;
        }

        .modal-category {
            font-size: 0.875rem;
            font-weight: 700;
            color: #6366f1;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 12px;
            display: block;
        }

        .modal-title {
            font-size: 2rem;
            font-weight: 800;
            color: #1e293b;
            margin-bottom: 16px;
            line-height: 1.2;
        }

        .modal-rating {
            display: flex;
            align-items: center;
            gap: 4px;
            color: #f59e0b;
            margin-bottom: 20px;
        }

        .modal-rating span {
            color: #64748b;
            margin-left: 8px;
            font-weight: 600;
        }

        .modal-price {
            margin-bottom: 24px;
        }

        .price-current {
            font-size: 2.5rem;
            font-weight: 800;
            color: #6366f1;
            margin-right: 12px;
        }

        .price-original {
            font-size: 1.5rem;
            color: #94a3b8;
            text-decoration: line-through;
        }

        .modal-description {
            color: #475569;
            line-height: 1.8;
            margin-bottom: 24px;
            font-size: 1rem;
        }

        .modal-features {
            display: flex;
            flex-direction: column;
            gap: 12px;
            margin-bottom: 32px;
            padding: 20px;
            background: #f8fafc;
            border-radius: 12px;
            border: 2px solid #e2e8f0;
        }

        .feature-item {
            display: flex;
            align-items: center;
            gap: 12px;
            color: #334155;
            font-weight: 500;
        }

        .feature-item i {
            color: #10b981;
            font-size: 1.25rem;
        }

        .modal-actions {
            margin-top: 32px;
        }

        @media (max-width: 767px) {
            .modal-content {
                width: 95%;
                max-height: 95vh;
            }

            .modal-body {
                padding: 30px 20px;
            }

            .modal-title {
                font-size: 1.5rem;
            }

            .price-current {
                font-size: 2rem;
            }

            .modal-close {
                width: 40px;
                height: 40px;
                top: 15px;
                right: 15px;
            }
        }
    `;
  document.head.appendChild(modalStyles);
})();
