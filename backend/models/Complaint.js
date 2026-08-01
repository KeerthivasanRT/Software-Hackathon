const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Student reference is required']
    },
    title: {
      type: String,
      required: [true, 'Complaint title is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Complaint description is required'],
      trim: true
    },
    category: {
      type: String,
      enum: ['Driver Behaviour', 'Bus Delay', 'Bus Cleanliness', 'Safety', 'Route Issue', 'Seat Damage', 'Other'],
      default: 'Bus Delay'
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Resolved', 'Rejected'],
      default: 'Pending'
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Urgent'],
      default: 'Medium'
    },
    route: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Route',
      default: null
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Driver',
      default: null
    },
    adminRemarks: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Complaint', complaintSchema);
