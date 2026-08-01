const mongoose = require('mongoose');

const pickupPointSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add pickup point name'],
      trim: true
    },
    latitude: {
      type: Number,
      default: 11.5034
    },
    longitude: {
      type: Number,
      default: 77.2444
    },
    route: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Route',
      default: null
    },
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
      }
    ],
    arrivalTime: {
      type: String,
      default: '07:15 AM'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('PickupPoint', pickupPointSchema);
