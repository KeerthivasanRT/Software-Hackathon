const mongoose = require('mongoose');

const vehicleInspectionSchema = new mongoose.Schema(
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
      default: null
    },
    inspectionDate: {
      type: Date,
      default: Date.now
    },
    brakes: { type: Boolean, default: true },
    tyres: { type: Boolean, default: true },
    lights: { type: Boolean, default: true },
    horn: { type: Boolean, default: true },
    mirrors: { type: Boolean, default: true },
    fuelLevel: { type: String, default: '85%' },
    battery: { type: Boolean, default: true },
    fireExtinguisher: { type: Boolean, default: true },
    firstAidKit: { type: Boolean, default: true },
    overallStatus: {
      type: String,
      enum: ['Pass', 'Fail'],
      default: 'Pass'
    },
    remarks: {
      type: String,
      default: 'Pre-trip safety checklist cleared.'
    }
  },
  {
    timestamps: true
  }
);

vehicleInspectionSchema.index({ driver: 1, inspectionDate: 1 }, { unique: false });

module.exports = mongoose.model('VehicleInspection', vehicleInspectionSchema);
