const mongoose = require('mongoose');

const salarySchema = new mongoose.Schema(
  {
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Driver',
      required: [true, 'Driver reference is required']
    },
    employeeId: {
      type: String,
      required: [true, 'Employee ID is required']
    },
    month: {
      type: String,
      required: [true, 'Month is required'] // e.g. 'July'
    },
    year: {
      type: Number,
      required: [true, 'Year is required'],
      default: 2026
    },
    basicSalary: {
      type: Number,
      required: [true, 'Basic salary is required']
    },
    allowance: {
      type: Number,
      default: 0
    },
    deduction: {
      type: Number,
      default: 0
    },
    bonus: {
      type: Number,
      default: 0
    },
    netSalary: {
      type: Number,
      required: [true, 'Net salary is required']
    },
    paymentStatus: {
      type: String,
      enum: ['Paid', 'Pending'],
      default: 'Pending'
    },
    paymentMethod: {
      type: String,
      enum: ['Net Banking', 'UPI', 'Bank Transfer', 'Cash'],
      default: 'Bank Transfer'
    },
    transactionId: {
      type: String,
      default: ''
    },
    paymentDate: {
      type: Date,
      default: null
    },
    remarks: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

salarySchema.index({ driver: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('Salary', salarySchema);
