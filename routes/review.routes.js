const express = require('express');
// mergeParams: true es VITAL para acceder a :restaurantId
const router = express.Router({ mergeParams: true }); 
const { body } = require('express-validator');
const reviewController = require('../controllers/review.controller');
const { isAuthenticated } = require('../middlewares/auth.middleware');

// --- Rutas anidadas bajo /restaurants/:restaurantId/reviews ---

/**
 * @route   POST /api/v1/restaurants/:restaurantId/reviews
 * @desc    Crear una nueva reseña para un restaurante
 * @access  Usuario Autenticado
 */
router.post(
  '/',
  isAuthenticated,
  [
    body('comment', 'El comentario es requerido').not().isEmpty(),
    body('rating', 'El rating debe ser un número entre 1 y 5').isInt({ min: 1, max: 5 }),
  ],
  reviewController.create
);

/**
 * @route   GET /api/v1/restaurants/:restaurantId/reviews
 * @desc    Obtener todas las reseñas de un restaurante
 * @access  Public
 */
router.get('/', reviewController.getAllByRestaurant);


// --- Rutas directas (se conectarán en index.js bajo /reviews) ---

/**
 * @route   DELETE /api/v1/reviews/:id
 * @desc    Eliminar una reseña (solo el propietario)
 * @access  Usuario Autenticado (Propietario)
 */
router.delete('/:id', isAuthenticated, reviewController.deleteOne);

/**
 * @route   POST /api/v1/reviews/:id/like
 * @desc    Dar 'like' a una reseña
 * @access  Usuario Autenticado
 */
router.post('/:id/like', isAuthenticated, reviewController.like);

/**
 * @route   POST /api/v1/reviews/:id/dislike
 * @desc    Dar 'dislike' a una reseña
 * @access  Usuario Autenticado
 */
router.post('/:id/dislike', isAuthenticated, reviewController.dislike);

module.exports = router;