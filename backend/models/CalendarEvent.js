const mongoose = require('mongoose');

const calendarEventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    eventType: {
      type: String,
      enum: ['Holiday', 'Working Day', 'Exam', 'Special Bus', 'Maintenance', 'Placement', 'Industrial Visit'],
      default: 'Working Day'
    },
    date: {
      type: Date,
      required: [true, 'Event date is required']
    },
    startTime: {
      type: String,
      default: '08:30 AM'
    },
    endTime: {
      type: String,
      default: '05:00 PM'
    },
    applicableRole: {
      type: String,
      enum: ['All', 'Admin', 'Driver', 'Student'],
      default: 'All'
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('CalendarEvent', calendarEventSchema);
