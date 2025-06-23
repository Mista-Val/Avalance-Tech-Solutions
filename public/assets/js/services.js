/**
 * Services Page Enhancements for Avalance Tech Solutions
 * Handles dynamic content, animations, and interactive elements
 */
document.addEventListener('DOMContentLoaded', function() {
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // Services data
    const services = [
        {
            id: 'it-consulting',
            icon: 'fa-laptop-code',
            title: 'IT Consultation',
            description: 'Expert technology consulting to align your business goals with the right IT strategy and solutions.',
            features: [
                'Technology roadmap planning',
                'IT infrastructure assessment',
                'Digital transformation strategy',
                'Vendor selection assistance'
            ],
            gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)'
        },
        {
            id: 'cloud-solutions',
            icon: 'fa-cloud',
            title: 'Cloud Solutions',
            description: 'Comprehensive cloud services including migration, management, and optimization for your business.',
            features: [
                'Cloud migration services',
                'Multi-cloud strategy',
                'Cloud cost optimization',
                '24/7 monitoring & support'
            ],
            gradient: 'linear-gradient(135deg, #3b82f6, #60a5fa)'
        },
        {
            id: 'cybersecurity',
            icon: 'fa-shield-alt',
            title: 'Cybersecurity',
            description: 'Protect your business from evolving cyber threats with our comprehensive security solutions.',
            features: [
                'Security assessment',
                'Threat detection & response',
                'Compliance management',
                'Employee training'
            ],
            gradient: 'linear-gradient(135deg, #10b981, #34d399)'
        },
        {
            id: 'n8n-automation',
            icon: 'fa-robot',
            title: 'n8n Automation',
            description: 'Custom workflow automation solutions to streamline your business processes and boost efficiency.',
            features: [
                'Workflow automation',
                'API integration',
                'Custom node development',
                'Process optimization'
            ],
            gradient: 'linear-gradient(135deg, #8b5cf6, #c084fc)'
        },
        {
            id: 'data-analytics',
            icon: 'fa-chart-line',
            title: 'Data Analytics',
            description: 'Transform your data into actionable insights with our advanced analytics solutions.',
            features: [
                'Business intelligence',
                'Data visualization',
                'Predictive analytics',
                'Custom reporting'
            ],
            gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)'
        },
        {
            id: 'custom-software',
            icon: 'fa-code',
            title: 'Custom Software',
            description: 'Tailored software solutions designed specifically for your business needs.',
            features: [
                'Web applications',
                'Mobile apps',
                'Enterprise software',
                'UI/UX design'
            ],
            gradient: 'linear-gradient(135deg, #ec4899, #f472b6)'
        }
    ];

    // Function to create service cards
    function createServiceCard(service) {
        const card = document.createElement('div');
        card.className = 'service-card';
        card.setAttribute('data-aos', 'fade-up');
        
        card.innerHTML = `
            <div class="service-icon" style="background: ${service.gradient}">
                <i class="fas ${service.icon}"></i>
            </div>
            <h3>${service.title}</h3>
            <p>${service.description}</p>
            <ul class="service-features">
                ${service.features.map(feature => `<li>${feature}</li>`).join('')}
            </ul>
            <a href="#contact" class="btn btn-outline-primary mt-auto">Learn More</a>
        `;
        
        return card;
    }

    // Load services into the container
    function loadServices() {
        const container = document.getElementById('services-container');
        if (!container) return;
        
        services.forEach(service => {
            const card = createServiceCard(service);
            container.appendChild(card);
        });
    }

    // Initialize services when the page loads
    loadServices();

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Account for fixed navbar
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add animation to cards on scroll
    const animateOnScroll = () => {
        const cards = document.querySelectorAll('.service-card, .industry-item');
        
        cards.forEach(card => {
            const cardPosition = card.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (cardPosition < screenPosition) {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }
        });
    };

    // Initial check for elements in viewport
    window.addEventListener('load', animateOnScroll);
    window.addEventListener('scroll', animateOnScroll);

    // Initialize AOS (Animate On Scroll) if available
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true
        });
    }
});
