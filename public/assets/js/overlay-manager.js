/**
 * Page Loader Manager
 * Handles the page loading state and ensures the loader is always hidden
 */
(function() {
    'use strict';
    
    // Configuration
    const config = {
        loaderId: 'page-loader',
        fadeId: 'initial-fade',
        hideDelay: 300, // ms to wait before hiding the loader
        fadeDelay: 3000, // 3000ms (3s) to keep the loader visible after page load
        forceHideTimeout: 10000, // Maximum time to show loader (safety net) increased to 10s
        debug: true // Set to true to enable console logs
    };
    
    // Safe query selector with error handling
    function safeQuery(selector) {
        try {
            return document.querySelector(selector);
        } catch (e) {
            if (config.debug) console.error('Query selector error:', e);
            return null;
        }
    }
    
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
    
    // Hide an element with fade out
    function fadeOut(element, callback) {
        if (!element) return;
        
        element.style.opacity = '0';
        element.style.transition = 'opacity 0.3s ease-out';
        
        setTimeout(() => {
            if (element && element.parentNode) {
                element.style.display = 'none';
                if (typeof callback === 'function') callback();
            }
        }, config.hideDelay);
    }
    
    // Main initialization
    function init() {
        const loader = safeQuery('#' + config.loaderId);
        const fade = safeQuery('#' + config.fadeId);
        
        if (config.debug) console.log('Initializing overlay manager...');
        
        // Function to safely hide everything
        function hideAll() {
            if (config.debug) console.log('Hiding loader and fade...');
            
            // First hide the loader
            if (loader) {
                fadeOut(loader);
            }
            
            // Then fade out the background
            if (fade) {
                // Small delay before starting fade out
                setTimeout(() => {
                    fadeOut(fade, () => {
                        if (config.debug) console.log('Cleanup complete');
                    });
                }, config.fadeDelay);
            }
            
            // Clean up any pending timeouts
            if (window.loaderTimeout) {
                clearTimeout(window.loaderTimeout);
            }
        }
        
        // Set up event listeners
        function setupEventListeners() {
            // Hide when page is fully loaded
            if (document.readyState === 'complete') {
                if (config.debug) console.log('Document already loaded, will hide loader after delay');
                // Wait for the specified fadeDelay (3s) before hiding
                setTimeout(hideAll, config.fadeDelay);
            } else {
                window.addEventListener('load', () => {
                    if (config.debug) console.log('Window loaded, will hide loader after delay');
                    // Wait for the specified fadeDelay (3s) before hiding
                    setTimeout(hideAll, config.fadeDelay);
                });
            }
            
            // Fallback: Hide everything after timeout
            window.loaderTimeout = setTimeout(() => {
                if (config.debug) console.log('Force hiding everything after timeout');
                hideAll();
            }, config.forceHideTimeout);
        }
        
        // Initialize
        setupEventListeners();
        
        // Clean up function
        return function cleanup() {
            if (window.loaderTimeout) {
                clearTimeout(window.loaderTimeout);
            }
            window.removeEventListener('load', hideAll);
        };
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // If document is already loaded, run immediately
        window.setTimeout(init, 0);
    }
    
    // Expose public API
    window.pageLoader = {
        hide: function() {
            const loader = safeQuery('#' + config.loaderId);
            const fade = safeQuery('#' + config.fadeId);
            
            if (loader) safeSetStyle(loader, { display: 'none' });
            if (fade) safeSetStyle(fade, { display: 'none' });
        }
    };
})();
