const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Driver = require('../models/Driver');
const Student = require('../models/Student');
const Bus = require('../models/Bus');
const Route = require('../models/Route');
const Salary = require('../models/Salary');
const FeeRecord = require('../models/FeeRecord');
const VehicleInspection = require('../models/VehicleInspection');
const FuelLog = require('../models/FuelLog');
const TripHistory = require('../models/TripHistory');
const CalendarEvent = require('../models/CalendarEvent');
const Maintenance = require('../models/Maintenance');
const User = require('../models/User');

dotenv.config();

const seedManagementOps = async () => {
  try {
    const existingSalary = await Salary.countDocuments();
    if (existingSalary > 0) {
      console.log('ℹ️ Phase 4 Management Operations Data already seeded.');
      return;
    }

    console.log('🌱 Seeding Phase 4 Management & Operations Data for BIT Transport Portal...');

    const drivers = await Driver.find().limit(5);
    const students = await Student.find().limit(10);
    const buses = await Bus.find().limit(5);
    const routes = await Route.find().limit(5);
    const adminUser = await User.findOne({ role: 'admin' });

    if (drivers.length === 0 || students.length === 0) {
      console.log('⚠️ Required Master Data missing for Phase 4 seeding.');
      return;
    }

    // 1. Seed Driver Salaries
    const months = ['June', 'July'];
    for (const d of drivers) {
      for (const m of months) {
        await Salary.create({
          driver: d._id,
          employeeId: d.employeeId,
          month: m,
          year: 2026,
          basicSalary: d.salary || 28000,
          allowance: 2500,
          deduction: 1000,
          bonus: 1500,
          netSalary: (d.salary || 28000) + 3000,
          paymentStatus: m === 'June' ? 'Paid' : 'Pending',
          paymentMethod: 'Bank Transfer',
          transactionId: m === 'June' ? `TXN-BIT-SAL-${Date.now()}` : '',
          paymentDate: m === 'June' ? new Date('2026-06-30') : null
        });
      }
    }
    console.log(`✅ Seeded ${drivers.length * 2} Driver Salary records.`);

    // 2. Seed Student Fees
    for (let i = 0; i < students.length; i++) {
      const student = students[i];
      const isPaid = i % 2 === 0;

      await FeeRecord.create({
        student: student._id,
        registerNumber: student.registerNumber,
        semester: 'Semester 6',
        academicYear: '2025-2026',
        route: student.assignedRoute || routes[0]._id,
        feeAmount: 18500,
        paidAmount: isPaid ? 18500 : 9250,
        balance: isPaid ? 0 : 9250,
        paymentStatus: isPaid ? 'Paid' : 'Partial',
        paymentMethod: 'UPI',
        transactionId: `TXN-BIT-FEE-${1000 + i}`,
        paymentDate: new Date('2026-07-15')
      });
    }
    console.log(`✅ Seeded ${students.length} Student Transport Fee records.`);

    // 3. Seed Vehicle Inspections
    for (let i = 0; i < drivers.length; i++) {
      await VehicleInspection.create({
        driver: drivers[i]._id,
        bus: buses[i % buses.length]._id,
        route: routes[i % routes.length]._id,
        inspectionDate: new Date(),
        brakes: true,
        tyres: true,
        lights: true,
        horn: true,
        mirrors: true,
        fuelLevel: '90%',
        overallStatus: 'Pass',
        remarks: 'Pre-trip safety checklist cleared by driver.'
      });
    }
    console.log(`✅ Seeded ${drivers.length} Daily Vehicle Inspection reports.`);

    // 4. Seed Fuel Logs
    for (let i = 0; i < buses.length; i++) {
      await FuelLog.create({
        bus: buses[i]._id,
        driver: drivers[i]._id,
        route: routes[i]._id,
        date: new Date(),
        fuelAdded: 45,
        fuelCost: 45 * 98.5,
        odometer: 142500 + i * 1200,
        mileage: 4.8,
        fuelStation: 'BIT Campus Fuel Station, Sathyamangalam'
      });
    }
    console.log(`✅ Seeded ${buses.length} Bus Fuel logs.`);

    // 5. Seed Trip History
    for (let i = 0; i < drivers.length; i++) {
      await TripHistory.create({
        driver: drivers[i]._id,
        bus: buses[i]._id,
        route: routes[i]._id,
        tripDate: new Date(),
        startTime: '06:30 AM',
        endTime: '08:15 AM',
        distanceCovered: 42,
        studentsPresent: 48,
        studentsAbsent: 4,
        tripStatus: 'Completed',
        remarks: 'Morning transit completed smoothly.'
      });
    }
    console.log(`✅ Seeded ${drivers.length} Trip History logs.`);

    // 6. Seed Calendar Events
    const events = [
      {
        title: 'Independence Day Holiday',
        description: 'Campus closed for Independence Day celebrations.',
        eventType: 'Holiday',
        date: new Date('2026-08-15'),
        applicableRole: 'All'
      },
      {
        title: 'End Semester Examinations',
        description: 'Special exam bus timing in effect. Evening departure 05:30 PM.',
        eventType: 'Exam',
        date: new Date('2026-08-20'),
        applicableRole: 'All'
      },
      {
        title: 'Fleet Monthly Servicing',
        description: 'Scheduled maintenance for buses BIT-BUS-01 to BIT-BUS-05.',
        eventType: 'Maintenance',
        date: new Date('2026-08-25'),
        applicableRole: 'Driver'
      }
    ];

    for (const e of events) {
      await CalendarEvent.create({
        ...e,
        createdBy: adminUser ? adminUser._id : null
      });
    }
    console.log(`✅ Seeded ${events.length} Calendar Schedule events.`);

    // 7. Seed Maintenance Requests
    await Maintenance.create({
      driver: drivers[0]._id,
      bus: buses[0]._id,
      issueType: 'Engine',
      description: 'Minor radiator fluid leak observed during morning return trip.',
      priority: 'Medium',
      status: 'In Progress',
      adminRemarks: 'Assigned to Depot Chief Mechanic for inspection.'
    });
    console.log('✅ Seeded Maintenance Request record.');

    console.log('🎉 Phase 4 Management Operations Seeding Completed Successfully.');
  } catch (error) {
    console.error('❌ Phase 4 Seeding Error:', error.message);
  }
};

module.exports = seedManagementOps;
