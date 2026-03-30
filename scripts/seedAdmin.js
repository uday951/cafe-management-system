import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected');

    // Dynamically import models
    const { default: User } = await import('../src/models/User.js');
    const { default: Business } = await import('../src/models/Business.js');

    // Admin credentials
    const ADMIN_EMAIL = 'admin@urbanflow.com';
    const ADMIN_PASSWORD = 'Admin@1234';
    const ADMIN_NAME = 'UrbanFlow Admin';
    const BUSINESS_NAME = 'UrbanFlow Cafe';

    // Check if admin already exists
    const existingUser = await User.findOne({ email: ADMIN_EMAIL });
    if (existingUser) {
      console.log('⚠️  Admin already exists with email:', ADMIN_EMAIL);
      console.log('🔑 Use these credentials to login:');
      console.log('   Email:   ', ADMIN_EMAIL);
      console.log('   Password:', ADMIN_PASSWORD);
      process.exit(0);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, salt);

    // Create Business first (needs businessId for user)
    const business = await Business.create({
      ownerId: new mongoose.Types.ObjectId(), // temp, will update after user created
      name: BUSINESS_NAME,
      businessType: 'restaurant',
      email: ADMIN_EMAIL,
      phone: '9999999999',
      address: '123 Main Street',
      city: 'Hyderabad',
      state: 'Telangana',
      description: 'Welcome to UrbanFlow Cafe – scan, order, enjoy!',
      paymentMethods: ['cash', 'upi', 'card'],
    });

    // Create User (owner)
    const user = await User.create({
      email: ADMIN_EMAIL,
      passwordHash,
      role: 'owner',
      name: ADMIN_NAME,
      phone: '9999999999',
      businessId: business._id,
      isActive: true,
    });

    // Update business ownerId with actual user id
    business.ownerId = user._id;
    await business.save();

    console.log('\n🎉 Admin account created successfully!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔑  LOGIN CREDENTIALS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('   Email:      ', ADMIN_EMAIL);
    console.log('   Password:   ', ADMIN_PASSWORD);
    console.log('   Role:       ', 'owner');
    console.log('   Business ID:', business._id.toString());
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('🌐 Visit http://localhost:5173/login to sign in\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
};

seedAdmin();
