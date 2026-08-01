import { create } from 'zustand';
import { User, Bus, Student, Driver, Route, Attendance, Complaint, Notification, AttendanceStatus, Emergency, Activity } from '@/types';
import { mockUsers, mockBuses, mockStudents, mockDrivers, mockRoutes, mockAttendance, mockComplaints, mockNotifications } from './mockData';

interface DataState {
  user: User | null;
  login: (role: User['role'], userId?: string | null, email?: string) => void;
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
  addRoute: (route: Route) => void;
  updateRoute: (route: Route) => void;
  deleteRoute: (id: string) => void;
  
  attendances: Attendance[];
  markAttendance: (attendance: Attendance) => void;
  markMultipleAttendances: (attendances: Attendance[]) => void;
  
  complaints: Complaint[];
  updateComplaint: (complaint: Complaint) => void;
  
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
  updateNotification: (notification: Notification) => void;
  deleteNotification: (id: string) => void;
  markNotificationRead: (id: string, userId: string) => void;
  markAllNotificationsRead: (userId: string, targetRole: string) => void;
  deleteNotificationForUser: (id: string, userId: string) => void;
  
  activities: Activity[];
  addActivity: (message: string) => void;
  
  emergencies: Emergency[];
  triggerEmergency: (emergency: Emergency) => void;
  resolveEmergency: (id: string, remarks?: string, actionTaken?: string) => void;
}

export const useDataStore = create<DataState>((set) => ({
  user: null,
  login: (role, userId, email) => {
    let user: User | null = null;
    if (role === 'admin') {
      user = { id: 'u1', name: 'Admin User', email: email || 'admin@college.edu', role: 'admin' };
    } else if (role === 'driver') {
      const driverStore = useDataStore.getState().drivers;
      const driver = driverStore.find(d => d.id === userId);
      if (driver) {
        user = { id: driver.id, name: driver.name, email: driver.email, role: 'driver' };
      }
    } else if (role === 'student') {
      const studentStore = useDataStore.getState().students;
      const student = studentStore.find(s => s.id === userId);
      if (student) {
        user = { id: student.id, name: student.name, email: student.email, role: 'student' };
      }
    }
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
  addRoute: (route) => set((state) => {
    state.addActivity(`Route ${route.name} created.`);
    return { routes: [...state.routes, route] };
  }),
  updateRoute: (route) => set((state) => {
    state.addActivity(`Route ${route.name} updated.`);
    // Notify driver
    const driver = state.drivers.find(d => d.assignedRouteId === route.id);
    if (driver) {
      state.addNotification({
        id: `notif-${Date.now()}-d`,
        title: 'Route Updated',
        message: `The route ${route.name} has been updated.`,
        targetRole: 'driver',
        date: new Date().toISOString(),
        isRead: false
      });
    }
    // Notify students
    state.addNotification({
      id: `notif-${Date.now()}-s`,
      title: 'Route Updated',
      message: `The route ${route.name} has been updated.`,
      targetRole: 'student',
      date: new Date().toISOString(),
      isRead: false
    });
    return {
      routes: state.routes.map(r => r.id === route.id ? route : r)
    };
  }),
  deleteRoute: (id) => set((state) => {
    const route = state.routes.find(r => r.id === id);
    if (route) {
      state.addActivity(`Route ${route.name} deleted.`);
    }
    return {
      routes: state.routes.filter(r => r.id !== id),
      drivers: state.drivers.map(d => d.assignedRouteId === id ? { ...d, assignedRouteId: null } : d),
      students: state.students.map(s => s.assignedRouteId === id ? { ...s, assignedRouteId: null, pickupStopId: null } : s),
      buses: state.buses.map(b => b.routeId === id ? { ...b, routeId: null } : b)
    };
  }),
  
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
  updateComplaint: (complaint) => set((state) => {
    state.addActivity(`Complaint #${complaint.id} updated to ${complaint.status}.`);
    
    // Notify the student
    const student = state.students.find(s => s.id === complaint.userId);
    if (student) {
      state.addNotification({
        id: `notif-${Date.now()}`,
        title: 'Complaint Update',
        message: `Your complaint "${complaint.subject}" status changed to ${complaint.status}.`,
        targetRole: 'student',
        date: new Date().toISOString(),
        isRead: false
      });
    }
    
    return {
      complaints: state.complaints.map(c => c.id === complaint.id ? complaint : c)
    };
  }),
  
  notifications: [...mockNotifications],
  addNotification: (notification) => set((state) => ({ notifications: [notification, ...state.notifications] })),
  updateNotification: (notification) => set((state) => ({
    notifications: state.notifications.map(n => n.id === notification.id ? notification : n)
  })),
  deleteNotification: (id) => set((state) => ({
    notifications: state.notifications.filter(n => n.id !== id)
  })),
  markNotificationRead: (id, userId) => set((state) => ({
    notifications: state.notifications.map(n => {
      if (n.id === id) {
        const readBy = n.readBy || [];
        if (!readBy.includes(userId)) {
          return { ...n, readBy: [...readBy, userId] };
        }
      }
      return n;
    })
  })),
  markAllNotificationsRead: (userId, targetRole) => set((state) => ({
    notifications: state.notifications.map(n => {
      if (n.targetRole === targetRole || n.targetRole === 'all' || n.targetRole === 'specific') {
        const readBy = n.readBy || [];
        if (!readBy.includes(userId)) {
          return { ...n, readBy: [...readBy, userId] };
        }
      }
      return n;
    })
  })),
  deleteNotificationForUser: (id, userId) => set((state) => ({
    notifications: state.notifications.map(n => {
      if (n.id === id) {
        const deletedBy = n.deletedBy || [];
        if (!deletedBy.includes(userId)) {
          return { ...n, deletedBy: [...deletedBy, userId] };
        }
      }
      return n;
    })
  })),
  
  activities: [],
  addActivity: (message) => set((state) => {
    const newActivity = {
      id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      message,
      date: new Date().toISOString()
    };
    return { activities: [newActivity, ...state.activities] };
  }),
  
  emergencies: [],
  triggerEmergency: (emergency) => set((state) => ({ emergencies: [emergency, ...state.emergencies] })),
  resolveEmergency: (id, remarks, actionTaken) => set((state) => ({
    emergencies: state.emergencies.map(e => 
      e.id === id ? { ...e, status: 'resolved', remarks, actionTaken } : e
    )
  })),
}));
