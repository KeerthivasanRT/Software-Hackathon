import { Bus, Driver, Route, Student, Attendance, Complaint, Notification, User, Stop, AttendanceStatus } from '@/types';
import { addDays, subDays } from 'date-fns';

const today = new Date();
const todayStr = today.toISOString();

export const mockBuses: Bus[] = [
  { id: 'b1', busNumber: 'BUS-001', registrationNumber: 'TN-33-AB-1201', busName: 'BIT Bus A', capacity: 60, driverId: 'd1', routeId: 'r1', fuelType: 'Diesel', averageMileage: 4.5, status: 'active', notes: 'Regular maintenance done' },
  { id: 'b2', busNumber: 'BUS-002', registrationNumber: 'TN-33-AB-1202', busName: 'BIT Bus B', capacity: 50, driverId: 'd2', routeId: 'r2', fuelType: 'Diesel', averageMileage: 5.0, status: 'active' },
  { id: 'b3', busNumber: 'BUS-003', registrationNumber: 'TN-33-AB-1203', busName: 'BIT Bus C', capacity: 50, driverId: 'd3', routeId: 'r3', fuelType: 'Diesel', averageMileage: 4.8, status: 'active' },
  { id: 'b4', busNumber: 'BUS-004', registrationNumber: 'TN-33-AB-1204', busName: 'BIT Bus D', capacity: 40, driverId: 'd4', routeId: 'r4', fuelType: 'Diesel', averageMileage: 5.2, status: 'active' },
];

export const mockDrivers: Driver[] = [
  { id: 'd1', name: 'S. Kumar', email: 'kumar.s@bitsathy.ac.in', role: 'driver', employeeId: 'DRV-001', licenseNumber: 'TN-DL-12345', licenseExpiry: '2028-05-12', experience: 5, phone: '9876543210', status: 'active', assignedBusId: 'b1', assignedRouteId: 'r1' },
  { id: 'd2', name: 'R. Murugan', email: 'murugan.r@bitsathy.ac.in', role: 'driver', employeeId: 'DRV-002', licenseNumber: 'TN-DL-67890', licenseExpiry: '2027-11-20', experience: 8, phone: '9876543211', status: 'active', assignedBusId: 'b2', assignedRouteId: 'r2' },
  { id: 'd3', name: 'M. Karthikeyan', email: 'karthikeyan.m@bitsathy.ac.in', role: 'driver', employeeId: 'DRV-003', licenseNumber: 'TN-DL-54321', licenseExpiry: '2029-01-15', experience: 3, phone: '9876543212', status: 'active', assignedBusId: 'b3', assignedRouteId: 'r3' },
  { id: 'd4', name: 'V. Prakash', email: 'prakash.v@bitsathy.ac.in', role: 'driver', employeeId: 'DRV-004', licenseNumber: 'TN-DL-98765', licenseExpiry: '2026-08-30', experience: 12, phone: '9876543213', status: 'active', assignedBusId: 'b4', assignedRouteId: 'r4' },
];

