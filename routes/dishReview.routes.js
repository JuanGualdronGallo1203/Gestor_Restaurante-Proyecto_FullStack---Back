const express = require('express');
// mergeParams: true es VITAL para acceder a :dishId
const router = express.Router({ mergeParams: true }); 
const { body } = require('express-validator');
const dishReviewController = require('../controllers/dishReview.controller');
const { isAuthenticated } = require('../middlewares/auth.middleware');

// --- Rutas anidadas bajo /dishes/:dishId/reviews ---

/**
 * @route   POST /api/v1/dishes/:dishId/reviews
 * @desc    [Usuario] Crear una reseña de platillo
 * @access  Usuario Autenticado
 */
router.post(
  '/',
  isAuthenticated,
  [
    body('comment', 'El comentario es requerido').not().isEmpty(),
    body('rating', 'El rating debe ser un número entre 1 y 5').isInt({ min: 1, max: 5 }),
  ],
  dishReviewController.create
);

/**
 * @route   GET /api/v1/dishes/:dishId/reviews
 * @desc    [Usuario] Obtener todas las reseñas de un platillo
 * @access  Usuario Autenticado
 */
router.get('/', isAuthenticated, dishReviewController.getAllByDish);


// --- Rutas directas (se conectarán en index.js bajo /dish-reviews) ---

/**
 * @route   PUT /api/v1/dish-reviews/:id
 * @desc    [Usuario] Actualizar su propia reseña de platillo
 * @access  Usuario Autenticado (Propietario)
 */
router.put(
  '/:id',
  isAuthenticated,
  [
    body('comment', 'El comentario es requerido').optional().not().isEmpty(),
    body('rating', 'El rating debe ser un número entre 1 y 5').optional().isInt({ min: 1, max: 5 }),
  ],
  dishReviewController.update
);


/**
 * @route   DELETE /api/v1/dish-reviews/:id
 * @desc    [Usuario o Admin] Eliminar una reseña de platillo
 * @access  Usuario Autenticado (Propietario o Admin)
 */
router.delete('/:id', isAuthenticated, dishReviewController.deleteOne);

module.exports = router;