document.addEventListener("DOMContentLoaded", function() {
    // Helper functions
    const showElement = (el) => {
        if (!el) return;
        el.style.display = "block";
        el.style.opacity = "0";
        el.style.transition = "opacity 0.3s ease";
        setTimeout(() => el.style.opacity = "1", 10);
    };

    const hideElement = (el, callback) => {
        if (!el) return;
        el.style.opacity = "0";
        el.style.transition = "opacity 0.3s ease";
        setTimeout(() => {
            el.style.display = "none";
            if (callback) callback();
        }, 300);
    };

    // Show alert function (can be called from anywhere)
    function showAlert(message, type = 'info') {
        // Try to find existing alert container or create one
        let alertContainer = document.getElementById('alertContainer');
        
        if (!alertContainer) {
            // Create alert container if it doesn't exist
            alertContainer = document.createElement('div');
            alertContainer.id = 'alertContainer';
            alertContainer.style.position = 'fixed';
            alertContainer.style.top = '20px';
            alertContainer.style.left = '50%';
            alertContainer.style.transform = 'translateX(-50%)';
            alertContainer.style.zIndex = '9999';
            alertContainer.style.width = '90%';
            alertContainer.style.maxWidth = '600px';
            document.body.appendChild(alertContainer);
        }

        // Create alert element
        const alertEl = document.createElement('div');
        alertEl.className = `alert alert-${type} alert-dismissible fade show`;
        alertEl.role = 'alert';
        alertEl.style.boxShadow = '0 0.5rem 1rem rgba(0,0,0,0.15)';
        
        // Add close button
        const closeBtn = document.createElement('button');
        closeBtn.type = 'button';
        closeBtn.className = 'btn-close';
        closeBtn.setAttribute('data-bs-dismiss', 'alert');
        closeBtn.setAttribute('aria-label', 'Close');
        
        // Add message content
        const messageEl = document.createElement('div');
        messageEl.innerHTML = message;
        
        // Assemble alert
        alertEl.appendChild(messageEl);
        alertEl.appendChild(closeBtn);
        
        // Add to container
        alertContainer.appendChild(alertEl);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            alertEl.classList.remove('show');
            setTimeout(() => {
                if (alertEl.parentNode === alertContainer) {
                    alertContainer.removeChild(alertEl);
                }
            }, 300);
        }, 5000);
    }

    // Form handling for all forms
    function setupForm(form) {
        if (!form) return;
        
        // Add real-time validation for input fields
        const inputFields = form.querySelectorAll('input, textarea, select');
        inputFields.forEach(field => {
            // Validate on blur
            field.addEventListener('blur', function() {
                validateField(this);
            });
            
            // Clear validation on input
            field.addEventListener('input', function() {
                if (this.classList.contains('is-invalid')) {
                    this.classList.remove('is-invalid');
                    const errorElement = this.nextElementSibling;
                    if (errorElement && errorElement.classList.contains('invalid-feedback')) {
                        errorElement.textContent = '';
                    }
                }
            });
        });
        
        // Field validation function
        function validateField(field) {
            if (!field.required) return true;
            
            let isValid = true;
            const value = field.value.trim();
            
            // Check if field is empty
            if (!value) {
                showFieldError(field, `${field.placeholder || 'This field'} is required`);
                return false;
            }
            
            // Validate email format
            if (field.type === 'email') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    showFieldError(field, 'Please enter a valid email address');
                    return false;
                }
            }
            
            // Validate phone number if needed
            if (field.type === 'tel' || field.name.includes('phone')) {
                const phoneRegex = /^[\+\d\s\-\(\)]{10,}$/;
                if (!phoneRegex.test(value)) {
                    showFieldError(field, 'Please enter a valid phone number');
                    return false;
                }
            }
            
            // Clear any existing error
            if (field.classList.contains('is-invalid')) {
                field.classList.remove('is-invalid');
                const errorElement = field.nextElementSibling;
                if (errorElement && errorElement.classList.contains('invalid-feedback')) {
                    errorElement.textContent = '';
                }
            }
            
            return true;
        }
        
        // Show field error
        function showFieldError(field, message) {
            field.classList.add('is-invalid');
            let errorElement = field.nextElementSibling;
            
            if (!errorElement || !errorElement.classList.contains('invalid-feedback')) {
                errorElement = document.createElement('div');
                errorElement.className = 'invalid-feedback';
                field.parentNode.insertBefore(errorElement, field.nextSibling);
            }
            
            errorElement.textContent = message;
        }
        
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Reset previous validation states and messages
            form.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
            form.querySelectorAll('.invalid-feedback').forEach(el => el.textContent = '');
            
            // Validate all fields
            let isValid = true;
            const requiredFields = form.querySelectorAll('[required]');
            
            // First validate all fields except checkboxes
            requiredFields.forEach(field => {
                if (field.type !== 'checkbox' && !validateField(field)) {
                    isValid = false;
                }
            });
            
            // Special handling for required checkboxes
            const requiredCheckboxes = form.querySelectorAll('input[type="checkbox"][required]');
            if (requiredCheckboxes.length > 0) {
                const checkedBoxes = form.querySelectorAll('input[type="checkbox"]:checked');
                if (checkedBoxes.length === 0) {
                    // Show error for the first required checkbox
                    showFieldError(requiredCheckboxes[0], 'Please select at least one service');
                    isValid = false;
                }
            }
            
            if (!isValid) {
                // Show general error message
                const alertDiv = form.querySelector('.alert') || document.createElement('div');
                alertDiv.className = 'alert alert-danger mb-4';
                alertDiv.innerHTML = '<strong>Please fix the following issues:</strong><ul class="mb-0 mt-2"></ul>';
                
                const errorList = alertDiv.querySelector('ul');
                form.querySelectorAll('.is-invalid').forEach(field => {
                    const errorMsg = field.nextElementSibling?.textContent || 'This field is invalid';
                    const fieldName = field.getAttribute('name') || field.getAttribute('id') || 'Field';
                    errorList.innerHTML += `<li><strong>${fieldName}:</strong> ${errorMsg}</li>`;
                });
                
                if (!form.contains(alertDiv)) {
                    form.prepend(alertDiv);
                }
                
                // Scroll to first error
                const firstError = form.querySelector('.is-invalid');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    firstError.focus();
                }
                
                return;
            }
            
            // Convert FormData to object
            const formData = new FormData(form);
            const formObject = {}; // Initialize formObject
            
            formData.forEach((value, key) => {
                if (key.endsWith('[]')) {
                    const cleanKey = key.replace('[]', '');
                    if (!formObject[cleanKey]) {
                        formObject[cleanKey] = [];
                    }
                    formObject[cleanKey].push(value);
                } else {
                    formObject[key] = value;
                }
            });

            // Map Business IT form fields to match server expectations
            if (form.id === 'businessItForm') {
                formObject.name = formObject.contactName || formObject.name || '';
                formObject.message = formObject.challenges || formObject.message || '';
                // Map other fields if needed
            }
            
            // Get form type based on form ID and determine if it's a pricing request
            let formType = 'contact';
            let isPricingRequest = false;
            
            if (['businessItForm', 'cloudInfraForm', 'customDevForm'].includes(form.id)) {
                isPricingRequest = true;
                if (form.id === 'businessItForm') formType = 'business_it_solutions';
                else if (form.id === 'cloudInfraForm') formType = 'cloud_infrastructure';
                else if (form.id === 'customDevForm') formType = 'custom_development';
            }
            
            // Add form type to data
            formObject.formType = formType;
            
            // Show loading state
            const submitButton = form.querySelector('button[type="submit"]');
            const originalButtonHTML = submitButton?.innerHTML || '';
            let error = null; // Initialize error variable
            
            if (submitButton) {
                // Disable all form elements to prevent multiple submissions
                const formElements = form.elements;
                for (let i = 0; i < formElements.length; i++) {
                    formElements[i].setAttribute('disabled', 'disabled');
                }
                
                // Show loading state in button
                submitButton.classList.add('disabled');
                submitButton.setAttribute('aria-disabled', 'true');
                
                // Update button content to show loading state
                const spinner = submitButton.querySelector('.spinner-border') || 
                              document.createElement('span');
                spinner.className = 'spinner-border spinner-border-sm me-2';
                spinner.setAttribute('role', 'status');
                spinner.setAttribute('aria-hidden', 'true');
                
                const btnText = submitButton.querySelector('.btn-text') || 
                              document.createElement('span');
                btnText.className = 'btn-text';
                btnText.textContent = 'Sending...';
                
                submitButton.innerHTML = '';
                submitButton.appendChild(spinner);
                submitButton.appendChild(btnText);
                
                // Add sr-only loading text for screen readers
                const srText = document.createElement('span');
                srText.className = 'visually-hidden';
                srText.textContent = 'Sending your message, please wait...';
                submitButton.appendChild(srText);
            }
            
            try {
                // Determine the API endpoint based on form type
                const apiEndpoint = isPricingRequest ? '/api/pricing-requests' : '/api/contacts';
                
                // Send data to server
                const response = await fetch(apiEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(formObject)
                });
                
                const data = await response.json();
                
                if (!response.ok) {
                    const errorMessage = isPricingRequest 
                        ? data.message || 'Failed to submit pricing request. Please try again.'
                        : data.message || 'Failed to submit form';
                    throw new Error(errorMessage);
                }
                
                // Show success message
                let successMessage = form.dataset.successMessage;
                if (!successMessage) {
                    successMessage = isPricingRequest 
                        ? 'Your pricing request has been submitted successfully! Our team will review your details and provide a customized quote soon.'
                        : 'Your request has been submitted successfully! We will get back to you soon.';
                }
                
                // Create success alert
                const successAlert = document.createElement('div');
                successAlert.className = 'alert alert-success alert-dismissible fade show';
                successAlert.role = 'alert';
                successAlert.innerHTML = `
                    <div class="d-flex align-items-center">
                        <i class="fas fa-check-circle me-2"></i>
                        <div>${successMessage}</div>
                    </div>
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                `;
                
                
                // Remove any existing error messages
                const existingErrorAlerts = form.querySelectorAll('.alert.alert-danger');
                existingErrorAlerts.forEach(alert => alert.remove());
                
                // Reset form
                form.reset();
                
                // Dispatch custom event for form success
                form.dispatchEvent(new CustomEvent('form:success', { bubbles: true }));
                
                // Check if this is a modal form
                const modal = form.closest('.modal');
                if (modal) {
                    // Save scroll position before refreshing
                    const scrollPosition = window.scrollY || document.documentElement.scrollTop;
                    sessionStorage.setItem('scrollPosition', scrollPosition);
                    
                    // Close the modal after a short delay to show success message
                    setTimeout(() => {
                        const modalInstance = bootstrap.Modal.getInstance(modal);
                        if (modalInstance) {
                            modalInstance.hide();
                        }
                        
                        // Refresh the page after modal is hidden
                        modal.addEventListener('hidden.bs.modal', function handler() {
                            modal.removeEventListener('hidden.bs.modal', handler);
                            window.location.reload();
                        }, { once: true });
                    }, 1500); // 1.5 seconds delay before closing modal
                }
                
            } catch (err) {
                error = err; // Store the error for use in finally block
                console.error('Error submitting form:', error);
                
                // Create error alert
                const errorAlert = form.querySelector('.alert.alert-danger') || document.createElement('div');
                errorAlert.className = 'alert alert-danger alert-dismissible fade show';
                errorAlert.role = 'alert';
                
                // Parse error message (could be from server or client)
                let errorMessage = 'An error occurred while submitting the form. Please try again.';
                
                try {
                    // Try to parse server error response
                    if (error.response) {
                        const data = await error.response.json();
                        errorMessage = data.message || errorMessage;
                    } else {
                        errorMessage = error.message || errorMessage;
                    }
                } catch (e) {
                    console.error('Error parsing error response:', e);
                }
                
                errorAlert.innerHTML = `
                    <div class="d-flex align-items-center">
                        <i class="fas fa-exclamation-circle me-2"></i>
                        <div>${errorMessage}</div>
                    </div>
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                `;
                
                // Insert error message at the top of the form
                if (!form.contains(errorAlert)) {
                    form.prepend(errorAlert);
                }
                
                // Scroll to error message
                errorAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                // Dispatch custom event for form error
                form.dispatchEvent(new CustomEvent('form:error', { 
                    bubbles: true,
                    detail: { error: error.message || errorMessage }
                }));
                
            } finally {
                // Reset form state
                if (submitButton) {
                    // Re-enable all form elements
                    const formElements = form.elements;
                    for (let i = 0; i < formElements.length; i++) {
                        formElements[i].removeAttribute('disabled');
                    }
                    
                    // Reset button state
                    submitButton.classList.remove('disabled');
                    submitButton.removeAttribute('aria-disabled');
                    submitButton.innerHTML = originalButtonHTML;
                    
                    // Focus on first form element if there was an error
                    if (error) {
                        const firstInput = form.querySelector('input, textarea, select');
                        if (firstInput) {
                            firstInput.focus();
                        }
                    }
                }
            }
        });
    }
    
    // Initialize all forms on the page
    document.querySelectorAll('form').forEach(setupForm);
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href*="#"]:not([href="#"])').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') && 
                location.hostname === this.hostname) {
                const target = document.getElementById(this.hash.slice(1));
                if (target) {
                    e.preventDefault();
                    window.scrollTo({
                        top: target.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Restore scroll position if it was saved
    const savedScrollPosition = sessionStorage.getItem('scrollPosition');
    if (savedScrollPosition !== null) {
        // Remove the saved position so it doesn't affect future page loads
        sessionStorage.removeItem('scrollPosition');
        
        // Scroll to the saved position after a short delay to ensure the page is fully loaded
        setTimeout(() => {
            window.scrollTo({
                top: parseInt(savedScrollPosition, 10),
                behavior: 'auto'
            });
        }, 50);
    }
    
    // Initialize tooltips
    if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }
    
    // Initialize popovers
    if (typeof bootstrap !== 'undefined' && bootstrap.Popover) {
        const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
        popoverTriggerList.map(function (popoverTriggerEl) {
            return new bootstrap.Popover(popoverTriggerEl);
        });
    }
    
    // Initialize AOS (Animate On Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            mirror: false
        });
    }
});