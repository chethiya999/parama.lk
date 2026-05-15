// About Us Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all about page functionality
    initializeAboutPage();
});

// Initialize all functionality
function initializeAboutPage() {
    setupScrollAnimations();
    setupCounterAnimations();
    setupSmoothScrolling();
    setupImageErrorHandling();
    setupParallaxEffects();
    setupFormHandling();
    preloadImages();
}

// Smooth scrolling for read more button
function setupSmoothScrolling() {
    const readMoreBtn = document.querySelector('.read-more-btn');
    
    if (readMoreBtn) {
        readMoreBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Account for navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    }
}

// Counter animations for statistics
function setupCounterAnimations() {
    const statNumbers = document.querySelectorAll('.stat-number');
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });
}

// Animate individual counter
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60fps
    let current = 0;
    
    const updateCounter = () => {
        current += increment;
        
        if (current < target) {
            element.textContent = Math.floor(current).toLocaleString();
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target.toLocaleString();
        }
    };
    
    updateCounter();
}

// Scroll animations for elements
function setupScrollAnimations() {
    const animatedElements = document.querySelectorAll('.value-item, .partner-item, .message-content, .director-image');
    
    // Add animation classes
    animatedElements.forEach((element, index) => {
        element.classList.add('animate-on-scroll');
        if (index % 3 === 1) element.classList.add('delay-1');
        if (index % 3 === 2) element.classList.add('delay-2');
    });
    
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                scrollObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(element => {
        scrollObserver.observe(element);
    });
}

// Parallax effects for header background
function setupParallaxEffects() {
    const headerBackground = document.querySelector('.header-background');
    
    if (headerBackground) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallax = scrolled * 0.3;
            
            headerBackground.style.transform = `translateY(${parallax}px)`;
        });
    }
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
            this.style.opacity = '1';
        });
    });
}

// Form handling for newsletter subscription
function setupFormHandling() {
    const subscribeForm = document.getElementById('subscribe-form');
    
    if (subscribeForm) {
        subscribeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const fullname = formData.get('fullname') || document.getElementById('fullname').value;
            const email = formData.get('email') || document.getElementById('email').value;
            
            if (validateForm(fullname, email)) {
                handleSubscription(fullname, email);
            }
        });
    }
}

// Form validation
function validateForm(fullname, email) {
    if (!fullname || fullname.trim().length < 2) {
        showNotification('Please enter a valid full name', 'error');
        return false;
    }
    
    if (!email || !isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return false;
    }
    
    return true;
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Handle subscription
function handleSubscription(fullname, email) {
    // Show loading state
    const submitBtn = document.querySelector('.subscribe-btn');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Reset form
        document.getElementById('subscribe-form').reset();
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Show success message
        showNotification(`Thank you ${fullname}! You've been subscribed to our newsletter.`, 'success');
        
        // Optional: Track subscription
        trackEvent('newsletter_subscription', {
            name: fullname,
            email: email
        });
        
    }, 2000);
}

// Notification system
function showNotification(message, type = 'info') {
    // Check if global notification system exists
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
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Preload images for better performance
function preloadImages() {
    const imagesToPreload = [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face'
    ];
    
    imagesToPreload.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Track events (placeholder for analytics)
function trackEvent(eventName, eventData) {
    console.log('Event tracked:', eventName, eventData);
    
    // Example: Google Analytics
    // if (typeof gtag !== 'undefined') {
    //     gtag('event', eventName, eventData);
    // }
    
    // Example: Custom analytics
    // if (typeof customAnalytics !== 'undefined') {
    //     customAnalytics.track(eventName, eventData);
    // }
}

// Scroll progress indicator
function setupScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #ffc107, #e6a800);
        z-index: 10001;
        transition: width 0.1s ease;
    `;
    
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        
        progressBar.style.width = scrolled + '%';
    });
}

// Team member interaction (if team section is added)
function setupTeamInteractions() {
    const teamMembers = document.querySelectorAll('.team-member');
    
    teamMembers.forEach(member => {
        member.addEventListener('click', function() {
            const memberData = {
                name: this.querySelector('.member-name')?.textContent,
                position: this.querySelector('.member-position')?.textContent,
                bio: this.querySelector('.member-bio')?.textContent
            };
            
            showMemberModal(memberData);
        });
    });
}

// Show member modal (placeholder)
function showMemberModal(memberData) {
    console.log('Show member modal:', memberData);
    // Implementation for team member modal would go here
}

// Lazy loading for images
function setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Accessibility improvements
function setupAccessibility() {
    // Add skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: #ffc107;
        color: #333;
        padding: 8px;
        text-decoration: none;
        z-index: 10002;
        border-radius: 4px;
        font-weight: bold;
    `;
    
    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main content landmark
    const mainContent = document.querySelector('.about-page-container');
    if (mainContent) {
        mainContent.id = 'main-content';
        mainContent.setAttribute('role', 'main');
    }
}

// Performance monitoring
function logPerformanceMetrics() {
    if (window.performance && window.performance.timing) {
        const timing = window.performance.timing;
        const loadTime = timing.loadEventEnd - timing.navigationStart;
        console.log(`About page load time: ${loadTime}ms`);
        
        // Track performance
        trackEvent('page_performance', {
            page: 'about',
            loadTime: loadTime
        });
    }
}

// Initialize additional features on page load
document.addEventListener('DOMContentLoaded', function() {
    setupScrollProgress();
    setupLazyLoading();
    setupAccessibility();
    
    // Log performance after page fully loads
    window.addEventListener('load', () => {
        setTimeout(logPerformanceMetrics, 1000);
    });
});

// Handle page visibility changes
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Page is hidden - pause animations, etc.
        console.log('About page is now hidden');
    } else {
        // Page is visible - resume animations, etc.
        console.log('About page is now visible');
    }
});

// Export functions for external use
window.AboutPage = {
    showNotification,
    trackEvent,
    animateCounter,
    showMemberModal
};

// Console welcome message for developers
console.log('%c👥 About Us Page Loaded! 👥', 'color: #ffc107; font-size: 16px; font-weight: bold;');
console.log('%cPage functions available via window.AboutPage', 'color: #666; font-size: 12px;');