const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const cors = require("cors");
const path = require("path");

const app = express();

/* Middleware */
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

/* MongoDB Connection (ONLY ONCE) */
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/foodDeliveryDB";
mongoose.connect(MONGODB_URI)
  .then(() => console.log("MongoDB Connected to:", MONGODB_URI.includes('mongodb.net') ? 'Cloud Database' : 'Local Database'))
  .catch(err => console.log("MongoDB Connection Error:", err));

/* User Schema */
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model("User", UserSchema);

/* Admin Schema */
const AdminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Admin = mongoose.model("Admin", AdminSchema);

/* Product Schema */
const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  rating: { type: Number, default: 4.0 },
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
  restaurantName: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.model("Product", ProductSchema);

/* Order Schema */
const OrderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  userId: { type: String },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerPhone: { type: String, required: true },
  customerAddress: { type: String, required: true },
  items: [{
    productId: String,
    productName: String,
    quantity: Number,
    price: Number
  }],
  subtotal: { type: Number, required: true },
  delivery: { type: Number, default: 40 },
  tax: { type: Number, required: true },
  total: { type: Number, required: true },
  paymentMethod: { type: String, default: 'COD' },
  status: { type: String, default: 'Pending', enum: ['Pending', 'Accepted', 'Rejected', 'Delivered'] },
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model("Order", OrderSchema);

/* User Profile Schema */
const UserProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  address: {
    house: String,
    street: String,
    city: String,
    state: String,
    pincode: String,
    landmark: String
  },
  location: {
    latitude: String,
    longitude: String
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const UserProfile = mongoose.model("UserProfile", UserProfileSchema);

/* Feedback Schema */
const FeedbackSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, default: 'new', enum: ['new', 'read', 'replied'] },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  createdAt: { type: Date, default: Date.now }
});

const Feedback = mongoose.model("Feedback", FeedbackSchema);


/* Restaurant Schema */
const RestaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  cuisine: { type: String, required: true },
  priceForOne: { type: Number, required: true },
  rating: { type: Number, default: 4.0 },
  image: { type: String, required: true },
  address: { type: String },
  phone: { type: String },
  openTime: { type: String },
  closeTime: { type: String },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const Restaurant = mongoose.model("Restaurant", RestaurantSchema);

/* SIGNUP API */
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword
    });

    await user.save();
    res.json({ 
      message: "Signup successful",
      userId: user._id,
      name: user.name
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Error creating account" });
  }
});

/* LOGIN API */
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Wrong password" });
    }

    res.json({
      message: "Login successful",
      userId: user._id,
      name: user.name
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Error logging in" });
  }
});

/* ADMIN LOGIN API */
app.post("/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Default admin credentials
    const DEFAULT_ADMIN_EMAIL = "admin@foodfast.com";
    const DEFAULT_ADMIN_PASSWORD = "Admin@2026";

    if (email === DEFAULT_ADMIN_EMAIL && password === DEFAULT_ADMIN_PASSWORD) {
      return res.json({
        message: "Admin login successful",
        token: "admin-token-" + Date.now(),
        email: email
      });
    }

    // Check database for other admins
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Invalid admin credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid admin credentials" });
    }

    res.json({
      message: "Admin login successful",
      token: "admin-token-" + Date.now(),
      email: admin.email
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ message: "Error logging in" });
  }
});

/* GET ALL USERS (Admin only) */
app.get("/admin/users", async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
});

/* DELETE USER (Admin only) */
app.delete("/admin/users/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    await UserProfile.findOneAndDelete({ userId: req.params.id });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user" });
  }
});

/* USER PROFILE APIs */

// Create or update user profile
app.post("/user/profile", async (req, res) => {
  try {
    const { userId, fullName, phone, address, location } = req.body;
    
    // Check if profile exists
    let profile = await UserProfile.findOne({ userId });
    
    if (profile) {
      // Update existing profile
      profile.fullName = fullName;
      profile.phone = phone;
      profile.address = address;
      profile.location = location;
      profile.updatedAt = Date.now();
      await profile.save();
      res.json({ message: "Profile updated successfully", profile });
    } else {
      // Create new profile
      profile = new UserProfile({
        userId,
        fullName,
        phone,
        address,
        location
      });
      await profile.save();
      res.json({ message: "Profile created successfully", profile });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error saving profile" });
  }
});

// Get user profile
app.get("/user/profile/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const profile = await UserProfile.findOne({ userId: req.params.userId });
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json({ 
      email: user.email,
      profile: profile 
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile" });
  }
});

/* CREATE NEW ADMIN (Admin only) */
app.post("/admin/create", async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new Admin({
      email,
      password: hashedPassword,
      name
    });

    await admin.save();
    res.json({ message: "Admin created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error creating admin" });
  }
});

/* PRODUCT MANAGEMENT APIs */

// Get all products (public access for menu)
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({ products });
  } catch (error) {
    res.status(500).json({ message: "Error fetching products" });
  }
});

// Get all products (admin)
app.get("/admin/products", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({ products });
  } catch (error) {
    res.status(500).json({ message: "Error fetching products" });
  }
});

// Add new product
app.post("/admin/products", async (req, res) => {
  try {
    const { name, category, description, price, image, rating, restaurantId, restaurantName } = req.body;
    
    const product = new Product({
      name,
      category,
      description,
      price,
      image,
      rating,
      restaurantId: restaurantId || undefined,
      restaurantName: restaurantName || undefined
    });
    
    await product.save();
    res.json({ message: "Product added successfully", product });
  } catch (error) {
    res.status(500).json({ message: "Error adding product" });
  }
});

// Delete product
app.delete("/admin/products/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product" });
  }
});

