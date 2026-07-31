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
  licenseNumber: string;
  phone: string;
  assignedBusId: string | null;
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
  status: 'pending' | 'in-progress' | 'resolved';
  date: string; // ISO string
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  targetRole: Role | 'all';
  date: string; // ISO string
  isRead: boolean;
}
