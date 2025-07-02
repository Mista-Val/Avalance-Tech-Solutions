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
    
    // Hide preloader when DOM is ready instead of waiting for all resources
    const hidePreloader = () => {
        // Fade out the preloader
        preloader.style.opacity = '0';
        preloader.style.visibility = 'hidden';
        
        // Remove preloader-active class after transition completes
        setTimeout(() => {
            body.classList.remove('preloader-active');
            body.style.overflow = '';
            
            // Remove preloader from DOM after animation completes
            setTimeout(() => {
                preloader.remove();
            }, 1000);
        }, 300);
    };
    
    // Hide preloader when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', hidePreloader);
    } else {
        // DOM already loaded
        setTimeout(hidePreloader, 100);
    }
    
    // Fallback in case something goes wrong
    setTimeout(hidePreloader, 5000); // 5 second timeout as fallback
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {};
}
