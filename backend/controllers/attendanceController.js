const Attendance = require('../models/Attendance');
const Student = require('../models/Student');

// @desc    Get attendance records (with filters & summary)
// @route   GET /api/attendance
// @access  Private
exports.getAttendance = async (req, res, next) => {
  try {
    const { student, route, bus, driver, date, status } = req.query;
    let query = {};

    if (student) query.student = student;
    if (route) query.route = route;
    if (bus) query.bus = bus;
    if (driver) query.driver = driver;
    if (status) query.status = status;
    if (date) {
      const searchDate = new Date(date);
      const startDate = new Date(searchDate.setHours(0, 0, 0, 0));
      const endDate = new Date(searchDate.setHours(23, 59, 59, 999));
      query.date = { $gte: startDate, $lte: endDate };
    }

    // Role-based scoping
    if (req.user && req.user.role === 'student') {
      const studentDoc = await Student.findOne({ email: req.user.email });
      if (studentDoc) {
        query.student = studentDoc._id;
      }
    }

    const records = await Attendance.find(query)
      .populate('student', 'name registerNumber department year email phone')
      .populate('driver', 'name employeeId phone')
      .populate('route', 'routeCode routeName startingPoint')
      .populate('bus', 'busNumber registrationNumber')
      .populate('pickupPoint', 'name arrivalTime')
      .sort({ date: -1 });

    return res.status(200).json({
      success: true,
      count: records.length,
      data: records
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get attendance summary & percentage for a student or overall
// @route   GET /api/attendance/summary
// @access  Private
exports.getAttendanceSummary = async (req, res, next) => {
  try {
    let studentId = req.query.student;

    if (req.user && req.user.role === 'student') {
      const studentDoc = await Student.findOne({ email: req.user.email });
      if (studentDoc) studentId = studentDoc._id;
    }

    let match = {};
    if (studentId) match.student = new mongoose.Types.ObjectId(studentId);

    const totalDays = await Attendance.countDocuments(match);
    const presentDays = await Attendance.countDocuments({ ...match, status: 'Present' });
    const absentDays = await Attendance.countDocuments({ ...match, status: 'Absent' });
    const lateDays = await Attendance.countDocuments({ ...match, status: 'Late' });

    const percentage = totalDays > 0 ? Math.round(((presentDays + lateDays) / totalDays) * 100) : 100;

    return res.status(200).json({
      success: true,
      summary: {
        totalDays,
        presentDays,
        absentDays,
        lateDays,
        attendancePercentage: `${percentage}%`
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark / Create attendance (Single or Bulk)
// @route   POST /api/attendance
// @access  Private (Driver or Admin)
exports.markAttendance = async (req, res, next) => {
  try {
    const { attendances } = req.body; // Array or single object

    if (Array.isArray(attendances)) {
      const results = [];
      for (const item of attendances) {
        const record = await Attendance.findOneAndUpdate(
          { student: item.student, date: item.date ? new Date(item.date) : new Date() },
          item,
          { upsert: true, new: true, runValidators: true }
        );
        results.push(record);
      }
      return res.status(201).json({
        success: true,
        message: 'Bulk attendance recorded successfully',
        count: results.length,
        data: results
      });
    } else {
      const { student, driver, route, bus, pickupPoint, date, time, status, remarks } = req.body;
      const record = await Attendance.findOneAndUpdate(
        { student, date: date ? new Date(date) : new Date() },
        { student, driver, route, bus, pickupPoint, date: date || new Date(), time: time || '07:42 AM', status: status || 'Present', remarks: remarks || '' },
        { upsert: true, new: true, runValidators: true }
      );

      return res.status(201).json({
        success: true,
        message: 'Attendance recorded successfully',
        data: record
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update attendance
// @route   PUT /api/attendance/:id
// @access  Private (Driver or Admin)
exports.updateAttendance = async (req, res, next) => {
  try {
    let record = await Attendance.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, message: 'Attendance record not found' });
    }

    record = await Attendance.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('student').populate('route').populate('bus');

    return res.status(200).json({
      success: true,
      message: 'Attendance record updated',
      data: record
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete attendance
// @route   DELETE /api/attendance/:id
// @access  Private (Admin only)
exports.deleteAttendance = async (req, res, next) => {
  try {
    const record = await Attendance.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, message: 'Attendance record not found' });
    }

    await record.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Attendance record deleted'
    });
  } catch (error) {
    next(error);
  }
};
