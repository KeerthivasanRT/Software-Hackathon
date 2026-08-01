const mongoose = require('mongoose');

const tripHistorySchema = new mongoose.Schema(
  {
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Driver',
      required: [true, 'Driver is required']
    },
    bus: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bus',
      required: [true, 'Bus is required']
    },
    route: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Route',
      required: [true, 'Route is required']
    },
    tripDate: {
      type: Date,
      default: Date.now
    },
    startTime: {
      type: String,
      default: '06:30 AM'
    },
    endTime: {
      type: String,
      default: '08:15 AM'
    },
    distanceCovered: {
      type: Number,
      default: 45
    },
    studentsPresent: {
      type: Number,
      default: 48
    },
    studentsAbsent: {
      type: Number,
      default: 4
    },
    tripStatus: {
      type: String,
      enum: ['Completed', 'In Progress', 'Cancelled'],
      default: 'Completed'
    },
    remarks: {
      type: String,
      default: 'Morning pickup route completed on time.'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('TripHistory', tripHistorySchema);
