// Main JavaScript for Parama Solutions website

// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    const mqMobileNav = window.matchMedia('(max-width: 1023px)');

    function ensureNavBackdrop() {
        let el = document.querySelector('.nav-backdrop');
        if (!el) {
            el = document.createElement('button');
            el.type = 'button';
            el.className = 'nav-backdrop';
            el.setAttribute('aria-label', 'Close navigation menu');
            document.body.appendChild(el);
            el.addEventListener('click', closeNavMenu);
        }
        return el;
    }

    function closeNavMenu() {
        const navLinks = document.querySelector('.nav-links');
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        document.body.classList.remove('nav-menu-open');
        if (navLinks) navLinks.classList.remove('open');
        if (mobileMenuBtn) {
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) icon.className = 'fas fa-bars';
        }
        document.querySelectorAll('.dropdown.is-open').forEach(function (d) {
            d.classList.remove('is-open');
        });
    }

    function openNavMenu() {
        const navLinks = document.querySelector('.nav-links');
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        if (!navLinks || !mobileMenuBtn) return;
        if (!mqMobileNav.matches) return;
        ensureNavBackdrop();
        navLinks.classList.add('open');
        document.body.classList.add('nav-menu-open');
        mobileMenuBtn.setAttribute('aria-expanded', 'true');
        const icon = mobileMenuBtn.querySelector('i');
        if (icon) icon.className = 'fas fa-times';
    }

    function toggleNavMenu() {
        const navLinks = document.querySelector('.nav-links');
        if (!navLinks) return;
        if (navLinks.classList.contains('open')) {
            closeNavMenu();
        } else {
            openNavMenu();
        }
    }

    function createMobileMenu() {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const navLinks = document.querySelector('.nav-links');

        if (mobileMenuBtn && navLinks) {
            if (!navLinks.id) navLinks.id = 'primary-nav';
            mobileMenuBtn.setAttribute('aria-controls', navLinks.id);
            mobileMenuBtn.setAttribute('aria-expanded', 'false');

            mobileMenuBtn.addEventListener('click', function () {
                toggleNavMenu();
            });

            document.querySelectorAll('.nav-links a').forEach(function (link) {
                link.addEventListener('click', function () {
                    if (!mqMobileNav.matches) return;
                    var parentDd = link.closest('.dropdown');
                    if (parentDd && link === parentDd.querySelector(':scope > a')) {
                        return;
                    }
                    closeNavMenu();
                });
            });

            document.addEventListener('keydown', function (e) {
                if (e.key === 'Escape') closeNavMenu();
            });
        }
    }
    
    // Navbar scroll effect
    function handleScroll() {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;
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
                
                closeNavMenu();
                
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
        if (window.matchMedia("(max-width: 767px)").matches) {
            return;
        }
        const imagesToPreload = [
            'https://pub-df1f9faee3d94aabbd406007fa5bfcca.r2.dev/machinery/facility/hero.png',
            'https://pub-df1f9faee3d94aabbd406007fa5bfcca.r2.dev/logo/Logo-07-main.png',
            'https://pub-df1f9faee3d94aabbd406007fa5bfcca.r2.dev/background/ChatGPT%20Image%20May%2014%2C%202026%2C%2009_49_29%20AM.png',
            'https://pub-df1f9faee3d94aabbd406007fa5bfcca.r2.dev/background/ChatGPT%20Image%20May%2014%2C%202026%2C%2012_37_12%20PM.png',
            'https://pub-df1f9faee3d94aabbd406007fa5bfcca.r2.dev/background/ChatGPT%20Image%20May%2014%2C%202026%2C%2009_49_35%20AM.png'
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
    
    function setupMobileDropdowns() {
        document.querySelectorAll('.dropdown').forEach(function (dropdown) {
            const trigger = dropdown.querySelector(':scope > a');
            const content = dropdown.querySelector('.dropdown-content');
            if (!trigger || !content || trigger.dataset.paramaDropdownBound === '1') return;
            trigger.dataset.paramaDropdownBound = '1';
            trigger.addEventListener('click', function (e) {
                if (!mqMobileNav.matches) return;
                e.preventDefault();
                const willOpen = !dropdown.classList.contains('is-open');
                document.querySelectorAll('.dropdown.is-open').forEach(function (other) {
                    if (other !== dropdown) other.classList.remove('is-open');
                });
                dropdown.classList.toggle('is-open', willOpen);
            });
        });
    }

    mqMobileNav.addEventListener('change', function () {
        if (!mqMobileNav.matches) {
            document.querySelectorAll('.dropdown.is-open').forEach(function (d) {
                d.classList.remove('is-open');
            });
            closeNavMenu();
        }
    });
    
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
    
    function setupHeroSlideshow() {
        const root = document.querySelector('.hero-slideshow');
        if (!root) return;

        const slides = root.querySelectorAll('.hero-slide');
        const dots = root.querySelectorAll('.hero-slideshow-dot');
        const prevBtn = root.querySelector('.hero-slideshow-prev');
        const nextBtn = root.querySelector('.hero-slideshow-next');
        if (!slides.length) return;

        let index = 0;
        let timer = null;
        const intervalMs = 5500;
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        function show(i) {
            const n = ((i % slides.length) + slides.length) % slides.length;
            index = n;
            slides.forEach((slide, j) => {
                const on = j === n;
                slide.classList.toggle('is-active', on);
                slide.setAttribute('aria-hidden', on ? 'false' : 'true');
            });
            dots.forEach((dot, j) => {
                const on = j === n;
                dot.classList.toggle('is-active', on);
                dot.setAttribute('aria-selected', on ? 'true' : 'false');
            });
        }

        function nextSlide() {
            show(index + 1);
        }

        function prevSlide() {
            show(index - 1);
        }

        function startAutoplay() {
            if (prefersReduced || slides.length < 2) return;
            stopAutoplay();
            timer = window.setInterval(nextSlide, intervalMs);
        }

        function stopAutoplay() {
            if (timer !== null) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        slides.forEach((slide, j) => {
            slide.setAttribute('aria-hidden', j === 0 ? 'false' : 'true');
        });

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                startAutoplay();
            });
        }
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                prevSlide();
                startAutoplay();
            });
        }

        dots.forEach((dot, j) => {
            dot.addEventListener('click', () => {
                show(j);
                startAutoplay();
            });
        });

        root.addEventListener('mouseenter', stopAutoplay);
        root.addEventListener('mouseleave', startAutoplay);

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                stopAutoplay();
            } else {
                startAutoplay();
            }
        });

        startAutoplay();
    }

    // Scroll reveal for sections using .reveal-on-scroll (css in theme-variables.css)
    function setupRevealOnScroll() {
        const els = document.querySelectorAll('.reveal-on-scroll');
        if (!els.length) return;

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            els.forEach((el) => el.classList.add('is-visible'));
            return;
        }

        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        io.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12, rootMargin: '0px 0px -10% 0px' }
        );

        els.forEach((el) => io.observe(el));
    }

    // Initialize all functions
    function init() {
        createMobileMenu();
        setupStatsAnimation();
        setupRevealOnScroll();
        setupSmoothScrolling();
        setupButtonEffects();
        setupSubscribeForm();
        preloadImages();
        setupImageErrorHandling();
        setupMobileDropdowns();
        setupActiveNavigation();
        setupHeroSlideshow();
        
        // Event listeners
        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', function () {
            if (!mqMobileNav.matches) closeNavMenu();
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


// Product logo functionality and animations
document.addEventListener('DOMContentLoaded', function() {
    initializeProdLogoSection();
});

function initializeProdLogoSection() {
    const prodLogoSection = document.querySelector('.prod-logo-section');
    const logoImage = prodLogoSection?.querySelector('.logo-image');
    const logoContainer = prodLogoSection?.querySelector('.logo-container');
    const tagline = prodLogoSection?.querySelector('.company-tagline');
    
    if (!prodLogoSection) {
        console.warn('Product logo section not found');
        return;
    }

    // Add entrance animation
    addEntranceAnimation(prodLogoSection);
    
    // Add hover effects
    addHoverEffects(logoImage, logoContainer);
    
    // Add click functionality
    addClickFunctionality(prodLogoSection);
    
    // Add scroll animation
    addScrollAnimation(prodLogoSection);
    
    // Auto-adjust placeholder size
    autoAdjustPlaceholderSize();
}

// Entrance animation
function addEntranceAnimation(prodLogoSection) {
    // Set initial state
    prodLogoSection.classList.add('prod-logo-fade-in');
    
    // Trigger animation after delay
    setTimeout(() => {
        prodLogoSection.classList.add('visible');
    }, 800);
}

// Hover effects with shine border
function addHoverEffects(logoImage, logoContainer) {
    if (logoImage) {
        logoImage.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.filter = 'brightness(1.1) saturate(1.2)';
            // Pause shine animation on hover
            this.style.animationPlayState = 'paused';
        });
        
        logoImage.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1.02)';
            this.style.filter = 'brightness(1.05)';
            // Resume shine animation
            this.style.animationPlayState = 'running';
        });
        
        // Add loading state handler
        logoImage.addEventListener('load', function() {
            this.style.opacity = '1';
            this.classList.add('animate__fadeIn');
            // Start shine animation after load
            setTimeout(() => {
                this.classList.add('shine-border');
            }, 1000);
        });
        
        logoImage.addEventListener('error', function() {
            console.log('Logo image failed to load, showing placeholder with shine border');
        });
    }
    
    if (logoContainer) {
        logoContainer.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.01)';
        });
        
        logoContainer.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    }
}

