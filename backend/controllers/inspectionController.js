const VehicleInspection = require('../models/VehicleInspection');
const Driver = require('../models/Driver');

// @desc    Get Vehicle Inspections
// @route   GET /api/inspections
// @access  Private
exports.getInspections = async (req, res, next) => {
  try {
    const { driver, bus, overallStatus } = req.query;
    let query = {};

    if (driver) query.driver = driver;
    if (bus) query.bus = bus;
    if (overallStatus) query.overallStatus = overallStatus;

    if (req.user && req.user.role === 'driver') {
      const driverDoc = await Driver.findOne({ email: req.user.email });
      if (driverDoc) query.driver = driverDoc._id;
    }

    const inspections = await VehicleInspection.find(query)
      .populate('driver', 'name employeeId phone')
      .populate('bus', 'busNumber registrationNumber capacity')
      .populate('route', 'routeCode routeName')
      .sort({ inspectionDate: -1 });

    return res.status(200).json({
      success: true,
      count: inspections.length,
      data: inspections
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit Daily Inspection (Driver)
// @route   POST /api/inspections
// @access  Private (Driver or Admin)
exports.createInspection = async (req, res, next) => {
  try {
    let driverId = req.body.driver;
    if (req.user && req.user.role === 'driver') {
      const driverDoc = await Driver.findOne({ email: req.user.email });
      if (driverDoc) driverId = driverDoc._id;
    }

    const inspection = await VehicleInspection.create({
      driver: driverId,
      bus: req.body.bus,
      route: req.body.route || null,
      brakes: req.body.brakes !== undefined ? req.body.brakes : true,
      tyres: req.body.tyres !== undefined ? req.body.tyres : true,
      lights: req.body.lights !== undefined ? req.body.lights : true,
      horn: req.body.horn !== undefined ? req.body.horn : true,
      mirrors: req.body.mirrors !== undefined ? req.body.mirrors : true,
      fuelLevel: req.body.fuelLevel || '85%',
      battery: req.body.battery !== undefined ? req.body.battery : true,
      fireExtinguisher: req.body.fireExtinguisher !== undefined ? req.body.fireExtinguisher : true,
      firstAidKit: req.body.firstAidKit !== undefined ? req.body.firstAidKit : true,
      overallStatus: req.body.overallStatus || 'Pass',
      remarks: req.body.remarks || 'Daily inspection checklist passed.'
    });

    return res.status(201).json({
      success: true,
      message: 'Vehicle inspection checklist submitted successfully',
      data: inspection
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete Inspection
// @route   DELETE /api/inspections/:id
// @access  Private (Admin only)
exports.deleteInspection = async (req, res, next) => {
  try {
    const inspection = await VehicleInspection.findById(req.params.id);
    if (!inspection) {
      return res.status(404).json({ success: false, message: 'Inspection not found' });
    }

    await inspection.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Inspection record deleted'
    });
  } catch (error) {
    next(error);
  }
};
