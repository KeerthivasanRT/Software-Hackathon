const express = require('express');
const router = express.Router();
const salaryController = require('../controllers/salaryController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);

router.get('/', salaryController.getSalaries);
router.post('/', authorize('admin'), salaryController.createSalary);
router.put('/:id', authorize('admin'), salaryController.updateSalary);
router.delete('/:id', authorize('admin'), salaryController.deleteSalary);

module.exports = router;
