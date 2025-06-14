// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Smooth scrolling for anchor links
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
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        observer.observe(statsSection);
    }

    // Form submission handler
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Simple validation
            if (!data.name || !data.email || !data.service) {
                alert('Please fill in all required fields.');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                alert('Please enter a valid email address.');
                return;
            }
            
            // Simulate form submission
            const submitBtn = this.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                alert('Thank you for your message! PARAMA Industries will contact you within 24 hours to discuss your weighbridge service needs.');
                this.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }

    // Vehicle type dependent field visibility
    const serviceSelect = document.querySelector('#service');
    const vehicleTypeGroup = document.querySelector('#vehicle-type').closest('.form-group');
    
    if (serviceSelect && vehicleTypeGroup) {
        serviceSelect.addEventListener('change', function() {
            if (this.value === 'truck' || this.value === 'container' || this.value === 'construction') {
                vehicleTypeGroup.style.display = 'block';
                vehicleTypeGroup.querySelector('select').required = true;
            } else {
                vehicleTypeGroup.style.display = 'none';
                vehicleTypeGroup.querySelector('select').required = false;
            }
        });
        
        // Initial state
        vehicleTypeGroup.style.display = 'none';
    }

    // Additional PARAMA-specific functionality
    
    // Add hover effect to service cards for better interactivity
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Add loading animation for stats when they become visible
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
        stat.style.opacity = '0';
        stat.style.transform = 'translateY(20px)';
    });

    // Enhanced intersection observer for stats with staggered animation
    const enhancedObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumbers = entry.target.querySelectorAll('.stat-number');
                statNumbers.forEach((stat, index) => {
                    setTimeout(() => {
                        stat.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                        stat.style.opacity = '1';
                        stat.style.transform = 'translateY(0)';
                    }, index * 200);
                });
                enhancedObserver.unobserve(entry.target);
            }
        });
    });

    if (statsSection) {
        enhancedObserver.observe(statsSection);
    }

    // Add fade-in animation for service cards
    const observeServiceCards = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });

    serviceCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observeServiceCards.observe(card);
    });

});