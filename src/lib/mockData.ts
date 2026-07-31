import { Bus, Driver, Route, Student, Attendance, Complaint, Notification, User, Stop } from '@/types';
import { addDays, subDays } from 'date-fns';

const today = new Date();

export const mockUsers: User[] = [
  { id: 'u1', name: 'Admin User', email: 'admin@college.edu', role: 'admin' },
  { id: 'u2', name: 'John Driver', email: 'john@college.edu', role: 'driver' },
  { id: 'u3', name: 'Alice Student', email: 'alice@college.edu', role: 'student' },
];

export const mockBuses: Bus[] = [
  { id: 'b1', busNumber: 'BUS-01', registrationNumber: 'KA-01-AB-1234', busName: 'Morning Express', capacity: 40, driverId: 'd1', routeId: 'r1', fuelType: 'Diesel', averageMileage: 4.5, status: 'active', notes: 'Regular maintenance done' },
  { id: 'b2', busNumber: 'BUS-02', registrationNumber: 'KA-01-AB-5678', busName: 'Campus Shuttle', capacity: 50, driverId: 'd2', routeId: 'r2', fuelType: 'Diesel', averageMileage: 5.0, status: 'active' },
  { id: 'b3', busNumber: 'BUS-03', registrationNumber: 'KA-01-AB-9012', busName: 'Evening Drops', capacity: 30, driverId: null, routeId: null, fuelType: 'Electric', averageMileage: 0, status: 'maintenance' },
];

export const mockDrivers: Driver[] = [
  { id: 'd1', name: 'John Driver', email: 'john@college.edu', role: 'driver', licenseNumber: 'DL-12345', phone: '555-0101', assignedBusId: 'b1' },
  { id: 'd2', name: 'Mike Wheeler', email: 'mike@college.edu', role: 'driver', licenseNumber: 'DL-67890', phone: '555-0102', assignedBusId: 'b2' },
];

export const mockRoutes: Route[] = [
  {
    id: 'r1',
    name: 'Morning - North Campus',
    distance: '25 km',
    distanceKm: 25,
    estimatedTime: '45 mins',
    stops: [
      { id: 's1', name: 'City Center', latitude: 12.9716, longitude: 77.5946, order: 1 },
      { id: 's2', name: 'North Mall', latitude: 12.9816, longitude: 77.6046, order: 2 },
      { id: 's3', name: 'Bannari Amman Institute of Technology, Sathyamangalam, Erode, Tamil Nadu', latitude: 11.5034, longitude: 77.2714, order: 3 },
    ],
  },
  {
    id: 'r2',
    name: 'Evening - South Drop',
    distance: '30 km',
    distanceKm: 30,
    estimatedTime: '60 mins',
    stops: [
      { id: 's4', name: 'Bannari Amman Institute of Technology, Sathyamangalam, Erode, Tamil Nadu', latitude: 11.5034, longitude: 77.2714, order: 1 },
      { id: 's5', name: 'Tech Park', latitude: 11.4500, longitude: 77.2000, order: 2 },
      { id: 's6', name: 'Annur, Tamil Nadu', latitude: 11.2333, longitude: 77.1000, order: 3 },
    ],
  }
];

export const mockStudents: Student[] = [
  { id: 'st1', name: 'Alice Student', email: 'alice@college.edu', role: 'student', studentId: 'CS2024-01', registerNumber: '730421104001', year: '3rd Year', department: 'Computer Science', phone: '555-0201', assignedBusId: 'b1', assignedRouteId: 'r1', pickupStopId: 's1' },
  { id: 'st2', name: 'Bob Smith', email: 'bob@college.edu', role: 'student', studentId: 'ME2024-02', registerNumber: '730421114002', year: '2nd Year', department: 'Mechanical', phone: '555-0202', assignedBusId: 'b1', assignedRouteId: 'r1', pickupStopId: 's2' },
  { id: 'st3', name: 'Charlie Brown', email: 'charlie@college.edu', role: 'student', studentId: 'EE2024-03', registerNumber: '730421105003', year: '4th Year', department: 'Electrical', phone: '555-0203', assignedBusId: 'b2', assignedRouteId: 'r2', pickupStopId: 's5' },
];

export const mockAttendance: Attendance[] = [
  { id: 'a1', studentId: 'st1', busId: 'b1', date: today.toISOString(), status: 'present' },
  { id: 'a2', studentId: 'st2', busId: 'b1', date: today.toISOString(), status: 'absent' },
  { id: 'a3', studentId: 'st3', busId: 'b2', date: today.toISOString(), status: 'present' },
  { id: 'a4', studentId: 'st1', busId: 'b1', date: subDays(today, 1).toISOString(), status: 'present' },
];

export const mockComplaints: Complaint[] = [
  { id: 'c1', userId: 'st1', subject: 'Late Bus', description: 'Bus was 20 minutes late at City Center.', status: 'pending', date: subDays(today, 2).toISOString() },
  { id: 'c2', userId: 'st2', subject: 'AC not working', description: 'The air conditioning in BUS-01 is broken.', status: 'in-progress', date: subDays(today, 1).toISOString() },
];

export const mockNotifications: Notification[] = [
  { id: 'n1', title: 'Route Change', message: 'North Campus Route will detour due to roadworks.', targetRole: 'all', date: today.toISOString(), isRead: false },
  { id: 'n2', title: 'Maintenance', message: 'BUS-03 is under maintenance this week.', targetRole: 'driver', date: subDays(today, 1).toISOString(), isRead: true },
];
