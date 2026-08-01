const db = require('../config/db');
const { successResponse, errorResponse } = require('../utils/helpers');

exports.getFuelLogs = async (req, res, next) => {
  try {
    const [fuelLogs] = await db.query(`
      SELECT f.*, b.bus_number, u.name as driver_name
      FROM FuelLogs f
      JOIN Buses b ON f.bus_id = b.id
      JOIN Drivers d ON f.driver_id = d.id
      JOIN Users u ON d.user_id = u.id
      ORDER BY f.date DESC
    `);
    return successResponse(res, fuelLogs, 'Fuel logs retrieved');
  } catch (error) {
    next(error);
  }
};

exports.addFuelLog = async (req, res, next) => {
  try {
    const { busId, driverId, date, fuelLiters, cost, odometerReading, fuelStation, receiptNumber, notes } = req.body;
    const fuelId = `fuel-${Date.now()}`;
    const logDate = date || new Date().toISOString().split('T')[0];

    await db.query(
      `INSERT INTO FuelLogs (id, bus_id, driver_id, date, fuel_liters, cost, odometer_reading, fuel_station, receipt_number, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [fuelId, busId, driverId, logDate, fuelLiters, cost, odometerReading, fuelStation || 'IOCL Station', receiptNumber || `REC-${Date.now()}`, notes || '']
    );

    return successResponse(res, { id: fuelId }, 'Fuel log added successfully', 201);
  } catch (error) {
    next(error);
  }
};
