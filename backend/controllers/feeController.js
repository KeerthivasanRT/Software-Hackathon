const FeeRecord = require('../models/FeeRecord');
const Student = require('../models/Student');

// @desc    Get fee records
// @route   GET /api/fees
// @access  Private
exports.getFees = async (req, res, next) => {
  try {
    const { student, semester, paymentStatus } = req.query;
    let query = {};

    if (student) query.student = student;
    if (semester) query.semester = semester;
    if (paymentStatus) query.paymentStatus = paymentStatus;

    // Student Role Scoping: Only view own fees
    if (req.user && req.user.role === 'student') {
      const studentDoc = await Student.findOne({ email: req.user.email });
      if (studentDoc) query.student = studentDoc._id;
    }

    const records = await FeeRecord.find(query)
      .populate('student', 'name registerNumber department email phone')
      .populate('route', 'routeCode routeName startingPoint')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: records.length,
      data: records
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create / Assign Fee Record
// @route   POST /api/fees
// @access  Private (Admin only)
exports.createFee = async (req, res, next) => {
  try {
    const { student, semester, academicYear, feeAmount, paidAmount } = req.body;

    const studentDoc = await Student.findById(student);
    if (!studentDoc) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const existing = await FeeRecord.findOne({ student, semester, academicYear: academicYear || '2025-2026' });
    if (existing) {
      return res.status(400).json({ success: false, message: `Fee record for ${semester} already exists for this student` });
    }

    const paid = paidAmount || 0;
    const balance = feeAmount - paid;
    let status = 'Pending';
    if (balance <= 0) status = 'Paid';
    else if (paid > 0) status = 'Partial';

    const fee = await FeeRecord.create({
      student,
      registerNumber: studentDoc.registerNumber,
      semester,
      academicYear: academicYear || '2025-2026',
      route: studentDoc.assignedRoute,
      feeAmount,
      paidAmount: paid,
      balance,
      paymentStatus: status
    });

    return res.status(201).json({
      success: true,
      message: 'Transport fee assigned successfully',
      data: fee
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update / Pay Fees
// @route   PUT /api/fees/:id
// @access  Private
exports.updateFee = async (req, res, next) => {
  try {
    let fee = await FeeRecord.findById(req.params.id);
    if (!fee) {
      return res.status(404).json({ success: false, message: 'Fee record not found' });
    }

    if (req.body.additionalPayment) {
      const newPaid = fee.paidAmount + req.body.additionalPayment;
      fee.paidAmount = newPaid;
      fee.balance = Math.max(0, fee.feeAmount - newPaid);
      fee.paymentStatus = fee.balance === 0 ? 'Paid' : 'Partial';
      fee.paymentDate = new Date();
      fee.paymentMethod = req.body.paymentMethod || fee.paymentMethod;
      fee.transactionId = req.body.transactionId || `TXN-FEE-${Date.now()}`;
      await fee.save();
    } else {
      fee = await FeeRecord.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
      }).populate('student');
    }

    return res.status(200).json({
      success: true,
      message: 'Fee record updated',
      data: fee
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete Fee Record
// @route   DELETE /api/fees/:id
// @access  Private (Admin only)
exports.deleteFee = async (req, res, next) => {
  try {
    const fee = await FeeRecord.findById(req.params.id);
    if (!fee) {
      return res.status(404).json({ success: false, message: 'Fee record not found' });
    }

    await fee.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Fee record deleted'
    });
  } catch (error) {
    next(error);
  }
};
