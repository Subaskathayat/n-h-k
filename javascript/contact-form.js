/**
 * Enhanced Contact Form Handler
 * Provides comprehensive form validation, security, accessibility, and UX improvements
 */

class ContactFormHandler {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.submitButton = document.getElementById('submitButton');
        this.formStatus = document.getElementById('formStatus');
        this.turnstileVerified = false;
        this.isSubmitting = false;
        this.rateLimitCount = 0;
        this.lastSubmissionTime = 0;
        
        // Rate limiting: max 3 submissions per 5 minutes
        this.RATE_LIMIT_MAX = 3;
        this.RATE_LIMIT_WINDOW = 5 * 60 * 1000; // 5 minutes in milliseconds
        
        this.init();
    }
    
    init() {
        if (!this.form) return;
        
        this.setupEventListeners();
        this.setupTurnstile();
        this.setupCharacterCounters();
        this.setupRealTimeValidation();
        this.loadRateLimitData();
    }
    
    setupEventListeners() {
        // Form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Prevent multiple submissions
        this.submitButton.addEventListener('click', (e) => {
            if (this.isSubmitting) {
                e.preventDefault();
                return false;
            }
        });
        
        // Reset form validation on input
        const inputs = this.form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', () => this.clearFieldError(input.id));
            input.addEventListener('blur', () => this.validateField(input));
        });
    }
    
    setupTurnstile() {
        // Global callbacks for Turnstile
        window.onTurnstileSuccess = (token) => {
            this.turnstileVerified = true;
            this.submitButton.disabled = false;
            this.clearFieldError('turnstileError');
            console.log('Turnstile verification successful');
        };
        
        window.onTurnstileExpire = () => {
            this.turnstileVerified = false;
            this.submitButton.disabled = true;
            this.showFieldError('turnstileError', 'Security verification expired. Please complete the CAPTCHA again.');
        };
        
        window.onTurnstileError = () => {
            this.turnstileVerified = false;
            this.submitButton.disabled = true;
            this.showFieldError('turnstileError', 'Security verification error. Please try again.');
        };
    }
    
    setupCharacterCounters() {
        const fields = [
            { id: 'name', counterId: 'nameCount', max: 50 },
            { id: 'email', counterId: 'emailCount', max: 100 },
            { id: 'subject', counterId: 'subjectCount', max: 100 },
            { id: 'message', counterId: 'messageCount', max: 1000 }
        ];
        
        fields.forEach(field => {
            const input = document.getElementById(field.id);
            const counter = document.getElementById(field.counterId);
            
            if (input && counter) {
                input.addEventListener('input', () => {
                    const length = input.value.length;
                    counter.textContent = `(${length}/${field.max})`;
                    
                    // Visual feedback for approaching limit
                    if (length > field.max * 0.9) {
                        counter.style.color = '#e74c3c';
                    } else if (length > field.max * 0.7) {
                        counter.style.color = '#f39c12';
                    } else {
                        counter.style.color = '#666';
                    }
                });
            }
        });
    }
    
    setupRealTimeValidation() {
        const emailInput = document.getElementById('email');
        if (emailInput) {
            emailInput.addEventListener('input', () => {
                const email = emailInput.value.trim();
                if (email && !this.isValidEmail(email)) {
                    this.showFieldError('emailError', 'Please enter a valid email address');
                } else {
                    this.clearFieldError('emailError');
                }
            });
        }
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        if (this.isSubmitting) return;
        
        // Check rate limiting
        if (!this.checkRateLimit()) {
            this.showStatus('Too many submission attempts. Please wait before trying again.', 'error');
            return;
        }
        
        // Validate all fields
        if (!this.validateForm()) {
            this.showStatus('Please fix the errors above and try again.', 'error');
            return;
        }
        
        // Check Turnstile verification
        if (!this.turnstileVerified) {
            this.showFieldError('turnstileError', 'Please complete the security verification');
            this.showStatus('Security verification required', 'error');
            return;
        }
        
        await this.submitForm();
    }
    
    validateForm() {
        let isValid = true;
        
        // Validate name
        const name = document.getElementById('name').value.trim();
        if (!name) {
            this.showFieldError('nameError', 'Name is required');
            isValid = false;
        } else if (name.length < 2) {
            this.showFieldError('nameError', 'Name must be at least 2 characters');
            isValid = false;
        } else if (!this.isValidName(name)) {
            this.showFieldError('nameError', 'Name contains invalid characters');
            isValid = false;
        }
        
        // Validate email
        const email = document.getElementById('email').value.trim();
        if (!email) {
            this.showFieldError('emailError', 'Email is required');
            isValid = false;
        } else if (!this.isValidEmail(email)) {
            this.showFieldError('emailError', 'Please enter a valid email address');
            isValid = false;
        }
        
        // Validate subject
        const subject = document.getElementById('subject').value.trim();
        if (!subject) {
            this.showFieldError('subjectError', 'Subject is required');
            isValid = false;
        } else if (subject.length < 5) {
            this.showFieldError('subjectError', 'Subject must be at least 5 characters');
            isValid = false;
        }
        
        // Validate message
        const message = document.getElementById('message').value.trim();
        if (!message) {
            this.showFieldError('messageError', 'Message is required');
            isValid = false;
        } else if (message.length < 10) {
            this.showFieldError('messageError', 'Message must be at least 10 characters');
            isValid = false;
        }
        
        // Check honeypot (spam protection)
        const honeypot = document.querySelector('input[name="botcheck"]');
        if (honeypot && honeypot.checked) {
            console.log('Spam detected via honeypot');
            isValid = false;
        }
        
        return isValid;
    }
    
    validateField(input) {
        const value = input.value.trim();
        const fieldName = input.id;
        
        switch (fieldName) {
            case 'name':
                if (value && !this.isValidName(value)) {
                    this.showFieldError('nameError', 'Name contains invalid characters');
                }
                break;
            case 'email':
                if (value && !this.isValidEmail(value)) {
                    this.showFieldError('emailError', 'Please enter a valid email address');
                }
                break;
        }
    }
    
    async submitForm() {
        this.isSubmitting = true;
        this.setLoadingState(true);
        
        try {
            const formData = new FormData(this.form);
            
            // Remove Turnstile token (Web3Forms doesn't verify it server-side on free tier)
            if (formData.has('cf-turnstile-response')) {
                formData.delete('cf-turnstile-response');
            }

            // Sanitize form data first
            const sanitizedData = this.sanitizeFormData(formData);

            // Only keep fields that Web3Forms expects for AJAX (do NOT include 'redirect' to avoid cross-origin redirect issues)
            const allowedKeys = new Set(['access_key', 'name', 'email', 'subject', 'message', 'botcheck']);
            const payload = new FormData();
            for (let [key, value] of sanitizedData.entries()) {
                if (allowedKeys.has(key)) {
                    payload.append(key, value);
                }
            }
            
            console.log('Submitting form with data:', Object.fromEntries(payload));
            
            const response = await fetch(this.form.action, {
                method: 'POST',
                body: payload,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            let result;
            try {
                result = await response.json();
            } catch (e) {
                // Fallback to text for non-JSON responses (e.g., HTML error or redirect page)
                const text = await response.text();
                console.warn('Non-JSON response body:', text);
                result = { success: false, message: text };
            }
            console.log('Form submission response (status ' + response.status + '):', result);
            
            if (response.ok && result.success) {
                this.handleSuccess();
                this.updateRateLimit();
            } else {
                // Show API-provided error message
                const msg = (result && (result.message || result.error)) ? (result.message || result.error) : 'Form submission failed';
                throw new Error(msg);
            }
            
        } catch (error) {
            console.error('Form submission error:', error);
            this.handleError(error);
        } finally {
            this.isSubmitting = false;
            this.setLoadingState(false);
        }
    }
    
    sanitizeFormData(formData) {
        const sanitized = new FormData();
        
        for (let [key, value] of formData.entries()) {
            if (typeof value === 'string') {
                // Basic XSS protection
                value = value.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
                value = value.replace(/javascript:/gi, '');
                value = value.replace(/on\w+\s*=/gi, '');
                
                // Trim whitespace
                value = value.trim();
            }
            
            sanitized.append(key, value);
        }
        
        return sanitized;
    }
    
    handleSuccess() {
        this.showStatus('Thank you! Your message has been sent successfully. We\'ll get back to you soon.', 'success');
        
        // Reset form
        this.form.reset();
        this.resetCharacterCounters();
        
        // Reset Turnstile
        if (typeof turnstile !== 'undefined') {
            turnstile.reset();
        }
        this.turnstileVerified = false;
        this.submitButton.disabled = true;
        
        // Hide submit button temporarily and show success indicator
        this.showSuccessIndicator();
        
        // Scroll to success message
        this.formStatus.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    handleError(error) {
        let errorMessage = 'Sorry, there was an error sending your message. Please try again.';
        
        const msg = (error && error.message) ? error.message : '';
        if (msg) {
            errorMessage = msg;
        }
        if (msg.toLowerCase().includes('network') || msg.toLowerCase().includes('fetch')) {
            errorMessage = 'Network error. Please check your connection and try again.';
        } else if (msg.toLowerCase().includes('rate limit')) {
            errorMessage = 'Too many requests. Please wait a moment before trying again.';
        }
        
        this.showStatus(errorMessage, 'error');
        
        // Reset Turnstile on error
        if (typeof turnstile !== 'undefined') {
            turnstile.reset();
        }
        this.turnstileVerified = false;
        this.submitButton.disabled = true;
    }
    
    showSuccessIndicator() {
        const successIndicator = document.createElement('div');
        successIndicator.className = 'success-indicator';
        successIndicator.innerHTML = `
            <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 10px; margin: 20px 0;">
                <span style="font-size: 24px;">✓</span>
                <p style="margin: 10px 0 0 0; font-weight: 600;">Message Sent Successfully!</p>
                <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.9;">Thank you for reaching out!</p>
            </div>
        `;
        
        // Hide submit button temporarily
        this.submitButton.style.display = 'none';
        
        // Insert success indicator
        this.submitButton.parentNode.insertBefore(successIndicator, this.submitButton.nextSibling);
        
        // Restore submit button after 10 seconds
        setTimeout(() => {
            if (successIndicator.parentNode) {
                successIndicator.remove();
            }
            this.submitButton.style.display = 'flex';
        }, 10000);
    }
    
    setLoadingState(loading) {
        const btnText = this.submitButton.querySelector('.btn-text');
        const btnIcon = this.submitButton.querySelector('.btn-icon');
        
        if (loading) {
            this.submitButton.classList.add('loading');
            this.submitButton.disabled = true;
            btnText.textContent = 'Sending...';
            btnIcon.textContent = '⏳';
        } else {
            this.submitButton.classList.remove('loading');
            btnText.textContent = 'Send Message';
            btnIcon.textContent = '→';
            // Button will be re-enabled by Turnstile verification
        }
    }
    
    showStatus(message, type) {
        this.formStatus.textContent = message;
        this.formStatus.className = `form-status ${type}`;
        
        // Auto-hide success messages after 8 seconds
        if (type === 'success') {
            setTimeout(() => {
                this.formStatus.className = 'form-status';
                this.formStatus.textContent = '';
            }, 8000);
        }
        
        // Announce to screen readers
        this.formStatus.setAttribute('aria-live', 'polite');
    }
    
    showFieldError(fieldId, message) {
        const errorElement = document.getElementById(fieldId);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
            
            // Add error styling to associated input
            const input = document.getElementById(fieldId.replace('Error', ''));
            if (input) {
                input.classList.add('error');
                input.setAttribute('aria-invalid', 'true');
            }
        }
    }
    
    clearFieldError(fieldId) {
        const errorId = fieldId.includes('Error') ? fieldId : fieldId + 'Error';
        const errorElement = document.getElementById(errorId);
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
        
        // Remove error styling from input
        const input = document.getElementById(fieldId.replace('Error', ''));
        if (input) {
            input.classList.remove('error');
            input.removeAttribute('aria-invalid');
        }
    }
    
    resetCharacterCounters() {
        const counters = [
            { id: 'nameCount', max: 50 },
            { id: 'emailCount', max: 100 },
            { id: 'subjectCount', max: 100 },
            { id: 'messageCount', max: 1000 }
        ];
        
        counters.forEach(counter => {
            const element = document.getElementById(counter.id);
            if (element) {
                element.textContent = `(0/${counter.max})`;
                element.style.color = '#666';
            }
        });
    }
    
    checkRateLimit() {
        const now = Date.now();
        
        // Reset count if window has passed
        if (now - this.lastSubmissionTime > this.RATE_LIMIT_WINDOW) {
            this.rateLimitCount = 0;
        }
        
        return this.rateLimitCount < this.RATE_LIMIT_MAX;
    }
    
    updateRateLimit() {
        this.rateLimitCount++;
        this.lastSubmissionTime = Date.now();
        this.saveRateLimitData();
    }
    
    loadRateLimitData() {
        try {
            const data = localStorage.getItem('contactFormRateLimit');
            if (data) {
                const parsed = JSON.parse(data);
                this.rateLimitCount = parsed.count || 0;
                this.lastSubmissionTime = parsed.lastTime || 0;
            }
        } catch (e) {
            console.warn('Could not load rate limit data:', e);
        }
    }
    
    saveRateLimitData() {
        try {
            localStorage.setItem('contactFormRateLimit', JSON.stringify({
                count: this.rateLimitCount,
                lastTime: this.lastSubmissionTime
            }));
        } catch (e) {
            console.warn('Could not save rate limit data:', e);
        }
    }
    
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email) && email.length <= 100;
    }
    
    isValidName(name) {
        // Allow letters, spaces, hyphens, apostrophes, and common international characters
        const nameRegex = /^[a-zA-Z\s\-'àáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð]+$/;
        return nameRegex.test(name) && name.length >= 2 && name.length <= 50;
    }
}

// Initialize the contact form handler when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ContactFormHandler();
});

// Export for potential use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ContactFormHandler;
}
