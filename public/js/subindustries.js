/**
 * PARAMA Subsidiaries JavaScript
 * Handles filtering, animations, and interactions
 */

// Company data
const companies = [
    {
        name: 'PARAMA Garden Hose',
        category: 'manufacturing',
        description: 'Premium garden hoses and outdoor watering solutions for residential and commercial use.',
        website: 'https://paramagardenhose.com'
    },
    {
        name: 'PARAMA Plastic Recycle',
        category: 'recycling',
        description: 'Environmental plastic recycling and sustainable waste management solutions.',
        website: 'https://paramarecycle.com'
    },
    {
        name: 'PARAMA Alkathene',
        category: 'chemicals',
        description: 'Specialized alkathene and polymer manufacturing for industrial applications.',
        website: 'https://paramaalkathene.com'
    },
    {
        name: 'WAYBRIDGE PARAMA',
        category: 'technology',
        description: 'Advanced bridge technology and infrastructure solutions for modern transportation.',
        website: 'https://waybridge.com'
    }
];

// DOM elements
let filterButtons = [];
let logoCards = [];
let currentFilter = 'all';

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

/**
 * Initialize the application
 */
function initializeApp() {
    // Get DOM elements
    filterButtons = document.querySelectorAll('.filter-btn');
    logoCards = document.querySelectorAll('.logo-card');
    
    // Setup event listeners
    setupEventListeners();
    
    // Add fade-in animation to cards
    animateCardsOnLoad();
    
    // Initialize accessibility
    initializeAccessibility();
    
    console.log('PARAMA Subsidiaries app initialized');
}

/**
 * Setup all event listeners
 */
function setupEventListeners() {
    // Filter button listeners
    filterButtons.forEach(btn => {
        btn.addEventListener('click', handleFilterClick);
        btn.addEventListener('keydown', handleFilterKeydown);
    });
    
    // Card hover effects
    logoCards.forEach(card => {
        card.addEventListener('mouseenter', handleCardHover);
        card.addEventListener('mouseleave', handleCardLeave);
    });
    
    // Visit button listeners
    const visitButtons = document.querySelectorAll('.visit-btn');
    visitButtons.forEach(btn => {
        btn.addEventListener('keydown', handleVisitKeydown);
    });
}

/**
 * Handle filter button clicks
 */
function handleFilterClick(event) {
    const button = event.target;
    const category = button.dataset.category;
    
    // Update active state
    updateActiveFilter(button);
    
    // Filter companies
    filterCompanies(category);
    
    // Update current filter
    currentFilter = category;
    
    // Track event
    trackEvent('filter_click', {
        category: category,
        filter_name: button.textContent
    });
}

/**
 * Handle keyboard navigation for filter buttons
 */
function handleFilterKeydown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleFilterClick(event);
    }
}

/**
 * Handle keyboard navigation for visit buttons
 */
function handleVisitKeydown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        event.target.click();
    }
}

/**
 * Update active filter button
 */
function updateActiveFilter(activeButton) {
    // Remove active class from all buttons
    filterButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
    });
    
    // Add active class to clicked button
    activeButton.classList.add('active');
    activeButton.setAttribute('aria-pressed', 'true');
}

/**
 * Filter companies by category
 */
function filterCompanies(category) {
    logoCards.forEach(card => {
        const cardCategory = card.dataset.category;
        
        if (category === 'all' || cardCategory === category) {
            showCard(card);
        } else {
            hideCard(card);
        }
    });
    
    // Update accessibility
    updateAriaLabels(category);
}

/**
 * Show a company card
 */
function showCard(card) {
    card.classList.remove('hidden');
    card.style.display = 'block';
    card.setAttribute('aria-hidden', 'false');
    
    // Add animation
    setTimeout(() => {
        card.classList.add('fade-in');
    }, 50);
}

/**
 * Hide a company card
 */
function hideCard(card) {
    card.classList.add('hidden');
    card.setAttribute('aria-hidden', 'true');
    
    // Remove animation class
    card.classList.remove('fade-in');
    
    // Hide after transition
    setTimeout(() => {
        if (card.classList.contains('hidden')) {
            card.style.display = 'none';
        }
    }, 400);
}

/**
 * Update ARIA labels for accessibility
 */
function updateAriaLabels(category) {
    const visibleCount = document.querySelectorAll('.logo-card:not(.hidden)').length;
    const categoryText = category === 'all' ? 'all categories' : category;
    
    // Update grid aria-label
    const grid = document.getElementById('logosGrid');
    grid.setAttribute('aria-label', `Showing ${visibleCount} companies in ${categoryText}`);
}

/**
 * Handle card hover effects
 */
function handleCardHover(event) {
    const card = event.currentTarget;
    // Enhanced hover effect is now handled by CSS
}

/**
 * Handle card leave effects
 */
function handleCardLeave(event) {
    const card = event.currentTarget;
    // Enhanced hover effect is now handled by CSS
}

/**
 * Animate cards on initial load
 */
