const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);

router.get('/', notificationController.getNotifications);
router.post('/', authorize('admin'), notificationController.createNotification);
router.put('/:id/read', notificationController.markAsRead);
router.delete('/:id', authorize('admin'), notificationController.deleteNotification);

module.exports = router;
