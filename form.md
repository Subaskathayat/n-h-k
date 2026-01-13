//html
<form action="https://api.web3forms.com/submit" method="POST">
  <input type="hidden" name="access_key" value="e2600e91-337c-4219-9f72-5dab2fcdcea0">
  <input type="text" name="name" required>
  <input type="email" name="email" required>
  <textarea name="message" required></textarea>
  <button type="submit">Submit Form</button>
</form>

//js

const form = document.getElementById('form');
const submitBtn = form.querySelector('button[type="submit"]');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    formData.append("access_key", "e2600e91-337c-4219-9f72-5dab2fcdcea0");

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


cloudfare site key : 0x4AAAAAABqgkMEaDYSIeO8i
cloudfare secret key : 0x4AAAAAABqgkGZMwcTQhYm51agwSjxgP20