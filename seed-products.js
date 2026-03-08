const mongoose = require("mongoose");

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/foodDeliveryDB")
  .then(async () => {
    console.log("Connected to MongoDB");
    
    // Product Schema
    const ProductSchema = new mongoose.Schema({
      name: { type: String, required: true },
      category: { type: String, required: true },
      description: { type: String, required: true },
      price: { type: Number, required: true },
      image: { type: String, required: true },
      rating: { type: Number, default: 4.0 },
      createdAt: { type: Date, default: Date.now }
    });
    
    const Product = mongoose.model("Product", ProductSchema);
    
    // Sample products
    const products = [
      {
        name: "Margherita Pizza",
        category: "Pizza",
        description: "Classic pizza with tomato sauce, mozzarella cheese, and fresh basil",
        price: 299,
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500",
        rating: 4.5
      },
      {
        name: "Cheese Burger",
        category: "Burger",
        description: "Juicy beef patty with cheese, lettuce, tomato, and special sauce",
        price: 149,
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500",
        rating: 4.3
      },
      {
        name: "Chicken Biryani",
        category: "Biryani",
        description: "Aromatic basmati rice with tender chicken and traditional spices",
        price: 199,
        image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500",
        rating: 4.8
      },
      {
        name: "Fresh Salad",
        category: "Healthy",
        description: "Mixed greens with fresh vegetables and house dressing",
        price: 119,
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500",
        rating: 4.3
      },
      {
        name: "Italian Pasta",
        category: "Pasta",
        description: "Creamy pasta with authentic Italian herbs and parmesan",
        price: 139,
        image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=500",
        rating: 4.6
      },
      {
        name: "Club Sandwich",
        category: "Fast Food",
        description: "Triple-decker sandwich with chicken, bacon, lettuce, and mayo",
        price: 129,
        image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500",
        rating: 4.3
      },
      {
        name: "Pepperoni Pizza",
        category: "Pizza",
        description: "Classic pizza loaded with pepperoni and extra cheese",
        price: 349,
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500",
        rating: 4.7
      },
      {
        name: "Chicken Wings",
        category: "Appetizer",
        description: "Crispy chicken wings with your choice of sauce",
        price: 179,
        image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500",
        rating: 4.4
      },
      {
        name: "Pancakes",
        category: "Breakfast",
        description: "Fluffy pancakes served with maple syrup and butter",
        price: 99,
        image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500",
        rating: 4.9
      }
    ];
    
    // Clear existing products
    await Product.deleteMany({});
    console.log("Cleared existing products");
    
    // Insert new products
    await Product.insertMany(products);
    console.log(`Added ${products.length} products to database`);
    
    // Close connection
    await mongoose.connection.close();
    console.log("Database seeded successfully!");
    process.exit(0);
  })
  .catch(err => {
    console.error("Error:", err);
    process.exit(1);
  });
