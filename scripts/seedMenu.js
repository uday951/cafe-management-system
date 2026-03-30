import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = 'mongodb+srv://udaydd6062_db_user:uday1234@cluster0.4fygtxp.mongodb.net/urbanflow?retryWrites=true&w=majority&appName=Cluster0';
const BUSINESS_ID = '69ca84ef170e0a9d7c3d864b';

await mongoose.connect(MONGODB_URI);

const Category = mongoose.model('Category', new mongoose.Schema({ businessId: mongoose.Schema.Types.ObjectId, name: String }));
const MenuItem = mongoose.model('MenuItem', new mongoose.Schema({ businessId: mongoose.Schema.Types.ObjectId, name: String, price: Number, category: String, description: String, image: String, isAvailable: Boolean }));

await Category.insertMany([
  { businessId: BUSINESS_ID, name: 'Starters' },
  { businessId: BUSINESS_ID, name: 'Main Course' },
  { businessId: BUSINESS_ID, name: 'Beverages' },
  { businessId: BUSINESS_ID, name: 'Desserts' },
]);

await MenuItem.insertMany([
  { businessId: BUSINESS_ID, name: 'Veg Spring Rolls', price: 149, category: 'Starters', description: 'Crispy rolls with fresh veggies', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400', isAvailable: true },
  { businessId: BUSINESS_ID, name: 'Paneer Tikka', price: 249, category: 'Starters', description: 'Grilled cottage cheese with spices', image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400', isAvailable: true },
  { businessId: BUSINESS_ID, name: 'Chicken Wings', price: 299, category: 'Starters', description: 'Spicy crispy chicken wings', image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400', isAvailable: true },
  { businessId: BUSINESS_ID, name: 'Butter Chicken', price: 349, category: 'Main Course', description: 'Creamy tomato based chicken curry', image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400', isAvailable: true },
  { businessId: BUSINESS_ID, name: 'Paneer Butter Masala', price: 299, category: 'Main Course', description: 'Rich creamy paneer curry', image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400', isAvailable: true },
  { businessId: BUSINESS_ID, name: 'Veg Biryani', price: 249, category: 'Main Course', description: 'Fragrant basmati rice with vegetables', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400', isAvailable: true },
  { businessId: BUSINESS_ID, name: 'Chicken Biryani', price: 329, category: 'Main Course', description: 'Aromatic rice with tender chicken', image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400', isAvailable: true },
  { businessId: BUSINESS_ID, name: 'Masala Chai', price: 49, category: 'Beverages', description: 'Indian spiced tea', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400', isAvailable: true },
  { businessId: BUSINESS_ID, name: 'Cold Coffee', price: 129, category: 'Beverages', description: 'Chilled blended coffee', image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400', isAvailable: true },
  { businessId: BUSINESS_ID, name: 'Mango Lassi', price: 99, category: 'Beverages', description: 'Sweet mango yogurt drink', image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400', isAvailable: true },
  { businessId: BUSINESS_ID, name: 'Gulab Jamun', price: 89, category: 'Desserts', description: 'Soft milk dumplings in sugar syrup', image: 'https://images.unsplash.com/photo-1666195966573-f2c5e9b5e5e5?w=400', isAvailable: true },
  { businessId: BUSINESS_ID, name: 'Chocolate Brownie', price: 149, category: 'Desserts', description: 'Warm fudgy chocolate brownie', image: 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=400', isAvailable: true },
]);

console.log('✅ Mock data seeded!');
process.exit(0);
