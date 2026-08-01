const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Validation rules
const registerValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please include a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['admin', 'driver', 'student']).withMessage('Invalid role type')
];

const loginValidation = [
  body('email').isEmail().withMessage('Please include a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

router.post('/register', registerValidation, authController.register);
router.post('/login', loginValidation, authController.login);

router.get('/profile', protect, authController.getProfile);
router.put('/profile', protect, authController.updateProfile);
router.post('/change-password', protect, authController.changePassword);

module.exports = router;
