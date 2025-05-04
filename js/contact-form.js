// Contact form handler for Web3Forms integration

document.addEventListener('DOMContentLoaded', function() {
    // Set the API key from config.js
    const accessKeyInput = document.getElementById('access_key');

    console.log('Checking for CONFIG object:', typeof CONFIG !== 'undefined');

    if (accessKeyInput && typeof CONFIG !== 'undefined' && CONFIG.WEB3FORMS_API_KEY) {
        console.log('API key found, setting in form');
        accessKeyInput.value = CONFIG.WEB3FORMS_API_KEY;
        console.log('API key set:', accessKeyInput.value ? 'Yes (value hidden for security)' : 'No');
    } else {
        console.error('Web3Forms API key not found. Make sure config.js is properly set up.');
        if (!accessKeyInput) {
            console.error('access_key input element not found in the form');
        }
        if (typeof CONFIG === 'undefined') {
            console.error('CONFIG object is undefined. Make sure config.js is loaded before contact-form.js');
        } else if (!CONFIG.WEB3FORMS_API_KEY) {
            console.error('WEB3FORMS_API_KEY is missing in the CONFIG object');
        }
    }

    // Handle contact form submission
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            // Simple validation
            if (!name || !email || !message) {
                formStatus.textContent = 'Please fill out all fields.';
                formStatus.className = 'form-status error';
                formStatus.style.display = 'block';
                return;
            }

            // Check if API key is set
            if (!accessKeyInput.value) {
                formStatus.textContent = 'Error: API key not configured. Please contact the site administrator.';
                formStatus.className = 'form-status error';
                formStatus.style.display = 'block';
                return;
            }

            // Show sending message
            formStatus.textContent = 'Sending...';
            formStatus.className = 'form-status';
            formStatus.style.display = 'block';

            // Create form data object
            const formData = new FormData(contactForm);

            // Submit the form using fetch API
            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Success message
                    formStatus.textContent = 'Thank you! Your message has been sent successfully.';
                    formStatus.className = 'form-status success';
                    contactForm.reset();
                } else {
                    // Error message
                    formStatus.textContent = 'Oops! Something went wrong. Please try again.';
                    formStatus.className = 'form-status error';
                    console.error('Form submission error:', data);
                }
            })
            .catch(error => {
                // Handle network errors
                formStatus.textContent = 'Network error. Please check your connection and try again.';
                formStatus.className = 'form-status error';
                console.error('Error:', error);
            });
        });
    }
});
