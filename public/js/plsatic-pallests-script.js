// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
});

// Application State
const appState = {
    selectedColor: 'blue',
    quantity: 2,
    unitPrice: 85.00,
    cart: JSON.parse(localStorage.getItem('cart') || '[]')
};

// Color mapping
const colorNames = {
    'blue': 'Blue',
    'red': 'Red',
    'black': 'Black',
    'white': 'Pearl White',
    'green': 'Green',
    'ash': 'Ash',
    'yellow': 'Yellow'
};

// Initialize Page Functionality
function initializePage() {
    setupMobileMenu();
    setupImageGallery();
    setupColorSelection();
    setupQuantityControls();
    setupActionButtons();
    setupModals();
    setupContactInteractions();
    setupNavigation();
    updatePricing();
    updateCartDisplay();
    loadConfiguration();
}

// Mobile Menu Toggle
function setupMobileMenu() {
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
        });
    }
}

// Image Gallery Functionality
function setupImageGallery() {
    const mainImage = document.getElementById('mainProductImage');
    const thumbImages = document.querySelectorAll('.thumb-image');
    
    thumbImages.forEach(thumb => {
        thumb.addEventListener('click', function() {
            // Remove active class from all thumbnails
            thumbImages.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked thumbnail
            this.classList.add('active');
            
            // Update main image
            if (mainImage) {
                mainImage.src = this.src.replace('w=100&h=100', 'w=600&h=400');
                
                // Add loading effect
                mainImage.style.opacity = '0.5';
                setTimeout(() => {
                    mainImage.style.opacity = '1';
                }, 200);
            }
        });
    });
    
    // Main image click to zoom
    if (mainImage) {
        mainImage.addEventListener('click', function() {
            this.style.transform = 'scale(1.1)';
            setTimeout(() => {
                this.style.transform = '';
            }, 300);
        });
    }
}

// Color Selection Functionality
function setupColorSelection() {
    const colorButtons = document.querySelectorAll('.color-btn');
    const selectedColorDisplay = document.getElementById('selectedColor');
    
    colorButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all color buttons
            colorButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Update selected color
            const color = this.getAttribute('data-color');
            appState.selectedColor = color;
            
            // Update color display in specifications
            if (selectedColorDisplay) {
                selectedColorDisplay.textContent = colorNames[color] || color;
            }
            
            // Save configuration
            saveConfiguration();
            
            // Add visual feedback
            this.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // Track color selection
            trackColorSelection(color);
        });
    });
}

// Quantity Controls
function setupQuantityControls() {
    const decreaseBtn = document.getElementById('decreaseQty');
    const increaseBtn = document.getElementById('increaseQty');
    const quantityInput = document.getElementById('quantityInput');
    
    if (decreaseBtn) {
        decreaseBtn.addEventListener('click', function() {
            if (appState.quantity > 1) {
                appState.quantity--;
                updateQuantityDisplay();
                updatePricing();
                addButtonFeedback(this);
            }
        });
    }
    
    if (increaseBtn) {
        increaseBtn.addEventListener('click', function() {
            if (appState.quantity < 1000) {
                appState.quantity++;
                updateQuantityDisplay();
                updatePricing();
                addButtonFeedback(this);
            }
        });
    }
    
    if (quantityInput) {
        quantityInput.addEventListener('input', function() {
            let value = parseInt(this.value);
            if (isNaN(value) || value < 1) {
                value = 1;
            } else if (value > 1000) {
                value = 1000;
            }
            
            appState.quantity = value;
            this.value = value;
            updatePricing();
            saveConfiguration();
        });
        
        quantityInput.addEventListener('blur', function() {
            if (this.value === '' || parseInt(this.value) < 1) {
                this.value = 1;
                appState.quantity = 1;
                updatePricing();
            }
        });
    }
}

// Update quantity display
function updateQuantityDisplay() {
    const quantityInput = document.getElementById('quantityInput');
    if (quantityInput) {
        quantityInput.value = appState.quantity;
    }
    saveConfiguration();
}

// Add button feedback animation
function addButtonFeedback(button) {
    button.style.transform = 'scale(0.9)';
    setTimeout(() => {
        button.style.transform = '';
    }, 150);
}

