const db = require('../config/db');
const { successResponse, errorResponse } = require('../utils/helpers');

exports.getDashboardStats = async (req, res, next) => {
  try {
    const [[busesCount]] = await db.query('SELECT COUNT(*) as total, SUM(CASE WHEN status="active" THEN 1 ELSE 0 END) as active FROM Buses');
    const [[studentsCount]] = await db.query('SELECT COUNT(*) as total FROM Students');
    const [[driversCount]] = await db.query('SELECT COUNT(*) as total FROM Drivers');
    const [[complaintsCount]] = await db.query('SELECT COUNT(*) as total, SUM(CASE WHEN status="pending" THEN 1 ELSE 0 END) as pending FROM Complaints');
    const [[emergenciesCount]] = await db.query('SELECT COUNT(*) as total, SUM(CASE WHEN status="active" THEN 1 ELSE 0 END) as active FROM EmergencySOS');
    const [[fuelCount]] = await db.query('SELECT SUM(fuel_liters) as totalLiters, SUM(cost) as totalCost FROM FuelLogs');

    const [recentActivities] = await db.query('SELECT * FROM Notifications ORDER BY created_at DESC LIMIT 5');

    return successResponse(res, {
      totalBuses: busesCount.total || 0,
      activeBuses: busesCount.active || 0,
      totalStudents: studentsCount.total || 0,
      totalDrivers: driversCount.total || 0,
      pendingComplaints: complaintsCount.pending || 0,
      activeEmergencies: emergenciesCount.active || 0,
      totalFuelLiters: fuelCount.totalLiters || 0,
      totalFuelCost: fuelCount.totalCost || 0,
      recentActivities
    }, 'Dashboard metrics calculated from database');
  } catch (error) {
    next(error);
  }
};
