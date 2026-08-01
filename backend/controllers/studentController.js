const Student = require('../models/Student');

// @desc    Get all students (with search & filtering & populate)
// @route   GET /api/students
// @access  Private
exports.getStudents = async (req, res, next) => {
  try {
    const { search, department, year, route, pickupPoint } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { registerNumber: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (department) query.department = department;
    if (year) query.year = year;
    if (route) query.assignedRoute = route;
    if (pickupPoint) query.pickupPoint = pickupPoint;

    // Role Scoping: If student role, only view self
    if (req.user && req.user.role === 'student') {
      query.email = req.user.email;
    }

    const students = await Student.find(query)
      .populate('assignedRoute', 'routeCode routeName startingPoint destination')
      .populate('assignedBus', 'busNumber registrationNumber capacity')
      .populate('pickupPoint', 'name arrivalTime latitude longitude')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single student by ID
// @route   GET /api/students/:id
// @access  Private
exports.getStudentById = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('assignedRoute')
      .populate('assignedBus')
      .populate('pickupPoint');

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    return res.status(200).json({ success: true, data: student });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new student
// @route   POST /api/students
// @access  Private (Admin only)
exports.createStudent = async (req, res, next) => {
  try {
    const existing = await Student.findOne({
      $or: [{ registerNumber: req.body.registerNumber }, { email: req.body.email }]
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Student with this Register Number or Email already exists'
      });
    }

    const student = await Student.create(req.body);

    return res.status(201).json({
      success: true,
      message: 'Student record created successfully',
      data: student
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update student
// @route   PUT /api/students/:id
// @access  Private (Admin only)
exports.updateStudent = async (req, res, next) => {
  try {
    let student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
      .populate('assignedRoute')
      .populate('assignedBus')
      .populate('pickupPoint');

    return res.status(200).json({
      success: true,
      message: 'Student updated successfully',
      data: student
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete student
// @route   DELETE /api/students/:id
// @access  Private (Admin only)
exports.deleteStudent = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    await student.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Student deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
