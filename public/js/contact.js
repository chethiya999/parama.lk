// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Contact form handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Validate required fields
            const requiredFields = ['firstName', 'lastName', 'email', 'service', 'message'];
            let isValid = true;
            let firstError = null;
            
            requiredFields.forEach(field => {
                const element = document.getElementById(field);
                if (!data[field] || data[field].trim() === '') {
                    isValid = false;
                    element.style.borderColor = '#dc2626';
                    if (!firstError) firstError = element;
                } else {
                    element.style.borderColor = '#e5e7eb';
                }
            });
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const emailField = document.getElementById('email');
            if (data.email && !emailRegex.test(data.email)) {
                isValid = false;
                emailField.style.borderColor = '#dc2626';
                if (!firstError) firstError = emailField;
            }
            
            if (!isValid) {
                showNotification('Please fill in all required fields correctly.', 'error');
                if (firstError) {
                    firstError.focus();
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                return;
            }
            
            // Simulate form submission
            const submitBtn = this.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                showNotification('Thank you for your message! We will contact you within 24 hours.', 'success');
                this.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                // Reset field borders
                requiredFields.forEach(field => {
                    document.getElementById(field).style.borderColor = '#e5e7eb';
                });
                emailField.style.borderColor = '#e5e7eb';
                
            }, 2000);
        });
    }
    
    // FAQ accordion functionality
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            if (isActive) {
                item.classList.remove('active');
            } else {
                item.classList.add('active');
            }
        });
    });
    
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
    
    // Enhanced animations for contact methods
    const contactMethods = document.querySelectorAll('.contact-method');
    const methodObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                }, index * 150);
                methodObserver.unobserve(entry.target);
            }
        });
    });
    
    contactMethods.forEach(method => {
        method.style.opacity = '0';
        method.style.transform = 'translateX(-30px)';
        method.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        methodObserver.observe(method);
    });
    
    // Enhanced animations for quick contact cards
    const quickCards = document.querySelectorAll('.quick-card');
    const quickObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 200);
                quickObserver.unobserve(entry.target);
            }
        });
    });
    
    quickCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        quickObserver.observe(card);
    });
    
    // Form field focus effects
    const formFields = document.querySelectorAll('.form-group input, .form-group textarea, .form-group select');
    formFields.forEach(field => {
        field.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        field.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });
    
    // Phone number formatting
    const phoneField = document.getElementById('phone');
    if (phoneField) {
        phoneField.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 0) {
                if (value.length <= 3) {
                    value = value;
                } else if (value.length <= 6) {
                    value = value.substring(0, 3) + ' ' + value.substring(3);
                } else if (value.length <= 10) {
                    value = value.substring(0, 3) + ' ' + value.substring(3, 6) + ' ' + value.substring(6);
                } else {
                    value = value.substring(0, 3) + ' ' + value.substring(3, 6) + ' ' + value.substring(6, 10);
                }
            }
            e.target.value = value;
        });
    }
    
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;
    
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
    
    // Enhanced hover effects for interactive elements
    const interactiveElements = document.querySelectorAll('.quick-card, .contact-method, .social-btn');
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Map click handler (placeholder for actual map integration)
    const mapPlaceholder = document.querySelector('.map-placeholder');
    if (mapPlaceholder) {
        mapPlaceholder.addEventListener('click', function() {
            // This would typically open a real map or navigation app
            const address = '456 Industrial Drive, Logistics Park, Colombo, Sri Lanka';
            const encodedAddress = encodeURIComponent(address);
            window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
        });
        
        mapPlaceholder.style.cursor = 'pointer';
    }
    
    // Contact method click tracking
    const contactLinks = document.querySelectorAll('a[href^="tel:"], a[href^="mailto:"], a[href^="https://wa.me/"]');
    contactLinks.forEach(link => {
        link.addEventListener('click', function() {
            const type = this.href.startsWith('tel:') ? 'phone' : 
                        this.href.startsWith('mailto:') ? 'email' : 'whatsapp';
            console.log(`Contact method used: ${type} - ${this.href}`);
        });
    });
    
    // Parallax effect for hero section
    const heroSection = document.querySelector('.hero-section');
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.3;
        
        if (heroSection) {
            heroSection.style.transform = `translateY(${rate}px)`;
        }
    });
    
    // Service-specific form handling
    const serviceSelect = document.getElementById('service');
    const messageField = document.getElementById('message');
    
    if (serviceSelect && messageField) {
        serviceSelect.addEventListener('change', function() {
            const service = this.value;
            const serviceMessages = {
                'weighbridge': 'I am interested in your weighbridge services. Please provide information about capacity, accuracy, and pricing.',
                'recycling': 'I would like to learn more about your plastic recycling services and environmental impact.',
                'pvc': 'I need information about your PVC manufacturing capabilities and product specifications.',
                'gardening': 'I am interested in your gardening solutions and landscaping services.',
                'logistics': 'Please provide details about your logistics and transportation services.',
                'industrial': 'I would like to discuss industrial consulting services for my business.',
            };
            
            if (service && serviceMessages[service] && !messageField.value) {
                messageField.value = serviceMessages[service];
            }
        });
    }
    
    // Add loading animation to submit button
    const submitBtn = document.querySelector('.submit-btn');
    if (submitBtn) {
        submitBtn.addEventListener('click', function() {
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
        });
    }
    
    console.log('%c📞 PARAMA Industries Contact Page Loaded! 📞', 'color: #f4d03f; font-size: 16px; font-weight: bold;');
    console.log('%cReady to connect with our industrial solutions team!', 'color: #2c2c2c; font-size: 14px;');
});