export const mockRoutes: Route[] = [
  {
    id: 'r1',
    name: 'Route A',
    distance: '35 km',
    distanceKm: 35,
    estimatedTime: '55 mins',
    stops: [
      { id: 's1-1', name: 'Annur Bus Stand', latitude: 11.2333, longitude: 77.1000, order: 1 },
      { id: 's1-2', name: 'Kunnathur', latitude: 11.2500, longitude: 77.1500, order: 2 },
      { id: 's1-3', name: 'Kovilpalayam', latitude: 11.2800, longitude: 77.1800, order: 3 },
      { id: 's1-4', name: 'Sathyamangalam', latitude: 11.5030, longitude: 77.2400, order: 4 },
      { id: 's1-5', name: 'Bannari', latitude: 11.5032, longitude: 77.2500, order: 5 },
      { id: 's1-6', name: 'BIT Campus', latitude: 11.5034, longitude: 77.2714, order: 6 },
    ],
  },
  {
    id: 'r2',
    name: 'Route B',
    distance: '65 km',
    distanceKm: 65,
    estimatedTime: '90 mins',
    stops: [
      { id: 's2-1', name: 'Gandhipuram', latitude: 11.0183, longitude: 76.9660, order: 1 },
      { id: 's2-2', name: 'Saibaba Colony', latitude: 11.0300, longitude: 76.9500, order: 2 },
      { id: 's2-3', name: 'Saravanampatti', latitude: 11.0820, longitude: 76.9930, order: 3 },
      { id: 's2-4', name: 'Kovilpalayam', latitude: 11.1640, longitude: 77.0420, order: 4 },
      { id: 's2-5', name: 'Annur', latitude: 11.2333, longitude: 77.1000, order: 5 },
      { id: 's2-6', name: 'Sathyamangalam', latitude: 11.5030, longitude: 77.2400, order: 6 },
      { id: 's2-7', name: 'BIT Campus', latitude: 11.5034, longitude: 77.2714, order: 7 },
    ],
  },
  {
    id: 'r3',
    name: 'Route C',
    distance: '60 km',
    distanceKm: 60,
    estimatedTime: '80 mins',
    stops: [
      { id: 's3-1', name: 'Erode Bus Stand', latitude: 11.3410, longitude: 77.7170, order: 1 },
      { id: 's3-2', name: 'Perundurai', latitude: 11.2700, longitude: 77.5800, order: 2 },
      { id: 's3-3', name: 'Bhavani', latitude: 11.4500, longitude: 77.6800, order: 3 },
      { id: 's3-4', name: 'Sathyamangalam', latitude: 11.5030, longitude: 77.2400, order: 4 },
      { id: 's3-5', name: 'Bannari', latitude: 11.5032, longitude: 77.2500, order: 5 },
      { id: 's3-6', name: 'BIT Campus', latitude: 11.5034, longitude: 77.2714, order: 6 },
    ],
  },
  {
    id: 'r4',
    name: 'Route D',
    distance: '45 km',
    distanceKm: 45,
    estimatedTime: '60 mins',
    stops: [
      { id: 's4-1', name: 'Bhavani Bus Stand', latitude: 11.4500, longitude: 77.6830, order: 1 },
      { id: 's4-2', name: 'Kavindapadi', latitude: 11.4200, longitude: 77.5800, order: 2 },
      { id: 's4-3', name: 'Athani', latitude: 11.5200, longitude: 77.5300, order: 3 },
      { id: 's4-4', name: 'Sathyamangalam', latitude: 11.5030, longitude: 77.2400, order: 4 },
      { id: 's4-5', name: 'Bannari', latitude: 11.5032, longitude: 77.2500, order: 5 },
      { id: 's4-6', name: 'BIT Campus', latitude: 11.5034, longitude: 77.2714, order: 6 },
    ],
  }
];

const studentNames = [
  'Arun Kumar', 'Rishvanth K', 'Praveen S', 'Hariharan M', 'Sanjay R', 'Karthikeyan V', 'Mohamed Irfan', 'Vignesh Kumar', 'Akash B', 'Harish Kumar', 
  'Deepak R', 'Naveen Kumar', 'Rahul S', 'Dinesh K', 'Gokul Raj', 'Abishek M', 'Yogesh V', 'Nithish Kumar', 'Ashwin R', 'Surya Prakash', 
  'Vikram S', 'Manoj K', 'Prasanth D', 'Santhosh M', 'Vijay R', 'Gowtham V', 'Ajith Kumar', 'Balaji S', 'Dhruv M', 'Kishore K', 
  'Manikandan P', 'Nandha Kumar', 'Prakash Raj', 'Ramesh S', 'Saravanan M', 'Tharun V', 'Venkatesh R', 'Yuvraj M', 'Sathish Kumar', 'Rajesh K', 
  'Nagaraj P', 'Kannan V', 'Jeeva S', 'Dhanush M', 'Bhuvanesh R', 'Aravind K', 'Vasanth S', 'Sriram M', 'Ponnusamy R', 'Murugesan K', 
  'Lakshman V', 'Jagan S', 'Hari Krishna', 'Ganesan M', 'Elango R', 'Deva K', 'Chandra Sekar', 'Babu M', 'Anand S', 'Vinoth Kumar'
];

const departments = [
  'Computer Science', 'Artificial Intelligence', 'Information Technology', 'Electronics and Communication', 
  'Electrical and Electronics', 'Mechanical', 'Civil', 'Biotechnology'
];

const years = ['I Year', 'II Year', 'III Year', 'IV Year'];

// Weighted distribution for realistic attendance statuses
const statuses: AttendanceStatus[] = [
  'present', 'present', 'present', 'present', 'present', 'present', 'present', 
  'absent', 'late', 'leave'
];

