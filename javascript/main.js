// ===== DOM Elements =====
const navbar = document.querySelector('.header');
const navbarMenu = document.querySelector('.navbar__menu');
const dishButtons = document.querySelectorAll('[data-dish]');
const newsletterForm = document.querySelector('.newsletter');
const sections = document.querySelectorAll('section');

// ===== Desktop Dropdown Menu =====
document.querySelectorAll('.dropdown').forEach(dropdown => {
  const toggle = dropdown.querySelector('.dropdown-toggle');
  
  if (toggle) {
    toggle.addEventListener('click', (e) => {
      // Only prevent default if clicking on the dropdown arrow
      // If clicking on the main link, let it navigate
      if (e.target === toggle || e.target.parentNode === toggle) {
        e.preventDefault();
        e.stopPropagation();
        
        // Close other dropdowns
        document.querySelectorAll('.dropdown').forEach(otherDropdown => {
          if (otherDropdown !== dropdown) {
            otherDropdown.classList.remove('active');
          }
        });
        
        dropdown.classList.toggle('active');
      }
    });
  }
});

// Close dropdowns when clicking outside
document.addEventListener('click', () => {
  document.querySelectorAll('.dropdown').forEach(dropdown => {
    dropdown.classList.remove('active');
  });
});

// Prevent dropdown from closing when clicking inside
document.querySelectorAll('.dropdown-menu').forEach(menu => {
  menu.addEventListener('click', (e) => {
    e.stopPropagation();
  });
});

// ===== Sticky Header on Scroll =====
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== Signature Dish Modals =====
dishButtons.forEach(button => {
  button.addEventListener('click', () => {
    const dishName = button.getAttribute('data-dish');
    openDishModal(dishName);
  });
});

function openDishModal(dishName) {
  // In a real implementation, you would fetch this data from a CMS/API
  const dishData = {
    'samosa': {
      title: 'Deconstructed Samosa',
      story: `This dish reimagines my grandmother's roadside samosa stall through molecular gastronomy. The potato foam is infused with 14 spices from her secret blend, while the tamarind gel replicates the chutney she served to me after school.',
      ingredients: ['Organic potatoes', 'Heirloom spices', 'Tamarind reduction', 'Filo crisp'],
      pairing: 'Pairs beautifully with our Darjeeling First Flush Tea`
    },
    'rogan-josh': {
      title: 'Saffron-Infused Rogan Josh',
      story: 'Inspired by my apprenticeship in Kashmir, this 72-hour slow-cooked lamb incorporates saffron harvested by the same family I lived with in Pampore. The rose petals are hand-pressed from their garden.',
      ingredients: ['New Zealand lamb rack', 'Kashmiri saffron', 'Rose petals', 'Heirloom garlic'],
      pairing: 'Best enjoyed with our Sommelier-selected Syrah'
    }
  };

  const dish = dishData[dishName];
  
  // Create modal HTML
  const modalHTML = `
    <div class="modal-overlay">
      <div class="modal">
        <button class="modal-close">&times;</button>
        <div class="modal-content">
          <h3>${dish.title}</h3>
          <div class="modal-story">
            <h4>The Story</h4>
            <p>${dish.story}</p>
          </div>
          <div class="modal-details">
            <div class="modal-ingredients">
              <h4>Key Ingredients</h4>
              <ul>
                ${dish.ingredients.map(ing => `<li>${ing}</li>`).join('')}
              </ul>
            </div>
            <div class="modal-pairing">
              <h4>Suggested Pairing</h4>
              <p>${dish.pairing}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Insert into DOM
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  
  // Add close functionality
  document.querySelector('.modal-close').addEventListener('click', closeModal);
  document.querySelector('.modal-overlay').addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) closeModal();
  });
}

function closeModal() {
  const modal = document.querySelector('.modal-overlay');
  modal.classList.add('fade-out');
  setTimeout(() => modal.remove(), 300);
}

// ===== Newsletter Form Handling =====
newsletterForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const emailInput = newsletterForm.querySelector('input[type="email"]');
  const email = emailInput.value.trim();

  if (!validateEmail(email)) {
    showToast('Please enter a valid email address', 'error');
    return;
  }

  // Simulate API call
  try {
    showToast('Subscribing...', 'loading');
    
    // Replace with actual fetch() to your backend
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    showToast('Thank you for subscribing!', 'success');
    newsletterForm.reset();
  } catch (error) {
    showToast('Subscription failed. Please try again.', 'error');
  }
});

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function showToast(message, type) {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ===== Scroll Animations =====
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
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

// ===== Video Background Optimization =====
function handleVideoBackground() {
  const heroVideo = document.querySelector('.hero__video video');
  
  // Only play video on larger screens
  if (window.innerWidth > 768) {
    heroVideo.play().catch(e => {
      console.log('Autoplay prevented:', e);
      // Fallback: Show poster image with play button
      heroVideo.controls = true;
    });
  } else {
    // On mobile, use poster image only
    heroVideo.src = '';
    heroVideo.poster = heroVideo.getAttribute('data-poster');
  }
}

window.addEventListener('resize', handleVideoBackground);
handleVideoBackground();

// ===== Calendly Integration =====
function initCalendly() {
  const calendlyButtons = document.querySelectorAll('[data-calendly]');
  
  calendlyButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      Calendly.initPopupWidget({
        url: 'https://calendly.com/chefnarhari/consultation'
      });
    });
  });
}

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

// Modal functionality
document.addEventListener('DOMContentLoaded', function() {
  // Get modal elements
  const modal = document.getElementById('messageModal');
  const modalClose = modal ? modal.querySelector('.modal-close') : null;
  const sendButtons = document.querySelectorAll('a[href="contact.html"].btn--outline');
  
  // Open modal when Send Message button is clicked
  sendButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
      }
    });
  });
  
  // Close modal when close button is clicked
  if (modalClose) {
    modalClose.addEventListener('click', function() {
      if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
      }
    });
  }
  
  // Close modal when clicking outside of it
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
      }
    });
  }
  
  // Handle modal form submission with Web3Forms and Turnstile
  const messageForm = document.getElementById('messageForm');
  if (messageForm) {
    messageForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form data
      const formData = new FormData(this);
      
      // Add Web3Forms access key
      formData.append('access_key', 'caf02768-f053-4c48-aad5-b9a5ace1b4eb');
      
      // Add recipient email
      formData.append('email_to', 'chef@narharikathayat.com.np');
      
      // Submit form to Web3Forms
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          alert('Thank you! Your message has been sent.');
          
          // Hide send button
          const submitButton = messageForm.querySelector('button[type="submit"]');
          if (submitButton) {
            submitButton.style.display = 'none';
          }
          
          // Reset form and close modal
          messageForm.reset();
          if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
          }
        } else {
          alert('There was an error sending your message. Please try again.');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('There was an error sending your message. Please try again.');
      });
    });
  }
  
  // Handle contact page form submission with Web3Forms and Turnstile
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form data
      const formData = new FormData(this);
      
      // Add Web3Forms access key
      formData.append('access_key', 'caf02768-f053-4c48-aad5-b9a5ace1b4eb');
      
      // Add recipient email
      formData.append('email_to', 'chef@narharikathayat.com.np');
      
      // Submit form to Web3Forms
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          alert('Thank you! Your message has been sent.');
          
          // Hide send button
          const submitButton = contactForm.querySelector('button[type="submit"]');
          if (submitButton) {
            submitButton.style.display = 'none';
          }
          
          // Reset form
          contactForm.reset();
        } else {
          alert('There was an error sending your message. Please try again.');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('There was an error sending your message. Please try again.');
      });
    });
  }
});
