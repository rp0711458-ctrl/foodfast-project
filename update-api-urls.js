// Script to update all API URLs in HTML files
// Run this after deploying to Railway

const fs = require('fs');
const path = require('path');

// CHANGE THIS to your Railway backend URL
const RAILWAY_URL = 'https://foodfast-website.vercel.app';

const htmlFiles = [
    'index.html',
    'restaurants.html',
    'signin.html',
    'signup.html',
    'profile-setup.html',
    'user-profile.html',
    'cart.html',
    'payment.html',
    'my-orders.html',
    'contact.html',
    'admin.html',
    'admin-dashboard.html',
    'admin-phone-verify.html'
];

console.log('🔄 Updating API URLs in HTML files...\n');

htmlFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    
    if (!fs.existsSync(filePath)) {
        console.log(`⚠️  ${file} not found, skipping...`);
        return;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace localhost URLs with Railway URL
    const oldUrl = 'http://localhost:3000';
    const oldUrl2 = 'https://YOUR-RAILWAY-URL.up.railway.app';
    const newUrl = RAILWAY_URL;
    
    let updatedContent = content.replace(new RegExp(oldUrl, 'g'), newUrl);
    updatedContent = updatedContent.replace(new RegExp(oldUrl2, 'g'), newUrl);
    
    if (content !== updatedContent) {
        fs.writeFileSync(filePath, updatedContent, 'utf8');
        console.log(`✅ Updated ${file}`);
    } else {
        console.log(`ℹ️  ${file} - no changes needed`);
    }
});

console.log('\n✨ Done! All files updated.');
console.log('\n📋 Next steps:');
console.log('1. Upload updated files to GitHub');
console.log('2. Wait 2-3 minutes for GitHub Pages to rebuild');
console.log('3. Test your website!');
