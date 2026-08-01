const Bus = require('../models/Bus');

// @desc    Get all buses (with search & filtering & populate)
// @route   GET /api/buses
// @access  Private
exports.getBuses = async (req, res, next) => {
  try {
    const { search, status, route } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { busNumber: { $regex: search, $options: 'i' } },
        { registrationNumber: { $regex: search, $options: 'i' } }
      ];
    }

    if (status) query.status = status;
    if (route) query.route = route;

    const buses = await Bus.find(query)
      .populate('driver', 'name employeeId phone licenseNumber')
      .populate('route', 'routeCode routeName startingPoint destination distance')
      .sort({ busNumber: 1 });

    return res.status(200).json({
      success: true,
      count: buses.length,
      data: buses
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single bus by ID
// @route   GET /api/buses/:id
// @access  Private
exports.getBusById = async (req, res, next) => {
  try {
    const bus = await Bus.findById(req.params.id)
      .populate('driver')
      .populate('route');

    if (!bus) {
      return res.status(404).json({ success: false, message: 'Bus not found' });
    }

    return res.status(200).json({ success: true, data: bus });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new bus
// @route   POST /api/buses
// @access  Private (Admin only)
exports.createBus = async (req, res, next) => {
  try {
    const existing = await Bus.findOne({ busNumber: req.body.busNumber });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Bus with this Bus Number already exists'
      });
    }

    const bus = await Bus.create(req.body);

    return res.status(201).json({
      success: true,
      message: 'Bus created successfully',
      data: bus
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update bus
// @route   PUT /api/buses/:id
// @access  Private (Admin only)
exports.updateBus = async (req, res, next) => {
  try {
    let bus = await Bus.findById(req.params.id);
    if (!bus) {
      return res.status(404).json({ success: false, message: 'Bus not found' });
    }

    bus = await Bus.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
      .populate('driver')
      .populate('route');

    return res.status(200).json({
      success: true,
      message: 'Bus updated successfully',
      data: bus
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete bus
// @route   DELETE /api/buses/:id
// @access  Private (Admin only)
exports.deleteBus = async (req, res, next) => {
  try {
    const bus = await Bus.findById(req.params.id);
    if (!bus) {
      return res.status(404).json({ success: false, message: 'Bus not found' });
    }

    await bus.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Bus deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
