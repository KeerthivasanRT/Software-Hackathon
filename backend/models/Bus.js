const mongoose = require('mongoose');

const busSchema = new mongoose.Schema(
  {
    busNumber: {
      type: String,
      required: [true, 'Please add bus number'],
      unique: true,
      trim: true
    },
    registrationNumber: {
      type: String,
      required: [true, 'Please add registration number'],
      trim: true
    },
    capacity: {
      type: Number,
      default: 55
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
    status: {
      type: String,
      enum: ['active', 'maintenance', 'inactive'],
      default: 'active'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Bus', busSchema);
