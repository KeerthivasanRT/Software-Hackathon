const express = require('express');
const router = express.Router();
const pickupPointController = require('../controllers/pickupPointController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);

router.get('/', pickupPointController.getPickupPoints);
router.get('/:id', pickupPointController.getPickupPointById);
router.post('/', authorize('admin'), pickupPointController.createPickupPoint);
router.put('/:id', authorize('admin'), pickupPointController.updatePickupPoint);
router.delete('/:id', authorize('admin'), pickupPointController.deletePickupPoint);

module.exports = router;
