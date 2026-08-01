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
  driverId?: string;
  studentId?: string;
  busId: string;
  routeId: string;
  pickupPoint: string;
  emergencyType?: string;
  description?: string;
  date: string; // ISO string
  status: 'active' | 'resolved';
  remarks?: string;
  actionTaken?: string;
}
