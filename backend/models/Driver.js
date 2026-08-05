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
    alternatePhone: {
      type: String,
      default: ''
    },
    gender: {
      type: String,
      default: 'Male'
    },
    dateOfBirth: {
      type: String,
      default: ''
    },
    bloodGroup: {
      type: String,
      default: 'O+'
    },
    address: {
      type: String,
      default: 'Sathyamangalam, Tamil Nadu'
    },
    city: {
      type: String,
      default: 'Sathyamangalam'
    },
    state: {
      type: String,
      default: 'Tamil Nadu'
    },
    pincode: {
      type: String,
      default: '638401'
    },
    emergencyContactName: {
      type: String,
      default: ''
    },
    emergencyContactNumber: {
      type: String,
      default: ''
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
    joiningDate: {
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
    shift: {
      type: String,
      default: 'Morning (06:00 AM - 02:00 PM)'
    },
    salary: {
      type: Number,
      default: 28000
    },
    department: {
      type: String,
      default: 'Transport & Fleet Logistics'
    },
    aadhaarNumber: {
      type: String,
      default: ''
    },
    drivingBadgeNumber: {
      type: String,
      default: ''
    },
    profilePhoto: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'on-duty'],
      default: 'active'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Driver', driverSchema);
