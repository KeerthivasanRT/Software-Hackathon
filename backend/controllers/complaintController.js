const Complaint = require('../models/Complaint');
const Student = require('../models/Student');

// @desc    Get all complaints (with filters by status/category/priority)
// @route   GET /api/complaints
// @access  Private
exports.getComplaints = async (req, res, next) => {
  try {
    const { status, category, priority } = req.query;
    let query = {};

    if (status) query.status = status;
    if (category) query.category = category;
    if (priority) query.priority = priority;

    // Role-based scoping: Student views own complaints
    if (req.user && req.user.role === 'student') {
      const studentDoc = await Student.findOne({ email: req.user.email });
      if (studentDoc) {
        query.student = studentDoc._id;
      }
    }

    const complaints = await Complaint.find(query)
      .populate('student', 'name registerNumber department email phone')
      .populate('route', 'routeCode routeName startingPoint')
      .populate('driver', 'name employeeId phone')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: complaints.length,
      data: complaints
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single complaint
// @route   GET /api/complaints/:id
// @access  Private
exports.getComplaintById = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('student')
      .populate('route')
      .populate('driver');

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    return res.status(200).json({ success: true, data: complaint });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit complaint
// @route   POST /api/complaints
// @access  Private (Student)
exports.createComplaint = async (req, res, next) => {
  try {
    const { title, description, category, priority, route, driver } = req.body;

    let studentId = req.body.student;
    if (req.user && req.user.role === 'student') {
      const studentDoc = await Student.findOne({ email: req.user.email });
      if (studentDoc) studentId = studentDoc._id;
    }

    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'Title and description are required' });
    }

    const complaint = await Complaint.create({
      student: studentId,
      title,
      description,
      category: category || 'Bus Delay',
      priority: priority || 'Medium',
      route: route || null,
      driver: driver || null,
      status: 'Pending'
    });

    return res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully to Command Center',
      data: complaint
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update complaint status & adminRemarks
// @route   PUT /api/complaints/:id
// @access  Private (Admin only)
exports.updateComplaint = async (req, res, next) => {
  try {
    let complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    complaint = await Complaint.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('student').populate('route').populate('driver');

    return res.status(200).json({
      success: true,
      message: 'Complaint status updated',
      data: complaint
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete complaint
// @route   DELETE /api/complaints/:id
// @access  Private (Admin only)
exports.deleteComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    await complaint.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Complaint deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
