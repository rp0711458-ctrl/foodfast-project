// API Configuration
// Update this URL after deploying backend to Railway
const API_URL = 'http://localhost:3000'; // Change this to your Railway URL

// Example: const API_URL = 'https://foodfast-production.up.railway.app';

// Export for use in HTML files
if (typeof window !== 'undefined') {
    window.API_URL = API_URL;
}
