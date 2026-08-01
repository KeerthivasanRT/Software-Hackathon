const mongoose = require('mongoose');

const fuelLogSchema = new mongoose.Schema(
  {
    bus: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bus',
      required: [true, 'Bus reference is required']
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Driver',
      required: [true, 'Driver reference is required']
    },
    route: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Route',
      default: null
    },
    date: {
      type: Date,
      default: Date.now
    },
    fuelAdded: {
      type: Number,
      required: [true, 'Fuel quantity (liters) is required'],
      min: [0, 'Fuel added cannot be negative']
    },
    fuelCost: {
      type: Number,
      required: [true, 'Fuel cost is required'],
      min: [0, 'Fuel cost cannot be negative']
    },
    odometer: {
      type: Number,
      required: [true, 'Odometer reading is required']
    },
    mileage: {
      type: Number,
      default: 4.8 // km per liter
    },
    fuelStation: {
      type: String,
      default: 'BIT Campus Fuel Outlet, Sathyamangalam'
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

module.exports = mongoose.model('FuelLog', fuelLogSchema);
