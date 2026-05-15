// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    // Escape key to close notifications
    if (e.key === 'Escape') {
        const notifications = document.querySelectorAll('.custom-notification');
        notifications.forEach(notif => notif.remove());
    }
    
    // Enter key on buttons
    if (e.key === 'Enter') {
        if (e.target.classList.contains('size-btn') || 
            e.target.classList.contains('length-btn')) {
            e.target.click();
        }
    }
    
    // Arrow keys for size selection
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        const activeSize = document.querySelector('.size-btn.active');
        if (activeSize) {
            const sizeButtons = Array.from(document.querySelectorAll('.size-btn'));
            const currentIndex = sizeButtons.indexOf(activeSize);
            let newIndex;
            
            if (e.key === 'ArrowLeft') {
                newIndex = currentIndex > 0 ? currentIndex - 1 : sizeButtons.length - 1;
            } else {
                newIndex = currentIndex < sizeButtons.length - 1 ? currentIndex + 1 : 0;
            }
            
            sizeButtons[newIndex].click();
            sizeButtons[newIndex].focus();
        }
    }
    
    // Arrow keys for length selection
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        const activeLength = document.querySelector('.length-btn.active');
        if (activeLength) {
            const lengthButtons = Array.from(document.querySelectorAll('.length-btn'));
            const currentIndex = lengthButtons.indexOf(activeLength);
            let newIndex;
            
            if (e.key === 'ArrowUp') {
                newIndex = currentIndex > 0 ? currentIndex - 1 : lengthButtons.length - 1;
            } else {
                newIndex = currentIndex < lengthButtons.length - 1 ? currentIndex + 1 : 0;
            }
            
            lengthButtons[newIndex].click();
            lengthButtons[newIndex].focus();
        }
    }
});

// Product comparison function
function compareWithOtherProducts() {
    const currentProduct = getCurrentSelection();
    console.log('Current product for comparison:', currentProduct);
    
    // This function could open a comparison modal or navigate to a comparison page
    showNotification('Product comparison feature coming soon!', 'info');
}

// Calculate total length in meters
function getTotalLength() {
    const lengthPerUnit = selectedLength === '100' ? 30 : 60; // meters
    return lengthPerUnit * currentQuantity;
}

// Calculate estimated weight (example calculation)
function calculateEstimatedWeight() {
    // Example weight calculation based on size and length
    const weightPerMeter = {
        '1/2': 0.5,   // kg per meter
        '3/4': 0.7,
        '1': 1.0,
        '1 1/2': 1.8,
        '2': 2.5
    };
    
    const totalLength = getTotalLength();
    const weightPerM = weightPerMeter[selectedSize] || 1.0;
    
    return (totalLength * weightPerM).toFixed(1);
}

// Display product summary
function showProductSummary() {
    const selection = getCurrentSelection();
    const totalLength = getTotalLength();
    const estimatedWeight = calculateEstimatedWeight();
    
    const summary = `
Product Summary:
• Product: ${selection.product}
• Size: ${selection.size}" diameter
• Length per unit: ${selection.length} (${selection.lengthMeters})
• Quantity: ${selection.quantity} pieces
• Total length: ${totalLength}m
• Estimated weight: ${estimatedWeight}kg
    `;
    
    console.log(summary);
    return summary;
}

// Add to favorites function
function addToFavorites() {
    try {
        const favorites = JSON.parse(localStorage.getItem('product_favorites') || '[]');
        const currentProduct = getCurrentSelection();
        
        // Check if already in favorites
        const alreadyFavorited = favorites.some(fav => 
            fav.product === currentProduct.product && 
            fav.size === currentProduct.size && 
            fav.lengthMeters === currentProduct.lengthMeters
        );
        
        if (alreadyFavorited) {
            showNotification('Product is already in favorites!', 'info');
            return;
        }
        
        favorites.push(currentProduct);
        localStorage.setItem('product_favorites', JSON.stringify(favorites));
        
        showNotification('Product added to favorites!', 'success');
    } catch (e) {
        console.log('Could not save to favorites');
        showNotification('Could not add to favorites', 'error');
    }
}

