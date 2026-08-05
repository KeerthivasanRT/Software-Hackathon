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
    password: 'Murugan@123',
    role: 'driver',
    phone: '9876543211',
    status: 'active'
  },
  {
    name: 'Arun Kumar',
    email: 'arun@student.com',
    password: 'Arun@123',
    role: 'student',
    phone: '9876543212',
    status: 'active'
  }
];

const runSeed = async () => {
  try {
    await connectDB();

    console.log('🌱 Seeding & Reserving Default User Credentials...');

    for (const userData of seedUsers) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);

      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        await User.updateOne(
          { _id: existingUser._id },
          { $set: { password: hashedPassword } }
        );
        console.log(`🔄 Updated existing account password hash: ${userData.email}`);
      } else {
        await User.create(userData);
        console.log(`✅ Seeded account: ${userData.email}`);
      }
    }

    console.log('🎉 User Credentials Seeding Complete.');
    console.log('\n========================================');
    console.log('DEFAULT LOGIN CREDENTIALS');
    console.log('========================================\n');
    console.log('ADMIN');
    console.log('Email: admin@admin.com');
    console.log('Password: Admin@123\n');
    console.log('DRIVER');
    console.log('Email: murugan@driver.com');
    console.log('Password: Murugan@123\n');
    console.log('STUDENT');
    console.log('Email: arun@student.com');
    console.log('Password: Arun@123\n');
    console.log('========================================');
  } catch (error) {
    console.error('❌ Seeding Error:', error.message);
  }
};

if (require.main === module) {
  runSeed().then(() => process.exit(0));
}

module.exports = runSeed;