// Send form data to WhatsApp
function sendToWhatsApp() {
    // Get form data
    const formData = new FormData(document.getElementById('contactForm'));
    const data = Object.fromEntries(formData);
    
    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'service', 'message'];
    let isValid = true;
    
    requiredFields.forEach(field => {
        const element = document.getElementById(field);
        if (!data[field] || data[field].trim() === '') {
            isValid = false;
            element.style.borderColor = '#dc2626';
        } else {
            element.style.borderColor = '#e5e7eb';
        }
    });
    
    if (!isValid) {
        showNotification('Please fill in all required fields before sending to WhatsApp.', 'error');
        return;
    }
    
    // Create WhatsApp message
    const message = `
🏢 *PARAMA Industries Contact Form*

👤 *Name:* ${data.firstName} ${data.lastName}
📧 *Email:* ${data.email}
📱 *Phone:* ${data.phone || 'Not provided'}
🏭 *Company:* ${data.company || 'Not provided'}
⚙️ *Service Interest:* ${data.service}
💰 *Budget:* ${data.budget || 'Not specified'}

📝 *Message:*
${data.message}

${data.newsletter ? '✅ Subscribed to newsletter' : ''}

---
Sent from PARAMA Industries Contact Form
    `.trim();
    
    // Encode message for WhatsApp
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/94777898445?text=${encodedMessage}`;
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
    
    showNotification('Opening WhatsApp with your message...', 'info');
}

// Utility Functions
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        info: '#f4d03f',
        warning: '#f59e0b'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type] || colors.info};
        color: ${type === 'info' ? '#2c2c2c' : 'white'};
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        z-index: 10000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.4s ease;
        max-width: 400px;
        font-weight: 500;
    `;
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px;">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 400);
    }, 4000);
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function formatPhoneNumber(phoneNumber) {
    const cleaned = phoneNumber.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return match[1] + ' ' + match[2] + ' ' + match[3];
    }
    return phoneNumber;
}

// Export functions for external use
window.PARAMAContact = {
    showNotification,
    validateEmail,
    formatPhoneNumber,
    sendToWhatsApp
};