// Share product function
function shareProduct() {
    const selection = getCurrentSelection();
    const url = window.location.href;
    const text = `Check out this ${selection.product} (${selection.size}" × ${selection.length}) from Parama Solutions!`;
    
    if (navigator.share) {
        // Use native sharing if available
        navigator.share({
            title: 'Parama Plastic Pallets',
            text: text,
            url: url
        }).catch(err => console.log('Error sharing:', err));
    } else {
        // Fallback to clipboard
        navigator.clipboard.writeText(`${text}\n${url}`).then(() => {
            showNotification('Product link copied to clipboard!', 'success');
        }).catch(() => {
            showNotification('Could not copy to clipboard', 'error');
        });
    }
}

// Print product information
function printProductInfo() {
    const summary = showProductSummary();
    const printWindow = window.open('', '_blank');
    
    printWindow.document.write(`
        <html>
        <head>
            <title>Parama Plastic Pallets - Product Information</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                h1 { color: #333; border-bottom: 2px solid #f4e942; padding-bottom: 10px; }
                .summary { background: #f8f9fa; padding: 15px; border-radius: 8px; white-space: pre-line; }
                .contact { margin-top: 20px; }
                @media print { .no-print { display: none; } }
            </style>
        </head>
        <body>
            <h1>Parama Plastic Pallets - Product Information</h1>
            <div class="summary">${summary}</div>
            <div class="contact">
                <h3>Contact Information:</h3>
                <p>Sales: +94 77 119 7144</p>
                <p>Hot Line: +94 77 789 8445</p>
                <p>General: +94 77 739 2975</p>
                <p>Email: info@domain.com</p>
            </div>
            <button class="no-print" onclick="window.print()">Print</button>
        </body>
        </html>
    `);
    
    printWindow.document.close();
}

// Enhanced error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    showNotification('An error occurred. Please refresh the page.', 'error');
});

// Performance monitoring
function logPerformanceMetrics() {
    if (window.performance && window.performance.timing) {
        const timing = window.performance.timing;
        const loadTime = timing.loadEventEnd - timing.navigationStart;
        console.log(`Page load time: ${loadTime}ms`);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Load any saved selection
    loadSelection();
    
    // Save selection when it changes
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('size-btn') || 
            e.target.classList.contains('length-btn') || 
            e.target.classList.contains('quantity-btn')) {
            setTimeout(saveSelection, 100);
        }
    });
    
    // Log performance metrics
    setTimeout(logPerformanceMetrics, 1000);
});

// Page visibility API for performance
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Page is hidden, save current state
        saveSelection();
    } else {
        // Page is visible, maybe refresh data
        console.log('Page is now visible');
    }
});

// Export functions for external use
window.AlkatheneProduct = {
    addToCart,
    requestQuote,
    callNumber,
    increaseQuantity,
    decreaseQuantity,
    getCurrentSelection,
    showNotification,
    showProductSummary,
    addToFavorites,
    shareProduct,
    printProductInfo,
    compareWithOtherProducts
};

// Service Worker registration (if available)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Add context menu for advanced options
document.addEventListener('contextmenu', function(e) {
    if (e.target.closest('.product-image')) {
        e.preventDefault();
        // Could show custom context menu with options like:
        // - View larger image
        // - Download product sheet
        // - Share product
        console.log('Context menu on product image');
    }
});

// Analytics tracking (placeholder)
function trackUserInteraction(action, details) {
    // This function can be used to track user interactions
    console.log('User interaction:', action, details);
    
    // Example: Google Analytics tracking
    // gtag('event', action, details);
    
    // Example: Custom analytics
    // customAnalytics.track(action, details);
}