// Update Pricing
function updatePricing() {
    const quantity = appState.quantity;
    let unitPrice = appState.unitPrice;
    
    // Apply bulk discounts
    if (quantity >= 100) {
        unitPrice *= 0.85; // 15% discount
    } else if (quantity >= 50) {
        unitPrice *= 0.9;  // 10% discount
    } else if (quantity >= 20) {
        unitPrice *= 0.95; // 5% discount
    }
    
    const totalPrice = unitPrice * quantity;
    
    // Update price displays
    const unitPriceElement = document.getElementById('unitPrice');
    const totalPriceElement = document.getElementById('totalPrice');
    
    if (unitPriceElement) {
        unitPriceElement.textContent = `$${unitPrice.toFixed(2)}`;
    }
    
    if (totalPriceElement) {
        totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`;
    }
    
    // Update discount information
    updateDiscountInfo(quantity);
    
    // Store current pricing
    appState.currentUnitPrice = unitPrice;
    appState.currentTotalPrice = totalPrice;
}

// Update discount information
function updateDiscountInfo(quantity) {
    const discountInfo = document.querySelector('.discount-info small');
    if (discountInfo) {
        if (quantity >= 100) {
            discountInfo.textContent = 'Volume discount applied! (15% off)';
            discountInfo.style.color = '#dc3545';
        } else if (quantity >= 50) {
            discountInfo.textContent = 'Bulk discount applied! (10% off)';
            discountInfo.style.color = '#dc3545';
        } else if (quantity >= 20) {
            discountInfo.textContent = 'Bulk discount applied! (5% off)';
            discountInfo.style.color = '#dc3545';
        } else {
            discountInfo.textContent = 'Bulk discounts available for 20+ units';
            discountInfo.style.color = '#28a745';
        }
    }
}

// Action Buttons Setup
function setupActionButtons() {
    const addToCartBtn = document.getElementById('addToCartBtn');
    const requestQuoteBtn = document.getElementById('requestQuoteBtn');
    const cartBtn = document.querySelector('.cart-btn');
    
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function() {
            addToCart();
            showCartModal();
            
            // Button animation
            this.style.transform = 'scale(0.95)';
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ADDING...';
            
            setTimeout(() => {
                this.style.transform = '';
                this.innerHTML = '<i class="fas fa-shopping-cart"></i> ADD TO CART';
            }, 1000);
        });
    }
    
    if (requestQuoteBtn) {
        requestQuoteBtn.addEventListener('click', function() {
            showModal('quoteModal');
            populateQuoteForm();
        });
    }
    
    if (cartBtn) {
        cartBtn.addEventListener('click', function() {
            showCartModal();
        });
    }
}

// Add to Cart Functionality
function addToCart() {
    const product = {
        id: Date.now(),
        name: 'Parama Plastic Pallet',
        color: appState.selectedColor,
        colorName: colorNames[appState.selectedColor],
        quantity: appState.quantity,
        unitPrice: appState.currentUnitPrice,
        totalPrice: appState.currentTotalPrice,
        timestamp: new Date().toISOString()
    };
    
    // Check if same product exists in cart
    const existingIndex = appState.cart.findIndex(
        item => item.name === product.name && item.color === product.color
    );
    
    if (existingIndex !== -1) {
        // Update existing product
        appState.cart[existingIndex].quantity += product.quantity;
        appState.cart[existingIndex].totalPrice += product.totalPrice;
    } else {
        // Add new product
        appState.cart.push(product);
    }
    
    // Save cart to localStorage
    localStorage.setItem('cart', JSON.stringify(appState.cart));
    
    // Update cart display
    updateCartDisplay();
    
    // Track add to cart
    trackAddToCart(product);
    
    console.log('Product added to cart:', product);
}

// Update Cart Display
function updateCartDisplay() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const totalItems = appState.cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        
        if (totalItems > 0) {
            cartCount.style.display = 'flex';
        } else {
            cartCount.style.display = 'none';
        }
    }
}

// Show Cart Modal
function showCartModal() {
    const cartItems = document.getElementById('cartItems');
    if (cartItems && appState.cart.length > 0) {
        cartItems.innerHTML = appState.cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>Color: ${item.colorName}</p>
                    <p>Quantity: ${item.quantity} × $${item.unitPrice.toFixed(2)}</p>
                </div>
                <div class="cart-item-price">
                    <strong>$${item.totalPrice.toFixed(2)}</strong>
                </div>
            </div>
        `).join('');
        
        const totalValue = appState.cart.reduce((sum, item) => sum + item.totalPrice, 0);
        cartItems.innerHTML += `
            <div class="cart-total">
                <strong>Total: $${totalValue.toFixed(2)}</strong>
            </div>
        `;
    } else if (cartItems) {
        cartItems.innerHTML = '<p>Your cart is empty</p>';
    }
    
    showModal('cartModal');
}

