const db = require('../config/db');
const { successResponse, errorResponse } = require('../utils/helpers');

exports.getTrips = async (req, res, next) => {
  try {
    const [trips] = await db.query(`
      SELECT t.*, b.bus_number, r.name as route_name, u.name as driver_name
      FROM TripHistory t
      JOIN Buses b ON t.bus_id = b.id
      JOIN Routes r ON t.route_id = r.id
      JOIN Drivers d ON t.driver_id = d.id
      JOIN Users u ON d.user_id = u.id
      ORDER BY t.start_time DESC
    `);
    return successResponse(res, trips, 'Trip history retrieved');
  } catch (error) {
    next(error);
  }
};

exports.addTrip = async (req, res, next) => {
  try {
    const { busId, driverId, routeId, startTime, endTime, passengersCount, status } = req.body;
    const tripId = `trip-${Date.now()}`;

    await db.query(
      `INSERT INTO TripHistory (id, bus_id, driver_id, route_id, start_time, end_time, passengers_count, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [tripId, busId, driverId, routeId, startTime || new Date(), endTime || new Date(), passengersCount || 35, status || 'completed']
    );

    return successResponse(res, { id: tripId }, 'Trip record created successfully', 201);
  } catch (error) {
    next(error);
  }
};