// Track button clicks
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('size-btn')) {
        trackUserInteraction('size_selection', { size: e.target.dataset.size });
    } else if (e.target.classList.contains('length-btn')) {
        trackUserInteraction('length_selection', { length: e.target.dataset.length });
    } else if (e.target.classList.contains('add-to-cart-btn')) {
        trackUserInteraction('add_to_cart', getCurrentSelection());
    } else if (e.target.classList.contains('request-quote-btn')) {
        trackUserInteraction('request_quote', getCurrentSelection());
    }
});

// Console welcome message for developers
console.log('%c🏭 Alkathene Product Page Loaded! 🏭', 'color: #f4e942; font-size: 16px; font-weight: bold;');
console.log('%cProduct functions available via window.AlkatheneProduct', 'color: #666; font-size: 12px;');
console.log('%cUse AlkatheneProduct.showProductSummary() to see current selection', 'color: #666; font-size: 12px;'); 

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all product page functionality
    initializeAlkathenePage();
});

// Global variables
let selectedSize = '1/2'; // Default selected size
let selectedLength = '100'; // Default selected length (100 feet)
let currentQuantity = 1;

// Initialize all functionality
function initializeAlkathenePage() {
    setupSizeSelection();
    setupLengthSelection();
    setupQuantityControls();
    setupFormValidation();
    setupImageErrorHandling();
    setupContactNumbers();
    preloadContent();
    updateSpecificationHighlight();
}

// Size selection functionality
function setupSizeSelection() {
    const sizeButtons = document.querySelectorAll('.size-btn');
    
    sizeButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            sizeButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Update selected size
            selectedSize = this.dataset.size;
            
            console.log('Selected size:', selectedSize);
            
            // Update specifications highlight
            updateSpecificationHighlight();
            
            // Update product info based on selection
            updateProductInfo();
        });
    });
}

// Length selection functionality
function setupLengthSelection() {
    const lengthButtons = document.querySelectorAll('.length-btn');
    
    lengthButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            lengthButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Update selected length
            selectedLength = this.dataset.length;
            
            console.log('Selected length:', selectedLength);
            
            // Update specifications highlight
            updateSpecificationHighlight();
            
            // Update product info based on selection
            updateProductInfo();
        });
    });
}

// Quantity controls
function setupQuantityControls() {
    const quantityInput = document.getElementById('quantity');
    
    // Input validation
    if (quantityInput) {
        quantityInput.addEventListener('input', function() {
            validateQuantityInput(this);
        });
        
        quantityInput.addEventListener('blur', function() {
            if (this.value === '' || this.value < 1) {
                this.value = 1;
            }
            currentQuantity = parseInt(this.value);
        });
    }
}

// Quantity management functions
function increaseQuantity() {
    const quantityInput = document.getElementById('quantity');
    if (quantityInput) {
        let currentValue = parseInt(quantityInput.value) || 1;
        if (currentValue < 100) {
            currentValue++;
            quantityInput.value = currentValue;
            currentQuantity = currentValue;
            updateQuantityDisplay();
        }
    }
}

function decreaseQuantity() {
    const quantityInput = document.getElementById('quantity');
    if (quantityInput) {
        let currentValue = parseInt(quantityInput.value) || 1;
        if (currentValue > 1) {
            currentValue--;
            quantityInput.value = currentValue;
            currentQuantity = currentValue;
            updateQuantityDisplay();
        }
    }
}

// Validate quantity input
function validateQuantityInput(input) {
    let value = parseInt(input.value);
    
    if (isNaN(value) || value < 1) {
        input.value = 1;
        value = 1;
    } else if (value > 100) {
        input.value = 100;
        value = 100;
    }
    
    currentQuantity = value;
    updateQuantityDisplay();
}

// Update quantity display
function updateQuantityDisplay() {
    console.log('Quantity updated to:', currentQuantity);
    // Can be used to update pricing or other UI elements
}

