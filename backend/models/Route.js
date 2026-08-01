const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema(
  {
    routeCode: {
      type: String,
      required: [true, 'Please add route code'],
      unique: true,
      trim: true
    },
    routeName: {
      type: String,
      required: [true, 'Please add route name'],
      trim: true
    },
    startingPoint: {
      type: String,
      required: [true, 'Please add starting point']
    },
    destination: {
      type: String,
      default: 'BIT Campus, Sathyamangalam'
    },
    distance: {
      type: Number,
      default: 45
    },
    estimatedTime: {
      type: String,
      default: '1 hr 15 mins'
    },
    stops: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PickupPoint'
      }
    ],
    assignedBus: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bus',
      default: null
    },
    assignedDriver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Driver',
      default: null
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'maintenance'],
      default: 'active'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Route', routeSchema);