export const mockStudents: Student[] = studentNames.map((name, index) => {
  const route = mockRoutes[index % mockRoutes.length];
  // Assign to stops excluding the final BIT Campus stop
  const pickupStops = route.stops.slice(0, -1); 
  const stop = pickupStops[index % pickupStops.length];
  const busId = `b${(index % mockRoutes.length) + 1}`;
  
  return {
    id: `st${index + 1}`,
    name,
    email: `${name.toLowerCase().replace(' ', '.')}@bitsathy.ac.in`,
    role: 'student',
    studentId: `${departments[index % departments.length].substring(0, 3).toUpperCase()}${(2024 - (index % 4)).toString()}-${(index + 1).toString().padStart(3, '0')}`,
    registerNumber: `73042${(index % 4) + 1}104${(index + 1).toString().padStart(3, '0')}`,
    department: departments[index % departments.length],
    year: years[index % years.length],
    phone: `98765${index.toString().padStart(5, '0')}`,
    assignedBusId: busId,
    assignedRouteId: route.id,
    pickupStopId: stop.id,
  };
});

export const mockAttendance: Attendance[] = mockStudents.map((student, index) => ({
  id: `a${index + 1}`,
  studentId: student.id,
  busId: student.assignedBusId!,
  date: todayStr,
  status: statuses[index % statuses.length],
}));

export const mockUsers: User[] = [
  { id: 'u1', name: 'Admin User', email: 'admin@college.edu', role: 'admin' },
  { id: 'd1', name: 'S. Kumar', email: 'kumar.s@bitsathy.ac.in', role: 'driver' }, // maps to mockDrivers[0]
  { id: 'st1', name: 'Arun Kumar', email: 'arun.kumar@bitsathy.ac.in', role: 'student' }, // maps to mockStudents[0]
];

export const mockComplaints: Complaint[] = [
  { id: 'c1', userId: 'st1', subject: 'Late Bus', description: 'Bus was 20 minutes late at Annur.', status: 'pending', date: subDays(today, 2).toISOString() },
  { id: 'c2', userId: 'st2', subject: 'AC not working', description: 'The air conditioning in BUS-02 is broken.', status: 'in-progress', date: subDays(today, 1).toISOString() },
];

export const mockNotifications: Notification[] = [
  { id: 'n1', title: 'Route Change', message: 'Tomorrow morning all buses will depart 15 minutes earlier due to road maintenance.', category: 'Route Update', priority: 'medium', targetRole: 'all', recipientType: 'all', status: 'sent', date: today.toISOString(), readBy: [], deletedBy: [] },
  { id: 'n2', title: 'Maintenance', message: 'BUS-003 is scheduled for maintenance this weekend.', category: 'Maintenance Notice', priority: 'low', targetRole: 'driver', recipientType: 'all_drivers', status: 'sent', date: subDays(today, 1).toISOString(), readBy: ['d1', 'd2'], deletedBy: [] },
  { id: 'n3', title: 'Bus Delay', message: 'Bus A is delayed by 10 minutes.', category: 'Bus Delay', priority: 'high', targetRole: 'all', recipientType: 'route_students', recipientIds: ['r1'], status: 'sent', date: new Date(today.getTime() - 1000 * 60 * 30).toISOString(), readBy: [], deletedBy: [] },
  { id: 'n4', title: 'Holiday Notice', message: 'Transport services are unavailable on Independence Day.', category: 'Holiday Notice', priority: 'medium', targetRole: 'all', recipientType: 'all', status: 'sent', date: subDays(today, 3).toISOString(), readBy: ['st1', 'd1'], deletedBy: [] },
  { id: 'n5', title: 'Placement Drive', message: 'Special buses have been arranged for Placement Drive.', category: 'General Announcement', priority: 'low', targetRole: 'student', recipientType: 'all_students', status: 'sent', date: new Date(today.getTime() - 1000 * 60 * 60 * 2).toISOString(), readBy: [], deletedBy: [] },
  { id: 'n6', title: 'Bus Reassigned', message: 'Bus C has been reassigned due to maintenance.', category: 'Bus Breakdown', priority: 'emergency', targetRole: 'specific', recipientType: 'bus_drivers', recipientIds: ['b3'], status: 'sent', date: subDays(today, 2).toISOString(), readBy: [], deletedBy: [] },
];
