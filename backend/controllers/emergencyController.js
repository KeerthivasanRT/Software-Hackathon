const EmergencySOS = require('../models/EmergencySOS');

// @desc    Get emergency SOS alerts & history
// @route   GET /api/emergency
// @access  Private
exports.getEmergencies = async (req, res, next) => {
  try {
    const { status } = req.query;
    let query = {};
    if (status) query.status = status;

    // Role-based scoping: Student/Driver sees own SOS history
    if (req.user && req.user.role !== 'admin') {
      query.triggeredBy = req.user.id;
    }

    const emergencies = await EmergencySOS.find(query)
      .populate('triggeredBy', 'name email phone role')
      .populate('route', 'routeCode routeName startingPoint')
      .populate('bus', 'busNumber registrationNumber')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: emergencies.length,
      data: emergencies
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Trigger Emergency SOS Alert
// @route   POST /api/emergency
// @access  Private (Student or Driver)
exports.triggerSOS = async (req, res, next) => {
  try {
    const { emergencyType, description, route, bus, location } = req.body;

    if (!emergencyType) {
      return res.status(400).json({ success: false, message: 'Emergency type is required' });
    }

    const emergency = await EmergencySOS.create({
      triggeredBy: req.user.id,
      role: req.user.role,
      emergencyType,
      description: description || '',
      route: route || null,
      bus: bus || null,
      location: location || { latitude: 11.5034, longitude: 77.2444, name: 'BIT Sathyamangalam Highway' },
      status: 'Active'
    });

    return res.status(201).json({
      success: true,
      message: '🚨 Emergency SOS broadcasted to Executive Command Center',
      data: emergency
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update emergency SOS status (Active -> Acknowledged -> Resolved)
// @route   PUT /api/emergency/:id
// @access  Private (Admin only)
exports.updateEmergencyStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    let emergency = await EmergencySOS.findById(req.params.id);

    if (!emergency) {
      return res.status(404).json({ success: false, message: 'Emergency record not found' });
    }

    emergency.status = status || emergency.status;
    await emergency.save();

    return res.status(200).json({
      success: true,
      message: `Emergency SOS status updated to '${emergency.status}'`,
      data: emergency
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete emergency record
// @route   DELETE /api/emergency/:id
// @access  Private (Admin only)
exports.deleteEmergency = async (req, res, next) => {
  try {
    const emergency = await EmergencySOS.findById(req.params.id);
    if (!emergency) {
      return res.status(404).json({ success: false, message: 'Emergency record not found' });
    }

    await emergency.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Emergency record deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
