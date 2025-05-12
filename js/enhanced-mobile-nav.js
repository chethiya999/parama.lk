// Enhanced mobile compatibility script
jQuery(document).ready(function($) {
    // Device detection
    var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    var isAndroid = /Android/.test(navigator.userAgent);
    var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    
    // Add device-specific classes to body
    if (isMobile) $('body').addClass('is-mobile');
    if (isIOS) $('body').addClass('is-ios');
    if (isAndroid) $('body').addClass('is-android');
    if (isSafari) $('body').addClass('is-safari');
    
    // Detect touch capability
    if ('ontouchstart' in window || navigator.msMaxTouchPoints) {
        $('body').addClass('touch-device');
    }
    
    // Create mobile menu toggle
    $('.navbar-toggle').on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        $('.navbar-collapse').toggleClass('in');
        $('body').toggleClass('menu-open');
        
        // Add overlay when menu is open
        if ($('body').hasClass('menu-open')) {
            if ($('.mobile-menu-overlay').length === 0) {
                $('<div class="mobile-menu-overlay"></div>').appendTo('body');
            }
        } else {
            $('.mobile-menu-overlay').remove();
        }
    });
    
    // Close mobile menu when clicking outside
    $(document).on('click touchstart', '.mobile-menu-overlay', function() {
        $('.navbar-collapse').removeClass('in');
        $('body').removeClass('menu-open');
        $(this).remove();
    });
    
    // Add dropdown toggles to mobile menu
    $('.navigation > li.dropdown').each(function() {
        if ($(this).find('.dropdown-btn').length === 0) {
            $(this).append('<span class="dropdown-btn"><i class="fa fa-plus"></i></span>');
        }
    });
    
    $('.navigation > li > ul > li.dropdown').each(function() {
        if ($(this).find('.dropdown-btn').length === 0) {
            $(this).append('<span class="dropdown-btn"><i class="fa fa-plus"></i></span>');
        }
    });
    
    // Toggle dropdown menus in mobile view
    $(document).on('click', '.dropdown-btn', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        var $parent = $(this).parent();
        var $target = $parent.children('ul');
        
        // Toggle current dropdown
        $parent.toggleClass('open');
        $target.slideToggle(300);
        
        // Change icon
        if ($(this).find('.fa-plus').length > 0) {
            $(this).html('<i class="fa fa-minus"></i>');
        } else {
            $(this).html('<i class="fa fa-plus"></i>');
        }
        
        // Close other dropdowns at same level
        $parent.siblings('.dropdown').removeClass('open').find('> ul').slideUp(300);
        $parent.siblings('.dropdown').find('.dropdown-btn .fa-minus').removeClass('fa-minus').addClass('fa-plus');
    });
    
    // Special handling for touch devices
    if (isMobile) {
        // Prevent dropdown links from navigating in mobile view
        $('.navigation > li.dropdown > a, .navigation > li > ul > li.dropdown > a').on('click', function(e) {
            if ($(window).width() < 992) {
                e.preventDefault();
                var $parent = $(this).parent();
                $parent.find('> .dropdown-btn').trigger('click');
            }
        });
        
        // Add better touch handling for iOS
        if (isIOS) {
            // Fix for iOS scroll issues
            $('.navbar-collapse').css({
                'overflow-y': 'scroll',
                '-webkit-overflow-scrolling': 'touch'
            });
            
            // Fix for iOS position:fixed bug
            $(window).on('scroll', function() {
                if ($('.header-mainbox').hasClass('fixed')) {
                    $('.header-mainbox').css({
                        'position': 'absolute',
                        'top': $(window).scrollTop() + 'px'
                    });
                }
            });
        }
        
        // Fix for Android keyboard issues
        if (isAndroid) {
            $('input, textarea').on('focus', function() {
                $('.header-mainbox.fixed').css('position', 'absolute');
            }).on('blur', function() {
                setTimeout(function() {
                    $('.header-mainbox.fixed').css('position', 'fixed');
                }, 100);
            });
        }
    }
    
    // Sticky Header with performance optimization
    var $header = $('.header-mainbox');
    var headerHeight = $header.outerHeight();
    var lastScrollTop = 0;
    var scrollThreshold = 200;
    var scrollTimer;
    
    function checkHeaderPosition() {
        var scrollTop = $(window).scrollTop();
        
        // Only change header state if scroll direction has changed significantly
        if (Math.abs(scrollTop - lastScrollTop) > 10) {
            if (scrollTop > scrollThreshold) {
                if (!$header.hasClass('fixed')) {
                    $header.addClass('fixed');
                    if (!$('body').hasClass('home')) {
                        $('body').css('padding-top', headerHeight + 'px');
                    }
                }
            } else {
                if ($header.hasClass('fixed')) {
                    $header.removeClass('fixed');
                    $('body').css('padding-top', '0');
                }
            }
            
            lastScrollTop = scrollTop;
        }
    }
    
    // Throttle scroll events for better performance
    $(window).on('scroll', function() {
        if (!scrollTimer) {
            scrollTimer = setTimeout(function() {
                checkHeaderPosition();
                scrollTimer = null;
            }, 10);
        }
    });
    
    // Run once on page load
    checkHeaderPosition();
    
    // Handle window resize
    var resizeTimer;
    $(window).on('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            // Update header height
            headerHeight = $header.outerHeight();
            
            // Reset mobile menu on desktop
            if ($(window).width() >= 992) {
                $('.navbar-collapse').removeClass('in');
                $('body').removeClass('menu-open');
                $('.mobile-menu-overlay').remove();
                $('.navigation li.dropdown ul').css('display', '');
                $('.navigation li.dropdown').removeClass('open');
                $('.dropdown-btn .fa-minus').removeClass('fa-minus').addClass('fa-plus');
                
                // Reset position for iOS fix
                if (isIOS) {
                    $('.header-mainbox').css('position', '');
                }
            }
        }, 250);
    });
    
    // Active menu item highlighting
    var currentUrl = window.location.href;
    
    $('.navigation > li > a').each(function() {
        var linkUrl = $(this).attr('href');
        
        // If current URL contains the link URL and it's not just the homepage
        if (currentUrl.indexOf(linkUrl) > -1 && linkUrl.length > 1) {
            $(this).addClass('active');
            $(this).parent().addClass('current-menu-item');
        }
        
        // Special case for homepage
        if (linkUrl === 'index.html' && (currentUrl.endsWith('/') || currentUrl.endsWith('index.html'))) {
            $(this).addClass('active');
            $(this).parent().addClass('current-menu-item');
        }
    });
    
    // Fix for FastClick compatibility issues
    if (typeof FastClick !== 'undefined') {
        $(function() {
            FastClick.attach(document.body);
        });
        
        // Prevent double-tap on iOS
        $('.navigation > li.dropdown > a').each(function() {
            $(this).attr('data-needsclick', 'true');
        });
    }
    
    // Fix for iOS Safari 100vh issue
    if (isIOS && isSafari) {
        var windowHeight = $(window).height();
        $('.navbar-collapse').css('height', windowHeight + 'px');
        
        $(window).resize(function() {
            var windowHeight = $(window).height();
            $('.navbar-collapse').css('height', windowHeight + 'px');
        });
    }
    
    // Handle orientation change
    window.addEventListener('orientationchange', function() {
        // Reset mobile menu
        $('.navbar-collapse').removeClass('in');
        $('body').removeClass('menu-open');
        $('.mobile-menu-overlay').remove();
        
        // Recalculate header height
        setTimeout(function() {
            headerHeight = $header.outerHeight();
            if ($header.hasClass('fixed') && !$('body').hasClass('home')) {
                $('body').css('padding-top', headerHeight + 'px');
            }
        }, 300);
    });
    
    // Add touch feedback for improved UX
    if (isMobile) {
        $('.navigation > li > a, .dropdown-btn, .btn-cta').on('touchstart', function() {
            $(this).addClass('touch-active');
        }).on('touchend touchcancel', function() {
            var $this = $(this);
            setTimeout(function() {
                $this.removeClass('touch-active');
            }, 100);
        });
    }
    
    // Fix for Webview scroll issues
    if (/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(navigator.userAgent)) {
        $('body').addClass('is-webview');
        
        // Special handling for iOS webview
        $('.navbar-collapse').css({
            '-webkit-transform': 'translateZ(0)',
            'transform': 'translateZ(0)'
        });
    }
    
    // Prevent body scrolling when menu is open
    function preventBodyScroll(prevent) {
        if (prevent) {
            $('body').css({
                'overflow': 'hidden',
                'height': '100%'
            });
        } else {
            $('body').css({
                'overflow': '',
                'height': ''
            });
        }
    }
    
    $('.navbar-toggle').on('click', function() {
        preventBodyScroll($('body').hasClass('menu-open'));
    });
    
    $(document).on('click', '.mobile-menu-overlay', function() {
        preventBodyScroll(false);
    });
});