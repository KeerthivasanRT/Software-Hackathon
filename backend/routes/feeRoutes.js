const express = require('express');
const router = express.Router();
const feeController = require('../controllers/feeController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);

router.get('/', feeController.getFees);
router.post('/', authorize('admin'), feeController.createFee);
router.put('/:id', feeController.updateFee);
router.delete('/:id', authorize('admin'), feeController.deleteFee);

module.exports = router;