// Click functionality
function addClickFunctionality(prodLogoSection) {
    const logoImage = prodLogoSection.querySelector('.logo-image');
    const logoContainer = prodLogoSection.querySelector('.logo-container');
    
    function handleClick() {
        // Add click animation
        prodLogoSection.style.transform = 'scale(0.98)';
        setTimeout(() => {
            prodLogoSection.style.transform = 'scale(1)';
        }, 150);
        
        // Optional: Add your click action here
        // For example: window.open('https://paramasolutions.com', '_blank');
        console.log('Product logo clicked - add your custom action here');
    }
    
    if (logoImage) {
        logoImage.addEventListener('click', handleClick);
        logoImage.style.cursor = 'pointer';
    }
    
    if (logoContainer) {
        logoContainer.addEventListener('click', handleClick);
        logoContainer.style.cursor = 'pointer';
    }
}

// Scroll animation
function addScrollAnimation(prodLogoSection) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'pulse 2s ease-in-out infinite';
            } else {
                entry.target.style.animation = 'none';
            }
        });
    }, {
        threshold: 0.5
    });
    
    observer.observe(prodLogoSection);
}

// Auto-adjust placeholder size and enable shine border
function autoAdjustPlaceholderSize() {
    const logoImage = document.querySelector('.prod-logo-section .logo-image');
    const placeholder = document.querySelector('.prod-logo-section .placeholder-image');
    
    if (logoImage && placeholder) {
        // Wait for logo to load, then match placeholder size and enable shine
        logoImage.addEventListener('load', function() {
            const logoRect = logoImage.getBoundingClientRect();
            placeholder.style.minHeight = logoRect.height + 'px';
            placeholder.style.width = '100%';
            
            // Enable shine border animation
            logoImage.classList.add('shine-border');
            
            console.log(`Placeholder adjusted to match logo size: ${logoRect.width}x${logoRect.height}`);
            console.log('Shine border animation enabled');
        });
        
        // Also adjust on window resize
        window.addEventListener('resize', function() {
            if (logoImage.complete && logoImage.naturalHeight !== 0) {
                const logoRect = logoImage.getBoundingClientRect();
                placeholder.style.minHeight = logoRect.height + 'px';
            }
        });
        
        // Enable shine border immediately if logo is already loaded
        if (logoImage.complete && logoImage.naturalHeight !== 0) {
            logoImage.classList.add('shine-border');
        }
    }
}

