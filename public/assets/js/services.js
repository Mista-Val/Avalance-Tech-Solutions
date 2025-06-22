/**
 * Services Data and Dynamic Loading for Avalance Tech Solutions
 * This file handles the dynamic loading and display of services
 */

document.addEventListener('DOMContentLoaded', function() {
    // Services data - can be fetched from an API in the future
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
            ]
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
            ]
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
            ]
        },
        {
            id: 'n8n-automation',
            icon: 'fa-robot',
            title: 'n8n Automation',
            description: 'Custom workflow automation solutions to streamline your business processes and boost efficiency.',
            features: [
                'Custom workflow development',
                'API integration',
                'Process automation',
                'Ongoing support'
            ]
        },
        {
            id: 'custom-software',
            icon: 'fa-code',
            title: 'Custom Software',
            description: 'Tailored software solutions designed to meet your specific business requirements.',
            features: [
                'Custom application development',
                'Web & mobile solutions',
                'Legacy system modernization',
                'Maintenance & support'
            ]
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
                'Custom dashboards'
            ]
        }
    ];

    // Function to create service cards
    function createServiceCard(service) {
        return `
            <div class="col-md-6 col-lg-4" data-aos="fade-up">
                <div class="service-card" id="${service.id}">
                    <div class="service-icon">
                        <i class="fas ${service.icon}"></i>
                    </div>
                    <h3>${service.title}</h3>
                    <p>${service.description}</p>
                    <div class="service-features">
                        <ul>
                            ${service.features.map(feature => `<li>${feature}</li>`).join('')}
                        </ul>
                    </div>
                    <a href="#contact" class="service-link">Learn More <i class="fas fa-arrow-right"></i></a>
                </div>
            </div>
        `;
    }

    // Load services into the container
    function loadServices() {
        const container = document.getElementById('services-container');
        if (container) {
            container.innerHTML = services.map(createServiceCard).join('');
        }
    }

    // Initialize services when the page loads
    loadServices();

    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Adjust for fixed header
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add animation to service cards on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate__animated', 'animate__fadeInUp');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all service cards
    document.querySelectorAll('.service-card').forEach(card => {
        observer.observe(card);
    });
});
