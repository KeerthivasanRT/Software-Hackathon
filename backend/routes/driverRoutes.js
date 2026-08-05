const express = require('express');
const router = express.Router();
const driverController = require('../controllers/driverController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);

router.get('/me/dashboard', driverController.getMyDashboard);
router.get('/me', driverController.getDriverMe);
router.get('/profile', driverController.getDriverProfile);
router.put('/profile', driverController.updateDriverProfile);
router.get('/', driverController.getDrivers);
router.get('/:id', driverController.getDriverById);
router.post('/', authorize('admin'), driverController.createDriver);
router.put('/:id', authorize('admin'), driverController.updateDriver);
router.delete('/:id', authorize('admin'), driverController.deleteDriver);

module.exports = router;
