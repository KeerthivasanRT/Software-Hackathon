const db = require('../config/db');
const fs = require('fs');
const path = require('path');
const { hashPassword } = require('../utils/helpers');

const initDatabase = async () => {
  try {
    console.log('Initializing MySQL Database Schema...');
    const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');
    
    // Split and execute statements
    const statements = schemaSql.split(';').map(s => s.trim()).filter(s => s.length > 0);
    for (let statement of statements) {
      await db.query(statement);
    }
    console.log('Database Schema Created Successfully.');

    // Seed default Admin user
    const [adminExists] = await db.query('SELECT * FROM Users WHERE email = ?', ['admin@bit.edu']);
    if (adminExists.length === 0) {
      console.log('Seeding initial Admin, Driver, and Student accounts...');
      const adminPass = await hashPassword('password123');
      await db.query(`INSERT INTO Users (id, name, email, password_hash, role) VALUES ('u-admin', 'System Administrator', 'admin@bit.edu', ?, 'admin')`, [adminPass]);
      await db.query(`INSERT INTO Admins (id, user_id, employee_id, department, phone) VALUES ('adm1', 'u-admin', 'EMP-ADM-001', 'Transport Management', '9876543210')`);

      // Seed Driver
      const driverPass = await hashPassword('password123');
      await db.query(`INSERT INTO Users (id, name, email, password_hash, role) VALUES ('u-driver', 'S. Kumar (Senior Driver)', 'driver@bit.edu', ?, 'driver')`, [driverPass]);
      await db.query(`INSERT INTO Drivers (id, user_id, employee_id, license_number, experience, phone, status) VALUES ('d1', 'u-driver', 'DRV-001', 'TN-38-2018-998877', 12, '9876543211', 'active')`);

      // Seed Student
      const studentPass = await hashPassword('password123');
      await db.query(`INSERT INTO Users (id, name, email, password_hash, role) VALUES ('u-student', 'Keerthana M', 'student@bit.edu', ?, 'student')`, [studentPass]);
      await db.query(`INSERT INTO Students (id, user_id, register_number, department, year, semester, phone, parent_phone, status) VALUES ('st1', 'u-student', '7376221CS101', 'Computer Science & Engineering', '3rd Year', '6th Semester', '9876543212', '9876543299', 'active')`);

      console.log('Seed Accounts Created Successfully:');
      console.log('Admin:   admin@bit.edu / password123');
      console.log('Driver:  driver@bit.edu / password123');
      console.log('Student: student@bit.edu / password123');
    }
  } catch (error) {
    console.error('Error initializing database:', error.message);
  }
};

if (require.main === module) {
  initDatabase().then(() => process.exit(0));
}

module.exports = initDatabase;
