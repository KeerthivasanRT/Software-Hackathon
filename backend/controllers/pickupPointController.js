const PickupPoint = require('../models/PickupPoint');

// @desc    Get all pickup points
// @route   GET /api/pickup-points
// @access  Private
exports.getPickupPoints = async (req, res, next) => {
  try {
    const { route } = req.query;
    let query = {};
    if (route) query.route = route;

    const points = await PickupPoint.find(query)
      .populate('route', 'routeCode routeName')
      .populate('students', 'name registerNumber department')
      .sort({ name: 1 });

    return res.status(200).json({
      success: true,
      count: points.length,
      data: points
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single pickup point by ID
// @route   GET /api/pickup-points/:id
// @access  Private
exports.getPickupPointById = async (req, res, next) => {
  try {
    const point = await PickupPoint.findById(req.params.id)
      .populate('route')
      .populate('students');

    if (!point) {
      return res.status(404).json({ success: false, message: 'Pickup point not found' });
    }

    return res.status(200).json({ success: true, data: point });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new pickup point
// @route   POST /api/pickup-points
// @access  Private (Admin only)
exports.createPickupPoint = async (req, res, next) => {
  try {
    const point = await PickupPoint.create(req.body);

    return res.status(201).json({
      success: true,
      message: 'Pickup point created successfully',
      data: point
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update pickup point
// @route   PUT /api/pickup-points/:id
// @access  Private (Admin only)
exports.updatePickupPoint = async (req, res, next) => {
  try {
    let point = await PickupPoint.findById(req.params.id);
    if (!point) {
      return res.status(404).json({ success: false, message: 'Pickup point not found' });
    }

    point = await PickupPoint.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('route').populate('students');

    return res.status(200).json({
      success: true,
      message: 'Pickup point updated successfully',
      data: point
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete pickup point
// @route   DELETE /api/pickup-points/:id
// @access  Private (Admin only)
exports.deletePickupPoint = async (req, res, next) => {
  try {
    const point = await PickupPoint.findById(req.params.id);
    if (!point) {
      return res.status(404).json({ success: false, message: 'Pickup point not found' });
    }

    await point.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Pickup point deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
