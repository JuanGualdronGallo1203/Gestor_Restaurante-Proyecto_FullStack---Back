const express = require('express');
const router = express.Router();
const authRoutes = require('./auth.routes');
const categoryRoutes = require('./category.routes');
const restaurantRoutes = require('./restaurant.routes');
const dishRoutes = require('./dish.routes');
const reviewRoutes = require('./review.routes');
const dishReviewRoutes = require('./dishReview.routes');

router.use('/auth', authRoutes);
router.use('/categories', categoryRoutes);
router.use('/restaurants', restaurantRoutes);
router.use('/restaurants/:restaurantId/dishes', dishRoutes);
router.use('/dishes', dishRoutes);
router.use('/restaurants/:restaurantId/reviews', reviewRoutes);
router.use('/reviews', reviewRoutes);
router.use('/dishes/:dishId/reviews', dishReviewRoutes);
router.use('/dish-reviews', dishReviewRoutes);

module.exports = router;