import { create } from 'zustand';
import { getApiUrl } from './api';
import { User, Bus, Student, Driver, Route, Attendance, Complaint, Notification, AttendanceStatus, Emergency, Activity, SalaryRecord, FeeRecord, VehicleInspection, FuelLog, TripRecord, CalendarScheduleEvent } from '@/types';
import { mockUsers, mockBuses, mockStudents, mockDrivers, mockRoutes, mockAttendance, mockComplaints, mockNotifications, mockSalaryRecords, mockFeeRecords, mockEmergencies, mockInspections, mockFuelLogs, mockTripRecords, mockCalendarEvents } from './mockData';

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
  updateEmergencyStatus: (id: string, status: Emergency['status'], assignedStaff?: string, remarks?: string, actionTaken?: string) => void;
  deleteEmergencyRecord: (id: string) => void;

  salaryRecords: SalaryRecord[];
  updateSalaryRecord: (record: SalaryRecord) => void;
  paySalary: (salaryId: string, paymentData: { paymentMethod: 'Net Banking' | 'UPI' | 'Bank Transfer'; basicSalary?: number; allowances?: number; bonus?: number; deductions?: number; bankName?: string; accountNumberMasked?: string; ifscCode?: string }) => void;

  feeRecords: FeeRecord[];
  updateFeeRecord: (record: FeeRecord) => void;
  addFeeRecord: (record: FeeRecord) => void;
  payStudentFee: (feeId: string, paymentData: { paymentMethod: 'Net Banking' | 'UPI' | 'Debit Card' | 'Credit Card' | 'Cash'; lateFee?: number; scholarshipDiscount?: number }) => void;

  vehicleInspections: VehicleInspection[];
  addVehicleInspection: (inspection: VehicleInspection) => void;

  fuelLogs: FuelLog[];
  addFuelLog: (log: FuelLog) => void;

  tripRecords: TripRecord[];
  addTripRecord: (trip: TripRecord) => void;

  calendarEvents: CalendarScheduleEvent[];
  addScheduleEvent: (event: CalendarScheduleEvent) => void;

  fetchBackendData: () => Promise<void>;
}

