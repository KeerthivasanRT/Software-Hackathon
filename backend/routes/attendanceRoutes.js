const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);

router.get('/', attendanceController.getAttendance);
router.get('/summary', attendanceController.getAttendanceSummary);
router.post('/', authorize('driver', 'admin'), attendanceController.markAttendance);
router.put('/:id', authorize('driver', 'admin'), attendanceController.updateAttendance);
router.delete('/:id', authorize('admin'), attendanceController.deleteAttendance);

module.exports = router;
