const express = require('express');
const router = express.Router();
const maintenanceController = require('../controllers/maintenanceController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);

router.get('/', maintenanceController.getMaintenanceRequests);
router.post('/', authorize('driver', 'admin'), maintenanceController.createMaintenanceRequest);
router.put('/:id', authorize('admin'), maintenanceController.updateMaintenanceRequest);
router.delete('/:id', authorize('admin'), maintenanceController.deleteMaintenanceRequest);

module.exports = router;
