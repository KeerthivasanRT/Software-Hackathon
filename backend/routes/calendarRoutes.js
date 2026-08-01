const express = require('express');
const router = express.Router();
const calendarController = require('../controllers/calendarController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);

router.get('/', calendarController.getEvents);
router.post('/', authorize('admin'), calendarController.createEvent);
router.put('/:id', authorize('admin'), calendarController.updateEvent);
router.delete('/:id', authorize('admin'), calendarController.deleteEvent);

module.exports = router;
