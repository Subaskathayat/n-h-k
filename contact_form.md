  <!-- Contact Section -->
  <section class="contact-section" id="contact-section">
    <div class="contact-container">
      <h2 data-aos="slide-up">Get In Touch</h2>
      <p class="contact-subtitle" data-aos="slide-up">Let's discuss your next project or just say hello!</p>
      
      <form id="contactForm" action="https://api.web3forms.com/submit" method="POST" data-aos="slide-up">
        <input type="hidden" name="access_key" value="eccbbbbd-82e3-4f49-88f8-225ba8f793c0">
        
        <div class="form-row">
          <div class="form-group">
            <label for="name">Your Name *</label>
            <input type="text" name="name" id="name" maxlength="20" required placeholder="Enter your full name">
          </div>
          <div class="form-group">
            <label for="email">Your Email *</label>
            <input type="email" name="email" id="email" maxlength="40" required placeholder="Enter your email address">
          </div>
        </div>
        
        <div class="form-group">
          <label for="subject">Subject *</label>
          <input type="text" name="subject" id="subject" maxlength="50" required placeholder="What's this about?">
        </div>
        
        <div class="form-group">
          <label for="message">Message *</label>
          <textarea name="message" id="message" rows="6" maxlength="150" required placeholder="Share your ideas, project details, or just say hello..."></textarea>
        </div>
        
        <!-- Cloudflare Turnstile -->
        <div class="cf-turnstile" data-sitekey="0x4AAAAAABonMQ3-WepthOU8" data-callback="onTurnstileSuccess" data-aos="slide-up"></div>
        
        <button type="submit" id="submitButton" disabled data-aos="slide-up">
          <span class="btn-text">Send Message</span>
          <span class="btn-icon">→</span>
        </button>
        
        <div id="formStatus" class="form-status"></div>
      </form>
    </div>
  </section>

//javascript for succsessful contact integration
  
// Turnstile callback
window.onTurnstileSuccess = function() {
    document.getElementById("submitButton").disabled = false;
};

// Contact form handling
document.getElementById("contactForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);
  const status = document.getElementById("formStatus");
  const submitButton = document.getElementById("submitButton");
  const btnText = submitButton.querySelector('.btn-text');
  const btnIcon = submitButton.querySelector('.btn-icon');
  const originalBtnText = btnText.textContent;
  const originalBtnIcon = btnIcon.textContent;

  // Validate form fields
  const name = formData.get('name');
  const email = formData.get('email');
  const subject = formData.get('subject');
  const message = formData.get('message');

  if (!name || !email || !subject || !message) {
    showStatus("Please fill in all required fields", "error");
    return;
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showStatus("Please enter a valid email address", "error");
    return;
  }

  // Get Turnstile token for client-side validation only
  const token = turnstile.getResponse();
  if (!token) {
    showStatus("Please complete the security verification", "error");
    return;
  }

  // Remove Turnstile token from form data (Web3Forms free plan doesn't support it)
  formData.delete('cf-turnstile-response');

  // Show loading animation
  submitButton.classList.add('loading');
  btnText.textContent = 'Sending...';
  btnIcon.textContent = '⏳';
  submitButton.disabled = true;

  try {
    console.log('Submitting form to:', form.action);
    console.log('Form data:', Object.fromEntries(formData));
    
    const res = await fetch(form.action, {
      method: "POST",
      body: formData
    });

    console.log('Response status:', res.status);
    console.log('Response ok:', res.ok);

    const data = await res.json();
    console.log('Response data:', data);

    if (res.ok && data.success) {
      showStatus("Message sent successfully! I'll get back to you soon.", "success");
      form.reset();
      turnstile.reset();
      
      // Hide the submit button on success
      submitButton.style.display = 'none';
      
      // Show a "Message Sent" indicator instead
      const successIndicator = document.createElement('div');
      successIndicator.className = 'success-indicator';
      successIndicator.innerHTML = `
        <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 10px; margin: 20px 0;">
          <span style="font-size: 24px;">✓</span>
          <p style="margin: 10px 0 0 0; font-weight: 600;">Message Sent Successfully!</p>
          <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.9;">Thank you for reaching out!</p>
        </div>
      `;
      
      // Insert the success indicator where the button was
      submitButton.parentNode.insertBefore(successIndicator, submitButton.nextSibling);
      
    } else {
      console.log('Form submission failed:', data);
      showStatus("Something went wrong. Please try again later.", "error");
      turnstile.reset();
      submitButton.disabled = true;
    }
  } catch (err) {
    console.error('Form submission error:', err);
    showStatus("Network error. Please check your connection and try again.", "error");
    turnstile.reset();
    submitButton.disabled = true;
  } finally {
    // Remove loading animation and restore button (only if not successful)
    if (submitButton.style.display !== 'none') {
      submitButton.classList.remove('loading');
      btnText.textContent = originalBtnText;
      btnIcon.textContent = originalBtnIcon;
    }
  }
});

// Helper function to show form status
function showStatus(message, type) {
  const status = document.getElementById("formStatus");
  status.textContent = message;
  status.className = `form-status ${type}`;
  
  // Auto-hide success messages after 5 seconds
  if (type === "success") {
    setTimeout(() => {
      status.className = "form-status";
      status.textContent = "";
    }, 5000);
  }
}

