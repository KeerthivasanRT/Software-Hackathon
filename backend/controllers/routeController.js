const Route = require('../models/Route');

// @desc    Get all routes (with search & filtering & populate)
// @route   GET /api/routes
// @access  Private
exports.getRoutes = async (req, res, next) => {
  try {
    const { search, status } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { routeCode: { $regex: search, $options: 'i' } },
        { routeName: { $regex: search, $options: 'i' } },
        { startingPoint: { $regex: search, $options: 'i' } }
      ];
    }

    if (status) query.status = status;

    const routes = await Route.find(query)
      .populate('assignedBus', 'busNumber registrationNumber capacity')
      .populate('assignedDriver', 'name employeeId phone')
      .populate('stops', 'name arrivalTime latitude longitude')
      .sort({ routeCode: 1 });

    return res.status(200).json({
      success: true,
      count: routes.length,
      data: routes
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single route by ID
// @route   GET /api/routes/:id
// @access  Private
exports.getRouteById = async (req, res, next) => {
  try {
    const route = await Route.findById(req.params.id)
      .populate('assignedBus')
      .populate('assignedDriver')
      .populate('stops');

    if (!route) {
      return res.status(404).json({ success: false, message: 'Route not found' });
    }

    return res.status(200).json({ success: true, data: route });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new route
// @route   POST /api/routes
// @access  Private (Admin only)
exports.createRoute = async (req, res, next) => {
  try {
    const existing = await Route.findOne({ routeCode: req.body.routeCode });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Route with this Route Code already exists'
      });
    }

    const route = await Route.create(req.body);

    return res.status(201).json({
      success: true,
      message: 'Route created successfully',
      data: route
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update route
// @route   PUT /api/routes/:id
// @access  Private (Admin only)
exports.updateRoute = async (req, res, next) => {
  try {
    let route = await Route.findById(req.params.id);
    if (!route) {
      return res.status(404).json({ success: false, message: 'Route not found' });
    }

    route = await Route.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
      .populate('assignedBus')
      .populate('assignedDriver')
      .populate('stops');

    return res.status(200).json({
      success: true,
      message: 'Route updated successfully',
      data: route
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete route
// @route   DELETE /api/routes/:id
// @access  Private (Admin only)
exports.deleteRoute = async (req, res, next) => {
  try {
    const route = await Route.findById(req.params.id);
    if (!route) {
      return res.status(404).json({ success: false, message: 'Route not found' });
    }

    await route.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Route deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
