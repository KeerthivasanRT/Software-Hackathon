const FuelLog = require('../models/FuelLog');
const Driver = require('../models/Driver');

// @desc    Get Fuel Logs
// @route   GET /api/fuel-logs
// @access  Private
exports.getFuelLogs = async (req, res, next) => {
  try {
    const { bus, driver } = req.query;
    let query = {};

    if (bus) query.bus = bus;
    if (driver) query.driver = driver;

    if (req.user && req.user.role === 'driver') {
      const driverDoc = await Driver.findOne({ email: req.user.email });
      if (driverDoc) query.driver = driverDoc._id;
    }

    const logs = await FuelLog.find(query)
      .populate('bus', 'busNumber registrationNumber')
      .populate('driver', 'name employeeId')
      .populate('route', 'routeCode routeName')
      .sort({ date: -1 });

    return res.status(200).json({
      success: true,
      count: logs.length,
      data: logs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add Fuel Entry
// @route   POST /api/fuel-logs
// @access  Private (Driver or Admin)
exports.createFuelLog = async (req, res, next) => {
  try {
    const { bus, fuelAdded, fuelCost, odometer, mileage, fuelStation, remarks } = req.body;

    if (fuelAdded < 0 || fuelCost < 0) {
      return res.status(400).json({ success: false, message: 'Fuel added and fuel cost cannot be negative' });
    }

    let driverId = req.body.driver;
    if (req.user && req.user.role === 'driver') {
      const driverDoc = await Driver.findOne({ email: req.user.email });
      if (driverDoc) driverId = driverDoc._id;
    }

    const log = await FuelLog.create({
      bus,
      driver: driverId,
      route: req.body.route || null,
      date: req.body.date || new Date(),
      fuelAdded,
      fuelCost,
      odometer,
      mileage: mileage || 4.8,
      fuelStation: fuelStation || 'BIT Campus Fuel Outlet, Sathyamangalam',
      remarks: remarks || ''
    });

    return res.status(201).json({
      success: true,
      message: 'Fuel entry logged successfully',
      data: log
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete Fuel Entry
// @route   DELETE /api/fuel-logs/:id
// @access  Private (Admin only)
exports.deleteFuelLog = async (req, res, next) => {
  try {
    const log = await FuelLog.findById(req.params.id);
    if (!log) {
      return res.status(404).json({ success: false, message: 'Fuel log not found' });
    }

    await log.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Fuel log entry deleted'
    });
  } catch (error) {
    next(error);
  }
};
