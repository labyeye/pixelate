require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const adminExists = await User.findOne({ username: 'admin' });
    if (adminExists) {
      console.log('Admin user already exists');
      process.exit();
    }
    
    const admin = new User({
      username: 'admin',
      password: 'admin123', // Change this to a strong password in production
      role: 'admin'
    });
    
    await admin.save();
    console.log('Admin user created successfully');
    process.exit();
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
}

createAdmin();