// Update specifications table highlighting
function updateSpecificationHighlight() {
    const specRows = document.querySelectorAll('.specs-table tbody tr');
    
    // Remove all highlights
    specRows.forEach(row => row.classList.remove('highlighted'));
    
    // Find and highlight matching rows
    specRows.forEach(row => {
        const sizeCell = row.querySelector('td[rowspan], td:first-child');
        const lengthCell = row.querySelector('td:nth-child(2), td:nth-child(1)');
        
        if (sizeCell && lengthCell) {
            const rowSize = sizeCell.textContent.trim();
            const rowLength = lengthCell.textContent.trim();
            
            // Check if this row matches current selection
            if (rowSize === selectedSize && rowLength === `${selectedLength}'-0"`) {
                row.classList.add('highlighted');
            }
        }
    });
}

// Update product information based on selection
function updateProductInfo() {
    // Calculate metrics in meters
    const lengthInMeters = selectedLength === '100' ? 30 : 60;
    
    console.log(`Selected: ${selectedSize}" diameter, ${selectedLength}' length (${lengthInMeters}m)`);
    
    // Update any dynamic content based on selection
    updatePricing(); // If pricing is dynamic
}

// Update pricing (placeholder function)
function updatePricing() {
    // This function can be used to update pricing based on size and length
    // Example pricing logic could go here
    console.log('Updating pricing for:', {
        size: selectedSize,
        length: selectedLength,
        quantity: currentQuantity
    });
}

// Enhanced add to cart function
function addToCart() {
    // Validate selection
    if (!validateSelection()) {
        return;
    }
    
    const button = document.querySelector('.add-to-cart-btn');
    const originalText = button.innerHTML;
    
    // Add loading state
    button.classList.add('loading');
    button.disabled = true;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding...';
    
    // Simulate API call
    setTimeout(() => {
        button.classList.remove('loading');
        button.classList.add('success');
        button.innerHTML = '<i class="fas fa-check"></i> Added to Cart!';
        
        // Show success notification
        const lengthText = selectedLength === '100' ? '100\'-0"' : '200\'-0"';
        showNotification(
            `Added ${currentQuantity}x Alkathene Pipe (${selectedSize}" × ${lengthText}) to cart!`, 
            'success'
        );
        
        // Reset button after 3 seconds
        setTimeout(() => {
            button.classList.remove('success');
            button.disabled = false;
            button.innerHTML = originalText;
        }, 3000);
        
        // Update cart UI
        updateCartUI();
        
    }, 1500);
}

// Request quote function
function requestQuote() {
    // Validate selection
    if (!validateSelection()) {
        return;
    }
    
    const productName = 'Parama Plastic Pallets';
    const lengthText = selectedLength === '100' ? '100\'-0"' : '200\'-0"';
    const lengthMeters = selectedLength === '100' ? '30m' : '60m';
    
    const message = `Hello! I would like to request a quote for:

Product: ${productName}
Size: ${selectedSize}" diameter
Length: ${lengthText} (${lengthMeters})
Quantity: ${currentQuantity} pieces

Please provide pricing, availability, and delivery information.

Thank you!`;
    
    const whatsappUrl = `https://wa.me/94718393764?text=${encodeURIComponent(message)}`;
    
    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank');
    
    // Show confirmation
    showNotification('Quote request sent via WhatsApp!', 'info');
}

// Call number function
function callNumber(number) {
    // Clean the number for tel: link
    const cleanNumber = number.replace(/\s/g, '');
    window.location.href = `tel:${cleanNumber}`;
}

// Validation functions
function validateSelection() {
    if (!selectedSize) {
        showNotification('Please select a pipe diameter', 'error');
        highlightError('.size-btn');
        return false;
    }
    
    if (!selectedLength) {
        showNotification('Please select a length', 'error');
        highlightError('.length-btn');
        return false;
    }
    
    if (!currentQuantity || currentQuantity < 1) {
        showNotification('Please enter a valid quantity', 'error');
        highlightError('#quantity');
        return false;
    }
    
    return true;
}

// Highlight error elements
function highlightError(selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
        el.classList.add('error');
        setTimeout(() => el.classList.remove('error'), 3000);
    });
}

// Form validation setup
function setupFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!validateForm(this)) {
                e.preventDefault();
            }
        });
    });
}

