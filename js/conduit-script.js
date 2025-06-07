// Electronic Conduit Product Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all product page functionality
    initializeProductPage();
});

// Global variables
let selectedSize = '1/2'; // Default selected size
let currentQuantity = 1;

// Initialize all functionality
function initializeProductPage() {
    setupSizeSelection();
    setupQuantityControls();
    setupFormValidation();
    setupImageErrorHandling();
    setupContactNumbers();
    preloadContent();
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
            
            // Optional: Update display or pricing based on size
            updateProductInfo(selectedSize);
        });
    });
}

// Quantity controls
function setupQuantityControls() {
    const quantityInput = document.getElementById('quantity');
    const decreaseBtn = document.querySelector('.quantity-btn[onclick="decreaseQuantity()"]');
    const increaseBtn = document.querySelector('.quantity-btn[onclick="increaseQuantity()"]');
    
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

// Update quantity display (if needed for other UI elements)
function updateQuantityDisplay() {
    // Can be used to update other parts of the UI based on quantity
    console.log('Quantity updated to:', currentQuantity);
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
        showNotification(
            `Added ${currentQuantity}x Electronic Conduit (${selectedSize}") to cart!`, 
            'success'
        );
        
        // Reset button after 3 seconds
        setTimeout(() => {
            button.classList.remove('success');
            button.disabled = false;
            button.innerHTML = originalText;
        }, 3000);
        
        // Optional: Update cart count or other UI elements
        updateCartUI();
        
    }, 1500);
}

// Request quote function
function requestQuote() {
    // Validate selection
    if (!validateSelection()) {
        return;
    }
    
    const productName = 'Parama Electronic Conduit';
    const message = `Hello! I would like to request a quote for:
    
Product: ${productName}
Size: ${selectedSize}"
Quantity: ${currentQuantity} pieces

Please provide pricing and availability information.

Thank you!`;
    
    const whatsappUrl = `https://wa.me/94777898445?text=${encodeURIComponent(message)}`;
    
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
        return false;
    }
    
    if (!currentQuantity || currentQuantity < 1) {
        showNotification('Please enter a valid quantity', 'error');
        return false;
    }
    
    return true;
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
    errorDiv.style.cssText = 'color: #dc3545; font-size: 12px; margin-top: 5px;';
    
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

// Update product info based on size
function updateProductInfo(size) {
    // This function can be used to update pricing, specifications, or other
    // product information based on the selected size
    console.log('Updating product info for size:', size);
    
    // Example: Update specifications table highlight
    highlightSpecificationRow(size);
}

// Highlight specification table row
function highlightSpecificationRow(size) {
    const specRows = document.querySelectorAll('.specs-table tbody tr');
    
    specRows.forEach(row => {
        row.classList.remove('highlighted');
        const sizeCell = row.querySelector('td:first-child');
        if (sizeCell && sizeCell.textContent.trim() === size) {
            row.classList.add('highlighted');
        }
    });
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
            // The onerror attribute in HTML will handle the placeholder display
        });
        
        img.addEventListener('load', function() {
            // Image loaded successfully
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
        border-radius: 5px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 10000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        max-width: 300px;
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
    // This function can be used to update cart counters or other UI elements
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
    // Preload any additional images or content
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
    return {
        product: 'Parama Electronic Conduit',
        size: selectedSize,
        quantity: currentQuantity,
        timestamp: new Date().toISOString()
    };
}

// Save selection to local storage (optional)
function saveSelection() {
    try {
        const selection = getCurrentSelection();
        localStorage.setItem('conduit_selection', JSON.stringify(selection));
    } catch (e) {
        console.log('Could not save selection to localStorage');
    }
}

// Load selection from local storage (optional)
function loadSelection() {
    try {
        const saved = localStorage.getItem('conduit_selection');
        if (saved) {
            const selection = JSON.parse(saved);
            
            // Restore size selection
            if (selection.size) {
                const sizeButton = document.querySelector(`[data-size="${selection.size}"]`);
                if (sizeButton) {
                    sizeButton.click();
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

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    // Escape key to close notifications
    if (e.key === 'Escape') {
        const notifications = document.querySelectorAll('.custom-notification');
        notifications.forEach(notif => notif.remove());
    }
    
    // Enter key on buttons
    if (e.key === 'Enter' && e.target.classList.contains('size-btn')) {
        e.target.click();
    }
});

// Export functions for external use
window.ConduitProduct = {
    addToCart,
    requestQuote,
    callNumber,
    increaseQuantity,
    decreaseQuantity,
    getCurrentSelection,
    showNotification
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Load any saved selection
    loadSelection();
    
    // Save selection when it changes
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('size-btn') || 
            e.target.classList.contains('quantity-btn')) {
            setTimeout(saveSelection, 100);
        }
    });
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

// Console welcome message for developers
console.log('%c🔌 Electronic Conduit Product Page Loaded! 🔌', 'color: #f4e942; font-size: 16px; font-weight: bold;');
console.log('%cProduct functions available via window.ConduitProduct', 'color: #666; font-size: 12px;');