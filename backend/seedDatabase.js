const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Load Mongoose Models
const User = require('./models/User');
const Student = require('./models/Student');
const Driver = require('./models/Driver');
const Bus = require('./models/Bus');
const Route = require('./models/Route');
const PickupPoint = require('./models/PickupPoint');
const Attendance = require('./models/Attendance');
const Salary = require('./models/Salary');
const FeeRecord = require('./models/FeeRecord');
const Notification = require('./models/Notification');
const Complaint = require('./models/Complaint');
const EmergencySOS = require('./models/EmergencySOS');
const FuelLog = require('./models/FuelLog');
const TripHistory = require('./models/TripHistory');
const VehicleInspection = require('./models/VehicleInspection');
const CalendarEvent = require('./models/CalendarEvent');
const Maintenance = require('./models/Maintenance');

const connectDB = require('./config/db');

// Sample Data Lists
const studentFirstNames = [
  'Arun', 'Karthikeyan', 'Praveen', 'Harish', 'Naveen',
  'Rohith', 'Akash', 'Dinesh', 'Vignesh', 'Madhan',
  'Ezhil', 'Gokul', 'Kavya', 'Deepika', 'Anitha',
  'Bhavana', 'Chetan', 'Divya', 'Ganesh', 'Hemant',
  'Indira', 'Janani', 'Kiran', 'Lokesh', 'Manoj',
  'Nisha', 'Oviya', 'Pradeep', 'Rahul', 'Sanjay',
  'Tamil', 'Usha', 'Varun', 'Yash', 'Zahir',
  'Abhinav', 'Balaji', 'Charan', 'Dhanush', 'Elango',
  'Farhan', 'Gowtham', 'Hari', 'Ishwarya', 'Jeeva',
  'Koushik', 'Lavanya', 'Mukesh', 'Nitin', 'Preethi'
];

const studentLastNames = [
  'Kumar', 'Rajan', 'Sundaram', 'Murugan', 'Selvam',
  'Natarajan', 'Ganesan', 'Vijay', 'Manikandan', 'Soundar'
];

const departments = [
  'CSE', 'IT', 'ECE', 'EEE', 'MECH', 'AIDS', 'AI&DS', 'CYBER SECURITY'
];

const driverNames = [
  'Murugan', 'Suresh', 'Ravi', 'Selvam', 'Kumar',
  'Mohan', 'Rajendran', 'Manikandan', 'Sivakumar', 'Velmurugan'
];

const pickupPointData = [
  { name: 'Annur Bus Stand', latitude: 11.2333, longitude: 77.1333, arrivalTime: '07:00 AM' },
  { name: 'Karumathampatti', latitude: 11.1167, longitude: 77.1833, arrivalTime: '07:15 AM' },
  { name: 'Saravanampatti', latitude: 11.0800, longitude: 76.9900, arrivalTime: '07:25 AM' },
  { name: 'Gandhipuram', latitude: 11.0168, longitude: 76.9558, arrivalTime: '06:45 AM' },
  { name: 'Ukkadam', latitude: 10.9934, longitude: 76.9600, arrivalTime: '06:30 AM' },
  { name: 'Perundurai', latitude: 11.2750, longitude: 77.5833, arrivalTime: '07:05 AM' },
  { name: 'Erode Bus Stand', latitude: 11.3410, longitude: 77.7172, arrivalTime: '06:40 AM' },
  { name: 'Bhavani Bus Stand', latitude: 11.4500, longitude: 77.6833, arrivalTime: '07:10 AM' },
  { name: 'Sathyamangalam', latitude: 11.5034, longitude: 77.2444, arrivalTime: '07:35 AM' },
  { name: 'Puliyampatti', latitude: 11.3500, longitude: 77.1667, arrivalTime: '07:20 AM' }
];

const routeDefinitions = [
  { routeCode: 'R-A', routeName: 'Route A: Annur → BIT', startingPoint: 'Annur Bus Stand', distance: 38, estimatedTime: '1 hr 05 mins' },
  { routeCode: 'R-B', routeName: 'Route B: Coimbatore → BIT', startingPoint: 'Gandhipuram, Coimbatore', distance: 68, estimatedTime: '1 hr 45 mins' },
  { routeCode: 'R-C', routeName: 'Route C: Erode → BIT', startingPoint: 'Erode Bus Stand', distance: 62, estimatedTime: '1 hr 35 mins' },
  { routeCode: 'R-D', routeName: 'Route D: Bhavani → BIT', startingPoint: 'Bhavani Bus Stand', distance: 42, estimatedTime: '1 hr 10 mins' },
  { routeCode: 'R-E', routeName: 'Route E: Sathyamangalam → BIT', startingPoint: 'Sathyamangalam Depot', distance: 12, estimatedTime: '25 mins' }
];

