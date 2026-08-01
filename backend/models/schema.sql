-- Smart Transport Management System DDL Schema
CREATE DATABASE IF NOT EXISTS smart_transport_db;
USE smart_transport_db;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS Users (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'driver', 'student') NOT NULL,
  avatar VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Admins Table
CREATE TABLE IF NOT EXISTS Admins (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(50) UNIQUE NOT NULL,
  employee_id VARCHAR(50) UNIQUE NOT NULL,
  department VARCHAR(100),
  phone VARCHAR(20),
  FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

-- 3. Routes Table (Need Routes before Buses)
CREATE TABLE IF NOT EXISTS Routes (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  start_location VARCHAR(100),
  end_location VARCHAR(100),
  distance_km FLOAT DEFAULT 0,
  estimated_time VARCHAR(50),
  status ENUM('active', 'inactive', 'maintenance') DEFAULT 'active'
);

-- 4. Buses Table (Need Buses before Drivers & Students)
CREATE TABLE IF NOT EXISTS Buses (
  id VARCHAR(50) PRIMARY KEY,
  bus_number VARCHAR(50) UNIQUE NOT NULL,
  registration_number VARCHAR(50) NOT NULL,
  bus_name VARCHAR(100),
  capacity INT DEFAULT 50,
  driver_id VARCHAR(50),
  route_id VARCHAR(50),
  fuel_type ENUM('Diesel', 'Petrol', 'Electric', 'CNG') DEFAULT 'Diesel',
  average_mileage FLOAT DEFAULT 5.0,
  status ENUM('active', 'maintenance', 'inactive') DEFAULT 'active',
  notes TEXT,
  FOREIGN KEY (route_id) REFERENCES Routes(id) ON DELETE SET NULL
);

-- 5. Drivers Table
CREATE TABLE IF NOT EXISTS Drivers (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(50) UNIQUE NOT NULL,
  employee_id VARCHAR(50) UNIQUE NOT NULL,
  license_number VARCHAR(50) NOT NULL,
  license_expiry DATE,
  experience INT DEFAULT 0,
  phone VARCHAR(20),
  status ENUM('active', 'inactive') DEFAULT 'active',
  assigned_bus_id VARCHAR(50),
  assigned_route_id VARCHAR(50),
  FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
  FOREIGN KEY (assigned_bus_id) REFERENCES Buses(id) ON DELETE SET NULL,
  FOREIGN KEY (assigned_route_id) REFERENCES Routes(id) ON DELETE SET NULL
);

-- Add foreign key back to Buses for driver_id
ALTER TABLE Buses ADD CONSTRAINT fk_bus_driver FOREIGN KEY (driver_id) REFERENCES Drivers(id) ON DELETE SET NULL;

-- 6. PickupPoints Table
CREATE TABLE IF NOT EXISTS PickupPoints (
  id VARCHAR(50) PRIMARY KEY,
  route_id VARCHAR(50) NOT NULL,
  name VARCHAR(100) NOT NULL,
  sequence_order INT DEFAULT 1,
  scheduled_time VARCHAR(20),
  latitude DOUBLE,
  longitude DOUBLE,
  FOREIGN KEY (route_id) REFERENCES Routes(id) ON DELETE CASCADE
);

-- 7. Students Table
CREATE TABLE IF NOT EXISTS Students (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(50) UNIQUE NOT NULL,
  register_number VARCHAR(50) UNIQUE NOT NULL,
  department VARCHAR(100),
  year VARCHAR(20),
  semester VARCHAR(20),
  phone VARCHAR(20),
  parent_phone VARCHAR(20),
  assigned_bus_id VARCHAR(50),
  assigned_route_id VARCHAR(50),
  pickup_stop_id VARCHAR(50),
  status ENUM('active', 'inactive') DEFAULT 'active',
  FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
  FOREIGN KEY (assigned_bus_id) REFERENCES Buses(id) ON DELETE SET NULL,
  FOREIGN KEY (assigned_route_id) REFERENCES Routes(id) ON DELETE SET NULL,
  FOREIGN KEY (pickup_stop_id) REFERENCES PickupPoints(id) ON DELETE SET NULL
);

-- 8. Attendance Table
CREATE TABLE IF NOT EXISTS Attendance (
  id VARCHAR(50) PRIMARY KEY,
  student_id VARCHAR(50) NOT NULL,
  bus_id VARCHAR(50) NOT NULL,
  date DATETIME NOT NULL,
  status ENUM('present', 'absent', 'late', 'leave') DEFAULT 'present',
  time VARCHAR(20),
  marked_by VARCHAR(50),
  FOREIGN KEY (student_id) REFERENCES Students(id) ON DELETE CASCADE,
  FOREIGN KEY (bus_id) REFERENCES Buses(id) ON DELETE CASCADE
);

-- 9. Complaints Table
CREATE TABLE IF NOT EXISTS Complaints (
  id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  category VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  student_id VARCHAR(50) NOT NULL,
  bus_id VARCHAR(50),
  status ENUM('pending', 'in_progress', 'resolved', 'dismissed') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES Students(id) ON DELETE CASCADE
);

-- 10. Notifications Table
CREATE TABLE IF NOT EXISTS Notifications (
  id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  message TEXT NOT NULL,
  target_role ENUM('all', 'driver', 'student', 'admin') DEFAULT 'all',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('sent', 'read', 'archived') DEFAULT 'sent'
);

-- 11. EmergencySOS Table
CREATE TABLE IF NOT EXISTS EmergencySOS (
  id VARCHAR(50) PRIMARY KEY,
  reported_by ENUM('driver', 'student') NOT NULL,
  student_id VARCHAR(50),
  driver_id VARCHAR(50),
  bus_id VARCHAR(50),
  route_id VARCHAR(50),
  emergency_type VARCHAR(100) NOT NULL,
  description TEXT,
  latitude DOUBLE,
  longitude DOUBLE,
  status ENUM('active', 'resolved') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 12. FuelLogs Table
CREATE TABLE IF NOT EXISTS FuelLogs (
  id VARCHAR(50) PRIMARY KEY,
  bus_id VARCHAR(50) NOT NULL,
  driver_id VARCHAR(50) NOT NULL,
  date DATE NOT NULL,
  fuel_liters FLOAT NOT NULL,
  cost FLOAT NOT NULL,
  odometer_reading FLOAT NOT NULL,
  fuel_station VARCHAR(100),
  receipt_number VARCHAR(50),
  notes TEXT,
  FOREIGN KEY (bus_id) REFERENCES Buses(id) ON DELETE CASCADE,
  FOREIGN KEY (driver_id) REFERENCES Drivers(id) ON DELETE CASCADE
);

-- 13. VehicleInspection Table
CREATE TABLE IF NOT EXISTS VehicleInspection (
  id VARCHAR(50) PRIMARY KEY,
  bus_id VARCHAR(50) NOT NULL,
  driver_id VARCHAR(50) NOT NULL,
  date DATE NOT NULL,
  brakes_ok BOOLEAN DEFAULT TRUE,
  tires_ok BOOLEAN DEFAULT TRUE,
  lights_ok BOOLEAN DEFAULT TRUE,
  engine_ok BOOLEAN DEFAULT TRUE,
  status ENUM('passed', 'flagged', 'repaired') DEFAULT 'passed',
  notes TEXT,
  FOREIGN KEY (bus_id) REFERENCES Buses(id) ON DELETE CASCADE,
  FOREIGN KEY (driver_id) REFERENCES Drivers(id) ON DELETE CASCADE
);

-- 14. TripHistory Table
CREATE TABLE IF NOT EXISTS TripHistory (
  id VARCHAR(50) PRIMARY KEY,
  bus_id VARCHAR(50) NOT NULL,
  driver_id VARCHAR(50) NOT NULL,
  route_id VARCHAR(50) NOT NULL,
  start_time DATETIME NOT NULL,
  end_time DATETIME,
  passengers_count INT DEFAULT 0,
  status ENUM('in_progress', 'completed', 'cancelled') DEFAULT 'completed',
  FOREIGN KEY (bus_id) REFERENCES Buses(id) ON DELETE CASCADE,
  FOREIGN KEY (driver_id) REFERENCES Drivers(id) ON DELETE CASCADE,
  FOREIGN KEY (route_id) REFERENCES Routes(id) ON DELETE CASCADE
);

-- 15. DriverSalary Table
CREATE TABLE IF NOT EXISTS DriverSalary (
  id VARCHAR(50) PRIMARY KEY,
  driver_id VARCHAR(50) NOT NULL,
  month VARCHAR(20) NOT NULL,
  year INT NOT NULL,
  base_salary FLOAT NOT NULL,
  bonus FLOAT DEFAULT 0,
  deductions FLOAT DEFAULT 0,
  net_salary FLOAT NOT NULL,
  status ENUM('pending', 'paid', 'processing') DEFAULT 'pending',
  payment_date DATE,
  payment_method VARCHAR(50),
  transaction_ref VARCHAR(100),
  FOREIGN KEY (driver_id) REFERENCES Drivers(id) ON DELETE CASCADE
);

-- 16. StudentFees Table
CREATE TABLE IF NOT EXISTS StudentFees (
  id VARCHAR(50) PRIMARY KEY,
  student_id VARCHAR(50) NOT NULL,
  academic_year VARCHAR(20) NOT NULL,
  total_fee FLOAT NOT NULL,
  paid_fee FLOAT DEFAULT 0,
  due_date DATE,
  status ENUM('paid', 'pending', 'overdue', 'partial') DEFAULT 'pending',
  transaction_id VARCHAR(100),
  payment_date DATE,
  FOREIGN KEY (student_id) REFERENCES Students(id) ON DELETE CASCADE
);

-- 17. CalendarEvents Table
CREATE TABLE IF NOT EXISTS CalendarEvents (
  id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  date DATE NOT NULL,
  time VARCHAR(50),
  event_type ENUM('academic', 'holiday', 'inspection', 'maintenance', 'meeting') DEFAULT 'academic',
  description TEXT,
  target_role ENUM('all', 'driver', 'student', 'admin') DEFAULT 'all'
);

-- 18. MaintenanceRequests Table
CREATE TABLE IF NOT EXISTS MaintenanceRequests (
  id VARCHAR(50) PRIMARY KEY,
  bus_id VARCHAR(50) NOT NULL,
  issue_description TEXT NOT NULL,
  priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
  status ENUM('pending', 'in_progress', 'completed') DEFAULT 'pending',
  requested_by VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (bus_id) REFERENCES Buses(id) ON DELETE CASCADE
);
