// Main JavaScript for Parama Solutions website

// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu functionality
    function createMobileMenu() {
        if (window.innerWidth <= 768 && !document.querySelector('.mobile-menu-btn')) {
            const navbar = document.querySelector('.navbar');
            const navLinks = document.querySelector('.nav-links');
            
            const mobileMenuBtn = document.createElement('button');
            mobileMenuBtn.className = 'mobile-menu-btn';
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            
            // Insert before the nav-links
            navbar.insertBefore(mobileMenuBtn, navLinks);
            
            // Event listener for mobile menu
            mobileMenuBtn.addEventListener('click', () => {
                navLinks.classList.toggle('open');
                
                // Change icon based on menu state
                if (navLinks.classList.contains('open')) {
                    mobileMenuBtn.innerHTML = '<i class="fas fa-times"></i>';
                } else {
                    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                }
            });
        } else if (window.innerWidth > 768 && document.querySelector('.mobile-menu-btn')) {
            document.querySelector('.mobile-menu-btn').remove();
            document.querySelector('.nav-links').classList.remove('open');
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
                if (document.querySelector('.nav-links.open')) {
                    document.querySelector('.nav-links').classList.remove('open');
                    document.querySelector('.mobile-menu-btn').innerHTML = '<i class="fas fa-bars"></i>';
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
    
    // Preload images for smoother experience
    function preloadImages() {
        // Add any images you want to preload here
        const imagesToPreload = [
            'worker-image.jpg',
            'stats-image.jpg'
            // Add more image paths as needed
        ];
        
        imagesToPreload.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }
    
    // Initialize all functions
    function init() {
        createMobileMenu();
        setupStatsAnimation();
        setupSmoothScrolling();
        setupButtonEffects();
        preloadImages();
        
        // Event listeners
        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', createMobileMenu);
    }
    
    // Run initialization
    init();
});