export const useDataStore = create<DataState>((set, get) => ({
  user: null,
  fetchBackendData: async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) return;

      const headers = { 'Authorization': `Bearer ${token}` };

      // Fetch Students
      const resStudents = await fetch(getApiUrl('/api/students'), { headers });
      if (resStudents.ok) {
        const data = await resStudents.json();
        if (data.success && data.data && data.data.length > 0) {
          const mappedStudents = data.data.map((s: any) => ({
            id: s._id,
            name: s.name,
            email: s.email,
            role: 'student',
            studentId: s.registerNumber,
            registerNumber: s.registerNumber,
            department: s.department,
            year: s.year,
            phone: s.phone,
            assignedBusId: s.assignedBus ? (s.assignedBus._id || s.assignedBus) : null,
            assignedRouteId: s.assignedRoute ? (s.assignedRoute._id || s.assignedRoute) : null,
            pickupStopId: s.pickupPoint ? (s.pickupPoint._id || s.pickupPoint) : null
          }));
          set({ students: mappedStudents });
        }
      }

      // Fetch Drivers
      const resDrivers = await fetch(getApiUrl('/api/drivers'), { headers });
      if (resDrivers.ok) {
        const data = await resDrivers.json();
        if (data.success && data.data && data.data.length > 0) {
          const mappedDrivers = data.data.map((d: any) => ({
            id: d._id,
            name: d.name,
            email: d.email,
            role: 'driver',
            employeeId: d.employeeId,
            licenseNumber: d.licenseNumber,
            licenseExpiry: d.licenseExpiry,
            experience: d.experience,
            phone: d.phone,
            status: d.status,
            assignedBusId: d.assignedBus ? (d.assignedBus._id || d.assignedBus) : null,
            assignedRouteId: d.assignedRoute ? (d.assignedRoute._id || d.assignedRoute) : null
          }));
          set({ drivers: mappedDrivers });
        }
      }

      // Fetch Buses
      const resBuses = await fetch(getApiUrl('/api/buses'), { headers });
      if (resBuses.ok) {
        const data = await resBuses.json();
        if (data.success && data.data && data.data.length > 0) {
          const mappedBuses = data.data.map((b: any) => ({
            id: b._id,
            busNumber: b.busNumber,
            registrationNumber: b.registrationNumber,
            busName: b.busNumber,
            capacity: b.capacity,
            driverId: b.driver ? (b.driver._id || b.driver) : null,
            routeId: b.route ? (b.route._id || b.route) : null,
            status: b.status
          }));
          set({ buses: mappedBuses });
        }
      }

      // Fetch Routes
      const resRoutes = await fetch(getApiUrl('/api/routes'), { headers });
      if (resRoutes.ok) {
        const data = await resRoutes.json();
        if (data.success && data.data && data.data.length > 0) {
          const mappedRoutes = data.data.map((r: any) => ({
            id: r._id,
            name: r.routeName,
            distance: `${r.distance} km`,
            estimatedTime: r.estimatedTime,
            distanceKm: r.distance,
            stops: (r.stops || []).map((st: any, idx: number) => ({
              id: st._id || `stop-${idx}`,
              name: st.name || `Stop ${idx + 1}`,
              latitude: st.latitude || 11.5034,
              longitude: st.longitude || 77.2444,
              order: idx + 1
            }))
          }));
          set({ routes: mappedRoutes });
        }
      }
    } catch (err) {
      console.warn('Backend sync warning (running local fallback):', err);
    }
  },
  login: (role, userId, email) => {
    let user: User | null = null;
    const authUserStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    const authUser = authUserStr ? JSON.parse(authUserStr) : null;

    if (role === 'admin') {
      user = { id: userId || authUser?.id || 'u1', name: authUser?.name || 'Admin User', email: email || authUser?.email || 'admin@college.edu', role: 'admin' };
    } else if (role === 'driver') {
      const driverStore = useDataStore.getState().drivers;
      const driver = driverStore.find(d => d.id === userId || (email && d.email.toLowerCase() === email.toLowerCase()) || (authUser && authUser.email && d.email.toLowerCase() === authUser.email.toLowerCase()));
      if (driver) {
        user = { id: driver.id, name: driver.name, email: driver.email, role: 'driver' };
      } else if (authUser && authUser.role === 'driver') {
        user = { id: authUser.id || userId || 'd2', name: authUser.name || 'Driver', email: authUser.email || email || '', role: 'driver' };
      }
    } else if (role === 'student') {
      const studentStore = useDataStore.getState().students;
      const student = studentStore.find(s => s.id === userId || (email && s.email.toLowerCase() === email.toLowerCase()) || (authUser && authUser.email && s.email.toLowerCase() === authUser.email.toLowerCase()));
      if (student) {
        user = { id: student.id, name: student.name, email: student.email, role: 'student' };
      } else if (authUser && authUser.role === 'student') {
        user = { id: authUser.id || userId || 'st1', name: authUser.name || 'Student', email: authUser.email || email || '', role: 'student' };
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
  
  emergencies: [...mockEmergencies],
  triggerEmergency: (emergency) => set((state) => {
    const adminNotification: Notification = {
      id: `notif-emg-${Date.now()}`,
      title: '🚨 New Emergency Alert',
      message: `Emergency (${emergency.emergencyType || 'SOS Alert'}) reported by ${emergency.reporterName || 'User'} on ${emergency.routeName || 'Route'}. Location: ${emergency.pickupPoint}`,
      category: 'Emergency Alert',
      priority: 'emergency',
      targetRole: 'admin',
      recipientType: 'all',
      status: 'sent',
      date: new Date().toISOString(),
      readBy: [],
      deletedBy: []
    };

    const newActivity: Activity = {
      id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      message: `🚨 Emergency ${emergency.id} (${emergency.emergencyType || 'SOS'}) reported by ${emergency.reporterName || 'User'}`,
      date: new Date().toISOString()
    };

    return {
      emergencies: [emergency, ...state.emergencies],
      notifications: [adminNotification, ...state.notifications],
      activities: [newActivity, ...state.activities]
    };
  }),

  resolveEmergency: (id, remarks, actionTaken) => set((state) => ({
    emergencies: state.emergencies.map(e => 
      e.id === id ? { ...e, status: 'Resolved', remarks, actionTaken } : e
    )
  })),

  updateEmergencyStatus: (id, status, assignedStaff, remarks, actionTaken) => set((state) => {
    let reporterId = '';
    let reporterRole: any = 'all';

    const newEmergencies = state.emergencies.map(e => {
      if (e.id === id) {
        reporterId = e.reporterId || '';
        reporterRole = e.reportedBy || 'all';
        return {
          ...e,
          status,
          assignedStaff: assignedStaff !== undefined ? assignedStaff : e.assignedStaff,
          remarks: remarks !== undefined ? remarks : e.remarks,
          actionTaken: actionTaken !== undefined ? actionTaken : e.actionTaken,
        };
      }
      return e;
    });

    const statusNotification: Notification = {
      id: `notif-emg-upd-${Date.now()}`,
      title: `🚨 Emergency Status Updated`,
      message: `Your reported emergency (${id}) status has been updated to "${status}". ${assignedStaff ? `Assigned Staff: ${assignedStaff}.` : ''}`,
      category: 'Emergency Update',
      priority: 'high',
      targetRole: reporterRole,
      recipientType: reporterRole === 'student' ? 'specific_student' : (reporterRole === 'driver' ? 'specific_driver' : 'all'),
      recipientIds: reporterId ? [reporterId] : [],
      status: 'sent',
      date: new Date().toISOString(),
      readBy: [],
      deletedBy: []
    };

    return {
      emergencies: newEmergencies,
      notifications: [statusNotification, ...state.notifications]
    };
  }),

  deleteEmergencyRecord: (id) => set((state) => ({
    emergencies: state.emergencies.filter(e => e.id !== id)
  })),

  salaryRecords: [...mockSalaryRecords],
  updateSalaryRecord: (record) => set((state) => ({
    salaryRecords: state.salaryRecords.map(s => s.id === record.id ? record : s)
  })),
  paySalary: (salaryId, paymentData) => set((state) => {
    let updatedDriverName = '';
    let updatedNetSalary = 0;
    let updatedMethod = paymentData.paymentMethod || 'Net Banking';
    let txnId = '';
    let driverId = '';
    let month = '';
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });

    const newSalaryRecords = state.salaryRecords.map((s, idx) => {
      if (s.id === salaryId) {
        const basicSalary = paymentData.basicSalary ?? s.basicSalary;
        const allowances = paymentData.allowances ?? s.allowances;
        const bonus = paymentData.bonus ?? s.bonus;
        const deductions = paymentData.deductions ?? s.deductions;
        const netSalary = basicSalary + allowances + bonus - deductions;
        
        txnId = `TXN24080100${idx + 10}`;
        updatedDriverName = s.driverName;
        updatedNetSalary = netSalary;
        driverId = s.driverId;
        month = s.month;

        return {
          ...s,
          basicSalary,
          allowances,
          bonus,
          deductions,
          netSalary,
          paymentStatus: 'paid' as const,
          paymentDate: formattedDate,
          paymentMethod: paymentData.paymentMethod || s.paymentMethod,
          bankName: paymentData.bankName || s.bankName,
          accountNumberMasked: paymentData.accountNumberMasked || s.accountNumberMasked,
          ifscCode: paymentData.ifscCode || s.ifscCode,
          transactionId: txnId,
        };
      }
      return s;
    });

    const salaryNotification: Notification = {
      id: `notif-sal-${Date.now()}`,
      title: '💰 Salary Credited',
      message: `Dear ${updatedDriverName},\n\nYour salary for ${month} has been credited successfully.\n\nNet Salary:\n₹${updatedNetSalary.toLocaleString('en-IN')}\n\nPayment Method:\n${updatedMethod}\n\nTransaction ID:\n${txnId}\n\nDate:\n${formattedDate}`,
      category: 'Salary Credit',
      priority: 'high',
      targetRole: 'driver',
      recipientType: 'specific_driver',
      recipientIds: [driverId],
      status: 'sent',
      date: now.toISOString(),
      readBy: [],
      deletedBy: []
    };

    const newActivity: Activity = {
      id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      message: `Salary of ₹${updatedNetSalary.toLocaleString('en-IN')} credited to ${updatedDriverName} via ${updatedMethod} (TXN: ${txnId})`,
      date: now.toISOString()
    };

    return {
      salaryRecords: newSalaryRecords,
      notifications: [salaryNotification, ...state.notifications],
      activities: [newActivity, ...state.activities],
    };
  }),

  feeRecords: [...mockFeeRecords],
  addFeeRecord: (record) => set((state) => ({ feeRecords: [record, ...state.feeRecords] })),
  updateFeeRecord: (record) => set((state) => ({
    feeRecords: state.feeRecords.map(f => f.id === record.id ? record : f)
  })),
  payStudentFee: (feeId, paymentData) => set((state) => {
    let studentName = '';
    let studentId = '';
    let totalPaid = 0;
    let method = paymentData.paymentMethod || 'Net Banking';
    let txnId = '';
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });

    const newFeeRecords = state.feeRecords.map((f, idx) => {
      if (f.id === feeId) {
        const lateFee = paymentData.lateFee ?? f.lateFee;
        const scholarshipDiscount = paymentData.scholarshipDiscount ?? f.scholarshipDiscount;
        const totalAmount = f.transportFee + lateFee - scholarshipDiscount;
        txnId = `TRN24080100${idx + 10}`;
        studentName = f.studentName;
        studentId = f.studentId;
        totalPaid = totalAmount;

        return {
          ...f,
          lateFee,
          scholarshipDiscount,
          totalAmount,
          paidAmount: totalAmount,
          pendingAmount: 0,
          paymentStatus: 'paid' as const,
          lastPaymentDate: formattedDate,
          paymentMethod: method,
          transactionId: txnId,
        };
      }
      return f;
    });

    const feeNotification: Notification = {
      id: `notif-fee-${Date.now()}`,
      title: '💳 Transport Fee Payment Successful',
      message: `Dear ${studentName},\n\nYour transport fee payment of ₹${totalPaid.toLocaleString('en-IN')} has been received successfully.\n\nTransaction ID:\n${txnId}\n\nPayment Method:\n${method}\n\nDate:\n${formattedDate}`,
      category: 'Fee Payment',
      priority: 'high',
      targetRole: 'student',
      recipientType: 'specific_student',
      recipientIds: [studentId],
      status: 'sent',
      date: now.toISOString(),
      readBy: [],
      deletedBy: []
    };

    const newActivity: Activity = {
      id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      message: `Transport fee payment of ₹${totalPaid.toLocaleString('en-IN')} received from ${studentName} via ${method} (TRN: ${txnId})`,
      date: now.toISOString()
    };

    return {
      feeRecords: newFeeRecords,
      notifications: [feeNotification, ...state.notifications],
      activities: [newActivity, ...state.activities],
    };
  }),

  vehicleInspections: [...mockInspections],
  addVehicleInspection: (inspection) => set((state) => {
    const adminNotif: Notification = {
      id: `notif-insp-${Date.now()}`,
      title: '🚌 New Vehicle Safety Inspection',
      message: `Driver ${inspection.driverName} completed safety inspection for ${inspection.busNumber} (${inspection.routeName}). Status: ${inspection.status}.`,
      category: 'Vehicle Inspection',
      priority: inspection.status === 'Unsafe' ? 'emergency' : (inspection.status === 'Needs Maintenance' ? 'high' : 'medium'),
      targetRole: 'admin',
      recipientType: 'all',
      status: 'sent',
      date: new Date().toISOString(),
      readBy: [],
      deletedBy: []
    };

    const activity: Activity = {
      id: `act-insp-${Date.now()}`,
      message: `Vehicle inspection submitted by ${inspection.driverName} for ${inspection.busNumber}: Status ${inspection.status}`,
      date: new Date().toISOString()
    };

    return {
      vehicleInspections: [inspection, ...state.vehicleInspections],
      notifications: [adminNotif, ...state.notifications],
      activities: [activity, ...state.activities]
    };
  }),

  fuelLogs: [...mockFuelLogs],
  addFuelLog: (log) => set((state) => {
    const adminNotif: Notification = {
      id: `notif-fuel-${Date.now()}`,
      title: '⛽ New Fuel Refilling Recorded',
      message: `Driver ${log.driverName} recorded ${log.fuelAddedLitres} L fuel refill (₹${log.fuelCost.toLocaleString('en-IN')}) for ${log.busNumber} at ${log.fuelStation}.`,
      category: 'Fuel Log',
      priority: 'medium',
      targetRole: 'admin',
      recipientType: 'all',
      status: 'sent',
      date: new Date().toISOString(),
      readBy: [],
      deletedBy: []
    };

    const activity: Activity = {
      id: `act-fuel-${Date.now()}`,
      message: `Fuel entry of ${log.fuelAddedLitres} L added by ${log.driverName} for ${log.busNumber}`,
      date: new Date().toISOString()
    };

    return {
      fuelLogs: [log, ...state.fuelLogs],
      notifications: [adminNotif, ...state.notifications],
      activities: [activity, ...state.activities]
    };
  }),

  tripRecords: [...mockTripRecords],
  addTripRecord: (trip) => set((state) => ({
    tripRecords: [trip, ...state.tripRecords]
  })),

  calendarEvents: [...mockCalendarEvents],
  addScheduleEvent: (event) => set((state) => {
    const driverNotif: Notification = {
      id: `notif-cal-${Date.now()}`,
      title: `📅 ${event.category}: ${event.title}`,
      message: `New schedule update: ${event.title} on ${event.date}. ${event.description || ''}`,
      category: 'Schedule Update',
      priority: event.category === 'Holiday' ? 'medium' : 'high',
      targetRole: 'driver',
      recipientType: 'all',
      status: 'sent',
      date: new Date().toISOString(),
      readBy: [],
      deletedBy: []
    };

    return {
      calendarEvents: [event, ...state.calendarEvents],
      notifications: [driverNotif, ...state.notifications]
    };
  }),
}));