// Modal Management
function setupModals() {
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close');
    const submitQuoteBtn = document.getElementById('submitQuote');
    
    // Close button events
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modalId = this.getAttribute('data-modal');
            hideModal(modalId);
        });
    });
    
    // Click outside to close
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                hideModal(this.id);
            }
        });
    });
    
    // Escape key to close
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            modals.forEach(modal => {
                if (modal.style.display === 'block') {
                    hideModal(modal.id);
                }
            });
        }
    });
    
    // Submit quote
    if (submitQuoteBtn) {
        submitQuoteBtn.addEventListener('click', function() {
            submitQuoteRequest();
        });
    }
}

// Show Modal
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

// Hide Modal
function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Populate Quote Form
function populateQuoteForm() {
    const quoteQuantity = document.getElementById('quoteQuantity');
    if (quoteQuantity) {
        quoteQuantity.value = appState.quantity;
    }
}

// Submit Quote Request
function submitQuoteRequest() {
    const form = document.getElementById('quoteForm');
    const formData = new FormData(form);
    
    const name = document.getElementById('quoteName').value;
    const email = document.getElementById('quoteEmail').value;
    const phone = document.getElementById('quotePhone').value;
    const company = document.getElementById('quoteCompany').value;
    const quantity = document.getElementById('quoteQuantity').value;
    const message = document.getElementById('quoteMessage').value;
    
    if (!name || !email) {
        alert('Please fill in your name and email address.');
        return;
    }
    
    const quoteData = {
        id: 'QUOTE_' + Date.now(),
        customerInfo: {
            name: name,
            email: email,
            phone: phone,
            company: company
        },
        productInfo: {
            name: 'Parama Plastic Pallet',
            color: appState.selectedColor,
            colorName: colorNames[appState.selectedColor],
            quantity: parseInt(quantity) || appState.quantity
        },
        message: message,
        timestamp: new Date().toISOString(),
        estimatedValue: (parseInt(quantity) || appState.quantity) * appState.unitPrice
    };
    
    // Store quote request
    let quotes = JSON.parse(localStorage.getItem('quoteRequests') || '[]');
    quotes.push(quoteData);
    localStorage.setItem('quoteRequests', JSON.stringify(quotes));
    
    // Show success message
    alert('Quote request submitted successfully! We will contact you within 24 hours.');
    
    // Clear form
    form.reset();
    hideModal('quoteModal');
    
    // Track quote request
    trackQuoteRequest(quoteData);
    
    console.log('Quote request submitted:', quoteData);
}

// Contact Interactions
function setupContactInteractions() {
    const contactItems = document.querySelectorAll('.contact-item');
    
    contactItems.forEach(item => {
        const phoneNumber = item.querySelector('.contact-number');
        if (phoneNumber) {
            const number = phoneNumber.textContent.replace(':', '').trim();
            
            item.addEventListener('click', function() {
                if (confirm(`Call ${number}?`)) {
                    window.location.href = `tel:${number}`;
                }
            });
        }
    });
}

// Navigation Setup
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const getQuoteBtn = document.querySelector('.quote-btn');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href && href.startsWith('#')) {
                e.preventDefault();
                
                // Remove active class from all links
                navLinks.forEach(l => l.classList.remove('active'));
                
                // Add active class to clicked link
                this.classList.add('active');
                
                // Smooth scroll to section (if exists)
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
    
    if (getQuoteBtn) {
        getQuoteBtn.addEventListener('click', function() {
            showModal('quoteModal');
            populateQuoteForm();
        });
    }
}

