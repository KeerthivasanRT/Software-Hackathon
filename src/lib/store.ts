import { create } from 'zustand';
import { User, Bus, Student, Driver, Route, Attendance, Complaint, Notification, AttendanceStatus } from '@/types';
import { mockUsers, mockBuses, mockStudents, mockDrivers, mockRoutes, mockAttendance, mockComplaints, mockNotifications } from './mockData';

interface DataState {
  user: User | null;
  login: (role: User['role']) => void;
  logout: () => void;
  
  buses: Bus[];
  addBus: (bus: Bus) => void;
  updateBus: (bus: Bus) => void;
  deleteBus: (id: string) => void;
  
  students: Student[];
  addStudent: (student: Student) => void;
  updateStudent: (student: Student) => void;
  deleteStudent: (id: string) => void;
  
  drivers: Driver[];
  routes: Route[];
  attendances: Attendance[];
  markAttendance: (attendance: Attendance) => void;
  markMultipleAttendances: (attendances: Attendance[]) => void;
  
  complaints: Complaint[];
  notifications: Notification[];
}

export const useDataStore = create<DataState>((set) => ({
  user: null,
  login: (role) => {
    const user = mockUsers.find(u => u.role === role) || null;
    set({ user });
  },
  logout: () => set({ user: null }),
  
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
}));
