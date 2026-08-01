const mongoose = require('mongoose');

const feeRecordSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Student reference is required']
    },
    registerNumber: {
      type: String,
      required: [true, 'Register number is required']
    },
    semester: {
      type: String,
      required: [true, 'Semester is required'] // e.g. 'Semester 6'
    },
    academicYear: {
      type: String,
      default: '2025-2026'
    },
    route: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Route',
      default: null
    },
    feeAmount: {
      type: Number,
      required: [true, 'Fee amount is required']
    },
    paidAmount: {
      type: Number,
      default: 0
    },
    balance: {
      type: Number,
      required: [true, 'Balance is required']
    },
    paymentStatus: {
      type: String,
      enum: ['Paid', 'Pending', 'Partial'],
      default: 'Pending'
    },
    paymentMethod: {
      type: String,
      enum: ['Net Banking', 'UPI', 'Debit Card', 'Credit Card', 'Cash'],
      default: 'UPI'
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

feeRecordSchema.index({ student: 1, semester: 1, academicYear: 1 }, { unique: true });

module.exports = mongoose.model('FeeRecord', feeRecordSchema);
