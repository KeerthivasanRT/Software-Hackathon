const express = require('express');
const router = express.Router();
const busController = require('../controllers/busController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);

router.get('/', busController.getBuses);
router.get('/:id', busController.getBusById);
router.post('/', authorize('admin'), busController.createBus);
router.put('/:id', authorize('admin'), busController.updateBus);
router.delete('/:id', authorize('admin'), busController.deleteBus);

module.exports = router;
