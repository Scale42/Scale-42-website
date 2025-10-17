document.addEventListener('DOMContentLoaded', function() {
    // Update copyright year
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // Handle contact form submission
    const form = document.getElementById('contact-form');
    const errorElement = document.querySelector('.contact__error');
    const successElement = document.querySelector('.contact__success');
    const emailInput = document.getElementById('email');
    const submitButton = form.querySelector('button[type="submit"]');

    // Function to get user's IP and location data
    async function getUserLocationData() {
        try {
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();
            return {
                ip: data.ip || 'unknown',
                country: data.country_name || 'unknown',
                countryCode: data.country_code || 'unknown',
                city: data.city || 'unknown',
                region: data.region || 'unknown'
            };
        } catch (error) {
            console.warn('Could not fetch location data:', error);
            return {
                ip: 'unknown',
                country: 'unknown',
                countryCode: 'unknown',
                city: 'unknown',
                region: 'unknown'
            };
        }
    }

    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Clear previous messages
            errorElement.textContent = '';
            successElement.hidden = true;
            
            // Basic email validation
            const email = emailInput.value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (!email) {
                errorElement.textContent = 'Please enter your email address.';
                return;
            }
            
            if (!emailRegex.test(email)) {
                errorElement.textContent = 'Please enter a valid email address.';
                return;
            }
            
            // Show loading state
            const originalButtonText = submitButton.textContent;
            submitButton.textContent = 'Submitting...';
            submitButton.disabled = true;
            
            try {
                // Get user location data
                const locationData = await getUserLocationData();
                
                // Send to n8n webhook
                const response = await fetch('https://n8n.edbmotte.com/webhook/14760557-5bcd-4cfe-8cdc-5d107bae4062', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: email,
                        timestamp: new Date().toISOString(),
                        source: 'Scale42 Website Contact Form',
                        url: window.location.href,
                        referrer: document.referrer || 'direct',
                        userAgent: navigator.userAgent,
                        ip: locationData.ip,
                        country: locationData.country,
                        countryCode: locationData.countryCode,
                        city: locationData.city,
                        region: locationData.region
                    })
                });
                
                if (response.ok) {
                    // Success
                    emailInput.value = '';
                    successElement.hidden = false;
                    errorElement.textContent = '';
                } else {
                    // Server error
                    errorElement.textContent = 'Something went wrong. Please try again later.';
                }
                
            } catch (error) {
                // Network or other error
                errorElement.textContent = 'Unable to submit. Please check your connection and try again.';
                console.error('Form submission error:', error);
            } finally {
                // Reset button state
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;
            }
        });
    }
});