/* ORDER MANAGEMENT APIs */

// Create new order from user
app.post("/orders", async (req, res) => {
  try {
    const { userId, customerName, customerEmail, customerPhone, customerAddress, items, subtotal, delivery, tax, total, paymentMethod, status } = req.body;
    
    // Generate unique order ID
    const orderId = 'ORD' + Date.now();
    
    const order = new Order({
      orderId,
      userId,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      items,
      subtotal,
      delivery,
      tax,
      total,
      paymentMethod: paymentMethod || 'COD',
      status: status || 'Pending'
    });
    
    await order.save();
    res.json({ message: "Order placed successfully", orderId, order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating order" });
  }
});

// Get all orders
app.get("/admin/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders" });
  }
});

// Create new order/bill
app.post("/admin/orders", async (req, res) => {
  try {
    const { customerName, customerEmail, customerPhone, customerAddress, items, subtotal, delivery, tax, total } = req.body;
    
    // Generate unique order ID
    const orderId = 'ORD' + Date.now();
    
    const order = new Order({
      orderId,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      items,
      subtotal,
      delivery,
      tax,
      total
    });
    
    await order.save();
    res.json({ message: "Order created successfully", orderId, order });
  } catch (error) {
    res.status(500).json({ message: "Error creating order" });
  }
});

// Update order status
app.put("/admin/orders/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json({ message: "Order status updated", order });
  } catch (error) {
    res.status(500).json({ message: "Error updating order status" });
  }
});

// Delete order
app.delete("/admin/orders/:id", async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting order" });
  }
});

/* FEEDBACK/CONTACT APIs */

// Submit feedback/contact form
app.post("/feedback", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    const feedback = new Feedback({
      name,
      email,
      message,
      status: 'new'
    });
    
    await feedback.save();
    res.json({ 
      success: true,
      message: "Thank you for your feedback! We will get back to you soon.",
      feedbackId: feedback._id
    });
  } catch (error) {
    console.error('Feedback error:', error);
    res.status(500).json({ 
      success: false,
      message: "Error submitting feedback. Please try again." 
    });
  }
});

// Get all feedback (Admin only)
app.get("/admin/feedback", async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json({ feedbacks });
  } catch (error) {
    res.status(500).json({ message: "Error fetching feedback" });
  }
});

// Update feedback status (Admin only)
app.put("/admin/feedback/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json({ 
      success: true,
      message: "Feedback status updated",
      feedback 
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating feedback" });
  }
});

// Delete feedback (Admin only)
app.delete("/admin/feedback/:id", async (req, res) => {
  try {
    await Feedback.findByIdAndDelete(req.params.id);
    res.json({ 
      success: true,
      message: "Feedback deleted successfully" 
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting feedback" });
  }
});

/* Home route */
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

/* RESTAURANT MANAGEMENT APIs */

// Get all restaurants (public)
app.get("/restaurants", async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ isActive: true }).sort({ createdAt: -1 });
    res.json({ restaurants });
  } catch (error) {
    res.status(500).json({ message: "Error fetching restaurants" });
  }
});

// Get all restaurants (admin)
app.get("/admin/restaurants", async (req, res) => {
  try {
    const restaurants = await Restaurant.find().sort({ createdAt: -1 });
    res.json({ restaurants });
  } catch (error) {
    res.status(500).json({ message: "Error fetching restaurants" });
  }
});

// Add new restaurant
app.post("/admin/restaurants", async (req, res) => {
  try {
    const { name, cuisine, priceForOne, rating, image, address, phone, openTime, closeTime } = req.body;
    
    const restaurant = new Restaurant({
      name,
      cuisine,
      priceForOne,
      rating,
      image,
      address,
      phone,
      openTime,
      closeTime
    });
    
    await restaurant.save();
    res.json({ message: "Restaurant added successfully", restaurant });
  } catch (error) {
    res.status(500).json({ message: "Error adding restaurant" });
  }
});

// Update restaurant
app.put("/admin/restaurants/:id", async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json({ message: "Restaurant updated successfully", restaurant });
  } catch (error) {
    res.status(500).json({ message: "Error updating restaurant" });
  }
});

// Delete restaurant
app.delete("/admin/restaurants/:id", async (req, res) => {
  try {
    await Restaurant.findByIdAndDelete(req.params.id);
    res.json({ message: "Restaurant deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting restaurant" });
  }
});

/* USER ORDERS APIs */

// Get user's orders
app.get("/user/orders/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders" });
  }
});

/* SEARCH APIs */

// Search restaurants and products
app.get("/search", async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.json({ restaurants: [], products: [] });
    }
    
    const searchRegex = new RegExp(query, 'i');
    
    // Search restaurants
    const restaurants = await Restaurant.find({
      $or: [
        { name: searchRegex },
        { cuisine: searchRegex }
      ],
      isActive: true
    }).limit(10);
    
    // Search products
    const products = await Product.find({
      $or: [
        { name: searchRegex },
        { category: searchRegex },
        { description: searchRegex },
        { restaurantName: searchRegex }
      ]
    }).limit(20);
    
    res.json({ restaurants, products });
  } catch (error) {
    res.status(500).json({ message: "Error searching" });
  }
});

// Get products by restaurant
app.get("/restaurants/:id/products", async (req, res) => {
  try {
    const products = await Product.find({ restaurantId: req.params.id });
    res.json({ products });
  } catch (error) {
    res.status(500).json({ message: "Error fetching restaurant products" });
  }
});

/* Server Start */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log("\n=== ADMIN CREDENTIALS ===");
  console.log("Email: admin@foodfast.com");
  console.log("Password: Admin@2026");
  console.log("========================\n");
});