export type Role = 'admin' | 'driver' | 'student';
export type AttendanceStatus = 'present' | 'absent' | 'late' | 'leave';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
}

export interface Bus {
  id: string;
  busNumber: string;
  registrationNumber: string;
  busName?: string;
  capacity: number;
  driverId: string | null;
  routeId: string | null;
  fuelType?: 'Diesel' | 'Petrol' | 'Electric' | 'CNG';
  averageMileage?: number;
  status: 'active' | 'maintenance' | 'inactive';
  notes?: string;
}

export interface Driver extends User {
  role: 'driver';
  employeeId: string;
  licenseNumber: string;
  licenseExpiry: string;
  experience: number;
  phone: string;
  status: 'active' | 'inactive';
  assignedBusId: string | null;
  assignedRouteId: string | null;
}

export interface Student extends User {
  role: 'student';
  studentId: string;
  registerNumber?: string;
  department: string;
  year?: string;
  phone: string;
  assignedBusId: string | null;
  assignedRouteId: string | null;
  pickupStopId: string | null;
}

export interface Stop {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  order: number;
}

export interface Route {
  id: string;
  name: string;
  stops: Stop[];
  distance: string; // e.g., "15 km"
  estimatedTime: string; // e.g., "45 mins"
  distanceKm: number; // numeric distance for fuel calc
}

export interface Attendance {
  id: string;
  studentId: string;
  busId: string;
  date: string; // ISO string
  status: AttendanceStatus;
}

export interface Complaint {
  id: string;
  userId: string;
  subject: string;
  description: string;
  status: 'pending' | 'in-progress' | 'resolved' | 'closed';
  date: string; // ISO string
  priority?: 'low' | 'medium' | 'high';
  resolutionRemarks?: string;
}

export interface Activity {
  id: string;
  message: string;
  date: string; // ISO string
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  category?: string; 
  priority?: 'low' | 'medium' | 'high' | 'emergency';
  targetRole: Role | 'all' | 'specific';
  recipientType?: 'all' | 'all_students' | 'all_drivers' | 'specific_student' | 'specific_driver' | 'route_students' | 'route_drivers' | 'bus_students' | 'bus_drivers';
  recipientIds?: string[];
  status?: 'draft' | 'scheduled' | 'sent';
  sendTime?: string;
  date: string; // ISO string
  isRead?: boolean; // legacy
  readBy?: string[];
  deletedBy?: string[];
}

export interface Emergency {
  id: string;
  reportedBy?: 'driver' | 'student';
  reporterName?: string;
  reporterId?: string;
  driverId?: string;
  studentId?: string;
  registerNumber?: string;
  employeeId?: string;
  busId: string;
  busNumber?: string;
  routeId: string;
  routeName?: string;
  pickupPoint: string;
  latitude?: number;
  longitude?: number;
  emergencyType?: 'Medical Emergency' | 'Accident' | 'Vehicle Breakdown' | 'Harassment' | 'Student Safety' | 'Fire' | 'Traffic Delay' | 'Road Block' | 'Lost Student' | 'Suspicious Activity' | 'Other' | string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  description?: string;
  emergencyContact?: string;
  date: string; // ISO string
  status: 'Active' | 'Acknowledged' | 'In Progress' | 'Resolved' | 'Closed' | 'active' | 'resolved';
  assignedStaff?: string;
  remarks?: string;
  actionTaken?: string;
}

export interface SalaryRecord {
  id: string;
  driverId: string;
  driverName: string;
  employeeId: string;
  month: string;
  basicSalary: number;
  allowances: number;
  bonus: number;
  deductions: number;
  netSalary: number;
  paymentStatus: 'paid' | 'pending';
  paymentDate: string | null;
  paymentMethod: 'Net Banking' | 'UPI' | 'Bank Transfer';
  bankName: string;
  accountNumberMasked: string;
  ifscCode: string;
  transactionId: string | null;
}

export interface FeeRecord {
  id: string;
  studentId: string;
  studentName: string;
  registerNumber: string;
  routeId: string;
  routeName: string;
  busId: string;
  busNumber: string;
  semester: string;
  transportFee: number;
  lateFee: number;
  scholarshipDiscount: number;
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  dueDate: string;
  paymentStatus: 'paid' | 'pending' | 'partial';
  lastPaymentDate: string | null;
  paymentMethod: 'Net Banking' | 'UPI' | 'Debit Card' | 'Credit Card' | 'Cash' | null;
  transactionId: string | null;
}

export interface VehicleChecklist {
  brakes: boolean;
  tyres: boolean;
  headlights: boolean;
  indicators: boolean;
  horn: boolean;
  mirrors: boolean;
  windshield: boolean;
  fuelLevel: boolean;
  battery: boolean;
  fireExtinguisher: boolean;
  firstAidKit: boolean;
  emergencyExit: boolean;
}

export interface VehicleInspection {
  id: string;
  driverId: string;
  driverName: string;
  busId: string;
  busNumber: string;
  routeId: string;
  routeName: string;
  date: string;
  time: string;
  checklist: VehicleChecklist;
  additionalRemarks: string;
  status: 'Good' | 'Needs Maintenance' | 'Unsafe';
}

export interface FuelLog {
  id: string;
  driverId: string;
  driverName: string;
  busId: string;
  busNumber: string;
  routeId: string;
  routeName: string;
  date: string;
  odometer: number;
  fuelAddedLitres: number;
  fuelCost: number;
  fuelStation: string;
  remarks?: string;
}

export interface TripRecord {
  id: string;
  driverId: string;
  driverName: string;
  busId: string;
  busNumber: string;
  routeId: string;
  routeName: string;
  date: string;
  startTime: string;
  endTime: string;
  distanceCovered: number; // in km
  stopsCovered: number;
  studentsPresent: number;
  studentsAbsent: number;
  status: 'Completed' | 'Cancelled' | 'Delayed';
  notes?: string;
}

export interface CalendarScheduleEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  category: 'Working Day' | 'Holiday' | 'Exam' | 'Special Bus Duty' | 'College Event' | 'Maintenance Day';
  description?: string;
  assignedDriverId?: string;
  busId?: string;
  routeId?: string;
}