// Configuration Management
function saveConfiguration() {
    const config = {
        selectedColor: appState.selectedColor,
        quantity: appState.quantity,
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('palletConfig', JSON.stringify(config));
}

function loadConfiguration() {
    const saved = localStorage.getItem('palletConfig');
    if (saved) {
        try {
            const config = JSON.parse(saved);
            
            // Apply saved color
            if (config.selectedColor) {
                appState.selectedColor = config.selectedColor;
                
                const colorBtn = document.querySelector(`[data-color="${config.selectedColor}"]`);
                if (colorBtn) {
                    document.querySelectorAll('.color-btn').forEach(btn => btn.classList.remove('active'));
                    colorBtn.classList.add('active');
                    
                    const selectedColorDisplay = document.getElementById('selectedColor');
                    if (selectedColorDisplay) {
                        selectedColorDisplay.textContent = colorNames[config.selectedColor];
                    }
                }
            }
            
            // Apply saved quantity
            if (config.quantity) {
                appState.quantity = config.quantity;
                updateQuantityDisplay();
            }
            
            updatePricing();
        } catch (e) {
            console.error('Error loading configuration:', e);
        }
    }
}

// Utility Functions
function getCurrentProduct() {
    return {
        name: 'Parama Plastic Pallet',
        color: appState.selectedColor,
        colorName: colorNames[appState.selectedColor],
        quantity: appState.quantity,
        unitPrice: appState.currentUnitPrice,
        totalPrice: appState.currentTotalPrice
    };
}

function getCartItemCount() {
    return appState.cart.reduce((total, item) => total + item.quantity, 0);
}

function getCartValue() {
    return appState.cart.reduce((total, item) => total + item.totalPrice, 0);
}

function clearCart() {
    appState.cart = [];
    localStorage.removeItem('cart');
    updateCartDisplay();
    console.log('Cart cleared');
}

// Search Functionality
function setupSearch() {
    const searchBtn = document.querySelector('.search-btn');
    
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            const searchTerm = prompt('Search products:');
            if (searchTerm) {
                // Implement search functionality
                console.log('Searching for:', searchTerm);
                alert(`Search functionality would look for: "${searchTerm}"`);
            }
        });
    }
}

// Analytics and Tracking
function trackPageView() {
    const pageData = {
        page: 'Plastic Pallets Product Page',
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        referrer: document.referrer
    };
    console.log('Page view tracked:', pageData);
}

function trackColorSelection(color) {
    const colorData = {
        event: 'color_selection',
        product: 'Parama Plastic Pallet',
        selectedColor: color,
        colorName: colorNames[color],
        timestamp: new Date().toISOString()
    };
    console.log('Color selection tracked:', colorData);
}

function trackAddToCart(product) {
    const cartData = {
        event: 'add_to_cart',
        product: product,
        timestamp: new Date().toISOString()
    };
    console.log('Add to cart tracked:', cartData);
}

function trackQuoteRequest(quoteData) {
    const trackingData = {
        event: 'quote_request',
        quoteId: quoteData.id,
        product: quoteData.productInfo,
        timestamp: new Date().toISOString()
    };
    console.log('Quote request tracked:', trackingData);
}

// Error Handling
window.addEventListener('error', function(event) {
    console.error('JavaScript error:', event.error);
    
    // Log error for debugging
    const errorData = {
        message: event.error.message,
        filename: event.filename,
        lineno: event.lineno,
        timestamp: new Date().toISOString()
    };
    
    // In production, send to error logging service
    console.log('Error logged:', errorData);
});

// Performance Monitoring
function trackPerformance() {
    if ('performance' in window) {
        window.addEventListener('load', function() {
            setTimeout(function() {
                const perfData = {
                    loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart,
                    domReady: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart,
                    timestamp: new Date().toISOString()
                };
                console.log('Performance tracked:', perfData);
            }, 0);
        });
    }
}

