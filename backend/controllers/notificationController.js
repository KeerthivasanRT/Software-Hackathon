const Notification = require('../models/Notification');

// @desc    Get notifications for user/role & unread count
// @route   GET /api/notifications
// @access  Private
exports.getNotifications = async (req, res, next) => {
  try {
    const role = req.user ? req.user.role.charAt(0).toUpperCase() + req.user.role.slice(1) : 'All';
    const userId = req.user ? req.user.id : null;

    const notifications = await Notification.find({
      $or: [
        { receiverRole: 'All' },
        { receiverRole: role },
        { receiverId: userId }
      ]
    }).sort({ createdAt: -1 });

    const unreadCount = notifications.filter(n => !n.readBy.includes(userId)).length;

    return res.status(200).json({
      success: true,
      count: notifications.length,
      unreadCount,
      data: notifications
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create / Broadcast notification
// @route   POST /api/notifications
// @access  Private (Admin)
exports.createNotification = async (req, res, next) => {
  try {
    const { title, message, receiverRole, priority } = req.body;

    if (!title || !message) {
      return res.status(400).json({ success: false, message: 'Title and message are required' });
    }

    const notification = await Notification.create({
      title,
      message,
      receiverRole: receiverRole || 'All',
      priority: priority || 'Medium',
      createdBy: req.user ? req.user.id : null
    });

    return res.status(201).json({
      success: true,
      message: 'Notification broadcasted successfully',
      data: notification
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark notification as read by user
// @route   PUT /api/notifications/:id/read
// @access  Private
exports.markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    if (!notification.readBy.includes(req.user.id)) {
      notification.readBy.push(req.user.id);
      await notification.save();
    }

    return res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      data: notification
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private (Admin only)
exports.deleteNotification = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    await notification.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
