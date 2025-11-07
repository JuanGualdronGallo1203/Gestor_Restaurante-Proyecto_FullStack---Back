const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const restaurantController = require('../controllers/restaurant.controller');
const { isAuthenticated } = require('../middlewares/auth.middleware');

router.get('/', isAuthenticated, restaurantController.getAll);

router.get('/:id', isAuthenticated, restaurantController.getOne);


router.post('/:id', isAuthenticated, )
