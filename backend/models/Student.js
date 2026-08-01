const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add student name'],
      trim: true
    },
    registerNumber: {
      type: String,
      required: [true, 'Please add register number'],
      unique: true,
      trim: true
    },
    department: {
      type: String,
      required: [true, 'Please add department'],
      trim: true
    },
    year: {
      type: String,
      enum: ['1st Year', '2nd Year', '3rd Year', '4th Year'],
      default: '3rd Year'
    },
    section: {
      type: String,
      default: 'A'
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
    address: {
      type: String,
      default: 'Sathyamangalam, Tamil Nadu'
    },
    pickupPoint: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PickupPoint',
      default: null
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

module.exports = mongoose.model('Student', studentSchema);
