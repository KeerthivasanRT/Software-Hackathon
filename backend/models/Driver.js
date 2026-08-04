const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add driver name'],
      trim: true
    },
    employeeId: {
      type: String,
      required: [true, 'Please add employee ID'],
      unique: true,
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please add email'],
      unique: true,
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Please add phone number']
    },
    licenseNumber: {
      type: String,
      required: [true, 'Please add license number'],
      trim: true
    },
    licenseExpiry: {
      type: String,
      default: '2030-12-31'
    },
    experience: {
      type: Number,
      default: 5
    },
    address: {
      type: String,
      default: 'Sathyamangalam, Tamil Nadu'
    },
    profilePhoto: {
      type: String,
      default: ''
    },
    assignedRoute: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Route',
      default: null
    },
    assignedBus: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bus',
      default: null
    },
    salary: {
      type: Number,
      default: 28000
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Driver', driverSchema);
