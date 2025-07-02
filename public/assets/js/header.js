class HeaderManager {
    constructor() {
        // Cache DOM elements
        this.navbar = document.querySelector('.main-header');
        this.navbarToggler = document.querySelector('.navbar-toggler');
        this.navbarCollapse = document.getElementById('navbarNav');
        this.backdrop = document.querySelector('.mobile-menu-backdrop');
        this.body = document.body;
        this.mobileMenuOverlay = null;
        
        // State
        this.isMenuOpen = false;
        this.scrollPosition = 0;
        this.lastScrollTop = 0;
        
        // Bootstrap collapse instance
        this.collapseInstance = null;
        
        // Bind methods
        this.toggleMobileMenu = this.toggleMobileMenu.bind(this);
        this.handleOutsideClick = this.handleOutsideClick.bind(this);
        this.handleResize = this.handleResize.bind(this);
        this.updateNavbarOnScroll = this.updateNavbarOnScroll.bind(this);
        this.highlightNav = this.highlightNav.bind(this);
        this.openMenu = this.openMenu.bind(this);
        this.closeMenu = this.closeMenu.bind(this);
        this.initMobileMenu = this.initMobileMenu.bind(this);
        
        // Initialize
        this.init();
    }
    
    /**
     * Initialize the header manager
     */
    init() {
        this.cacheElements();
        this.initBootstrapCollapse();
        this.initEventListeners();
        this.handleResize(); // Initial check
        this.updateNavbarOnScroll(); // Initial check
        this.initMobileMenu();
    }
    
    /**
     * Initialize mobile menu functionality
     */
    initMobileMenu() {
        // Create mobile menu overlay
        this.mobileMenuOverlay = document.createElement('div');
        this.mobileMenuOverlay.className = 'mobile-menu-overlay';
        document.body.appendChild(this.mobileMenuOverlay);
        
        // Add event listeners for mobile menu
        if (this.navbarToggler) {
            this.navbarToggler.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleMobileMenu();
            });
        }
        
        // Close menu when clicking outside
        this.mobileMenuOverlay.addEventListener('click', () => {
            this.closeMenu();
        });
        
        // Close menu when clicking on nav links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 991.98) {
                    this.closeMenu();
                }
            });
        });
    }
    
    /**
     * Initialize Bootstrap Collapse
     */
    initBootstrapCollapse() {
        if (this.navbarCollapse) {
            this.collapseInstance = new bootstrap.Collapse(this.navbarCollapse, {
                toggle: false
            });
            
            // Listen for Bootstrap collapse events
            this.navbarCollapse.addEventListener('show.bs.collapse', () => {
                this.openMenu();
            });
            
            this.navbarCollapse.addEventListener('shown.bs.collapse', () => {
                this.isMenuOpen = true;
            });
            
            this.navbarCollapse.addEventListener('hide.bs.collapse', () => {
                this.closeMenu();
            });
            
            this.navbarCollapse.addEventListener('hidden.bs.collapse', () => {
                this.isMenuOpen = false;
            });
        }
    }
    
    /**
     * Cache DOM elements
     */
    cacheElements() {
        this.navbar = document.querySelector('.main-header');
        this.navbarToggler = document.querySelector('.navbar-toggler');
        this.navbarCollapse = document.querySelector('.navbar-collapse');
        this.backdrop = document.querySelector('.mobile-menu-backdrop');
        this.body = document.body;
    }
    
    /**
     * Initialize event listeners
     */
    initEventListeners() {
        // Toggle mobile menu
        if (this.navbarToggler) {
            this.navbarToggler.addEventListener('click', this.toggleMobileMenu);
        }
        
        // Close menu when clicking on a nav link
        const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });
        
        // Handle window resize
        window.addEventListener('resize', this.handleResize);
        
        // Handle scroll
        window.addEventListener('scroll', this.updateNavbarOnScroll, { passive: true });
        
        // Close menu when clicking on backdrop
        if (this.backdrop) {
            this.backdrop.addEventListener('click', () => this.closeMenu());
        }
    }
    
    /**
     * Toggle mobile menu
     */
    toggleMobileMenu() {
        if (this.isMenuOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
        // Toggle body class for scroll control
        document.body.classList.toggle('mobile-menu-open', !this.isMenuOpen);
        
        // Prevent scroll when menu is open
        if (!this.isMenuOpen) {
            this.scrollPosition = window.pageYOffset;
        } else {
            window.scrollTo(0, this.scrollPosition);
        }
    }
    
    /**
     * Open mobile menu
     */
    openMenu() {
        if (this.isMenuOpen) return;
        
        // Store scroll position
        this.scrollPosition = window.scrollY;
        
        // Add classes to show menu and backdrop
        if (this.backdrop) this.backdrop.classList.add('active');
        document.body.classList.add('menu-open', 'mobile-menu-open');
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.top = `-${this.scrollPosition}px`;
        document.body.style.width = '100%';
        
        // Update state
        this.isMenuOpen = true;
        
        // Add click outside handler
        document.addEventListener('click', this.handleOutsideClick);
    }
    
    /**
     * Close mobile menu
     */
    closeMenu() {
        if (!this.isMenuOpen) return;
        
        // Hide Bootstrap collapse if available
        if (this.collapseInstance) {
            this.collapseInstance.hide();
        }
        
        // Hide backdrop if available
        if (this.backdrop) {
            this.backdrop.classList.remove('active');
        }
        
        // Update state
        this.isMenuOpen = false;
        
        // Update toggle button state
        if (this.navbarToggler) {
            this.navbarToggler.classList.remove('active');
            this.navbarToggler.setAttribute('aria-expanded', 'false');
        }
        
        // Hide mobile menu overlay
        if (this.mobileMenuOverlay) {
            this.mobileMenuOverlay.classList.remove('show');
        }
        
        // Re-enable body scroll
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.paddingRight = '';
        
        // Restore scroll position
        if (this.scrollPosition) {
            window.scrollTo(0, this.scrollPosition);
        }
        
        // Remove menu open classes from body
        document.body.classList.remove('menu-open', 'mobile-menu-open');
        
        // Remove click outside handler
        document.removeEventListener('click', this.handleOutsideClick);
    }
    
    /**
     * Handle window resize
     */
    handleResize() {
        // Close menu when resizing to desktop
        if (window.innerWidth > 991.98) {
            this.closeMenu();
        }
        // No need to update header height CSS variable as it's now static
    }
    
    /**
     * Handle clicks outside the menu
     */
    handleOutsideClick(event) {
        if (this.isMenuOpen && 
            this.navbarCollapse && 
            this.navbarToggler &&
            !this.navbarCollapse.contains(event.target) && 
            !this.navbarToggler.contains(event.target)) {
            
            // Close the menu using Bootstrap's collapse
            if (this.collapseInstance) {
                this.collapseInstance.hide();
            }
        }
    }
    
    /**
     * Update navbar on scroll
     */
    updateNavbarOnScroll() {
        if (!this.navbar) return;
        
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Only update scrolled class for styling, no position changes
        if (scrollTop > 50) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }
        
        // Update last scroll position
        this.lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }
    
    /**
     * Highlight current section in navigation
     */
    highlightNav() {
        const scrollPosition = window.scrollY;
        
        document.querySelectorAll('section[id]').forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                document.querySelector(`.nav-link[href*="${sectionId}"]`).classList.add('active');
            } else {
                const navLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);
                if (navLink) navLink.classList.remove('active');
            }
        });
    }
}

// Initialize the header manager as early as possible
const initHeaderManager = () => {
    // Check if we're not in an iframe to avoid duplicate initializations
    if (window.self === window.top) {
        new HeaderManager();
    }
};

// Initialize header manager when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeaderManager);
} else {
    // DOM already loaded
    setTimeout(initHeaderManager, 0);
}
