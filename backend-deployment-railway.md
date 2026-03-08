# 🚀 Deploy FoodFast Backend to Railway (FREE)

## The Problem
GitHub Pages only hosts static files (HTML/CSS/JS). Your Node.js backend needs a separate hosting service.

## The Solution
- **Frontend**: GitHub Pages (already uploaded) ✅
- **Backend**: Railway.app (FREE, supports Node.js + MongoDB) 🚂
- **Database**: MongoDB Atlas (FREE cloud database) 🍃

---

## STEP 1: Deploy Backend to Railway

### 1.1 Create Railway Account
1. Go to https://railway.app
2. Click "Login" → Sign in with GitHub
3. Authorize Railway to access your GitHub

### 1.2 Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your `foodfast` repository
4. Railway will detect Node.js automatically

### 1.3 Configure Environment
1. Click on your service
2. Go to "Variables" tab
3. Add this variable:
   ```
   PORT=3000
   ```

### 1.4 Get Your Backend URL
After deployment (2-3 minutes), Railway will give you a URL like:
```
https://foodfast-production.up.railway.app
```
**SAVE THIS URL!** You'll need it in Step 2.

---

## STEP 2: Update MongoDB Connection

### Option A: Use MongoDB Atlas (Recommended - FREE)

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create free account
3. Create a FREE cluster (M0 Sandbox)
4. Click "Connect" → "Connect your application"
5. Copy the connection string:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/foodDeliveryDB
   ```

6. In Railway:
   - Go to Variables tab
   - Add new variable:
     ```
     MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/foodDeliveryDB
     ```

7. Update `server.js` line 13 to use environment variable:
   ```javascript
   mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/foodDeliveryDB")
   ```

### Option B: Use Railway's MongoDB Plugin (Also FREE)

1. In Railway project, click "New"
2. Select "Database" → "Add MongoDB"
3. Railway will automatically set `MONGODB_URL` variable
4. Update `server.js` to use it

---

## STEP 3: Update Frontend API URLs

You need to update ALL HTML files to use your Railway backend URL instead of `localhost:3000`.

### Files to Update:
- index.html
- restaurants.html
- signin.html
- signup.html
- profile-setup.html
- user-profile.html
- cart.html
- payment.html
- my-orders.html
- contact.html
- admin.html
- admin-dashboard.html
- admin-phone-verify.html

### What to Change:
Replace ALL instances of:
```javascript
fetch('http://localhost:3000/
```

With:
```javascript
fetch('https://YOUR-RAILWAY-URL.up.railway.app/
```

**Example:**
```javascript
// OLD:
fetch('http://localhost:3000/signup', {

// NEW:
fetch('https://foodfast-production.up.railway.app/signup', {
```

---

## STEP 4: Update GitHub Pages

After updating all files:

1. Go to your GitHub repository
2. Upload the updated HTML files
3. Commit changes
4. Wait 2-3 minutes for GitHub Pages to rebuild

---

## STEP 5: Test Your Live Website

1. Open: `https://rp0711458-ctrl.github.io/foodfast`
2. Test signup/login
3. Test ordering food
4. Test admin panel

---

## 🎯 Quick Checklist

- [ ] Railway account created
- [ ] Backend deployed to Railway
- [ ] Railway URL obtained
- [ ] MongoDB Atlas setup (or Railway MongoDB)
- [ ] All HTML files updated with Railway URL
- [ ] Files uploaded to GitHub
- [ ] Website tested and working

---

## 🔧 Troubleshooting

### Backend not starting on Railway?
- Check "Deployments" tab for errors
- Make sure `package.json` has start script:
  ```json
  "scripts": {
    "start": "node server.js"
  }
  ```

### CORS errors?
Your `server.js` already has `app.use(cors())` - this should work.

### Database connection failed?
- Check MongoDB Atlas IP whitelist (allow 0.0.0.0/0 for all IPs)
- Verify connection string is correct
- Check Railway logs for errors

---

## 💰 Cost Breakdown

- **GitHub Pages**: FREE forever ✅
- **Railway**: FREE ($5 credit/month, enough for small projects) ✅
- **MongoDB Atlas**: FREE (512MB storage) ✅

**Total Cost: $0/month** 🎉

---

## 🚀 Alternative: Deploy Everything to Vercel

If Railway is complicated, you can deploy EVERYTHING to Vercel:

1. Go to https://vercel.com
2. Import your GitHub repository
3. Vercel will deploy both frontend AND backend
4. Get one URL for everything

---

## 📞 Need Help?

If you get stuck, tell me:
1. Which step you're on
2. What error you see
3. Screenshot if possible

I'll help you fix it! 🛠️
