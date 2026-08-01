const express = require('express');
const router = express.Router();
const fuelLogController = require('../controllers/fuelLogController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);

router.get('/', fuelLogController.getFuelLogs);
router.post('/', authorize('driver', 'admin'), fuelLogController.createFuelLog);
router.delete('/:id', authorize('admin'), fuelLogController.deleteFuelLog);

module.exports = router;
