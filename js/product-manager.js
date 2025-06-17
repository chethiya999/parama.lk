// ====================
// CONDUIT PAGE SPECIFIC SCRIPT
// Replace the existing <script> section in your conduit page with this
// ====================

// Enhanced product manager specifically for conduit page
class ConduitProductManager {
    constructor() {
        this.productName = 'Electronic Conduit';
        this.whatsappNumber = '94777898445';
        this.maxQuantity = 50;
        this.minQuantity = 1;
        this.init();
    }
    
    init() {
        this.setupEventListeners();
    }
    
    // ====================
    // QUANTITY MANAGEMENT
    // ====================
    
    increaseQuantity() {
        const quantityInput = document.getElementById('quantity');
        if (!quantityInput) return;
        
        let currentValue = parseInt(quantityInput.value) || this.minQuantity;
        if (currentValue < this.maxQuantity) {
            quantityInput.value = currentValue + 1;
        }
    }
    
    decreaseQuantity() {
        const quantityInput = document.getElementById('quantity');
        if (!quantityInput) return;
        
        let currentValue = parseInt(quantityInput.value) || this.minQuantity;
        if (currentValue > this.minQuantity) {
            quantityInput.value = currentValue - 1;
        }
    }
    
    // ====================
    // SELECTION MANAGEMENT
    // ====================
    
    getCurrentSelections() {
        const selections = {};
        
        // Get size (using your existing class names)
        const activeSize = document.querySelector('.size-btn.active');
        selections.size = activeSize ? activeSize.dataset.size || activeSize.textContent : null;
        
        // Get quantity
        const quantityInput = document.getElementById('quantity');
        selections.quantity = quantityInput ? parseInt(quantityInput.value) || 1 : 1;
        
        return selections;
    }
    
    // ====================
    // ADD TO CART FUNCTION
    // ====================
    
    addToCart() {
        const selections = this.getCurrentSelections();
        const button = document.querySelector('.add-to-cart-btn');
        
        if (!button) return;
        
        const originalText = button.innerHTML;
        
        // Validate selections
        if (!selections.size) {
            this.showNotification('Please select a size', 'error');
            return;
        }
        
        // Add loading state
        button.classList.add('loading');
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding...';
        button.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            button.classList.remove('loading');
            button.classList.add('success');
            button.innerHTML = '<i class="fas fa-check"></i> Added to Cart!';
            
            // Create success message
            let message = `Added ${selections.quantity}x ${this.productName}`;
            if (selections.size) message += ` (${selections.size}")`;
            message += ' to cart!';
            
            this.showNotification(message, 'success');
            
            // Store in localStorage
            this.storeCartItem(selections);
            
            // Reset button after 3 seconds
            setTimeout(() => {
                button.classList.remove('success');
                button.innerHTML = originalText;
                button.disabled = false;
            }, 3000);
            
        }, 1500);
    }
    
    // ====================
    // REQUEST QUOTE FUNCTION
    // ====================
    
    requestQuote() {
        const selections = this.getCurrentSelections();
        
        // Validate selections
        if (!selections.size) {
            this.showNotification('Please select a size before requesting a quote', 'error');
            return;
        }
        
        // Build WhatsApp message
        let message = `Hello! I would like to request a quote for:\n\n`;
        message += `Product: ${this.productName}\n`;
        message += `Quantity: ${selections.quantity}\n`;
        message += `Size: ${selections.size}"\n`;
        message += `\nPlease provide pricing, availability, and delivery information.\n\nThank you!`;
        
        const whatsappUrl = `https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    }
    
    // ====================
    // UTILITY FUNCTIONS
    // ====================
    
    showNotification(message, type = 'info') {
        // Check if custom notification system exists
        if (window.ParamaSolutions && window.ParamaSolutions.showNotification) {
            window.ParamaSolutions.showNotification(message, type);
        } else {
            // Create simple toast
            this.createToast(message, type);
        }
    }
    
    createToast(message, type) {
        // Remove existing toast
        const existingToast = document.querySelector('.conduit-toast');
        if (existingToast) existingToast.remove();
        
        // Create new toast
        const toast = document.createElement('div');
        toast.className = `conduit-toast conduit-toast-${type}`;
        toast.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Add styles
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#007bff'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 10px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 14px;
            font-weight: 500;
            max-width: 350px;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(toast);
        
        // Remove after 4 seconds
        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }
    
    storeCartItem(selections) {
        // Store cart item in localStorage
        let cart = JSON.parse(localStorage.getItem('paramaCart') || '[]');
        
        const cartItem = {
            id: Date.now(),
            productName: this.productName,
            quantity: selections.quantity,
            size: selections.size,
            timestamp: new Date().toISOString(),
            page: 'conduit'
        };
        
        cart.push(cartItem);
        localStorage.setItem('paramaCart', JSON.stringify(cart));
        
        // Update cart counter if exists
        this.updateCartCounter();
    }
    
    updateCartCounter() {
        const cart = JSON.parse(localStorage.getItem('paramaCart') || '[]');
        const cartCounters = document.querySelectorAll('.cart-counter');
        cartCounters.forEach(counter => {
            counter.textContent = cart.length;
            counter.style.display = cart.length > 0 ? 'block' : 'none';
        });
    }
    
    setupEventListeners() {
        // Size selection - using your existing class names
        document.querySelectorAll('.size-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                // Remove active from all size buttons
                document.querySelectorAll('.size-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                // Add active to clicked button
                e.target.classList.add('active');
            });
        });
    }
}

// ====================
// GLOBAL FUNCTIONS
// ====================

// Initialize the conduit manager
let conduitManager;

// Global functions for onclick handlers (keeping your existing structure)
function increaseQuantity() {
    if (conduitManager) conduitManager.increaseQuantity();
}

function decreaseQuantity() {
    if (conduitManager) conduitManager.decreaseQuantity();
}

function addToCart() {
    if (conduitManager) conduitManager.addToCart();
}

function requestQuote() {
    if (conduitManager) conduitManager.requestQuote();
}

function callNumber(number) {
    window.location.href = `tel:${number}`;
}

// ====================
// INITIALIZE ON PAGE LOAD
// ====================

document.addEventListener('DOMContentLoaded', function() {
    conduitManager = new ConduitProductManager();
    
    // Add CSS animations for toast
    if (!document.querySelector('#conduit-toast-styles')) {
        const style = document.createElement('style');
        style.id = 'conduit-toast-styles';
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
            
            .add-to-cart-btn.loading {
                opacity: 0.7;
                pointer-events: none;
            }
            
            .add-to-cart-btn.success {
                background-color: #28a745 !important;
                border-color: #28a745 !important;
            }
        `;
        document.head.appendChild(style);
    }
     
    // Quantity management
    function increaseQuantity() {
        const quantityInput = document.getElementById('quantity');
        let currentValue = parseInt(quantityInput.value);
        if (currentValue < 100) {
            quantityInput.value = currentValue + 1;
        }
    }
    
    function decreaseQuantity() {
        const quantityInput = document.getElementById('quantity');
        let currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
        }
    }
});