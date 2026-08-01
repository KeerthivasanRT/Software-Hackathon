const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect); // Require JWT for all endpoints

router.get('/', studentController.getStudents);
router.get('/:id', studentController.getStudentById);
router.post('/', authorize('admin'), studentController.createStudent);
router.put('/:id', authorize('admin'), studentController.updateStudent);
router.delete('/:id', authorize('admin'), studentController.deleteStudent);

module.exports = router;
