// Premium Navigation JavaScript with Mobile Optimization
jQuery(document).ready(function($) {
    // Elements
    const $navToggle = $('#navToggle');
    const $navMenu = $('#navMenu');
    const $headerMainbox = $('.header-mainbox');
    const $dropdownToggle = $('.dropdown-toggle');
    const $dropdownSubmenu = $('.dropdown-submenu > .dropdown-item');
    const $body = $('body');
    
    // Create overlay for mobile menu
    $body.append('<div class="overlay"></div>');
    const $overlay = $('.overlay');
    
    // Toggle Mobile Menu
    $navToggle.on('click', function() {
        $(this).toggleClass('active');
        $navMenu.toggleClass('active');
        $overlay.toggleClass('active');
        $body.toggleClass('menu-open');
    });
    
    // Close mobile menu when clicking overlay
    $overlay.on('click', function() {
        $navToggle.removeClass('active');
        $navMenu.removeClass('active');
        $overlay.removeClass('active');
        $body.removeClass('menu-open');
    });
    
    // Toggle Dropdowns on Mobile
    $dropdownToggle.on('click', function(e) {
        if (window.innerWidth < 992) {
            e.preventDefault();
            const $parent = $(this).parent();
            const $dropdownMenu = $(this).next('.dropdown-menu');
            
            // Close other dropdowns
            if (!$parent.hasClass('open')) {
                $('.nav-item.dropdown').not($parent).removeClass('open').find('> .dropdown-menu').slideUp(300);
            }
            
            $parent.toggleClass('open');
            $dropdownMenu.slideToggle(300);
        }
    });
    
    // Toggle Submenu Dropdowns on Mobile
    $dropdownSubmenu.on('click', function(e) {
        if (window.innerWidth < 992) {
            e.preventDefault();
            const $parent = $(this).parent();
            const $submenu = $(this).next('.dropdown-menu');
            
            $parent.toggleClass('open');
            $submenu.slideToggle(300);
        }
    });
    
    // Sticky Header on Scroll
    const headerHeight = $headerMainbox.outerHeight();
    
    function handleScroll() {
        if ($(window).scrollTop() > 100) {
            $headerMainbox.addClass('fixed');
            if (!$body.hasClass('header-fixed')) {
                $body.addClass('header-fixed');
                $body.css('padding-top', headerHeight + 'px');
            }
        } else {
            $headerMainbox.removeClass('fixed');
            $body.removeClass('header-fixed');
            $body.css('padding-top', '0');
        }
    }
    
    $(window).on('scroll', handleScroll);
    
    // Reset menu on window resize
    function resetMenuOnResize() {
        const windowWidth = window.innerWidth;
        
        if (windowWidth >= 992) {
            // Reset mobile menu
            $navToggle.removeClass('active');
            $navMenu.removeClass('active');
            $overlay.removeClass('active');
            $body.removeClass('menu-open');
            
            // Reset dropdowns
            $('.dropdown-menu').css('display', '');
            $('.nav-item.dropdown, .dropdown-submenu').removeClass('open');
        }
    }
    
    let resizeTimer;
    $(window).on('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(resetMenuOnResize, 250);
    });
    
    // Add entrance animation
    setTimeout(function() {
        const $navItems = $('.nav-item');
        $navItems.each(function(index) {
            const $this = $(this);
            setTimeout(function() {
                $this.addClass('animated');
            }, 100 * index);
        });
    }, 500);
    
    // Initialize header state on page load
    handleScroll();
    
    // Fix dropdown positioning when near edge of screen
    $('.dropdown').on('mouseenter', function() {
        if (window.innerWidth >= 992) {
            const $dropdown = $(this);
            const $menu = $dropdown.children('.dropdown-menu');
            
            if ($menu.length) {
                const dropdownOffset = $menu.offset();
                const rightEdge = dropdownOffset.left + $menu.outerWidth();
                
                if (rightEdge > window.innerWidth) {
                    $menu.addClass('dropdown-menu-right');
                }
            }
        }
    });
    
    // Handle tab navigation accessibility
    $('.nav-link').on('focus', function() {
        if (window.innerWidth >= 992) {
            $(this).parents('.dropdown').addClass('focus');
        }
    }).on('blur', function() {
        if (window.innerWidth >= 992) {
            $(this).parents('.dropdown').removeClass('focus');
        }
    });
});