// Main JavaScript for Parama Solutions website

// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu functionality
    function createMobileMenu() {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const navLinks = document.querySelector('.nav-links');
        
        if (mobileMenuBtn && navLinks) {
            mobileMenuBtn.addEventListener('click', () => {
                navLinks.classList.toggle('open');
                
                // Change icon based on menu state
                const icon = mobileMenuBtn.querySelector('i');
                if (navLinks.classList.contains('open')) {
                    icon.className = 'fas fa-times';
                } else {
                    icon.className = 'fas fa-bars';
                }
            });
        }
    }
    
    // Navbar scroll effect
    function handleScroll() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    
    // Counter animation function
    function startCounters() {
        const counters = document.querySelectorAll('.counter');
        const speed = 200; // The lower the value, the faster the animation
        
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const increment = target / speed;
            
            const updateCount = () => {
                const count = +counter.innerText;
                if (count < target) {
                    counter.innerText = Math.ceil(count + increment);
                    setTimeout(updateCount, 1);
                } else {
                    counter.innerText = target;
                }
            };
            
            updateCount();
        });
    }
    
    // Intersection Observer for stats section animations
    function setupStatsAnimation() {
        const observerOptions = {
            threshold: 0.2 // Trigger when 20% of the element is visible
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add animation classes to stat items with staggered delay
                    document.querySelectorAll('.stat-item').forEach((item, index) => {
                        setTimeout(() => {
                            item.classList.add('animate__animated', item.dataset.animation);
                            item.style.opacity = 1;
                        }, index * 150);
                    });
                    
                    // Start the counters after a delay
                    setTimeout(startCounters, 500);
                    
                    // Unobserve once triggered
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // Observe the stats section
        const statSection = document.querySelector('.stats-section');
        if (statSection) {
            observer.observe(statSection);
        }
    }
    
    // Smooth scrolling for navigation links
    function setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                
                // Close mobile menu if open
                const navLinks = document.querySelector('.nav-links');
                const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
                if (navLinks && navLinks.classList.contains('open')) {
                    navLinks.classList.remove('open');
                    const icon = mobileMenuBtn.querySelector('i');
                    if (icon) icon.className = 'fas fa-bars';
                }
                
                // Active link highlighting
                document.querySelectorAll('.nav-links a').forEach(link => {
                    link.classList.remove('active');
                });
                this.classList.add('active');
                
                // Smooth scroll to target
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 70, // Adjust for navbar height
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    // Button hover effects
    function setupButtonEffects() {
        const buttons = document.querySelectorAll('.quote-btn, .about-btn');
        
        buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                button.style.transform = 'translateY(-3px)';
                button.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translateY(0)';
                button.style.boxShadow = 'none';
            });
        });
    }
    
    // Subscribe form functionality
    function setupSubscribeForm() {
        const subscribeForm = document.getElementById('subscribe-form');
        if (subscribeForm) {
            subscribeForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const fullname = document.getElementById('fullname').value;
                const email = document.getElementById('email').value;
                
                if (fullname && email) {
                    // Show success message
                    alert('Thank you for subscribing! We will keep you updated with our latest news and services.');
                    
                    // Reset form
                    subscribeForm.reset();
                    
                    // Optional: You can replace alert with a custom notification
                    // showNotification('Thank you for subscribing!', 'success');
                }
            });
        }
    }
    
    // Preload images for smoother experience
    function preloadImages() {
        const imagesToPreload = [
            'images/worker-image.jpg',
            'images/stats-image.jpg',
            'images/logo/logo.png',
            'images/logo.png'
        ];
        
        imagesToPreload.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }
    
    // Handle image loading errors gracefully
    function setupImageErrorHandling() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            img.addEventListener('error', function() {
                console.log('Image failed to load:', this.src);
                // The onerror in HTML will handle the placeholder display
            });
        });
    }
    
    // Dropdown functionality for mobile
    function setupMobileDropdowns() {
        const dropdowns = document.querySelectorAll('.dropdown');
        
        dropdowns.forEach(dropdown => {
            const dropdownLink = dropdown.querySelector('a');
            const dropdownContent = dropdown.querySelector('.dropdown-content');
            
            if (window.innerWidth <= 768 && dropdownLink && dropdownContent) {
                dropdownLink.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    // Toggle dropdown content visibility
                    if (dropdownContent.style.display === 'block') {
                        dropdownContent.style.display = 'none';
                    } else {
                        // Close other dropdowns first
                        document.querySelectorAll('.dropdown-content').forEach(content => {
                            content.style.display = 'none';
                        });
                        dropdownContent.style.display = 'block';
                    }
                });
            }
        });
    }
    
    // Active navigation highlighting based on scroll position
    function setupActiveNavigation() {
        const sections = document.querySelectorAll('section, .hero, .stats-section');
        const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
        
        function highlightNavigation() {
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                
                if (window.scrollY >= (sectionTop - 200)) {
                    current = section.getAttribute('id') || '';
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        }
        
        window.addEventListener('scroll', highlightNavigation);
    }
    
    // Custom notification function (alternative to alert)
    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#28a745' : '#007bff'};
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            z-index: 10000;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        `;
        notification.textContent = message;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // Initialize all functions
    function init() {
        createMobileMenu();
        setupStatsAnimation();
        setupSmoothScrolling();
        setupButtonEffects();
        setupSubscribeForm();
        preloadImages();
        setupImageErrorHandling();
        setupMobileDropdowns();
        setupActiveNavigation();
        
        // Event listeners
        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', () => {
            // Close mobile menu on resize
            const navLinks = document.querySelector('.nav-links');
            const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
            if (navLinks && navLinks.classList.contains('open')) {
                navLinks.classList.remove('open');
                const icon = mobileMenuBtn.querySelector('i');
                if (icon) icon.className = 'fas fa-bars';
            }
            
            // Reinitialize mobile dropdowns
            setupMobileDropdowns();
        });
    }
    
    // Run initialization
    init();
    
    // Export functions for external use (optional)
    window.ParamaSolutions = {
        showNotification,
        startCounters,
        setupMobileDropdowns
    };
});

// Additional utility functions

// Function to validate email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Function to format phone numbers
function formatPhoneNumber(phoneNumber) {
    const cleaned = phoneNumber.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{2})(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return '+' + match[1] + ' ' + match[2] + ' ' + match[3] + ' ' + match[4];
    }
    return phoneNumber;
}

// Function to handle contact form submissions (can be extended)
function handleContactForm(formData) {
    // This function can be extended to handle contact form submissions
    console.log('Contact form data:', formData);
    
    // Example: Send data to server
    // fetch('/contact', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(formData)
    // });
}
    // Parallax effect for hero section
    const heroSection = document.querySelector('.hero-section');
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        if (heroSection) {
            heroSection.style.transform = `translateY(${rate}px)`;
        }
    });
    
// Function to get current page section
function getCurrentSection() {
    const sections = document.querySelectorAll('section, .hero, .stats-section');
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id') || section.className;
        }
    });
    
    return current;
}

// Console welcome message
console.log('%c🌱 Welcome to Parama Solutions! 🌱', 'color: #28a745; font-size: 16px; font-weight: bold;');
console.log('%cInnovating for a Greener Tomorrow!', 'color: #ffc107; font-size: 14px;');