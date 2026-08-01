const CalendarEvent = require('../models/CalendarEvent');

// @desc    Get Calendar Events
// @route   GET /api/calendar
// @access  Private
exports.getEvents = async (req, res, next) => {
  try {
    const role = req.user ? req.user.role.charAt(0).toUpperCase() + req.user.role.slice(1) : 'All';
    const { eventType } = req.query;

    let query = {
      $or: [{ applicableRole: 'All' }, { applicableRole: role }]
    };

    if (eventType) query.eventType = eventType;

    const events = await CalendarEvent.find(query).sort({ date: 1 });

    return res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create Calendar Event (Admin only)
// @route   POST /api/calendar
// @access  Private (Admin only)
exports.createEvent = async (req, res, next) => {
  try {
    const { title, description, eventType, date, startTime, endTime, applicableRole } = req.body;

    if (!title || !date) {
      return res.status(400).json({ success: false, message: 'Event title and date are required' });
    }

    const event = await CalendarEvent.create({
      title,
      description: description || '',
      eventType: eventType || 'Working Day',
      date: new Date(date),
      startTime: startTime || '08:30 AM',
      endTime: endTime || '05:00 PM',
      applicableRole: applicableRole || 'All',
      createdBy: req.user ? req.user.id : null
    });

    return res.status(201).json({
      success: true,
      message: 'Calendar event created successfully',
      data: event
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Calendar Event
// @route   PUT /api/calendar/:id
// @access  Private (Admin only)
exports.updateEvent = async (req, res, next) => {
  try {
    let event = await CalendarEvent.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Calendar event not found' });
    }

    event = await CalendarEvent.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    return res.status(200).json({
      success: true,
      message: 'Calendar event updated',
      data: event
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete Calendar Event
// @route   DELETE /api/calendar/:id
// @access  Private (Admin only)
exports.deleteEvent = async (req, res, next) => {
  try {
    const event = await CalendarEvent.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Calendar event not found' });
    }

    await event.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Calendar event deleted'
    });
  } catch (error) {
    next(error);
  }
};
