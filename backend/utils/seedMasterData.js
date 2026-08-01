const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Route = require('../models/Route');
const Bus = require('../models/Bus');
const Driver = require('../models/Driver');
const PickupPoint = require('../models/PickupPoint');
const Student = require('../models/Student');
const connectDB = require('../config/db');

dotenv.config();

const routeDefinitions = [
  { routeCode: 'R-01', routeName: 'Route A: Annur → BIT', startingPoint: 'Annur Bus Stand', distance: 38, estimatedTime: '1 hr 05 mins' },
  { routeCode: 'R-02', routeName: 'Route B: Coimbatore → BIT', startingPoint: 'Gandhipuram, Coimbatore', distance: 68, estimatedTime: '1 hr 45 mins' },
  { routeCode: 'R-03', routeName: 'Route C: Erode → BIT', startingPoint: 'Erode Central Bus Stand', distance: 62, estimatedTime: '1 hr 35 mins' },
  { routeCode: 'R-04', routeName: 'Route D: Bhavani → BIT', startingPoint: 'Bhavani New Bus Stand', distance: 42, estimatedTime: '1 hr 10 mins' },
  { routeCode: 'R-05', routeName: 'Route E: Sathyamangalam → BIT', startingPoint: 'Sathyamangalam Depot', distance: 12, estimatedTime: '25 mins' },
  { routeCode: 'R-06', routeName: 'Route F: Tirupur → BIT', startingPoint: 'Tirupur Old Bus Stand', distance: 55, estimatedTime: '1 hr 25 mins' },
  { routeCode: 'R-07', routeName: 'Route G: Gobichettipalayam → BIT', startingPoint: 'Gobi Bus Stand', distance: 28, estimatedTime: '45 mins' },
  { routeCode: 'R-08', routeName: 'Route H: Mettupalayam → BIT', startingPoint: 'Mettupalayam Railway Station', distance: 48, estimatedTime: '1 hr 15 mins' },
  { routeCode: 'R-09', routeName: 'Route I: Pollachi → BIT', startingPoint: 'Pollachi Bus Stand', distance: 105, estimatedTime: '2 hrs 15 mins' },
  { routeCode: 'R-10', routeName: 'Route J: Salem → BIT', startingPoint: 'Salem New Bus Stand', distance: 112, estimatedTime: '2 hrs 25 mins' }
];

const driverNames = [
  'R. Murugan', 'S. Kumar', 'K. Selvam', 'P. Ramesh', 'M. Ganesan',
  'V. Natarajan', 'T. Elango', 'N. Soundar', 'A. Vijay', 'C. Manikandan'
];

const departments = ['Computer Science & Engineering', 'Electronics & Communication', 'Mechanical Engineering', 'Information Technology', 'Artificial Intelligence & Data Science'];

const seedMasterData = async () => {
  try {
    const existingRoutes = await Route.countDocuments();
    if (existingRoutes > 0) {
      console.log('ℹ️ Master Data already seeded.');
      return;
    }

    console.log('🌱 Seeding Phase 2 Master Data for Bannari Amman Institute of Technology...');

    // 1. Seed 10 Drivers
    const createdDrivers = [];
    for (let i = 0; i < 10; i++) {
      const driver = await Driver.create({
        name: driverNames[i],
        employeeId: `DRV-${101 + i}`,
        email: `driver${i + 1}@bit.edu`,
        phone: `987654320${i}`,
        licenseNumber: `TN-38-2018-000${10 + i}`,
        licenseExpiry: '2032-05-20',
        experience: 6 + (i % 5),
        salary: 28000 + i * 1000,
        status: 'active'
      });
      createdDrivers.push(driver);
    }
    console.log(`✅ Seeded ${createdDrivers.length} Drivers.`);

    // 2. Seed 10 Buses & 10 Routes
    const createdBuses = [];
    const createdRoutes = [];
    const createdPoints = [];

    for (let i = 0; i < 10; i++) {
      const def = routeDefinitions[i];

      const route = await Route.create({
        routeCode: def.routeCode,
        routeName: def.routeName,
        startingPoint: def.startingPoint,
        destination: 'BIT Campus, Sathyamangalam',
        distance: def.distance,
        estimatedTime: def.estimatedTime,
        status: 'active'
      });

      const bus = await Bus.create({
        busNumber: `BIT-BUS-${String(i + 1).padStart(2, '0')}`,
        registrationNumber: `TN-38-BT-${1001 + i}`,
        capacity: 55,
        driver: createdDrivers[i]._id,
        route: route._id,
        status: 'active'
      });

      // Update references
      route.assignedBus = bus._id;
      route.assignedDriver = createdDrivers[i]._id;

      createdDrivers[i].assignedBus = bus._id;
      createdDrivers[i].assignedRoute = route._id;
      await createdDrivers[i].save();

      // Seed 5 Pickup Points per route
      const routePoints = [];
      for (let j = 0; j < 5; j++) {
        const point = await PickupPoint.create({
          name: `${def.startingPoint.split(',')[0]} Stop ${j + 1}`,
          latitude: 11.5034 + i * 0.05 + j * 0.01,
          longitude: 77.2444 + i * 0.05 + j * 0.01,
          route: route._id,
          arrivalTime: `07:${15 + j * 10} AM`
        });
        routePoints.push(point);
        createdPoints.push(point);
      }

      route.stops = routePoints.map(p => p._id);
      await route.save();

      createdBuses.push(bus);
      createdRoutes.push(route);
    }

    console.log(`✅ Seeded ${createdRoutes.length} Routes, ${createdBuses.length} Buses, ${createdPoints.length} Pickup Points.`);

    // 3. Seed 50 Students
    const createdStudents = [];
    for (let i = 0; i < 50; i++) {
      const routeIndex = i % 10;
      const pointIndex = i % 5;
      const targetRoute = createdRoutes[routeIndex];
      const targetBus = createdBuses[routeIndex];
      const targetPoint = createdPoints[routeIndex * 5 + pointIndex];

      const student = await Student.create({
        name: `Student ${i + 1} (${['Anand', 'Bhavana', 'Chetan', 'Divya', 'Ezhil'][i % 5]})`,
        registerNumber: `7376221CS${101 + i}`,
        department: departments[i % departments.length],
        year: ['1st Year', '2nd Year', '3rd Year', '4th Year'][i % 4],
        section: ['A', 'B', 'C'][i % 3],
        email: `student${i + 1}@bit.edu`,
        phone: `99887766${String(i).padStart(2, '0')}`,
        address: `${targetPoint.name}, Tamil Nadu`,
        pickupPoint: targetPoint._id,
        assignedRoute: targetRoute._id,
        assignedBus: targetBus._id,
        status: 'active'
      });

      targetPoint.students.push(student._id);
      await targetPoint.save();
      createdStudents.push(student);
    }

    console.log(`✅ Seeded ${createdStudents.length} Students with full relations.`);
    console.log('🎉 Phase 2 Master Data Seeding Completed Successfully.');
  } catch (error) {
    console.error('❌ Master Data Seeding Error:', error.message);
  }
};

if (require.main === module) {
  connectDB().then(() => seedMasterData().then(() => process.exit(0)));
}

module.exports = seedMasterData;
