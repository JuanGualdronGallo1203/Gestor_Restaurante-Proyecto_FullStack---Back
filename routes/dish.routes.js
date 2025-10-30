const express = require('express');
// ¡Importante! 'mergeParams: true' permite que este router
// acceda a los parámetros de la ruta padre (como :restaurantId)
const router = express.Router({ mergeParams: true });

const { body } = require('express-validator');
const dishController = require('../controllers/dish.controller');
const { isAdmin } = require('../middlewares/auth.middleware');

/**
 * @route   POST /api/v1/restaurants/:restaurantId/dishes
 * @desc    Crear un nuevo plato para un restaurante (Solo Admin)
 * @access  Admin
 */
router.post(
  '/',
  isAdmin,
  [
    body('name', 'El nombre es requerido').not().isEmpty(),
    body('price', 'El precio debe ser un número').isNumeric(),
    body('description', 'La descripción es opcional').optional().isString(),
  ],
  dishController.create
);

/**
 * @route   GET /api/v1/restaurants/:restaurantId/dishes
 * @desc    Obtener todos los platos de un restaurante
 * @access  Public
 */
router.get('/', dishController.getAllByRestaurant);

// --- Rutas que no dependen del restaurante (operan por ID de plato) ---

/**
 * @route   PUT /api/v1/dishes/:id
 * @desc    Actualizar un plato por su ID (Solo Admin)
 * @access  Admin
 */
router.put(
  '/:id',
  isAdmin,
  [
    body('name', 'El nombre es requerido').optional().not().isEmpty(),
    body('price', 'El precio debe ser un número').optional().isNumeric(),
  ],
  dishController.update
);

/**
 * @route   DELETE /api/v1/dishes/:id
 * @desc    Eliminar un plato por su ID (Solo Admin)
 * @access  Admin
 */
router.delete('/:id', isAdmin, dishController.deleteOne);

module.exports = router;