// Accessibility Enhancements
function setupAccessibility() {
    // Add keyboard navigation for color buttons
    document.addEventListener('keydown', function(event) {
        if (event.target.classList.contains('color-btn')) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                event.target.click();
            }
        }
        
        if (event.target.classList.contains('qty-btn')) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                event.target.click();
            }
        }
    });
    
    // Add ARIA labels
    const colorButtons = document.querySelectorAll('.color-btn');
    colorButtons.forEach(button => {
        const color = button.getAttribute('data-color');
        const colorName = colorNames[color] || color;
        button.setAttribute('aria-label', `Select ${colorName} color`);
        button.setAttribute('role', 'button');
        button.setAttribute('tabindex', '0');
    });
    
    const qtyButtons = document.querySelectorAll('.qty-btn');
    qtyButtons.forEach(button => {
        const action = button.textContent === '+' ? 'increase' : 'decrease';
        button.setAttribute('aria-label', `${action} quantity`);
        button.setAttribute('role', 'button');
        button.setAttribute('tabindex', '0');
    });
}

// Mobile Optimizations
function setupMobileOptimizations() {
    // Touch event optimizations
    if ('ontouchstart' in window) {
        // Add touch-friendly interactions
        const interactiveElements = document.querySelectorAll('.color-btn, .qty-btn, .btn');
        
        interactiveElements.forEach(element => {
            element.addEventListener('touchstart', function() {
                this.style.opacity = '0.7';
            });
            
            element.addEventListener('touchend', function() {
                this.style.opacity = '';
            });
        });
    }
    
    // Viewport height adjustment for mobile browsers
    function setViewportHeight() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    setViewportHeight();
    window.addEventListener('resize', setViewportHeight);
}

// Social Sharing
function setupSocialSharing() {
    const socialLinks = document.querySelectorAll('.social-links a');
    
    socialLinks.forEach(link => {
        const platform = link.querySelector('i').className;
        
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const url = window.location.href;
            const title = document.title;
            const text = 'Check out these premium plastic pallets from Parama!';
            
            let shareUrl = '';
            
            if (platform.includes('facebook')) {
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
            } else if (platform.includes('linkedin')) {
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
            } else if (platform.includes('instagram')) {
                // Instagram doesn't support direct URL sharing
                alert('Please share this page manually on Instagram!');
                return;
            }
            
            if (shareUrl) {
                window.open(shareUrl, '_blank', 'width=600,height=400');
            }
        });
    });
}

// Initialize advanced features
document.addEventListener('DOMContentLoaded', function() {
    trackPageView();
    trackPerformance();
    setupAccessibility();
    setupMobileOptimizations();
    setupSocialSharing();
    setupSearch();
});

// Auto-save configuration
setInterval(saveConfiguration, 30000); // Save every 30 seconds

// Export functions for external use
window.ParamaPalletPage = {
    addToCart: addToCart,
    getCartItemCount: getCartItemCount,
    getCartValue: getCartValue,
    clearCart: clearCart,
    getCurrentProduct: getCurrentProduct,
    showQuoteModal: () => showModal('quoteModal'),
    showCartModal: showCartModal
};

// Service Worker Registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Uncomment when service worker is available
        // navigator.serviceWorker.register('/sw.js')
        //     .then(function(registration) {
        //         console.log('ServiceWorker registration successful');
        //     })
        //     .catch(function(err) {
        //         console.log('ServiceWorker registration failed: ', err);
        //     });
    });
}

// Online/Offline Status
window.addEventListener('online', function() {
    console.log('Connection restored');
    // Show notification or sync data
});

window.addEventListener('offline', function() {
    console.log('Connection lost');
    // Show offline notification
    alert('You are currently offline. Some features may not work properly.');
});

// Page Visibility API
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Page is hidden, pause unnecessary operations
        console.log('Page hidden');
    } else {
        // Page is visible, resume operations
        console.log('Page visible');
        // Refresh cart display in case it was updated in another tab
        appState.cart = JSON.parse(localStorage.getItem('cart') || '[]');
        updateCartDisplay();
    }
});

// Local Storage Event Listener (for cross-tab synchronization)
window.addEventListener('storage', function(e) {
    if (e.key === 'cart') {
        // Cart was updated in another tab
        appState.cart = JSON.parse(e.newValue || '[]');
        updateCartDisplay();
        console.log('Cart synchronized from another tab');
    }
});