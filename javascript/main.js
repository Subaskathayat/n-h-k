/**
 * Main Application JavaScript
 * Handles navigation, modals, animations, and core UI interactions
 */

'use strict';

// ===== Configuration Constants =====
const CONFIG = {
  BREAKPOINTS: {
    MOBILE: 992
  },
  SCROLL_THRESHOLD: 50,
  ANIMATION: {
    THRESHOLD: 0.1,
    ROOT_MARGIN: '0px 0px -100px 0px'
  },
  TOAST_DURATION: 3000
};

// ===== Application Class =====
class ChefWebsiteApp {
  constructor() {
    this.elements = this.initializeElements();
    this.state = {
      isMenuOpen: false,
      isSubmitting: false
    };
    
    this.init();
  }

  initializeElements() {
    return {
      navbar: document.querySelector('.header'),
      navbarMenu: document.querySelector('.navbar__menu'),
      navbarContainer: document.querySelector('.navbar'),
      navToggle: document.querySelector('.navbar__toggle'),
      primaryMenu: document.getElementById('primary-menu'),
      dishButtons: document.querySelectorAll('[data-dish]'),
      newsletterForm: document.querySelector('.newsletter'),
      sections: document.querySelectorAll('section'),
      recipeNavs: document.querySelectorAll('.recipes-nav'),
      sendButtons: document.querySelectorAll('a[href="contact.html"].btn--outline'),
      messageModal: document.getElementById('messageModal'),
      messageForm: document.getElementById('messageForm')
    };
  }

  init() {
    this.setupNavigation();
    this.setupModals();
    this.setupAnimations();
    this.setupNewsletterForm();
    this.setupScrollEffects();
    this.setupVideoOptimization();
    this.setupCalendlyIntegration();
    
    console.log('Chef Website App initialized successfully');
  }

  // ===== Navigation Setup =====
  setupNavigation() {
    this.setupResponsiveNavbar();
    this.setupRecipeNavigation();
    this.setupStickyHeader();
  }

  setupResponsiveNavbar() {
    const { navToggle, navbarContainer, primaryMenu } = this.elements;
    
    if (!navToggle || !navbarContainer || !primaryMenu) return;

    // Toggle button click handler
    navToggle.addEventListener('click', () => {
      this.toggleMobileMenu();
    });

    // Close menu when clicking on links
    primaryMenu.addEventListener('click', (e) => {
      if (e.target.closest('a')) {
        this.setMenuState(false);
      }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.state.isMenuOpen) {
        this.setMenuState(false);
      }
    });

