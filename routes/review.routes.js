const express = require('express');
const router = express.Router({ mergeParams: true }); 
const { body } = require('express-validator');
const reviewController = require('../controllers/review.controller');
const { isAuthenticated } = require('../middlewares/auth.middleware');

// --- Rutas anidadas bajo /restaurants/:restaurantId/reviews ---

/**
 * @route   POST /api/v1/restaurants/:restaurantId/reviews
 * @desc    [Usuario] Crear una reseña
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
 * @desc    [Usuario] Obtener todas las reseñas de un restaurante
 * @access  Usuario Autenticado (Cambiado de Público a Autenticado)
 */
router.get('/', isAuthenticated, reviewController.getAllByRestaurant);


// --- Rutas directas (se conectarán en index.js bajo /reviews) ---

/**
 * @route   PUT /api/v1/reviews/:id
 * @desc    [Usuario] Actualizar su propia reseña (NUEVA)
 * @access  Usuario Autenticado (Propietario)
 */
router.put(
  '/:id',
  isAuthenticated,
  [
    body('comment', 'El comentario es requerido').optional().not().isEmpty(),
    body('rating', 'El rating debe ser un número entre 1 y 5').optional().isInt({ min: 1, max: 5 }),
  ],
  reviewController.update
);


/**
 * @route   DELETE /api/v1/reviews/:id
 * @desc    [Usuario o Admin] Eliminar una reseña
 * @access  Usuario Autenticado (Propietario o Admin)
 */
router.delete('/:id', isAuthenticated, reviewController.deleteOne);


module.exports = router;