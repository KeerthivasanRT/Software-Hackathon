const Maintenance = require('../models/Maintenance');
const Driver = require('../models/Driver');

// @desc    Get Maintenance Requests
// @route   GET /api/maintenance
// @access  Private
exports.getMaintenanceRequests = async (req, res, next) => {
  try {
    const { bus, driver, status } = req.query;
    let query = {};

    if (bus) query.bus = bus;
    if (driver) query.driver = driver;
    if (status) query.status = status;

    if (req.user && req.user.role === 'driver') {
      const driverDoc = await Driver.findOne({ email: req.user.email });
      if (driverDoc) query.driver = driverDoc._id;
    }

    const requests = await Maintenance.find(query)
      .populate('driver', 'name employeeId phone')
      .populate('bus', 'busNumber registrationNumber capacity')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Raise Maintenance Request (Driver)
// @route   POST /api/maintenance
// @access  Private (Driver or Admin)
exports.createMaintenanceRequest = async (req, res, next) => {
  try {
    const { bus, issueType, description, priority } = req.body;

    if (!bus || !description) {
      return res.status(400).json({ success: false, message: 'Bus and description are required' });
    }

    let driverId = req.body.driver;
    if (req.user && req.user.role === 'driver') {
      const driverDoc = await Driver.findOne({ email: req.user.email });
      if (driverDoc) driverId = driverDoc._id;
    }

    const request = await Maintenance.create({
      driver: driverId,
      bus,
      issueType: issueType || 'Engine',
      description,
      priority: priority || 'Medium',
      status: 'Pending'
    });

    return res.status(201).json({
      success: true,
      message: 'Maintenance request submitted to Command Center',
      data: request
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Status / Assign Mechanic (Admin only)
// @route   PUT /api/maintenance/:id
// @access  Private (Admin only)
exports.updateMaintenanceRequest = async (req, res, next) => {
  try {
    let request = await Maintenance.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Maintenance request not found' });
    }

    request = await Maintenance.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('driver').populate('bus');

    return res.status(200).json({
      success: true,
      message: 'Maintenance request updated',
      data: request
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete Maintenance Request
// @route   DELETE /api/maintenance/:id
// @access  Private (Admin only)
exports.deleteMaintenanceRequest = async (req, res, next) => {
  try {
    const request = await Maintenance.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Maintenance request not found' });
    }

    await request.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Maintenance request deleted'
    });
  } catch (error) {
    next(error);
  }
};
