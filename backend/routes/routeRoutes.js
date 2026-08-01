const express = require('express');
const router = express.Router();
const routeController = require('../controllers/routeController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);

router.get('/', routeController.getRoutes);
router.get('/:id', routeController.getRouteById);
router.post('/', authorize('admin'), routeController.createRoute);
router.put('/:id', authorize('admin'), routeController.updateRoute);
router.delete('/:id', authorize('admin'), routeController.deleteRoute);

module.exports = router;
