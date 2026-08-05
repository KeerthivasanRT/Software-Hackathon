const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const connectDB = require('../config/db');

dotenv.config();

const seedUsers = [
  {
    name: 'Admin User',
    email: 'admin@admin.com',
    password: 'Admin@123',
    role: 'admin',
    phone: '9876543210',
    status: 'active'
  },
  {
    name: 'R. Murugan',
    email: 'murugan@driver.com',
    password: 'password123',
    role: 'driver',
    phone: '9876543211',
    status: 'active'
  },
  {
    name: 'Arun Kumar',
    email: 'arun@student.com',
    password: 'Student@123',
    role: 'student',
    phone: '9876543212',
    status: 'active'
  }
];

const runSeed = async () => {
  try {
    await connectDB();

    console.log('🌱 Seeding Phase 1 Default Users...');

    for (const userData of seedUsers) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);

      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        await User.updateOne(
          { _id: existingUser._id },
          { $set: { ...userData, password: hashedPassword } }
        );
        console.log(`🔄 Updated existing account & password hash: ${userData.name} (${userData.role}) - ${userData.email}`);
      } else {
        await User.create(userData);
        console.log(`✅ Seeded account: ${userData.name} (${userData.role}) - ${userData.email}`);
      }
    }

    console.log('🎉 Phase 1 User Seeding Complete.');
    console.log('\n=======================================================');
    console.log('Driver:');
    console.log('Email: murugan@driver.com');
    console.log('Password: password123');
    console.log('=======================================================');
  } catch (error) {
    console.error('❌ Seeding Error:', error.message);
  }
};

if (require.main === module) {
  runSeed().then(() => process.exit(0));
}

module.exports = runSeed;
