const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/foodDeliveryDB')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Restaurant Schema
const RestaurantSchema = new mongoose.Schema({
  name: String,
  cuisine: String,
  priceForOne: Number,
  rating: Number,
  image: String,
  address: String,
  phone: String,
  openTime: String,
  closeTime: String,
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const Restaurant = mongoose.model('Restaurant', RestaurantSchema);

// Product Schema
const ProductSchema = new mongoose.Schema({
  name: String,
  category: String,
  description: String,
  price: Number,
  image: String,
  rating: Number,
  restaurantId: mongoose.Schema.Types.ObjectId,
  restaurantName: String,
  createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', ProductSchema);

// Seed Data
async function seedDatabase() {
  try {
    // Clear existing data
    await Restaurant.deleteMany({});
    await Product.deleteMany({});
    console.log('Cleared existing data');

    // Restaurant 1: Pizza Palace
    const pizzaPalace = await Restaurant.create({
      name: 'Pizza Palace',
      cuisine: 'Italian',
      priceForOne: 300,
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591',
      address: 'MG Road, Bangalore',
      phone: '+91 9876543210',
      openTime: '11:00 AM',
      closeTime: '11:00 PM'
    });

    await Product.insertMany([
      {
        name: 'Margherita Pizza',
        category: 'Pizza',
        description: 'Classic pizza with tomato sauce, mozzarella, and basil',
        price: 299,
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500',
        rating: 4.5,
        restaurantId: pizzaPalace._id,
        restaurantName: 'Pizza Palace'
      },
      {
        name: 'Pepperoni Pizza',
        category: 'Pizza',
        description: 'Loaded with pepperoni and extra cheese',
        price: 349,
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500',
        rating: 4.7,
        restaurantId: pizzaPalace._id,
        restaurantName: 'Pizza Palace'
      },
      {
        name: 'Veggie Supreme Pizza',
        category: 'Pizza',
        description: 'Fresh vegetables with Italian herbs',
        price: 329,
        image: 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=500',
        rating: 4.4,
        restaurantId: pizzaPalace._id,
        restaurantName: 'Pizza Palace'
      },
      {
        name: 'BBQ Chicken Pizza',
        category: 'Pizza',
        description: 'Grilled chicken with BBQ sauce',
        price: 379,
        image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500',
        rating: 4.6,
        restaurantId: pizzaPalace._id,
        restaurantName: 'Pizza Palace'
      },
      {
        name: 'Garlic Bread',
        category: 'Appetizer',
        description: 'Crispy garlic bread with herbs',
        price: 99,
        image: 'https://images.unsplash.com/photo-1573140401552-388e3c0b1f6e?w=500',
        rating: 4.3,
        restaurantId: pizzaPalace._id,
        restaurantName: 'Pizza Palace'
      }
    ]);

    // Restaurant 2: Burger Hub
    const burgerHub = await Restaurant.create({
      name: 'Burger Hub',
      cuisine: 'American',
      priceForOne: 250,
      rating: 4.3,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd',
      address: 'Indiranagar, Bangalore',
      phone: '+91 9876543211',
      openTime: '10:00 AM',
      closeTime: '12:00 AM'
    });

    await Product.insertMany([
      {
        name: 'Classic Cheese Burger',
        category: 'Burger',
        description: 'Juicy beef patty with cheese and fresh veggies',
        price: 149,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500',
        rating: 4.3,
        restaurantId: burgerHub._id,
        restaurantName: 'Burger Hub'
      },
      {
        name: 'Chicken Burger',
        category: 'Burger',
        description: 'Crispy chicken patty with special sauce',
        price: 169,
        image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=500',
        rating: 4.4,
        restaurantId: burgerHub._id,
        restaurantName: 'Burger Hub'
      },
      {
        name: 'Veggie Burger',
        category: 'Burger',
        description: 'Healthy veggie patty with fresh ingredients',
        price: 129,
        image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=500',
        rating: 4.2,
        restaurantId: burgerHub._id,
        restaurantName: 'Burger Hub'
      },
      {
        name: 'Double Decker Burger',
        category: 'Burger',
        description: 'Two beef patties with double cheese',
        price: 229,
        image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=500',
        rating: 4.6,
        restaurantId: burgerHub._id,
        restaurantName: 'Burger Hub'
      },
      {
        name: 'French Fries',
        category: 'Sides',
        description: 'Crispy golden fries',
        price: 79,
        image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500',
        rating: 4.5,
        restaurantId: burgerHub._id,
        restaurantName: 'Burger Hub'
      }
    ]);

    // Restaurant 3: Biryani House
    const biryaniHouse = await Restaurant.create({
      name: 'Biryani House',
      cuisine: 'Indian',
      priceForOne: 280,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8',
      address: 'Koramangala, Bangalore',
      phone: '+91 9876543212',
      openTime: '12:00 PM',
      closeTime: '11:30 PM'
    });

    await Product.insertMany([
      {
        name: 'Chicken Biryani',
        category: 'Biryani',
        description: 'Aromatic basmati rice with tender chicken',
        price: 199,
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500',
        rating: 4.8,
        restaurantId: biryaniHouse._id,
        restaurantName: 'Biryani House'
      },
      {
        name: 'Mutton Biryani',
        category: 'Biryani',
        description: 'Rich and flavorful mutton biryani',
        price: 249,
        image: 'https://images.unsplash.com/photo-1599043513900-ed6fe01d3833?w=500',
        rating: 4.9,
        restaurantId: biryaniHouse._id,
        restaurantName: 'Biryani House'
      },
      {
        name: 'Veg Biryani',
        category: 'Biryani',
        description: 'Mixed vegetables with fragrant spices',
        price: 159,
        image: 'https://images.unsplash.com/photo-1642821373181-696a54913e93?w=500',
        rating: 4.5,
        restaurantId: biryaniHouse._id,
        restaurantName: 'Biryani House'
      },
      {
        name: 'Hyderabadi Biryani',
        category: 'Biryani',
        description: 'Authentic Hyderabadi style biryani',
        price: 279,
        image: 'https://images.unsplash.com/photo-1633945274309-2c8c2b0e5e0e?w=500',
        rating: 4.9,
        restaurantId: biryaniHouse._id,
        restaurantName: 'Biryani House'
      },
      {
        name: 'Raita',
        category: 'Sides',
        description: 'Cool yogurt with cucumber and spices',
        price: 49,
        image: 'https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=500',
        rating: 4.4,
        restaurantId: biryaniHouse._id,
        restaurantName: 'Biryani House'
      }
    ]);

    // Restaurant 4: Pasta Paradise
    const pastaParadise = await Restaurant.create({
      name: 'Pasta Paradise',
      cuisine: 'Italian',
      priceForOne: 320,
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9',
      address: 'Whitefield, Bangalore',
      phone: '+91 9876543213',
      openTime: '11:30 AM',
      closeTime: '10:30 PM'
    });

    await Product.insertMany([
      {
        name: 'Alfredo Pasta',
        category: 'Pasta',
        description: 'Creamy white sauce pasta',
        price: 189,
        image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=500',
        rating: 4.6,
        restaurantId: pastaParadise._id,
        restaurantName: 'Pasta Paradise'
      },
      {
        name: 'Arrabiata Pasta',
        category: 'Pasta',
        description: 'Spicy tomato sauce pasta',
        price: 169,
        image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=500',
        rating: 4.5,
        restaurantId: pastaParadise._id,
        restaurantName: 'Pasta Paradise'
      },
      {
        name: 'Pesto Pasta',
        category: 'Pasta',
        description: 'Fresh basil pesto with pine nuts',
        price: 199,
        image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=500',
        rating: 4.7,
        restaurantId: pastaParadise._id,
        restaurantName: 'Pasta Paradise'
      },
      {
        name: 'Carbonara Pasta',
        category: 'Pasta',
        description: 'Classic Italian pasta with bacon',
        price: 219,
        image: 'https://images.unsplash.com/photo-1588013273468-315fd88ea34c?w=500',
        rating: 4.8,
        restaurantId: pastaParadise._id,
        restaurantName: 'Pasta Paradise'
      },
      {
        name: 'Caesar Salad',
        category: 'Salad',
        description: 'Fresh romaine with Caesar dressing',
        price: 129,
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500',
        rating: 4.4,
        restaurantId: pastaParadise._id,
        restaurantName: 'Pasta Paradise'
      }
    ]);

    // Restaurant 5: Sushi Station
    const sushiStation = await Restaurant.create({
      name: 'Sushi Station',
      cuisine: 'Japanese',
      priceForOne: 450,
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351',
      address: 'HSR Layout, Bangalore',
      phone: '+91 9876543214',
      openTime: '12:00 PM',
      closeTime: '10:00 PM'
    });

    await Product.insertMany([
      {
        name: 'California Roll',
        category: 'Sushi',
        description: 'Crab, avocado, and cucumber roll',
        price: 299,
        image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=500',
        rating: 4.7,
        restaurantId: sushiStation._id,
        restaurantName: 'Sushi Station'
      },
      {
        name: 'Salmon Nigiri',
        category: 'Sushi',
        description: 'Fresh salmon on seasoned rice',
        price: 349,
        image: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=500',
        rating: 4.8,
        restaurantId: sushiStation._id,
        restaurantName: 'Sushi Station'
      },
      {
        name: 'Tuna Roll',
        category: 'Sushi',
        description: 'Spicy tuna with cucumber',
        price: 329,
        image: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=500',
        rating: 4.6,
        restaurantId: sushiStation._id,
        restaurantName: 'Sushi Station'
      },
      {
        name: 'Vegetable Tempura',
        category: 'Appetizer',
        description: 'Crispy fried vegetables',
        price: 199,
        image: 'https://images.unsplash.com/photo-1541529086526-db283c563270?w=500',
        rating: 4.5,
        restaurantId: sushiStation._id,
        restaurantName: 'Sushi Station'
      },
      {
        name: 'Miso Soup',
        category: 'Soup',
        description: 'Traditional Japanese soup',
        price: 99,
        image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=500',
        rating: 4.4,
        restaurantId: sushiStation._id,
        restaurantName: 'Sushi Station'
      }
    ]);

    // Restaurant 6: Taco Town
    const tacoTown = await Restaurant.create({
      name: 'Taco Town',
      cuisine: 'Mexican',
      priceForOne: 270,
      rating: 4.4,
      image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47',
      address: 'Jayanagar, Bangalore',
      phone: '+91 9876543215',
      openTime: '11:00 AM',
      closeTime: '11:00 PM'
    });

    await Product.insertMany([
      {
        name: 'Chicken Tacos',
        category: 'Tacos',
        description: 'Grilled chicken with salsa',
        price: 179,
        image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500',
        rating: 4.5,
        restaurantId: tacoTown._id,
        restaurantName: 'Taco Town'
      },
      {
        name: 'Beef Burrito',
        category: 'Burrito',
        description: 'Wrapped beef with beans and rice',
        price: 219,
        image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=500',
        rating: 4.6,
        restaurantId: tacoTown._id,
        restaurantName: 'Taco Town'
      },
      {
        name: 'Veggie Quesadilla',
        category: 'Quesadilla',
        description: 'Cheese and vegetables in tortilla',
        price: 159,
        image: 'https://images.unsplash.com/photo-1618040996337-56904b7850b9?w=500',
        rating: 4.3,
        restaurantId: tacoTown._id,
        restaurantName: 'Taco Town'
      },
      {
        name: 'Nachos Supreme',
        category: 'Appetizer',
        description: 'Loaded nachos with cheese and jalapeños',
        price: 189,
        image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=500',
        rating: 4.7,
        restaurantId: tacoTown._id,
        restaurantName: 'Taco Town'
      },
      {
        name: 'Guacamole & Chips',
        category: 'Appetizer',
        description: 'Fresh guacamole with tortilla chips',
        price: 129,
        image: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=500',
        rating: 4.4,
        restaurantId: tacoTown._id,
        restaurantName: 'Taco Town'
      }
    ]);

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log('- 6 Restaurants added');
    console.log('- 30 Products added (5 per restaurant)');
    console.log('\nRestaurants:');
    console.log('1. Pizza Palace (Italian)');
    console.log('2. Burger Hub (American)');
    console.log('3. Biryani House (Indian)');
    console.log('4. Pasta Paradise (Italian)');
    console.log('5. Sushi Station (Japanese)');
    console.log('6. Taco Town (Mexican)');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
