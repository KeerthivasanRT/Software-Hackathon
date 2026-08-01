const express = require('express');
const router = express.Router();
const inspectionController = require('../controllers/inspectionController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);

router.get('/', inspectionController.getInspections);
router.post('/', authorize('driver', 'admin'), inspectionController.createInspection);
router.delete('/:id', authorize('admin'), inspectionController.deleteInspection);

module.exports = router;
