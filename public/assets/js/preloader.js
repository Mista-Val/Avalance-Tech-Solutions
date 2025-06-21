/**
 * Preloader Initialization
 * Handles the page preloader animation and ensures smooth transitions
 */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    const preloader = document.getElementById('page-loader');
    const body = document.body;
    
    if (!preloader) return;
    
    // Add preloader-active class to body when preloader is active
    body.classList.add('preloader-active');
    
    // Wait for window load to ensure all resources are loaded
    window.addEventListener('load', function() {
        // Add a small delay to ensure smooth transition
        setTimeout(function() {
            // Fade out the preloader
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
            
            // Remove preloader-active class after transition completes
            setTimeout(function() {
                body.classList.remove('preloader-active');
                // Enable scrolling
                body.style.overflow = '';
                // Remove preloader from DOM after animation completes
                setTimeout(function() {
                    preloader.remove();
                }, 1000);
            }, 500);
        }, 500);
    });
    
    // Fallback in case the load event doesn't fire
    setTimeout(function() {
        if (body.classList.contains('preloader-active')) {
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
            body.classList.remove('preloader-active');
            body.style.overflow = '';
            setTimeout(function() {
                preloader.remove();
            }, 1000);
        }
    }, 10000); // 10 second timeout as fallback
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {};
}
