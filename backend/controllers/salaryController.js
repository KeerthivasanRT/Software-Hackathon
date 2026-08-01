const Salary = require('../models/Salary');
const Driver = require('../models/Driver');

// @desc    Get salary records (Filtered by Month / Driver)
// @route   GET /api/salary
// @access  Private
exports.getSalaries = async (req, res, next) => {
  try {
    const { driver, month, year, paymentStatus } = req.query;
    let query = {};

    if (driver) query.driver = driver;
    if (month) query.month = month;
    if (year) query.year = year;
    if (paymentStatus) query.paymentStatus = paymentStatus;

    // Driver Role Scoping: Only view own salary history
    if (req.user && req.user.role === 'driver') {
      const driverDoc = await Driver.findOne({ email: req.user.email });
      if (driverDoc) query.driver = driverDoc._id;
    }

    const salaries = await Salary.find(query)
      .populate('driver', 'name employeeId email phone licenseNumber salary')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: salaries.length,
      data: salaries
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create / Assign Salary Record
// @route   POST /api/salary
// @access  Private (Admin only)
exports.createSalary = async (req, res, next) => {
  try {
    const { driver, month, year, basicSalary, allowance, deduction, bonus } = req.body;

    const driverDoc = await Driver.findById(driver);
    if (!driverDoc) {
      return res.status(404).json({ success: false, message: 'Driver not found' });
    }

    const existing = await Salary.findOne({ driver, month, year });
    if (existing) {
      return res.status(400).json({ success: false, message: `Salary for ${month} ${year} already exists for this driver` });
    }

    const netSalary = (basicSalary || driverDoc.salary) + (allowance || 0) + (bonus || 0) - (deduction || 0);

    const salary = await Salary.create({
      driver,
      employeeId: driverDoc.employeeId,
      month,
      year: year || 2026,
      basicSalary: basicSalary || driverDoc.salary,
      allowance: allowance || 0,
      deduction: deduction || 0,
      bonus: bonus || 0,
      netSalary,
      paymentStatus: req.body.paymentStatus || 'Pending',
      paymentMethod: req.body.paymentMethod || 'Bank Transfer',
      remarks: req.body.remarks || ''
    });

    return res.status(201).json({
      success: true,
      message: 'Salary assigned successfully',
      data: salary
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Salary / Mark Paid
// @route   PUT /api/salary/:id
// @access  Private (Admin only)
exports.updateSalary = async (req, res, next) => {
  try {
    let salary = await Salary.findById(req.params.id);
    if (!salary) {
      return res.status(404).json({ success: false, message: 'Salary record not found' });
    }

    if (req.body.basicSalary || req.body.allowance || req.body.deduction || req.body.bonus) {
      const basic = req.body.basicSalary || salary.basicSalary;
      const allowance = req.body.allowance !== undefined ? req.body.allowance : salary.allowance;
      const bonus = req.body.bonus !== undefined ? req.body.bonus : salary.bonus;
      const deduction = req.body.deduction !== undefined ? req.body.deduction : salary.deduction;
      req.body.netSalary = basic + allowance + bonus - deduction;
    }

    if (req.body.paymentStatus === 'Paid' && !salary.paymentDate) {
      req.body.paymentDate = new Date();
      req.body.transactionId = req.body.transactionId || `TXN-SAL-${Date.now()}`;
    }

    salary = await Salary.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('driver');

    return res.status(200).json({
      success: true,
      message: 'Salary record updated',
      data: salary
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete Salary
// @route   DELETE /api/salary/:id
// @access  Private (Admin only)
exports.deleteSalary = async (req, res, next) => {
  try {
    const salary = await Salary.findById(req.params.id);
    if (!salary) {
      return res.status(404).json({ success: false, message: 'Salary record not found' });
    }

    await salary.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Salary record deleted'
    });
  } catch (error) {
    next(error);
  }
};
