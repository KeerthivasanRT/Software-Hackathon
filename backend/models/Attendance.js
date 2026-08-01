const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Student is required']
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Driver',
      default: null
    },
    route: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Route',
      default: null
    },
    bus: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bus',
      default: null
    },
    pickupPoint: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PickupPoint',
      default: null
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      default: Date.now
    },
    time: {
      type: String,
      default: '07:42 AM'
    },
    status: {
      type: String,
      enum: ['Present', 'Absent', 'Late'],
      default: 'Present'
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

// One attendance record per student per day
attendanceSchema.index({ student: 1, date: 1 }, { unique: false });

module.exports = mongoose.model('Attendance', attendanceSchema);
