const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaintController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);

router.get('/', complaintController.getComplaints);
router.get('/:id', complaintController.getComplaintById);
router.post('/', complaintController.createComplaint);
router.put('/:id', authorize('admin'), complaintController.updateComplaint);
router.delete('/:id', authorize('admin'), complaintController.deleteComplaint);

module.exports = router;
