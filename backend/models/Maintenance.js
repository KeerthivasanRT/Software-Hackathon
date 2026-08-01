const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema(
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
    issueType: {
      type: String,
      enum: ['Brake Issue', 'Tyre Puncture', 'Engine', 'Cleaning', 'Electrical', 'Other'],
      default: 'Engine'
    },
    description: {
      type: String,
      required: [true, 'Description is required']
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Urgent'],
      default: 'Medium'
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Resolved', 'Rejected'],
      default: 'Pending'
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

module.exports = mongoose.model('Maintenance', maintenanceSchema);
