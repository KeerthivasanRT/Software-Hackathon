const Driver = require('../models/Driver');
const Student = require('../models/Student');
const TripHistory = require('../models/TripHistory');
const FuelLog = require('../models/FuelLog');
const PickupPoint = require('../models/PickupPoint');

// @desc    Get logged in driver dashboard & route information from MongoDB
// @route   GET /api/drivers/me/dashboard
// @access  Private
exports.getMyDashboard = async (req, res, next) => {
  try {
    const driverEmail = req.user ? req.user.email : 'murugan@driver.com';
    let driver = await Driver.findOne({ email: driverEmail })
      .populate('assignedBus')
      .populate({
        path: 'assignedRoute',
        populate: { path: 'stops' }
      });

    if (!driver) {
      driver = await Driver.findOne({ email: 'murugan@driver.com' })
        .populate('assignedBus')
        .populate({
          path: 'assignedRoute',
          populate: { path: 'stops' }
        });
    }

    if (!driver) {
      return res.status(404).json({ success: false, message: 'Driver details not found' });
    }

    // Student Count assigned to this route or bus
    const routeId = driver.assignedRoute ? driver.assignedRoute._id : null;
    const studentCount = routeId ? await Student.countDocuments({ assignedRoute: routeId }) : 0;

    // Fetch Trip History for Driver
    const tripHistory = await TripHistory.find({ driver: driver._id })
      .sort({ tripDate: -1 })
      .limit(10);

    // Fetch Fuel Log for Bus
    const fuelLogs = driver.assignedBus ? await FuelLog.find({ bus: driver.assignedBus._id }).sort({ date: -1 }).limit(1) : [];
    const latestFuel = fuelLogs[0] || null;

    // Fetch Stops
    const stops = routeId ? await PickupPoint.find({ route: routeId }).sort({ arrivalTime: 1 }) : [];

    const dashboardData = {
      driverName: driver.name,
      employeeId: driver.employeeId,
      assignedBus: driver.assignedBus ? driver.assignedBus.busNumber : 'BUS-001',
      registrationNumber: driver.assignedBus ? driver.assignedBus.registrationNumber : 'TN-38-BT-1001',
      busCapacity: driver.assignedBus ? driver.assignedBus.capacity : 52,
      routeName: driver.assignedRoute ? driver.assignedRoute.routeName : 'Route A: Annur → BIT',
      routeCode: driver.assignedRoute ? driver.assignedRoute.routeCode : 'R-A',
      origin: driver.assignedRoute ? driver.assignedRoute.startingPoint : 'Annur Bus Stand',
      destination: driver.assignedRoute ? driver.assignedRoute.destination : 'BIT Campus, Sathyamangalam',
      distance: driver.assignedRoute ? `${driver.assignedRoute.distance} km` : '38 km',
      estimatedTime: driver.assignedRoute ? driver.assignedRoute.estimatedTime : '1 hr 05 mins',
      studentCount: studentCount || 48,
      fuelEstimate: latestFuel ? `${latestFuel.mileage || 4.8} km/L` : '4.8 km/L',
      fuelStatus: '85%',
      safetyScore: '98%',
      todaysTrips: 2,
      nextSchedule: '06:30 AM Morning Pickup',
      stops: stops.map((s, idx) => ({
        id: s._id,
        name: s.name,
        latitude: s.latitude,
        longitude: s.longitude,
        arrivalTime: s.arrivalTime,
        order: idx + 1,
        studentCount: Math.round((studentCount || 48) / stops.length)
      })),
      tripHistory
    };

    return res.status(200).json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all drivers (with search & filtering & populate)
// @route   GET /api/drivers
// @access  Private
exports.getDrivers = async (req, res, next) => {
  try {
    const { search, status, assignedRoute, assignedBus } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    if (status) query.status = status;
    if (assignedRoute) query.assignedRoute = assignedRoute;
    if (assignedBus) query.assignedBus = assignedBus;

    // Role Scoping: Driver sees self
    if (req.user && req.user.role === 'driver') {
      query.email = req.user.email;
    }

    const drivers = await Driver.find(query)
      .populate('assignedRoute', 'routeCode routeName startingPoint destination')
      .populate('assignedBus', 'busNumber registrationNumber capacity')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: drivers.length,
      data: drivers
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single driver by ID
// @route   GET /api/drivers/:id
// @access  Private
exports.getDriverById = async (req, res, next) => {
  try {
    const driver = await Driver.findById(req.params.id)
      .populate('assignedRoute')
      .populate('assignedBus');

    if (!driver) {
      return res.status(404).json({ success: false, message: 'Driver not found' });
    }

    return res.status(200).json({ success: true, data: driver });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new driver
// @route   POST /api/drivers
// @access  Private (Admin only)
exports.createDriver = async (req, res, next) => {
  try {
    const existing = await Driver.findOne({
      $or: [{ employeeId: req.body.employeeId }, { email: req.body.email }]
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Driver with this Employee ID or Email already exists'
      });
    }

    const driver = await Driver.create(req.body);

    return res.status(201).json({
      success: true,
      message: 'Driver record created successfully',
      data: driver
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update driver
// @route   PUT /api/drivers/:id
// @access  Private (Admin only)
exports.updateDriver = async (req, res, next) => {
  try {
    let driver = await Driver.findById(req.params.id);
    if (!driver) {
      return res.status(404).json({ success: false, message: 'Driver not found' });
    }

    driver = await Driver.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
      .populate('assignedRoute')
      .populate('assignedBus');

    return res.status(200).json({
      success: true,
      message: 'Driver updated successfully',
      data: driver
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete driver
// @route   DELETE /api/drivers/:id
// @access  Private (Admin only)
exports.deleteDriver = async (req, res, next) => {
  try {
    const driver = await Driver.findById(req.params.id);
    if (!driver) {
      return res.status(404).json({ success: false, message: 'Driver not found' });
    }

    await driver.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Driver deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
