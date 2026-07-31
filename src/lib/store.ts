import { create } from 'zustand';
import { User, Bus, Student, Driver, Route, Attendance, Complaint, Notification, AttendanceStatus, Emergency } from '@/types';
import { mockUsers, mockBuses, mockStudents, mockDrivers, mockRoutes, mockAttendance, mockComplaints, mockNotifications } from './mockData';

interface DataState {
  user: User | null;
  login: (role: User['role']) => void;
  logout: () => void;
  
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  
  buses: Bus[];
  addBus: (bus: Bus) => void;
  updateBus: (bus: Bus) => void;
  deleteBus: (id: string) => void;
  
  students: Student[];
  addStudent: (student: Student) => void;
  updateStudent: (student: Student) => void;
  deleteStudent: (id: string) => void;
  
  drivers: Driver[];
  addDriver: (driver: Driver) => void;
  updateDriver: (driver: Driver) => void;
  deleteDriver: (id: string) => void;
  routes: Route[];
  attendances: Attendance[];
  markAttendance: (attendance: Attendance) => void;
  markMultipleAttendances: (attendances: Attendance[]) => void;
  
  complaints: Complaint[];
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
  
  emergencies: Emergency[];
  triggerEmergency: (emergency: Emergency) => void;
  resolveEmergency: (id: string, remarks?: string, actionTaken?: string) => void;
}

export const useDataStore = create<DataState>((set) => ({
  user: null,
  login: (role) => {
    const user = mockUsers.find(u => u.role === role) || null;
    set({ user });
  },
  logout: () => set({ user: null }),
  
  isSidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ isSidebarCollapsed: collapsed }),
  
  buses: [...mockBuses],
  addBus: (bus) => set((state) => ({ buses: [...state.buses, bus] })),
  updateBus: (bus) => set((state) => ({
    buses: state.buses.map(b => b.id === bus.id ? bus : b)
  })),
  deleteBus: (id) => set((state) => ({
    buses: state.buses.filter(b => b.id !== id)
  })),
  
  students: [...mockStudents],
  addStudent: (student) => set((state) => ({ students: [...state.students, student] })),
  updateStudent: (student) => set((state) => ({
    students: state.students.map(s => s.id === student.id ? student : s)
  })),
  deleteStudent: (id) => set((state) => ({
    students: state.students.filter(s => s.id !== id)
  })),
  
  drivers: [...mockDrivers],
  addDriver: (driver) => set((state) => ({ drivers: [...state.drivers, driver] })),
  updateDriver: (driver) => set((state) => {
    // If the driver is assigned a bus, update the bus to point to this driver.
    // If they were removed from a bus, we should theoretically clear the old bus, but for now we'll just set the new one.
    const newBuses = [...state.buses];
    
    // Clear driver from any bus they previously owned if it's different now
    newBuses.forEach(b => {
      if (b.driverId === driver.id && b.id !== driver.assignedBusId) {
        b.driverId = null;
      }
    });

    if (driver.assignedBusId) {
      const busIndex = newBuses.findIndex(b => b.id === driver.assignedBusId);
      if (busIndex >= 0) {
        newBuses[busIndex] = { ...newBuses[busIndex], driverId: driver.id, routeId: driver.assignedRouteId };
      }
    }

    return {
      drivers: state.drivers.map(d => d.id === driver.id ? driver : d),
      buses: newBuses
    };
  }),
  deleteDriver: (id) => set((state) => {
    const newBuses = state.buses.map(b => b.driverId === id ? { ...b, driverId: null } : b);
    return {
      drivers: state.drivers.filter(d => d.id !== id),
      buses: newBuses
    };
  }),
  routes: [...mockRoutes],
  
  attendances: [...mockAttendance],
  markAttendance: (attendance) => set((state) => {
    const existingIndex = state.attendances.findIndex(a => a.studentId === attendance.studentId && a.date.split('T')[0] === attendance.date.split('T')[0]);
    if (existingIndex >= 0) {
      const updated = [...state.attendances];
      updated[existingIndex] = attendance;
      return { attendances: updated };
    }
    return { attendances: [...state.attendances, attendance] };
  }),
  markMultipleAttendances: (newAttendances) => set((state) => {
    let updated = [...state.attendances];
    for (const attendance of newAttendances) {
      const existingIndex = updated.findIndex(a => a.studentId === attendance.studentId && a.date.split('T')[0] === attendance.date.split('T')[0]);
      if (existingIndex >= 0) {
        updated[existingIndex] = attendance;
      } else {
        updated.push(attendance);
      }
    }
    return { attendances: updated };
  }),
  
  complaints: [...mockComplaints],
  notifications: [...mockNotifications],
  addNotification: (notification) => set((state) => ({ notifications: [notification, ...state.notifications] })),
  
  emergencies: [],
  triggerEmergency: (emergency) => set((state) => ({ emergencies: [emergency, ...state.emergencies] })),
  resolveEmergency: (id, remarks, actionTaken) => set((state) => ({
    emergencies: state.emergencies.map(e => 
      e.id === id ? { ...e, status: 'resolved', remarks, actionTaken } : e
    )
  })),
}));
