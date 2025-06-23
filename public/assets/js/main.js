/**
 * Main Application Initialization
 * Orchestrates the setup of all components and manages the application lifecycle
 */
(function() {
    'use strict';

    // Configuration
    const config = {
        animationDuration: 800,
        debug: false
    };
    
    // Store cleanup functions
    const cleanupFns = [];
    let isInitialized = false;
    
    // Safe style setter with error handling
    function safeSetStyle(element, styles) {
        if (!element || !element.style) return false;
        try {
            Object.assign(element.style, styles);
            return true;
        } catch (e) {
            if (config.debug) console.error('Style error:', e);
            return false;
        }
    }
    
    /**
     * Safe initialization wrapper to prevent multiple initializations
     */
    function safeInit(fn, name) {
        return function() {
            try {
                if (config.debug) console.log(`Initializing ${name || 'component'}`);
                return fn.apply(this, arguments);
            } catch (e) {
                console.error(`Error initializing ${name || 'component'}:`, e);
                return null;
            }
        };
    }

    
    /**
     * Register cleanup function to be called on page unload
     */
    function onCleanup(fn) {
        if (typeof fn === 'function') {
            cleanupFns.push(fn);
        }
    }

    /**
     * Initialize AOS (Animate On Scroll)
     */
    const initAOS = safeInit(function() {
        if (typeof AOS === 'undefined') return;
        
        AOS.init({
            duration: 1000,
            once: true,
            easing: 'ease-in-out',
            mirror: false
        });
        
        return AOS;
    }, 'AOS');

    /**
     * Initialize Magnific Popup for image galleries
     */
    const initMagnificPopup = safeInit(function() {
        if (typeof $ === 'undefined' || typeof $.fn.magnificPopup === 'undefined') return;
        
        $('.popup-gallery').magnificPopup({
            delegate: 'a',
            type: 'image',
            tLoading: 'Loading image #%curr%...',
            mainClass: 'mfp-img-mobile',
            gallery: {
                enabled: true,
                navigateByImgClick: true,
                preload: [0, 1]
            },
            image: {
                tError: '<a href="%url%">The image #%curr%</a> could not be loaded.'
            }
        });
        
        return true;
    }, 'Magnific Popup');

    /**
     * Initialize all components
     */
    function init() {
        if (isInitialized) {
            if (config.debug) console.warn('App already initialized');
            return;
        }
        
        try {
            // Initialize components
            initAOS();
            initMagnificPopup();
            
            // Mark as initialized
            isInitialized = true;
            
            if (config.debug) console.log('App initialized successfully');
            
            // Make sure body is visible
            safeSetStyle(document.body, {
                visibility: 'visible',
                opacity: '1',
                overflow: 'auto'
            });
            
            // Hide loader after all components are initialized
            // Small delay to ensure all elements are in place
            setTimeout(() => {
                if (window.pageLoader && typeof window.pageLoader.hide === 'function') {
                    window.pageLoader.hide();
                }
            }, 100);
            
        } catch (e) {
            console.error('Fatal error during initialization:', e);
            
            // Ensure page is visible and loader is hidden even if there's an error
            safeSetStyle(document.body, {
                visibility: 'visible',
                opacity: '1',
                overflow: 'auto'
            });
            
            if (window.pageLoader && typeof window.pageLoader.hide === 'function') {
                window.pageLoader.hide();
            }
        }
    }

    /**
     * Clean up all event listeners and resources
     */
    function cleanup() {
        if (!isInitialized) return;
        
        if (config.debug) console.log('Cleaning up...');
        
        // Run all cleanup functions in reverse order
        for (let i = cleanupFns.length - 1; i >= 0; i--) {
            try {
                if (typeof cleanupFns[i] === 'function') {
                    cleanupFns[i]();
                }
            } catch (e) {
                console.error('Error during cleanup:', e);
            }
        }
        
        // Clear the array
        cleanupFns.length = 0;
        isInitialized = false;
    }
    
    /**
     * Initialize the application
     */
    function start() {
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            // If document is already loaded or loading, initialize immediately
            window.setTimeout(init, 0);
        } else {
            // Wait for DOM to be ready
            document.addEventListener('DOMContentLoaded', init);
        }
        
        // Clean up on page unload
        window.addEventListener('unload', cleanup);
    }
    
    // Initialize back to top button
    const initBackToTop = safeInit(function() {
        const backToTop = document.getElementById('backToTop');
        const scrollToTopBtn = document.getElementById('scrollToTopBtn');
        
        if (!backToTop && !scrollToTopBtn) return;

        // Show/hide button on scroll
        function toggleBackToTop() {
            const show = window.scrollY > 300;
            if (backToTop) backToTop.classList.toggle('show', show);
            if (scrollToTopBtn) scrollToTopBtn.classList.toggle('visible', show);
        }

        // Smooth scroll to top function
        function scrollToTop() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }

        // Add event listeners
        if (backToTop) {
            backToTop.addEventListener('click', function(e) {
                e.preventDefault();
                scrollToTop();
            });
        }
        
        if (scrollToTopBtn) {
            scrollToTopBtn.addEventListener('click', scrollToTop);
        }

        // Initial check
        toggleBackToTop();

        // Check on scroll
        window.addEventListener('scroll', toggleBackToTop, { passive: true });

        return true;
    }, 'Back to Top');

    // Start the application
    start();
    
    // Initialize back to top
    initBackToTop();
    
    // Expose public API
    window.app = {
        init,
        cleanup,
        onCleanup,
        isInitialized: () => isInitialized
    };
    
    // For debugging
    if (config.debug) {
        window.app._config = config;
    }
})();
