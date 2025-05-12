<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Parama Industries - Navigation</title>
    <!-- Include Remix Icons -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/remixicon/3.5.0/remixicon.min.css" rel="stylesheet">
    <!-- Include Bootstrap Icons -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.10.5/font/bootstrap-icons.min.css" rel="stylesheet">
    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/4.6.2/css/bootstrap.min.css">
    <!-- Custom CSS -->
    <style>
        /* General Styles */
        body {
            margin: 0;
            padding: 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        /* Top Header Styles */
        .top-header {
            background-color: #0a1629;
            color: white;
            padding: 10px 0;
        }
        .header-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 15px;
        }
        .header-info {
            display: flex;
            align-items: center;
        }
        .header-info-item {
            display: flex;
            align-items: center;
            margin-right: 25px;
            color: white;
            font-size: 14px;
        }
        .header-info-item i {
            margin-right: 8px;
            color: #ffd700;
            font-size: 18px;
        }
        .social-icons {
            display: flex;
        }
        .social-icon {
            color: white;
            margin-left: 15px;
            font-size: 18px;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .social-icon:hover {
            color: #ffd700;
        }
        
        /* Navigation Bar Styles */
        .header-mainbox {
            background-color: #0a1629;
            padding: 0;
            position: relative;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        .logo-box {
            padding: 15px 0;
            float: left;
        }
        .logo img {
            max-height: 50px;
            transition: all 0.3s ease;
        }
        .outer-box {
            float: right;
        }
        .main-menu {
            margin-right: 0;
        }
        .navigation {
            position: relative;
            margin: 0;
            padding: 0;
            display: flex;
            align-items: center;
        }
        .navigation li {
            position: relative;
            list-style: none;
            margin-right: 5px;
        }
        .navigation li a {
            color: white;
            text-decoration: none;
            padding: 30px 15px;
            display: block;
            font-size: 15px;
            font-weight: 500;
            transition: all 0.3s ease;
            position: relative;
        }
        .navigation li a:hover,
        .navigation li.current a {
            color: #ffd700;
        }
        .navigation li a::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 3px;
            background-color: #ffd700;
            transition: all 0.3s ease;
        }
        .navigation li a:hover::after,
        .navigation li.current a::after {
            width: 70%;
        }
        .dropdown {
            position: relative;
        }
        .dropdown > a:after {
            content: " ";
            display: inline-block;
            vertical-align: middle;
            margin-left: 5px;
            width: 8px;
            height: 8px;
            border-right: 2px solid #fff;
            border-bottom: 2px solid #fff;
            transform: rotate(45deg);
            transition: all 0.3s ease;
        }
        .dropdown:hover > a:after {
            transform: rotate(-135deg);
            border-color: #ffd700;
        }
        .dropdown ul {
            position: absolute;
            left: 0;
            top: 100%;
            background-color: #0a1629;
            min-width: 240px;
            padding: 10px 0;
            opacity: 0;
            visibility: hidden;
            transform: translateY(10px);
            transition: all 0.3s ease;
            box-shadow: 0 5px 15px rgba(0,0,0,0.15);
            z-index: 999;
            border-top: 3px solid #ffd700;
        }
        .dropdown:hover > ul {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
        }
        .dropdown ul li {
            margin: 0;
            width: 100%;
        }
        .dropdown ul li a {
            padding: 10px 20px;
            display: block;
            font-size: 14px;
            color: white;
            border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .dropdown ul li a:hover,
        .dropdown ul li a.active {
            background-color: rgba(255, 215, 0, 0.1);
            color: #ffd700;
        }
        .dropdown ul li a::after {
            display: none;
        }
        .dropdown ul li.dropdown > a:after {
            transform: rotate(-45deg);
            position: absolute;
            right: 15px;
            top: 50%;
            margin-top: -3px;
        }
        .dropdown ul li.dropdown:hover > a:after {
            transform: rotate(-135deg);
        }
        .dropdown ul li.dropdown ul {
            left: 100%;
            top: -10px;
            margin-left: 2px;
        }
        
        /* Quote Button */
        .theme-btn {
            background-color: #ffd700;
            color: #0a1629 !important;
            padding: 12px 30px !important;
            font-weight: 600 !important;
            border-radius: 4px;
            display: inline-block;
            transition: all 0.3s ease !important;
            border: 2px solid #ffd700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-size: 14px !important;
        }
        .theme-btn:hover {
            background-color: transparent;
            color: #ffd700 !important;
        }
        .theme-btn::after {
            display: none !important;
        }
        
        /* Mobile Styles */
        .navbar-header {
            display: none;
        }
        .navbar-toggle {
            background-color: #ffd700;
            border: none;
            margin: 25px 0;
            padding: 10px;
            border-radius: 3px;
            outline: none;
            position: absolute;
            right: 15px;
            top: 0;
            display: none;
        }
        .navbar-toggle .icon-bar {
            display: block;
            width: 22px;
            height: 2px;
            background-color: #0a1629;
            margin: 4px 0;
            transition: all 0.3s ease;
        }
        
        /* Fixed Header on Scroll */
        .header-fixed {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            z-index: 999;
            animation: slideDown 0.5s forwards;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        @keyframes slideDown {
            from {
                transform: translateY(-100%);
            }
            to {
                transform: translateY(0);
            }
        }
        
        /* Responsive Styles */
        @media (max-width: 991px) {
            .header-info-item span {
                display: none;
            }
            .header-info-item {
                margin-right: 15px;
            }
            .navigation li a {
                padding: 25px 10px;
                font-size: 14px;
            }
            .theme-btn {
                padding: 10px 20px !important;
                font-size: 12px !important;
            }
        }
        
        @media (max-width: 768px) {
            .header-content {
                flex-direction: column;
                align-items: flex-start;
            }
            .header-info {
                margin-bottom: 10px;
            }
            .social-icons {
                margin-left: -10px;
            }
            
            /* Mobile Navigation */
            .logo-box {
                width: 100%;
                text-align: center;
                float: none;
            }
            .outer-box {
                width: 100%;
                float: none;
            }
            .navbar-header {
                display: block;
            }
            .navbar-toggle {
                display: block;
            }
            .navbar-collapse {
                display: none;
                position: absolute;
                top: 100%;
                left: 0;
                width: 100%;
                background-color: #0a1629;
                max-height: 350px;
                overflow-y: auto;
                z-index: 999;
                box-shadow: 0 5px 10px rgba(0,0,0,0.2);
            }
            .navbar-collapse.show {
                display: block;
            }
            .navigation {
                display: block;
                padding: 10px 0;
            }
            .navigation li {
                margin: 0;
                width: 100%;
            }
            .navigation li a {
                padding: 12px 20px;
                border-bottom: 1px solid rgba(255,255,255,0.1);
            }
            .dropdown > a:after {
                position: absolute;
                right: 20px;
                top: 50%;
                margin-top: -3px;
            }
            .dropdown ul {
                position: static;
                opacity: 1;
                visibility: visible;
                transform: none;
                display: none;
                background-color: rgba(255,255,255,0.05);
                border: none;
                padding: 0;
                box-shadow: none;
                margin-left: 15px;
            }
            .dropdown.show > ul {
                display: block;
            }
            .dropdown ul li.dropdown ul {
                margin-left: 15px;
            }
            .extra-menu-item {
                display: inline-block;
                width: auto;
                margin: 15px 20px !important;
            }
        }
    </style>
</head>
<body>
    <!-- Top Header -->
    <div class="top-header">
        <div class="header-content">
            <div class="header-info">
                <div class="header-info-item">
                    <i class="ri-ship-line"></i>
                    <span>We Are Leading Provider Of Industrial Solutions.</span>
                </div>
                <div class="header-info-item">
                    <i class="ri-phone-fill"></i>
                    <span>+00 01234 5678</span>
                </div>
                <div class="header-info-item">
                    <i class="ri-map-pin-fill"></i>
                    <span>8500 Lorem Street, 55030</span>
                </div>
            </div>
            <div class="social-icons">
                <a href="#" class="social-icon"><i class="bi bi-facebook"></i></a>
                <a href="#" class="social-icon"><i class="bi bi-twitter-x"></i></a>
                <a href="#" class="social-icon"><i class="bi bi-linkedin"></i></a>
                <a href="#" class="social-icon"><i class="bi bi-dribbble"></i></a>
            </div>
        </div>
    </div>
    
    <!-- Header Main Box -->
    <div class="header-mainbox style_3">
        <div class="container">
            <div class="clearfix">
                <div class="logo-box">
                    <div class="logo">
                        <a href="index.html">
                            <img class="img-responsive" src="/api/placeholder/200/50" alt="Parama Industries Logo">
                        </a>
                    </div>
                </div>
                <div class="outer-box clearfix"> 
                    <!-- Main Menu -->
                    <nav class="main-menu logo-outer">
                        <div class="navbar-header"> 
                            <!-- Toggle Button -->
                            <button type="button" class="navbar-toggle">
                                <span class="icon-bar"></span>
                                <span class="icon-bar"></span>
                                <span class="icon-bar"></span>
                            </button>
                        </div>
                        <div class="navbar-collapse collapse clearfix">
                            <ul class="navigation clearfix">
                                <li class="current"><a href="index.html">Home</a></li>
                                <li class="dropdown">
                                    <a href="#">Products & Solutions</a>
                                    <ul>
                                        <li><a href="pvc-pipe.html">PCV Irrigation Pipe & Electrical Conduit</a></li>
                                        <li><a href="alkathene.html">Alkathene</a></li>
                                        <li><a href="garden.html">Garden Design</a></li>
                                        <li><a href="recycle.html">Recycle</a></li>
                                        <li><a href="alternative-energy.html">Alternative Energy</a></li>
                                        <li><a class="active" href="metal-Industry.html">Metal Industry</a></li>
                                    </ul>
                                </li>
                                <li class="dropdown">
                                    <a href="#">Pages</a>
                                    <ul>
                                        <li><a href="about.html">About</a></li>
                                        <li class="dropdown">
                                            <a href="#">Services</a>
                                            <ul>
                                                <li><a href="services-list.html">Services List</a></li>
                                                <li><a href="services-grid.html">Services Classic</a></li>
                                                <li><a href="services-icon.html">Services Icon</a></li>
                                            </ul>
                                        </li>
                                        <li><a href="testimonials.html">Testimonial</a></li>
                                        <li><a href="coming-soon.html">Coming Soon</a></li>
                                        <li><a href="error.html">Error Pages</a></li>
                                        <li><a href="case-studies.html">Case Studies</a></li>
                                        <li><a href="engineers.html">Engineers</a></li>
                                        <li><a href="contact.html">Contact</a></li>
                                    </ul>
                                </li>
                                <li class="dropdown">
                                    <a href="#">Projects</a>
                                    <ul>
                                        <li class="dropdown">
                                            <a href="#">Projects Box</a>
                                            <ul>
                                                <li><a href="project-box-2col.html">Col 2</a></li>
                                                <li><a href="project-box-3col.html">Col 3</a></li>
                                                <li><a href="project-box-4col.html">Col 4</a></li>
                                            </ul>
                                        </li>
                                        <li class="dropdown">
                                            <a href="#">Projects GLess</a>
                                            <ul>
                                                <li><a href="project-box-gless-2col.html">Col 2</a></li>
                                                <li><a href="project-box-gless-3col.html">Col 3</a></li>
                                                <li><a href="project-box-gless-4col.html">Col 4</a></li>
                                            </ul>
                                        </li>
                                        <li class="dropdown">
                                            <a href="#">Projects Full Box</a>
                                            <ul>
                                                <li><a href="project-full-2col.html">Col 2</a></li>
                                                <li><a href="project-full-3col.html">Col 3</a></li>
                                                <li><a href="project-full-4col.html">Col 4</a></li>
                                            </ul>
                                        </li>
                                        <li class="dropdown">
                                            <a href="#">Projects Full Gless</a>
                                            <ul>
                                                <li><a href="project-full-gless-2col.html">Col 2</a></li>
                                                <li><a href="project-full-gless-3col.html">Col 3</a></li>
                                                <li><a href="project-full-gless-4col.html">Col 4</a></li>
                                            </ul>
                                        </li>
                                        <li class="dropdown">
                                            <a href="#">Projects Mesonry</a>
                                            <ul>
                                                <li><a href="project_masonry-box-3col.html">Box Col 3</a></li>
                                                <li><a href="project_masonry-full-gless-3col.html">Full Col 3</a></li>
                                            </ul>
                                        </li>
                                        <li><a href="project-with-title.html">Project Title</a></li>
                                    </ul>
                                </li>
                                <li class="dropdown">
                                    <a href="#">Blog</a>
                                    <ul>
                                        <li><a href="blog-classic.html">Blog Classic</a></li>
                                        <li><a href="blog-grid.html">Blog Grid</a></li>
                                        <li><a href="single-blog.html">Single Blog</a></li>
                                    </ul>
                                </li>
                                <li class="extra-menu-item menu-item-button-link">
                                    <a href="contact.html" class="theme-btn">Get A Quote</a>
                                </li>
                            </ul>
                        </div>
                    </nav>
                    <!-- Main Menu End--> 
                </div>
            </div>
        </div>
    </div>

    <!-- Main Content Area -->
    <div style="height: 400px; background-color: #f5f5f5; display: flex; align-items: center; justify-content: center;">
        <h2>Main Content Area</h2>
    </div>

    <!-- JavaScript -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/4.6.2/js/bootstrap.bundle.min.js"></script>
    <script>
        // Toggle Mobile Menu
        $(document).ready(function() {
            // Mobile menu toggle
            $('.navbar-toggle').on('click', function() {
                $('.navbar-collapse').toggleClass('show');
                $(this).toggleClass('active');
                
                // Animate hamburger icon
                if ($(this).hasClass('active')) {
                    $(this).find('.icon-bar:nth-child(1)').css({
                        'transform': 'rotate(45deg) translate(5px, 5px)',
                        'transition': 'all 0.3s ease'
                    });
                    $(this).find('.icon-bar:nth-child(2)').css({
                        'opacity': '0',
                        'transition': 'all 0.3s ease'
                    });
                    $(this).find('.icon-bar:nth-child(3)').css({
                        'transform': 'rotate(-45deg) translate(5px, -5px)',
                        'transition': 'all 0.3s ease'
                    });
                } else {
                    $(this).find('.icon-bar').css({
                        'transform': 'none',
                        'opacity': '1',
                        'transition': 'all 0.3s ease'
                    });
                }
            });
            
            // Mobile dropdown toggle
            $('.dropdown > a').on('click', function(e) {
                if ($(window).width() <= 768) {
                    e.preventDefault();
                    $(this).parent().toggleClass('show');
                    $(this).next('ul').slideToggle(300);
                }
            });
            
            // Fixed header on scroll
            $(window).on('scroll', function() {
                if ($(window).scrollTop() > 100) {
                    $('.header-mainbox').addClass('header-fixed');
                    $('.logo img').css('max-height', '40px');
                } else {
                    $('.header-mainbox').removeClass('header-fixed');
                    $('.logo img').css('max-height', '50px');
                }
            });
            
            // Prevent parent dropdown from closing when clicking on child dropdown
            $('.dropdown ul').on('click', function(e) {
                e.stopPropagation();
            });
        });
    </script>
</body>
</html>