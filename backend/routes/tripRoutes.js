const express = require('express');
const router = express.Router();
const tripHistoryController = require('../controllers/tripHistoryController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);

router.get('/', tripHistoryController.getTrips);
router.post('/', authorize('driver', 'admin'), tripHistoryController.createTrip);

module.exports = router;