// Generic form validation
function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            showFieldError(field, 'This field is required');
            isValid = false;
        } else {
            clearFieldError(field);
        }
    });
    
    return isValid;
}

// Show field error
function showFieldError(field, message) {
    field.classList.add('error');
    
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add new error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
}

// Clear field error
function clearFieldError(field) {
    field.classList.remove('error');
    const errorMessage = field.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

// Contact number setup
function setupContactNumbers() {
    const contactNumbers = document.querySelectorAll('.contact-number');
    
    contactNumbers.forEach(number => {
        number.addEventListener('click', function() {
            const phoneNumber = this.textContent.trim();
            callNumber(phoneNumber);
        });
        
        // Add hover effects
        number.addEventListener('mouseenter', function() {
            this.style.textDecoration = 'underline';
        });
        
        number.addEventListener('mouseleave', function() {
            this.style.textDecoration = 'none';
        });
    });
}

// Image error handling
function setupImageErrorHandling() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        img.addEventListener('error', function() {
            console.log('Image failed to load:', this.src);
        });
        
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
    });
}

// Notification system
function showNotification(message, type = 'info') {
    // Check if we can use the global notification system
    if (window.ParamaSolutions && window.ParamaSolutions.showNotification) {
        window.ParamaSolutions.showNotification(message, type);
        return;
    }
    
    // Fallback to custom notification
    createCustomNotification(message, type);
}

// Custom notification system
function createCustomNotification(message, type) {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.custom-notification');
    existingNotifications.forEach(notif => notif.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `custom-notification notification-${type}`;
    
    // Set styles based on type
    const colors = {
        success: '#28a745',
        error: '#dc3545',
        info: '#17a2b8',
        warning: '#ffc107'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type] || colors.info};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        max-width: 350px;
        font-size: 14px;
        font-weight: 500;
    `;
    
    notification.textContent = message;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Update cart UI (placeholder function)
function updateCartUI() {
    console.log('Cart updated');
    
    // Example: Update cart badge count
    const cartBadge = document.querySelector('.cart-badge');
    if (cartBadge) {
        let currentCount = parseInt(cartBadge.textContent) || 0;
        cartBadge.textContent = currentCount + currentQuantity;
    }
}

// Preload content for better performance
function preloadContent() {
    const imagesToPreload = [
        // Add image URLs that should be preloaded
    ];
    
    imagesToPreload.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Get current product selection
function getCurrentSelection() {
    const lengthText = selectedLength === '100' ? '100\'-0"' : '200\'-0"';
    const lengthMeters = selectedLength === '100' ? '30m' : '60m';
    
    return {
        product: 'Parama Plastic Pallets',
        size: selectedSize,
        length: lengthText,
        lengthMeters: lengthMeters,
        quantity: currentQuantity,
        timestamp: new Date().toISOString()
    };
}

// Save selection to local storage
function saveSelection() {
    try {
        const selection = getCurrentSelection();
        localStorage.setItem('alkathene_selection', JSON.stringify(selection));
    } catch (e) {
        console.log('Could not save selection to localStorage');
    }
}

// Load selection from local storage
function loadSelection() {
    try {
        const saved = localStorage.getItem('alkathene_selection');
        if (saved) {
            const selection = JSON.parse(saved);
            
            // Restore size selection
            if (selection.size) {
                const sizeButton = document.querySelector(`[data-size="${selection.size}"]`);
                if (sizeButton) {
                    sizeButton.click();
                }
            }
            
            // Restore length selection
            if (selection.lengthMeters) {
                const length = selection.lengthMeters === '30m' ? '100' : '200';
                const lengthButton = document.querySelector(`[data-length="${length}"]`);
                if (lengthButton) {
                    lengthButton.click();
                }
            }
            
            // Restore quantity
            if (selection.quantity) {
                const quantityInput = document.getElementById('quantity');
                if (quantityInput) {
                    quantityInput.value = selection.quantity;
                    currentQuantity = selection.quantity;
                }
            }
        }
    } catch (e) {
        console.log('Could not load selection from localStorage');
    }
}

//