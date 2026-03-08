// FoodFast - Shared Navigation Component
// This ensures consistent navigation across all pages

// Generate navigation HTML
function generateNavigation() {
    return `
        <div class="nav-container">
            <h2>🍕 FoodFast</h2>
            <div class="nav-links">
                <a href="index.html">Home</a>
                <a href="restaurants.html">Restaurants</a>
                <a href="contact.html">Contact</a>
                <a href="cart.html" id="cartLink" style="display:none;">Cart<span id="cartCount">0</span></a>
                <div id="userSection" style="display:none;">
                    <div class="user-dropdown">
                        <a href="#" class="user-avatar" onclick="toggleDropdown(event)">
                            <span id="userInitials">AS</span>
                        </a>
                        <div class="dropdown-menu" id="dropdownMenu">
                            <a href="user-profile.html">👤 My Profile</a>
                            <a href="my-orders.html">📦 My Orders</a>
                            <a href="#" onclick="logout()">🚪 Sign Out</a>
                        </div>
                    </div>
                </div>
                <a href="signin.html" id="signinLink">Sign In</a>
            </div>
        </div>
    `;
}

// Update navigation based on login status
function updateNavigation() {
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');
    
    const userSection = document.getElementById('userSection');
    const signinLink = document.getElementById('signinLink');
    const cartLink = document.getElementById('cartLink');
    const userInitials = document.getElementById('userInitials');
    const cartCount = document.getElementById('cartCount');
    
    if (userId) {
        // User is logged in
        if (userSection) userSection.style.display = 'flex';
        if (signinLink) signinLink.style.display = 'none';
        if (cartLink) cartLink.style.display = 'block';
        
        // Set user initials
        if (userName && userInitials) {
            const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
            userInitials.textContent = initials;
        }
        
        // Update cart count
        if (cartCount) {
            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
            cartCount.textContent = cart.length;
        }
    } else {
        // User is not logged in
        if (userSection) userSection.style.display = 'none';
        if (signinLink) signinLink.style.display = 'block';
        if (cartLink) cartLink.style.display = 'none';
    }
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.clear();
        alert('Logged out successfully');
        window.location.href = 'index.html';
    }
}

// Toggle dropdown menu
function toggleDropdown(e) {
    e.preventDefault();
    const dropdown = document.getElementById('dropdownMenu');
    if (dropdown) {
        dropdown.classList.toggle('show');
    }
}

// Close dropdown when clicking outside
window.onclick = function(event) {
    if (!event.target.matches('.user-avatar') && !event.target.matches('.user-avatar span')) {
        const dropdowns = document.getElementsByClassName('dropdown-menu');
        for (let i = 0; i < dropdowns.length; i++) {
            dropdowns[i].classList.remove('show');
        }
    }
}

// Initialize navigation on page load
document.addEventListener('DOMContentLoaded', function() {
    updateNavigation();
    
    // Update cart count on storage change (for multi-tab support)
    window.addEventListener('storage', function(e) {
        if (e.key === 'cart' || e.key === 'userId') {
            updateNavigation();
        }
    });
});
