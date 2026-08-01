const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Student = require('../models/Student');
const Driver = require('../models/Driver');
const Route = require('../models/Route');
const Bus = require('../models/Bus');
const Attendance = require('../models/Attendance');
const Complaint = require('../models/Complaint');
const Notification = require('../models/Notification');
const EmergencySOS = require('../models/EmergencySOS');
const User = require('../models/User');

dotenv.config();

const seedDailyOperations = async () => {
  try {
    const existingAttendance = await Attendance.countDocuments();
    if (existingAttendance > 0) {
      console.log('ℹ️ Daily Operations Data already seeded.');
      return;
    }

    console.log('🌱 Seeding Phase 3 Daily Operations Data for BIT Transport Portal...');

    const students = await Student.find().limit(10);
    const drivers = await Driver.find().limit(5);
    const routes = await Route.find().limit(5);
    const buses = await Bus.find().limit(5);
    const adminUser = await User.findOne({ role: 'admin' });

    if (students.length === 0 || drivers.length === 0) {
      console.log('⚠️ Master Data missing for Daily Operations seeding.');
      return;
    }

    // 1. Seed Attendance for 10 Students across 3 days
    const attendanceStatuses = ['Present', 'Present', 'Present', 'Absent', 'Late'];
    for (let dayOffset = 0; dayOffset < 3; dayOffset++) {
      const currentDate = new Date();
      currentDate.setDate(currentDate.getDate() - dayOffset);

      for (let i = 0; i < students.length; i++) {
        const student = students[i];
        const status = attendanceStatuses[(i + dayOffset) % attendanceStatuses.length];

        await Attendance.create({
          student: student._id,
          driver: drivers[i % drivers.length]._id,
          route: student.assignedRoute || routes[0]._id,
          bus: student.assignedBus || buses[0]._id,
          pickupPoint: student.pickupPoint,
          date: currentDate,
          time: '07:42 AM',
          status: status,
          remarks: status === 'Late' ? 'Traffic at Sathyamangalam Toll' : ''
        });
      }
    }
    console.log('✅ Seeded 30 Attendance records across 3 days.');

    // 2. Seed Complaints
    const complaintData = [
      {
        title: 'AC cooling insufficient on Route A',
        description: 'The air conditioning in BIT-BUS-01 was blowing warm air during morning pickup.',
        category: 'Bus Cleanliness',
        priority: 'Medium',
        status: 'Pending'
      },
      {
        title: 'Bus arrived 15 mins late at Annur Stop',
        description: 'Heavy fog on Sathyamangalam highway delayed arrival to 07:30 AM.',
        category: 'Bus Delay',
        priority: 'High',
        status: 'In Progress',
        adminRemarks: 'Transport manager notified driver R. Murugan to initiate earlier dispatch.'
      },
      {
        title: 'Broken seat handle on Row 4',
        description: 'Seat 14 right armrest is loose and requires maintenance attention.',
        category: 'Seat Damage',
        priority: 'Low',
        status: 'Resolved',
        adminRemarks: 'Depot workshop fixed seat frame.'
      }
    ];

    for (let i = 0; i < complaintData.length; i++) {
      await Complaint.create({
        student: students[i]._id,
        route: students[i].assignedRoute || routes[0]._id,
        driver: drivers[i % drivers.length]._id,
        ...complaintData[i]
      });
    }
    console.log(`✅ Seeded ${complaintData.length} Complaints.`);

    // 3. Seed Notifications
    const notifications = [
      {
        title: 'Campus Transport Schedule Adjustment',
        message: 'All evening return buses will depart 15 minutes after 05:00 PM for semester exams.',
        receiverRole: 'All',
        priority: 'High'
      },
      {
        title: 'Driver Safety Protocol Briefing',
        message: 'Mandatory vehicle pre-trip check required before 06:30 AM departure.',
        receiverRole: 'Driver',
        priority: 'Medium'
      },
      {
        title: 'Bus Pass Renewal Notice',
        message: 'Please complete your semester 6 bus pass fee payment by end of week.',
        receiverRole: 'Student',
        priority: 'Urgent'
      }
    ];

    for (const n of notifications) {
      await Notification.create({
        ...n,
        createdBy: adminUser ? adminUser._id : null
      });
    }
    console.log(`✅ Seeded ${notifications.length} Broadcast Notifications.`);

    // 4. Seed Emergency SOS
    await EmergencySOS.create({
      triggeredBy: adminUser ? adminUser._id : students[0]._id,
      role: 'student',
      route: routes[0]._id,
      bus: buses[0]._id,
      location: { latitude: 11.5034, longitude: 77.2444, name: 'Sathyamangalam Highway Km 14' },
      emergencyType: 'Vehicle Breakdown',
      description: 'Engine overheating on BIT-BUS-01. Replacement bus dispatched.',
      status: 'Acknowledged'
    });
    console.log('✅ Seeded 1 Active Emergency SOS record.');

    console.log('🎉 Phase 3 Daily Operations Seeding Complete.');
  } catch (error) {
    console.error('❌ Daily Operations Seeding Error:', error.message);
  }
};

module.exports = seedDailyOperations;
