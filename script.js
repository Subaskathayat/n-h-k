// Smooth scroll to contact section
function scrollToContact() {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
        contactSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Load hCaptcha script dynamically
(function() {
    const script = document.createElement('script');
    script.src = 'https://js.hcaptcha.com/1/api.js';
    script.async = true;
    script.defer = true;
    script.onload = function() {
        // hCaptcha is loaded, you can initialize if needed
        console.log('hCaptcha loaded successfully');
    };
    document.head.appendChild(script);
})();

// hCaptcha callback functions
window.onHcaptchaLoad = function() {
    console.log('hCaptcha widget loaded');
};

window.onHcaptchaSuccess = function(token) {
    console.log('hCaptcha success, token:', token);
};

window.onHcaptchaError = function(event) {
    console.error('hCaptcha error:', event);
};

window.onHcaptchaExpire = function() {
    console.log('hCaptcha expired');
};

// web3forms
const form = document.getElementById('contactForm');
const submitBtn = form.querySelector('button[type="submit"]');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Check if hCaptcha is completed
    const hCaptchaResponse = document.querySelector('[name="h-captcha-response"]');
    if (!hCaptchaResponse || !hCaptchaResponse.value) {
        alert("Please complete the hCaptcha verification.");
        return;
    }

    const formData = new FormData(form);
    // Access key is already in the hidden input, no need to append

    const originalText = submitBtn.textContent;

    submitBtn.textContent = "Sending...";
    submitBtn.disabled = true;

    try {
        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        if (response.ok) {
            alert("Success! Your message has been sent.");
            form.reset();
            // Reset hCaptcha after successful submission
            if (window.hcaptcha) {
                hcaptcha.reset();
            }
        } else {
            alert("Error: " + data.message);
        }

    } catch (error) {
        alert("Something went wrong. Please try again.");
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
});