function animateCardsOnLoad() {
    logoCards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('fade-in');
        }, index * 150);
    });
}

/**
 * Visit company website
 */
function visitCompany(url) {
    if (!url || url === '#') {
        showNotification('Website URL not available', 'warning');
        return;
    }
    
    // Add loading state
    const button = event.target;
    const originalText = button.textContent;
    button.textContent = 'Opening...';
    button.classList.add('loading');
    
    // Get company name for tracking
    const card = button.closest('.logo-card');
    const companyName = card.querySelector('.company-name').textContent;
    
    // Track website visit
    trackWebsiteVisit(companyName, url);
    
    // Open URL
    try {
        window.open(url, '_blank', 'noopener,noreferrer');
    } catch (error) {
        console.error('Error opening website:', error);
        showNotification('Could not open website', 'error');
    }
    
    // Reset button state
    setTimeout(() => {
        button.textContent = originalText;
        button.classList.remove('loading');
    }, 1000);
}

/**
 * Show notification message
 */
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 24px;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        background: ${type === 'error' ? '#e74c3c' : type === 'warning' ? '#f39c12' : '#3498db'};
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

/**
 * Search companies by name or description
 */
function searchCompanies(searchTerm) {
    const term = searchTerm.toLowerCase().trim();
    
    if (!term) {
        // Show all companies in current filter
        filterCompanies(currentFilter);
        return;
    }
    
    logoCards.forEach(card => {
        const name = card.querySelector('.company-name').textContent.toLowerCase();
        const description = card.querySelector('.company-description').textContent.toLowerCase();
        const category = card.dataset.category.toLowerCase();
        
        const matches = name.includes(term) || 
                       description.includes(term) || 
                       category.includes(term);
        
        if (matches && (currentFilter === 'all' || card.dataset.category === currentFilter)) {
            showCard(card);
        } else {
            hideCard(card);
        }
    });
}

/**
 * Get company data by category
 */
function getCompaniesByCategory(category) {
    if (category === 'all') {
        return companies;
    }
    return companies.filter(company => company.category === category);
}

/**
 * Get visible companies count
 */
function getVisibleCompaniesCount() {
    return document.querySelectorAll('.logo-card:not(.hidden)').length;
}

/**
 * Keyboard navigation handler
 */
function handleKeyboardNavigation(event) {
    const focusableElements = document.querySelectorAll(
        '.filter-btn, .visit-btn, .logo-card'
    );
    const currentIndex = Array.from(focusableElements).indexOf(document.activeElement);
    
    switch (event.key) {
        case 'ArrowRight':
        case 'ArrowDown':
            event.preventDefault();
            const nextIndex = (currentIndex + 1) % focusableElements.length;
            focusableElements[nextIndex].focus();
            break;
            
        case 'ArrowLeft':
        case 'ArrowUp':
            event.preventDefault();
            const prevIndex = currentIndex === 0 ? focusableElements.length - 1 : currentIndex - 1;
            focusableElements[prevIndex].focus();
            break;
            
        case 'Home':
            event.preventDefault();
            focusableElements[0].focus();
            break;
            
        case 'End':
            event.preventDefault();
            focusableElements[focusableElements.length - 1].focus();
            break;
    }
}

/**
 * Initialize accessibility features
 */
function initializeAccessibility() {
    // Add ARIA labels
    const grid = document.getElementById('logosGrid');
    grid.setAttribute('role', 'grid');
    grid.setAttribute('aria-label', 'Company subsidiaries grid');
    
    // Add keyboard navigation
    document.addEventListener('keydown', handleKeyboardNavigation);
    
    // Set initial ARIA states
    filterButtons.forEach(btn => {
        btn.setAttribute('role', 'tab');
        btn.setAttribute('aria-pressed', btn.classList.contains('active') ? 'true' : 'false');
    });
    
    logoCards.forEach(card => {
        card.setAttribute('role', 'gridcell');
        card.setAttribute('tabindex', '0');
    });
}

/**
 * Performance optimization - debounce function
 */
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

/**
 * Handle window resize for responsive behavior
 */
function handleResize() {
    // Responsive behavior is now handled by CSS Grid
    // This function can be used for additional responsive logic if needed
}

// Debounced resize handler
const debouncedResize = debounce(handleResize, 250);

// Add resize listener
window.addEventListener('resize', debouncedResize);

/**
 * Export functions for external use
 */
window.PARAMA = {
    filterCompanies,
    searchCompanies,
    visitCompany,
    getCompaniesByCategory,
    getVisibleCompaniesCount,
    companies
};

// Analytics tracking (optional)
function trackEvent(eventName, eventData) {
    // Implement your analytics tracking here
    console.log('Event:', eventName, eventData);
    
    // Example: Google Analytics
    // if (typeof gtag !== 'undefined') {
    //     gtag('event', eventName, eventData);
    // }
}

// Track website visits
function trackWebsiteVisit(companyName, url) {
    trackEvent('website_visit', {
        company_name: companyName,
        website_url: url,
        timestamp: new Date().toISOString()
    });
}