    // Close menu on desktop resize
    window.addEventListener('resize', this.debounce(() => {
      if (window.innerWidth > CONFIG.BREAKPOINTS.MOBILE) {
        this.setMenuState(false);
      }
    }, 250));
  }

  setupRecipeNavigation() {
    // Recipe navigation dropdown handling
    this.elements.recipeNavs.forEach(nav => {
      const mainLink = nav.querySelector('.nav-main');
      if (mainLink) {
        // Navigation is handled by CSS hover, no JS needed
        mainLink.addEventListener('click', () => {
          // Allow normal navigation
        });
      }
    });

    // Close recipe snippets when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.recipes-nav')) {
        document.querySelectorAll('.recipes-snippet').forEach(snippet => {
          snippet.style.display = 'none';
        });
      }
    });
  }

  setupStickyHeader() {
    let ticking = false;
    
    const updateHeader = () => {
      const { navbar } = this.elements;
      if (navbar) {
        navbar.classList.toggle('scrolled', window.scrollY > CONFIG.SCROLL_THRESHOLD);
      }
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateHeader);
        ticking = true;
      }
    });
  }

  toggleMobileMenu() {
    this.setMenuState(!this.state.isMenuOpen);
  }

  setMenuState(isOpen) {
    const { navbarContainer, navToggle } = this.elements;
    
    if (!navbarContainer || !navToggle) return;
    
    this.state.isMenuOpen = isOpen;
    navbarContainer.classList.toggle('navbar--open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
    
    // Manage body scroll for mobile
    if (isOpen && window.innerWidth <= CONFIG.BREAKPOINTS.MOBILE) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  // ===== Modal Setup =====
  setupModals() {
    this.setupDishModals();
    this.setupMessageModal();
  }

  setupDishModals() {
    const { dishButtons } = this.elements;
    
    dishButtons.forEach(button => {
      button.addEventListener('click', () => {
        const dishName = button.getAttribute('data-dish');
        this.openDishModal(dishName);
      });
    });
  }

  openDishModal(dishName) {
    // Dish data - in production, this would come from a CMS/API
    const dishData = {
      'samosa': {
        title: 'Deconstructed Samosa',
        story: `This dish reimagines my grandmother's roadside samosa stall through molecular gastronomy. The potato foam is infused with 14 spices from her secret blend, while the tamarind gel replicates the chutney she served to me after school.`,
        ingredients: ['Organic potatoes', 'Heirloom spices', 'Tamarind reduction', 'Filo crisp'],
        pairing: 'Pairs beautifully with our Darjeeling First Flush Tea'
      },
      'rogan-josh': {
        title: 'Saffron-Infused Rogan Josh',
        story: 'Inspired by my apprenticeship in Kashmir, this 72-hour slow-cooked lamb incorporates saffron harvested by the same family I lived with in Pampore. The rose petals are hand-pressed from their garden.',
        ingredients: ['New Zealand lamb rack', 'Kashmiri saffron', 'Rose petals', 'Heirloom garlic'],
        pairing: 'Best enjoyed with our Sommelier-selected Syrah'
      }
    };

    const dish = dishData[dishName];
    if (!dish) return;
    
    // Create modal HTML
    const modalHTML = `
      <div class="modal-overlay">
        <div class="modal">
          <button class="modal-close" aria-label="Close modal">&times;</button>
          <div class="modal-content">
            <h3>${dish.title}</h3>
            <div class="modal-story">
              <h4>The Story</h4>
              <p>${dish.story}</p>
            </div>
            <div class="modal-ingredients">
              <h4>Key Ingredients</h4>
              <ul>
                ${dish.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
              </ul>
            </div>
            <div class="modal-pairing">
              <h4>Perfect Pairing</h4>
              <p>${dish.pairing}</p>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // Add modal to page
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Setup modal event listeners
    const modal = document.querySelector('.modal-overlay');
    const closeBtn = modal.querySelector('.modal-close');
    
    closeBtn.addEventListener('click', () => this.closeDishModal());
    modal.addEventListener('click', (e) => {
      if (e.target === modal) this.closeDishModal();
    });
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
  }

  closeDishModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
      modal.remove();
      document.body.style.overflow = '';
    }
  }

  // ===== Newsletter Form Setup =====
  setupNewsletterForm() {
    const { newsletterForm } = this.elements;
    
    if (!newsletterForm) return;

    newsletterForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      if (this.state.isSubmitting) return;
      
      const emailInput = newsletterForm.querySelector('input[type="email"]');
      const email = emailInput.value.trim();

      if (!this.isValidEmail(email)) {
        this.showToast('Please enter a valid email address', 'error');
        return;
      }

      try {
        this.state.isSubmitting = true;
        this.showToast('Subscribing...', 'info');
        
        // Simulate API call - replace with actual newsletter service
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        this.showToast('Thank you for subscribing!', 'success');
        newsletterForm.reset();
      } catch (error) {
        this.showToast('Subscription failed. Please try again.', 'error');
        console.error('Newsletter subscription error:', error);
      } finally {
        this.state.isSubmitting = false;
      }
    });
  }

  // ===== Animation Setup =====
  setupAnimations() {
    this.setupScrollAnimations();
  }

  setupScrollAnimations() {
    const { sections } = this.elements;
    
    if (!sections.length) return;

    const observerOptions = {
      threshold: CONFIG.ANIMATION.THRESHOLD,
      rootMargin: CONFIG.ANIMATION.ROOT_MARGIN
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    sections.forEach(section => {
      observer.observe(section);
    });
  }

  setupScrollEffects() {
    // Additional scroll-based effects can be added here
  }

  setupVideoOptimization() {
    const video = document.querySelector('.hero-video');
    if (!video) return;
    
    const handleVideoBackground = () => {
      // Pause video on mobile to save bandwidth
      if (window.innerWidth <= 768) {
        video.pause();
        video.style.display = 'none';
      } else {
        video.style.display = 'block';
        video.play().catch(e => console.log('Video autoplay prevented'));
      }
    };

    window.addEventListener('resize', this.debounce(handleVideoBackground, 250));
    handleVideoBackground();
  }

  setupCalendlyIntegration() {
    const calendlyButtons = document.querySelectorAll('[data-calendly]');
    
    if (!calendlyButtons.length) return;
    
    const initCalendly = () => {
      calendlyButtons.forEach(button => {
        button.addEventListener('click', (e) => {
          e.preventDefault();
          if (window.Calendly) {
            window.Calendly.initPopupWidget({url: 'https://calendly.com/chef-narhari'});
          }
        });
      });
    };

    // Load Calendly script dynamically
    if (!window.Calendly) {
      const script = document.createElement('script');
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      script.onload = initCalendly;
      document.body.appendChild(script);
    } else {
      initCalendly();
    }
  }

  setupMessageModal() {
    const { messageModal, sendButtons, messageForm } = this.elements;
    
    if (!messageModal) return;
    
    const modalClose = messageModal.querySelector('.modal-close');
    
    // Open modal when Send Message button is clicked
    sendButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        this.openMessageModal();
      });
    });
    
    // Close modal when close button is clicked
    if (modalClose) {
      modalClose.addEventListener('click', () => {
        this.closeMessageModal();
      });
    }
    
    // Close modal when clicking outside of it
    messageModal.addEventListener('click', (e) => {
      if (e.target === messageModal) {
        this.closeMessageModal();
      }
    });
    
    // Setup form submission if form exists
    if (messageForm) {
      this.setupMessageFormSubmission();
    }
  }

  openMessageModal() {
    const { messageModal } = this.elements;
    messageModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  closeMessageModal() {
    const { messageModal } = this.elements;
    messageModal.style.display = 'none';
    document.body.style.overflow = '';
  }
  setupMessageFormSubmission() {
    const { messageForm } = this.elements;
    let modalTurnstileVerified = false;
    
    // Initialize Turnstile for modal if available
    if (typeof turnstile !== 'undefined') {
      const turnstileContainer = messageForm.querySelector('.cf-turnstile');
      if (turnstileContainer) {
        turnstile.render(turnstileContainer, {
          sitekey: '0x4AAAAAABqgkMEaDYSIeO8i',
          callback: (token) => {
            modalTurnstileVerified = true;
          },
          'expired-callback': () => {
            modalTurnstileVerified = false;
          },
          'error-callback': () => {
            modalTurnstileVerified = false;
          }
        });
      }
    }
    
    messageForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      if (this.state.isSubmitting) return;
      
      // Check if Turnstile is verified
      if (!modalTurnstileVerified) {
        this.showToast('Please complete the CAPTCHA verification.', 'error');
        return;
      }
      
      try {
        this.state.isSubmitting = true;
        const formData = new FormData(messageForm);
        
        // Add Web3Forms configuration
        formData.append('access_key', 'caf02768-f053-4c48-aad5-b9a5ace1b4eb');
        formData.append('email_to', 'chef@narharikathayat.com.np');
        
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData
        });
        
        const data = await response.json();
        
        if (data.success) {
          this.showToast('Thank you! Your message has been sent.', 'success');
          messageForm.reset();
          this.closeMessageModal();
          
          // Reset Turnstile
          modalTurnstileVerified = false;
          if (typeof turnstile !== 'undefined') {
            turnstile.reset();
          }
        } else {
          throw new Error(data.message || 'Form submission failed');
        }
      } catch (error) {
        console.error('Message form submission error:', error);
        this.showToast('There was an error sending your message. Please try again.', 'error');
      } finally {
        this.state.isSubmitting = false;
      }
    });
  }

  // ===== Utility Methods =====
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func.apply(this, args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 100;
  }

  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.textContent = message;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'polite');
    
    document.body.appendChild(toast);
    
    // Auto-remove toast
    setTimeout(() => {
      if (toast.parentNode) {
        toast.remove();
      }
    }, CONFIG.TOAST_DURATION);
  }
}

// ===== Application Initialization =====
document.addEventListener('DOMContentLoaded', () => {
  new ChefWebsiteApp();
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ChefWebsiteApp;
}
