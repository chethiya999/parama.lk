// Footer JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Form submission handling
    const subscribeForm = document.getElementById('subscribe-form');
    if (subscribeForm) {
        subscribeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const fullname = document.getElementById('fullname').value;
            const email = document.getElementById('email').value;
            
            if (fullname && email) {
                // Here you would typically send this data to your server
                // For demo purposes, we'll just show a success message
                showSubscribeMessage('Thank you for subscribing!', 'success');
                
                // Clear the form
                subscribeForm.reset();
            } else {
                showSubscribeMessage('Please fill in all fields', 'error');
            }
        });
    }
    
    // Function to show subscribe message
    function showSubscribeMessage(message, type) {
        // Create message element
        const messageElement = document.createElement('div');
        messageElement.className = `subscribe-message ${type}`;
        messageElement.textContent = message;
        
        // Find where to insert the message
        const subscribeSection = document.querySelector('.footer-subscribe');
        
        // Remove any existing messages
        const existingMessage = subscribeSection.querySelector('.subscribe-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Insert the message
        subscribeSection.appendChild(messageElement);
        
        // Remove the message after 5 seconds
        setTimeout(() => {
            messageElement.classList.add('fade-out');
            setTimeout(() => {
                messageElement.remove();
            }, 500);
        }, 5000);
    }
    
    // Blog post hover effects
    const blogPosts = document.querySelectorAll('.blog-post');
    
    blogPosts.forEach(post => {
        post.addEventListener('mouseenter', function() {
            this.classList.add('hover');
        });
        
        post.addEventListener('mouseleave', function() {
            this.classList.remove('hover');
        });
    });
    
    // Smooth scroll for footer navigation links
    const footerLinks = document.querySelectorAll('.footer-menu a');
    
    footerLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                e.preventDefault();
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add CSS for the message display
    const style = document.createElement('style');
    style.textContent = `
        .subscribe-message {
            padding: 15px;
            border-radius: 5px;
            margin-top: 20px;
            text-align: center;
            font-weight: bold;
            opacity: 1;
            transition: opacity 0.5s ease;
        }
        
        .subscribe-message.success {
            background-color: rgba(76, 175, 80, 0.3);
            color: #4CAF50;
            border: 1px solid #4CAF50;
        }
        
        .subscribe-message.error {
            background-color: rgba(244, 67, 54, 0.3);
            color: #F44336;
            border: 1px solid #F44336;
        }
        
        .subscribe-message.fade-out {
            opacity: 0;
        }
        
        .blog-post.hover h3 {
            color: #ffcb05 !important;
        }
    `;
    
    document.head.appendChild(style);
    
    // Highlight active menu link
    function setActiveLink() {
        const currentPath = window.location.pathname;
        
        footerLinks.forEach(link => {
            const linkPath = link.getAttribute('href');
            
            if (linkPath === currentPath || 
                (currentPath === '/' && linkPath === '#main-pages')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    
    setActiveLink();
});