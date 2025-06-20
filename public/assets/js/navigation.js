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

                // Smooth scroll to target
                const headerOffset = 120;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

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
        if (typeof bootstrap !== 'undefined' && bootstrap.ScrollSpy) {
            new bootstrap.ScrollSpy(document.body, {
                target: '#mainNav',
                offset: 100
            });
        }
        
        window.addEventListener('scroll', () => {
            if (!this.ticking) {
                window.requestAnimationFrame(() => {
                    this.updateActiveNavLink();
                    this.ticking = false;
                });
                this.ticking = true;
            }
        }, { passive: true });
    }
    
    updateActiveNavLink() {
        try {
            let current = '';
            const scrollPosition = window.scrollY + 100;

            this.sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    current = '#' + section.id;
                }
            });

            this.navLinks.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === current);
            });
        } catch (error) {
            // Silently fail
        }
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
