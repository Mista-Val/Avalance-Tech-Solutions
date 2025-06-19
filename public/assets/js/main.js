// Main application initialization
(function() {
    'use strict';

    // Configuration
    const config = {
        preloaderHideDelay: 300,
        preloaderForceHide: 5000,
        scrollOffset: 100,
        animationDuration: 800
    };

    // Cache DOM elements
    const dom = {
        preloader: document.getElementById('loading'),
        navbar: document.querySelector('.navbar')
    };

    /**
     * Initialize smooth scrolling for anchor links
     */
    function initSmoothScrolling() {
        document.addEventListener('click', function(e) {
            const anchor = e.target.closest('a[href^="#"]');
            if (!anchor || anchor.getAttribute('href') === '#') return;
            
            e.preventDefault();
            const targetId = anchor.getAttribute('href');
            
            try {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - config.scrollOffset,
                        behavior: 'smooth'
                    });
                }
            } catch (error) {
                console.error('Smooth scrolling error:', error);
                window.location.href = targetId; // Fallback
            }
        });
    }

    /**
     * Initialize WOW.js for scroll animations
     */
    function initWow() {
        if (typeof WOW !== 'undefined') {
            try {
                new WOW({
                    boxClass: 'wow',
                    animateClass: 'animated',
                    offset: 0,
                    mobile: true,
                    live: true
                }).init();
            } catch (e) {
                console.error('WOW.js initialization error:', e);
            }
        }
    }


    /**
     * Hide the preloader with animation
     * @param {boolean} force - Whether to force hide immediately
     */
    function hidePreloader(force = false) {
        if (!dom.preloader) return;
        
        if (force) {
            dom.preloader.style.display = 'none';
            return;
        }
        
        dom.preloader.style.opacity = '0';
        dom.preloader.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            if (dom.preloader) {
                dom.preloader.style.display = 'none';
            }
        }, config.preloaderHideDelay);
    }

    /**
     * Initialize preloader timeout
     */
    function initPreloader() {
        if (!dom.preloader) return;
        
        // Hide preloader when all assets are loaded
        const hideOnLoad = () => {
            window.removeEventListener('load', hideOnLoad);
            clearTimeout(forceHideTimeout);
            hidePreloader();
        };
        
        // Force hide after timeout
        const forceHideTimeout = setTimeout(() => {
            hidePreloader(true);
        }, config.preloaderForceHide);
        
        // Set up event listeners
        if (document.readyState === 'complete') {
            hideOnLoad();
        } else {
            window.addEventListener('load', hideOnLoad);
        }
    }

    /**
     * Initialize navbar scroll behavior
     */
    function initNavbar() {
        if (!dom.navbar) return;
        
        const updateNavbar = () => {
            if (window.scrollY > 50) {
                dom.navbar.classList.add('scrolled');
            } else {
                dom.navbar.classList.remove('scrolled');
            }
        };
        
        window.addEventListener('scroll', updateNavbar, { passive: true });
        updateNavbar(); // Initial check
    }

    /**
     * Initialize AOS (Animate On Scroll)
     */
    function initAOS() {
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: config.animationDuration,
                easing: 'ease-in-out',
                once: true,
                offset: 100
            });
        }
    }

    /**
     * Initialize Bootstrap tooltips
     */
    function initTooltips() {
        if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
            const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
            tooltipTriggerList.map(el => new bootstrap.Tooltip(el));
        }
    }

    /**
     * Initialize all components
     */
    function init() {
        initSmoothScrolling();
        initWow();
        initAOS();
        initTooltips();
        initNavbar();
        initPreloader();
        
        // Log initialization
        console.log('Application initialized');
    }

    // Start initialization when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 0);
    }
})();
