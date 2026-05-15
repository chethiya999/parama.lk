// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Counter animation for stats
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        counters.forEach(counter => {
            const target = counter.textContent;
            const numericTarget = parseInt(target.replace(/[^0-9]/g, ''));
            let current = 0;
            const increment = numericTarget / 100;
            const timer = setInterval(() => {
                current += increment;
                if (current >= numericTarget) {
                    counter.textContent = target;
                    clearInterval(timer);
                } else {
                    const displayValue = Math.floor(current);
                    if (target.includes('K')) {
                        counter.textContent = Math.floor(displayValue / 1000) + 'K+';
                    } else if (target.includes('%')) {
                        counter.textContent = displayValue + '%';
                    } else if (target.includes('/')) {
                        counter.textContent = target;
                    } else if (target.includes('+')) {
                        counter.textContent = displayValue + '+';
                    } else {
                        counter.textContent = displayValue;
                    }
                }
            }, 50);
        });
    }

    // Intersection Observer for stats animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                observer.unobserve(entry.target);
            }
        });
    });

    // Initialize observer for stats section
    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        observer.observe(statsSection);
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Enhanced animations for value items
    const valueItems = document.querySelectorAll('.value-item');
    const valueObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 150);
                valueObserver.unobserve(entry.target);
            }
        });
    });

    valueItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        valueObserver.observe(item);
    });

    // Enhanced animations for team cards
    const teamCards = document.querySelectorAll('.team-card');
    const teamObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 200);
                teamObserver.unobserve(entry.target);
            }
        });
    });

    teamCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        teamObserver.observe(card);
    });

    // Enhanced animations for subsidiary cards
    const subsidiaryCards = document.querySelectorAll('.subsidiary-card');
    const subsidiaryObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 150);
                subsidiaryObserver.unobserve(entry.target);
            }
        });
    });

    subsidiaryCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        subsidiaryObserver.observe(card);
    });

    // Mission and Vision card animations
    const mvCards = document.querySelectorAll('.mv-card');
    const mvObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 300);
                mvObserver.unobserve(entry.target);
            }
        });
    });

    mvCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(40px)';
        card.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        mvObserver.observe(card);
    });

    // Enhanced animations for director message section
    const directorSection = document.querySelector('.director-message');
    const directorObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const directorImage = entry.target.querySelector('.director-image');
                const directorText = entry.target.querySelector('.director-text');
                
                if (directorImage) {
                    setTimeout(() => {
                        directorImage.style.opacity = '1';
                        directorImage.style.transform = 'translateX(0)';
                    }, 200);
                }
                
                if (directorText) {
                    setTimeout(() => {
                        directorText.style.opacity = '1';
                        directorText.style.transform = 'translateX(0)';
                    }, 400);
                }
                
                directorObserver.unobserve(entry.target);
            }
        });
    });

    if (directorSection) {
        const directorImage = directorSection.querySelector('.director-image');
        const directorText = directorSection.querySelector('.director-text');
        
        if (directorImage) {
            directorImage.style.opacity = '0';
            directorImage.style.transform = 'translateX(-50px)';
            directorImage.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        }
        
        if (directorText) {
            directorText.style.opacity = '0';
            directorText.style.transform = 'translateX(50px)';
            directorText.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        }
        
        directorObserver.observe(directorSection);
    }

    // Enhanced animations for message content paragraphs
    const messageParagraphs = document.querySelectorAll('.message-content p');
    const messageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                messageObserver.unobserve(entry.target);
            }
        });
    });

    messageParagraphs.forEach(p => {
        p.style.opacity = '0';
        p.style.transform = 'translateY(20px)';
        p.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        messageObserver.observe(p);
    });
    const interactiveElements = document.querySelectorAll('.subsidiary-card, .team-card, .value-item, .mv-card');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Enhanced hover effects for interactive elements
    const logoImages = document.querySelectorAll('.subsidiary-logo img');
    logoImages.forEach(img => {
        img.addEventListener('error', function() {
            this.style.display = 'none';
            this.nextElementSibling.style.display = 'flex';
        });
    });

    // Navbar scroll effect
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.style.background = 'white';
            navbar.style.backdropFilter = 'none';
        }
        
        lastScrollTop = scrollTop;
    });

    // Parallax effect for hero section
    const heroSection = document.querySelector('.hero-section');
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        if (heroSection) {
            heroSection.style.transform = `translateY(${rate}px)`;
        }
    });

    // Contact info click handlers
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
    
    phoneLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Allow default behavior but add analytics or tracking if needed
            console.log('Phone clicked:', this.href);
        });
    });
    
    emailLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Allow default behavior but add analytics or tracking if needed
            console.log('Email clicked:', this.href);
        });
    });

    // CTA button enhancement
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Add ripple effect
            const ripple = document.createElement('span');
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(255, 255, 255, 0.6)';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'ripple 0.6s linear';
            ripple.style.left = '50%';
            ripple.style.top = '50%';
            ripple.style.width = '20px';
            ripple.style.height = '20px';
            ripple.style.marginLeft = '-10px';
            ripple.style.marginTop = '-10px';
            
            this.style.position = 'relative';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
            
            // Scroll to contact section or handle CTA action
            const contactSection = document.querySelector('#contact') || document.querySelector('.footer');
            if (contactSection) {
                contactSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }

    // Add CSS for ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Performance optimization: Lazy loading for images
    const images = document.querySelectorAll('img');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => {
        imageObserver.observe(img);
    });

    // Console welcome message
    console.log('%c🌟 Welcome to PARAMA Industries! 🌟', 'color: #f4d03f; font-size: 18px; font-weight: bold;');
    console.log('%cSustainable Industrial Solutions for a Better Tomorrow', 'color: #5a5a5a; font-size: 14px;');
    
});

// Utility functions
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

// Export functions for potential external use
window.PARAMAAbout = {
    animateCounters: function() {
        const counters = document.querySelectorAll('.stat-number');
        // Re-run counter animation if needed
        counters.forEach(counter => {
            counter.textContent = '0';
        });
        setTimeout(() => {
            animateCounters();
        }, 100);
    }
};