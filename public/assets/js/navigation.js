/**
 * Navigation and Scroll Manager
 * Handles smooth scrolling, active nav link highlighting, and scroll-based effects
 */

class NavigationManager {
    constructor() {
        this.sections = document.querySelectorAll('section[id]');
        this.navLinks = document.querySelectorAll('#mainNav .nav-link');
        this.navbar = document.querySelector('.navbar');
        this.ticking = false;
        
        this.init();
    }
    
    init() {
        this.setupSmoothScrolling();
        this.setupScrollSpy();
        this.setupNavbarScroll();
        this.updateActiveNavLink(); // Initial update
    }
    
    setupSmoothScrolling() {
        document.addEventListener('click', (e) => {
            const anchor = e.target.closest('a[href^="#"]');
            if (!anchor || anchor.getAttribute('href') === '#') return;
            
            try {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (!targetElement) return;

                // Close mobile menu if open
                this.closeMobileMenu();

                // Calculate header offset considering fixed header
                const headerOffset = 120;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                // Check if we're at the bottom of the page
                const isAtBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
                
                // If at bottom, scroll up a bit first to ensure smooth scrolling works
                if (isAtBottom) {
                    window.scrollTo({
                        top: document.body.scrollHeight - window.innerHeight - 50,
                        behavior: 'smooth'
                    });
                    
                    // Wait for the scroll to complete, then scroll to target
                    setTimeout(() => {
                        const newElementPosition = targetElement.getBoundingClientRect().top;
                        const newOffsetPosition = newElementPosition + window.pageYOffset - headerOffset;
                        
                        window.scrollTo({
                            top: newOffsetPosition,
                            behavior: 'smooth'
                        });
                    }, 300);
                } else {
                    // Normal smooth scroll
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }


                // Update URL without page jump
                if (history.pushState) {
                    history.pushState(null, null, targetId);
                } else {
                    location.hash = targetId;
                }
            } catch (error) {
                // Silently fail
            }
        });
    }
    
    closeMobileMenu() {
        const navbarCollapse = document.querySelector('.navbar-collapse.show');
        if (navbarCollapse) {
            const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse) || 
                new bootstrap.Collapse(navbarCollapse, { toggle: false });
            bsCollapse.hide();
        }
    }
    
    setupScrollSpy() {
        // Initial check
        this.updateActiveNavLink();
        
        // Throttle scroll events for better performance
        let isScrolling;
        window.addEventListener('scroll', () => {
            window.clearTimeout(isScrolling);
            isScrolling = setTimeout(() => {
                this.updateActiveNavLink();
            }, 50);
        }, { passive: true });
        
        // Also check on window resize as section positions might change
        window.addEventListener('resize', () => {
            this.updateActiveNavLink();
        });
    }
    
    updateActiveNavLink() {
        const scrollPosition = window.scrollY + 100; // Slight offset to activate sections a bit earlier
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        
        // Check if we're at the bottom of the page
        const isAtBottom = window.scrollY + windowHeight >= documentHeight - 50;
        
        // If at bottom, activate the last section
        if (isAtBottom && this.sections.length > 0) {
            const lastSection = this.sections[this.sections.length - 1];
            const lastSectionId = lastSection.getAttribute('id');
            this.setActiveLink(lastSectionId);
            return;
        }
        
        // Normal scroll position handling
        let currentSectionId = '';
        
        this.sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = sectionId;
            }
        });
        
        if (currentSectionId) {
            this.setActiveLink(currentSectionId);
        }
    }
    
    setActiveLink(sectionId) {
        this.navLinks.forEach(link => {
            const href = link.getAttribute('href');
            const isActive = href === `#${sectionId}` || 
                           (href.includes('#') && href.split('#')[1] === sectionId);
            
            if (isActive) {
                link.classList.add('active');
                // Also update mobile menu active state
                const mobileLink = document.querySelector(`.mobile-nav-link[href="#${sectionId}"]`);
                if (mobileLink) {
                    document.querySelectorAll('.mobile-nav-link').forEach(link => link.classList.remove('active'));
                    mobileLink.classList.add('active');
                }
            } else {
                link.classList.remove('active');
            }
        });
    }
    
    setupNavbarScroll() {
        if (!this.navbar) return;
        
        const updateNavbar = () => {
            if (window.scrollY > 50) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }
        };
        
        window.addEventListener('scroll', updateNavbar, { passive: true });
        updateNavbar(); // Initial check
    }
}

// Initialize NavigationManager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.navigationManager = new NavigationManager();
});