const busLabels = ['BUS-A', 'BUS-B', 'BUS-C', 'BUS-D', 'BUS-E', 'BUS-F', 'BUS-G', 'BUS-H', 'BUS-I', 'BUS-J'];

const seedAll = async () => {
  try {
    await connectDB();

    console.log('🧹 Clearing existing collections for a clean seed...');
    await Promise.all([
      User.deleteMany({ email: { $nin: ['admin@admin.com', 'murugan@driver.com', 'arun@student.com'] } }),
      Student.deleteMany({}),
      Driver.deleteMany({}),
      Bus.deleteMany({}),
      Route.deleteMany({}),
      PickupPoint.deleteMany({}),
      Attendance.deleteMany({}),
      Salary.deleteMany({}),
      FeeRecord.deleteMany({}),
      Notification.deleteMany({}),
      Complaint.deleteMany({}),
      EmergencySOS.deleteMany({}),
      FuelLog.deleteMany({}),
      TripHistory.deleteMany({}),
      VehicleInspection.deleteMany({}),
      CalendarEvent.deleteMany({}),
      Maintenance.deleteMany({})
    ]);

    console.log('🌱 Starting Fast Bulk BIT MongoDB Seed...');

    // 1. Admin User
    let adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      adminUser = await User.create({
        name: 'Admin User',
        email: 'admin@admin.com',
        password: 'Admin@123',
        role: 'admin',
        phone: '9876543210',
        status: 'active'
      });
    }

    // 2. Create 5 Routes
    const createdRoutes = await Route.insertMany(routeDefinitions.map(def => ({
      routeCode: def.routeCode,
      routeName: def.routeName,
      startingPoint: def.startingPoint,
      destination: 'BIT Campus, Sathyamangalam',
      distance: def.distance,
      estimatedTime: def.estimatedTime,
      status: 'active'
    })));
    console.log(`✅ Seeded ${createdRoutes.length} Routes.`);

    // 3. Create 10 Pickup Points
    const createdPickupPoints = await PickupPoint.insertMany(pickupPointData.map((data, i) => ({
      name: data.name,
      latitude: data.latitude,
      longitude: data.longitude,
      arrivalTime: data.arrivalTime,
      route: createdRoutes[i % 5]._id
    })));

    for (let i = 0; i < createdPickupPoints.length; i++) {
      const rIdx = i % 5;
      createdRoutes[rIdx].stops.push(createdPickupPoints[i]._id);
      await createdRoutes[rIdx].save();
    }
    console.log(`✅ Seeded ${createdPickupPoints.length} Pickup Points.`);

    // 4. Create 10 Drivers
    const createdDrivers = await Driver.insertMany(driverNames.map((name, i) => ({
      name,
      employeeId: `DRV-${101 + i}`,
      email: `${name.toLowerCase()}@driver.com`,
      phone: `98765432${String(i).padStart(2, '0')}`,
      licenseNumber: `TN-38-2018-000${10 + i}`,
      licenseExpiry: '2032-05-20',
      experience: 5 + (i % 6),
      salary: 28000 + i * 1000,
      status: 'active',
      assignedRoute: createdRoutes[i % 5]._id
    })));
    console.log(`✅ Seeded ${createdDrivers.length} Drivers.`);

    for (const d of createdDrivers) {
      let u = await User.findOne({ email: d.email });
      if (!u) {
        await User.create({
          name: d.name,
          email: d.email,
          password: 'Driver@123',
          role: 'driver',
          phone: d.phone,
          status: 'active'
        });
      }
    }
    console.log(`✅ Ensured User login accounts exist for all ${createdDrivers.length} Drivers.`);

    // 5. Create 10 Buses (BUS-A to BUS-J, 52 seats capacity)
    const createdBuses = await Bus.insertMany(busLabels.map((label, i) => ({
      busNumber: label,
      registrationNumber: `TN-38-BT-${1001 + i}`,
      capacity: 52,
      driver: createdDrivers[i]._id,
      route: createdRoutes[i % 5]._id,
      status: 'active'
    })));

    for (let i = 0; i < 10; i++) {
      createdDrivers[i].assignedBus = createdBuses[i]._id;
      await createdDrivers[i].save();
      if (!createdRoutes[i % 5].assignedBus) {
        createdRoutes[i % 5].assignedBus = createdBuses[i]._id;
        createdRoutes[i % 5].assignedDriver = createdDrivers[i]._id;
        await createdRoutes[i % 5].save();
      }
    }
    console.log(`✅ Seeded ${createdBuses.length} Buses (52 Capacity).`);

    // 6. Create 50 Realistic BIT Students
    const studentDocs = [];
    for (let i = 0; i < 50; i++) {
      const rIdx = i % 5;
      const pIdx = i % 10;
      const fullName = `${studentFirstNames[i]} ${studentLastNames[i % studentLastNames.length]}`;
      studentDocs.push({
        name: fullName,
        registerNumber: `7376221CS${101 + i}`,
        department: departments[i % departments.length],
        year: ['1st Year', '2nd Year', '3rd Year', '4th Year'][i % 4],
        section: ['A', 'B', 'C'][i % 3],
        email: `${studentFirstNames[i].toLowerCase()}${101 + i}@student.com`,
        phone: `99887766${String(i).padStart(2, '0')}`,
        address: `${createdPickupPoints[pIdx].name}, Tamil Nadu`,
        pickupPoint: createdPickupPoints[pIdx]._id,
        assignedRoute: createdRoutes[rIdx]._id,
        assignedBus: createdBuses[rIdx]._id,
        status: 'active'
      });
    }
    const createdStudents = await Student.insertMany(studentDocs);
    console.log(`✅ Seeded ${createdStudents.length} Realistic BIT Students.`);

    // 7. Bulk Insert Attendance for last 30 days (95% Present, 3% Absent, 2% Late)
    const attendanceDocs = [];
    const statuses = ['Present', 'Present', 'Present', 'Present', 'Present', 'Present', 'Present', 'Present', 'Present', 'Present', 'Present', 'Present', 'Present', 'Present', 'Present', 'Present', 'Present', 'Present', 'Present', 'Absent', 'Late'];

    for (let day = 0; day < 30; day++) {
      const date = new Date();
      date.setDate(date.getDate() - day);
      if (date.getDay() === 0) continue;

      for (let i = 0; i < createdStudents.length; i++) {
        const student = createdStudents[i];
        const status = statuses[(i + day) % statuses.length];
        attendanceDocs.push({
          student: student._id,
          driver: createdDrivers[i % 10]._id,
          route: student.assignedRoute,
          bus: student.assignedBus,
          pickupPoint: student.pickupPoint,
          date,
          time: '07:42 AM',
          status,
          remarks: status === 'Late' ? 'Traffic bottleneck' : ''
        });
      }
    }
    await Attendance.insertMany(attendanceDocs);
    console.log(`✅ Seeded ${attendanceDocs.length} Attendance records across 30 days (95% Present, 3% Absent, 2% Late).`);

    // 8. Bulk Insert Salaries
    const salaryDocs = [];
    for (const d of createdDrivers) {
      for (const m of ['June', 'July']) {
        const basic = d.salary || 30000;
        const isPaid = m === 'June';
        salaryDocs.push({
          driver: d._id,
          employeeId: d.employeeId,
          month: m,
          year: 2026,
          basicSalary: basic,
          allowance: 2500,
          bonus: 1500,
          deduction: 1000,
          netSalary: basic + 3000,
          paymentStatus: isPaid ? 'Paid' : 'Pending',
          paymentMethod: 'Bank Transfer',
          transactionId: isPaid ? `TXN-BIT-SAL-${Date.now()}-${d.employeeId}` : '',
          paymentDate: isPaid ? new Date('2026-06-30') : null
        });
      }
    }
    await Salary.insertMany(salaryDocs);
    console.log(`✅ Seeded ${salaryDocs.length} Driver Salary records.`);

    // 9. Bulk Insert Student Transport Fees (₹18,000, ₹22,000, ₹25,000)
    const feeAmounts = [18000, 22000, 25000];
    const feeDocs = [];
    for (let i = 0; i < createdStudents.length; i++) {
      const student = createdStudents[i];
      const feeAmount = feeAmounts[i % feeAmounts.length];
      const statusType = i % 3;
      let paidAmount = 0;
      let status = 'Pending';

      if (statusType === 0) {
        paidAmount = feeAmount;
        status = 'Paid';
      } else if (statusType === 2) {
        paidAmount = feeAmount / 2;
        status = 'Partial';
      }

      feeDocs.push({
        student: student._id,
        registerNumber: student.registerNumber,
        semester: 'Semester 6',
        academicYear: '2025-2026',
        route: student.assignedRoute,
        feeAmount,
        paidAmount,
        balance: feeAmount - paidAmount,
        paymentStatus: status,
        paymentMethod: 'UPI',
        transactionId: status !== 'Pending' ? `TXN-BIT-FEE-${2000 + i}` : '',
        paymentDate: status !== 'Pending' ? new Date('2026-07-15') : null
      });
    }
    await FeeRecord.insertMany(feeDocs);
    console.log(`✅ Seeded ${feeDocs.length} Student Transport Fee records.`);

    // 10. Bulk Insert 15 Notifications
    const notificationTemplates = [
      { title: 'Tomorrow Holiday', message: 'Campus closed tomorrow on account of local festival.', receiverRole: 'All', priority: 'High' },
      { title: 'Bus Delay Warning', message: 'Route B (Coimbatore) running 15 mins behind schedule due to roadwork near Saravanampatti.', receiverRole: 'All', priority: 'Medium' },
      { title: 'Exam Transport Schedule', message: 'Special evening return buses dispatched at 05:30 PM for End-Sem exams.', receiverRole: 'Student', priority: 'High' },
      { title: 'Placement Special Bus', message: 'Early morning 06:00 AM bus arranged for campus drive candidates.', receiverRole: 'Student', priority: 'High' },
      { title: 'Maintenance Notice', message: 'BUS-A undergoing scheduled servicing; temporary replacement bus assigned.', receiverRole: 'Driver', priority: 'Medium' },
      { title: 'Pre-trip Safety Checklist', message: 'Drivers must submit digital vehicle inspection before morning transit.', receiverRole: 'Driver', priority: 'Urgent' },
      { title: 'Pass Renewal Reminder', message: 'Semester 6 bus pass fee payment deadline is August 10.', receiverRole: 'Student', priority: 'Medium' },
      { title: 'Speed Limit Compliance', message: 'Adhere strictly to 45 km/h campus perimeter speed limit.', receiverRole: 'Driver', priority: 'High' },
      { title: 'Emergency Drill Completed', message: 'Campus SOS alert simulation completed successfully.', receiverRole: 'Admin', priority: 'Low' },
      { title: 'New Route Extension', message: 'Route C extended to cover additional pickup stop at Perundurai Bypass.', receiverRole: 'All', priority: 'Medium' },
      { title: 'Fuel Price Revision', message: 'Updated fuel log rates reflected in depot accounting.', receiverRole: 'Admin', priority: 'Low' },
      { title: 'Driver Monthly Meeting', message: 'Driver briefing session scheduled at Sathyamangalam Depot.', receiverRole: 'Driver', priority: 'High' },
      { title: 'Seat Allocation Update', message: 'Updated seat mapping available on student mobile portal.', receiverRole: 'Student', priority: 'Low' },
      { title: 'Monsoon Driving Caution', message: 'Drive cautiously near Sathyamangalam ghat road during rains.', receiverRole: 'Driver', priority: 'Urgent' },
      { title: 'Transport Feedback Open', message: 'Students can submit route feedback via digital complaints system.', receiverRole: 'Student', priority: 'Low' }
    ];
    await Notification.insertMany(notificationTemplates.map(n => ({ ...n, createdBy: adminUser._id })));
    console.log(`✅ Seeded ${notificationTemplates.length} Notifications.`);

    // 11. Bulk Insert 20 Complaints
    const complaintCategories = ['Driver Behaviour', 'Bus Delay', 'Bus Cleanliness', 'Safety', 'Route Issue', 'Seat Damage', 'Other'];
    const complaintStatuses = ['Pending', 'In Progress', 'Resolved'];
    const complaintDocs = [];

    for (let i = 0; i < 20; i++) {
      const student = createdStudents[i % createdStudents.length];
      const status = complaintStatuses[i % 3];
      complaintDocs.push({
        student: student._id,
        title: `Transport Complaint #${i + 1}: ${complaintCategories[i % complaintCategories.length]}`,
        description: `Detailed feedback regarding ${complaintCategories[i % complaintCategories.length]} on bus transit.`,
        category: complaintCategories[i % complaintCategories.length],
        status,
        priority: i % 2 === 0 ? 'High' : 'Medium',
        route: student.assignedRoute,
        driver: createdDrivers[i % 10]._id,
        adminRemarks: status === 'Resolved' ? 'Issue resolved by Transport Officer.' : status === 'In Progress' ? 'Under investigation.' : ''
      });
    }
    await Complaint.insertMany(complaintDocs);
    console.log(`✅ Seeded 20 Complaints (Pending, In Progress, Resolved).`);

    // 12. Bulk Insert 7 Emergency SOS Records (5 Resolved, 2 Active)
    const sosDocs = [];
    for (let i = 0; i < 7; i++) {
      const isResolved = i < 5;
      sosDocs.push({
        triggeredBy: adminUser._id,
        role: i % 2 === 0 ? 'student' : 'driver',
        route: createdRoutes[i % 5]._id,
        bus: createdBuses[i % 5]._id,
        location: { latitude: 11.5034, longitude: 77.2444, name: `Highway Stop ${i + 1}` },
        emergencyType: ['Medical Emergency', 'Vehicle Breakdown', 'Accident', 'Student Safety', 'Harassment'][i % 5],
        description: `Emergency alert #${i + 1} logged on Sathyamangalam Highway.`,
        status: isResolved ? 'Resolved' : 'Active'
      });
    }
    await EmergencySOS.insertMany(sosDocs);
    console.log(`✅ Seeded 7 Emergency SOS records (5 Resolved, 2 Active).`);

    // 13. Bulk Insert 50 Fuel Logs
    const fuelDocs = [];
    for (let i = 0; i < 50; i++) {
      const bus = createdBuses[i % 10];
      const driver = createdDrivers[i % 10];
      const fuelAdded = 40 + (i % 15);
      fuelDocs.push({
        bus: bus._id,
        driver: driver._id,
        route: bus.route,
        date: new Date(Date.now() - i * 86400000),
        fuelAdded,
        fuelCost: fuelAdded * 98.5,
        odometer: 140000 + i * 250,
        mileage: 4.8,
        fuelStation: 'BIT Campus Fuel Station, Sathyamangalam'
      });
    }
    await FuelLog.insertMany(fuelDocs);
    console.log(`✅ Seeded 50 Fuel Log entries.`);

    // 14. Bulk Insert 100 Completed Trips
    const tripDocs = [];
    for (let i = 0; i < 100; i++) {
      const bus = createdBuses[i % 10];
      const driver = createdDrivers[i % 10];
      const route = createdRoutes[i % 5];
      tripDocs.push({
        driver: driver._id,
        bus: bus._id,
        route: route._id,
        tripDate: new Date(Date.now() - i * 43200000),
        startTime: '06:30 AM',
        endTime: '08:15 AM',
        distanceCovered: route.distance || 45,
        studentsPresent: 48,
        studentsAbsent: 4,
        tripStatus: 'Completed',
        remarks: 'Transit completed according to scheduled timetable.'
      });
    }
    await TripHistory.insertMany(tripDocs);
    console.log(`✅ Seeded 100 Completed Trip History logs.`);

    // 15. Bulk Insert 30 Vehicle Inspection Reports
    const inspectionDocs = [];
    for (let i = 0; i < 30; i++) {
      const driver = createdDrivers[i % 10];
      const bus = createdBuses[i % 10];
      inspectionDocs.push({
        driver: driver._id,
        bus: bus._id,
        route: bus.route,
        inspectionDate: new Date(Date.now() - i * 86400000),
        brakes: true,
        tyres: true,
        lights: true,
        horn: true,
        mirrors: true,
        fuelLevel: '85%',
        overallStatus: 'Pass',
        remarks: 'Daily safety checklist verified and cleared.'
      });
    }
    await VehicleInspection.insertMany(inspectionDocs);
    console.log(`✅ Seeded 30 Daily Vehicle Inspection reports.`);

    // 16. Bulk Insert Calendar Events
    const calendarEventsData = [
      { title: 'Independence Day Holiday', description: 'Campus holiday.', eventType: 'Holiday', date: new Date('2026-08-15') },
      { title: 'Working Saturday', description: 'Full day classes; normal bus schedule.', eventType: 'Working Day', date: new Date('2026-08-16') },
      { title: 'TCS Placement Drive Special Bus', description: 'Early morning 06:00 AM buses.', eventType: 'Placement', date: new Date('2026-08-18') },
      { title: 'End Semester Examinations', description: 'Exam bus timing in effect.', eventType: 'Exam', date: new Date('2026-08-20') },
      { title: 'Depot Fleet Maintenance Day', description: 'Scheduled bus maintenance.', eventType: 'Maintenance', date: new Date('2026-08-25') }
    ];
    await CalendarEvent.insertMany(calendarEventsData.map(e => ({ ...e, applicableRole: 'All', createdBy: adminUser._id })));
    console.log(`✅ Seeded Calendar Schedule events.`);

    console.log('=======================================================');
    console.log(' 🎉 FAST BULK BIT MONGODB ATLAS SEED COMPLETED!');
    console.log('=======================================================');
  } catch (error) {
    console.error('❌ Seeding Failed:', error);
  }
};

if (require.main === module) {
  seedAll().then(() => process.exit(0));
}

module.exports = seedAll;
