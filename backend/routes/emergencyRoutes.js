const express = require('express');
const router = express.Router();
const emergencyController = require('../controllers/emergencyController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);

router.get('/', emergencyController.getEmergencies);
router.post('/', emergencyController.triggerSOS);
router.put('/:id', authorize('admin'), emergencyController.updateEmergencyStatus);
router.delete('/:id', authorize('admin'), emergencyController.deleteEmergency);

module.exports = router;
