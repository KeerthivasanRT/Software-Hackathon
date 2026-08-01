const mongoose = require('mongoose');

const emergencySOSSchema = new mongoose.Schema(
  {
    triggeredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User triggering SOS is required']
    },
    role: {
      type: String,
      enum: ['student', 'driver', 'admin'],
      required: [true, 'Role is required']
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
    location: {
      latitude: { type: Number, default: 11.5034 },
      longitude: { type: Number, default: 77.2444 },
      name: { type: String, default: 'BIT Sathyamangalam Highway' }
    },
    emergencyType: {
      type: String,
      enum: ['Medical Emergency', 'Vehicle Breakdown', 'Accident', 'Student Safety', 'Harassment', 'Fire', 'Other'],
      required: [true, 'Emergency type is required']
    },
    description: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['Active', 'Acknowledged', 'Resolved'],
      default: 'Active'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('EmergencySOS', emergencySOSSchema);
