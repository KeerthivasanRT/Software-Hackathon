const TripHistory = require('../models/TripHistory');
const Driver = require('../models/Driver');

// @desc    Get Trip History
// @route   GET /api/trips
// @access  Private
exports.getTrips = async (req, res, next) => {
  try {
    const { driver, bus, route } = req.query;
    let query = {};

    if (driver) query.driver = driver;
    if (bus) query.bus = bus;
    if (route) query.route = route;

    if (req.user && req.user.role === 'driver') {
      const driverDoc = await Driver.findOne({ email: req.user.email });
      if (driverDoc) query.driver = driverDoc._id;
    }

    const trips = await TripHistory.find(query)
      .populate('driver', 'name employeeId phone')
      .populate('bus', 'busNumber registrationNumber')
      .populate('route', 'routeCode routeName startingPoint')
      .sort({ tripDate: -1 });

    return res.status(200).json({
      success: true,
      count: trips.length,
      data: trips
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Log a new trip
// @route   POST /api/trips
// @access  Private (Driver or Admin)
exports.createTrip = async (req, res, next) => {
  try {
    const { bus, route, startTime, endTime, distanceCovered, studentsPresent, studentsAbsent, tripStatus, remarks } = req.body;

    let driverId = req.body.driver;
    if (req.user && req.user.role === 'driver') {
      const driverDoc = await Driver.findOne({ email: req.user.email });
      if (driverDoc) driverId = driverDoc._id;
    }

    const trip = await TripHistory.create({
      driver: driverId,
      bus,
      route,
      tripDate: req.body.tripDate || new Date(),
      startTime: startTime || '06:30 AM',
      endTime: endTime || '08:15 AM',
      distanceCovered: distanceCovered || 45,
      studentsPresent: studentsPresent || 48,
      studentsAbsent: studentsAbsent || 4,
      tripStatus: tripStatus || 'Completed',
      remarks: remarks || 'Trip completed.'
    });

    return res.status(201).json({
      success: true,
      message: 'Trip logged successfully',
      data: trip
    });
  } catch (error) {
    next(error);
  }
};