// Utility function to update product logo src (supports pvc.jpg)
function updateProdLogoSrc(newSrc) {
    const logoImage = document.querySelector('.prod-logo-section .logo-image');
    if (logoImage) {
        logoImage.src = newSrc;
        console.log(`Logo updated to: ${newSrc}`);
        // Re-adjust placeholder size after logo change
        setTimeout(autoAdjustPlaceholderSize, 100);
    }
}

// Utility function to update product tagline (now visible)
function updateProdTagline(newTagline) {
    const tagline = document.querySelector('.prod-logo-section .company-tagline');
    if (tagline) {
        tagline.textContent = newTagline;
        console.log(`Tagline updated to: ${newTagline}`);
    }
}

// Function to hide/show product logo section
function toggleProdLogoSection(show = true) {
    const prodLogoSection = document.querySelector('.prod-logo-section');
    if (prodLogoSection) {
        prodLogoSection.style.display = show ? 'block' : 'none';
    }
}

// Initialize pulse animation
addPulseAnimation();

// Error handling for missing elements
function handleMissingElements() {
    setTimeout(() => {
        const prodLogoSection = document.querySelector('.prod-logo-section');
        if (!prodLogoSection) {
            console.error('Product logo section not found. Make sure the HTML is properly added.');
            return;
        }
        
        const logoImage = prodLogoSection.querySelector('.logo-image');
        if (logoImage) {
            // Check if pvc.jpg loads properly
            logoImage.addEventListener('error', function() {
                console.warn('Logo image (pvc.jpg) failed to load, showing placeholder');
            });
            
            logoImage.addEventListener('load', function() {
                console.log('Logo image (pvc.jpg) loaded successfully');
            });
        }
    }, 1000);
}

handleMissingElements();

// Export functions for external use (optional)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        updateProdLogoSrc,
        updateProdTagline,
        toggleProdLogoSection,
        initializeProdLogoSection
    };
}
// Console welcome message
console.log('%c🌱 Welcome to Parama Solutions! 🌱', 'color: #28a745; font-size: 16px; font-weight: bold;');
console.log('%cInnovating for a Greener Tomorrow!', 'color: #ffc107; font-size: 14px;');