// routes/dish.routes.js

const express = require('express');
// ¡Importante! 'mergeParams: true' permite que este router
// acceda a los parámetros de la ruta padre (como :restaurantId)
const router = express.Router({ mergeParams: true });

const { body } = require('express-validator');
const dishController = require('../controllers/dish.controller');
const { isAdmin, isAuthenticated } = require('../middlewares/auth.middleware'); // Asegúrate de tener 'isAuthenticated' si lo necesitas para 'GET'

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
    // Validación de URL añadida
    body('imageUrl', 'Debe ser una URL válida').optional().isURL(),
  ],
  dishController.create
);

/**
 * @route   GET /api/v1/restaurants/:restaurantId/dishes
 * @desc    Obtener todos los platos de un restaurante
 * @access  Usuario Autenticado (como definimos en la lógica del frontend)
 */
// Nota: El middleware 'isAuthenticated' se aplica en las rutas de 'restaurants',
// así que si el usuario ya está autenticado para ver la página de detalle,
// esta ruta funcionará. Si no, tendrías que añadir 'isAuthenticated' aquí.
router.get('/', dishController.getAllByRestaurant);

// --- Rutas que no dependen del restaurante (operan por ID de plato) ---

/**
 * @route   GET /api/v1/dishes/:id
 * @desc    Obtener un platillo por su ID (para el modal de editar)
 * @access  Admin
 */
router.get('/:id', isAdmin, dishController.getOne);

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
    // Validación de URL añadida
    body('imageUrl', 'Debe ser una URL válida').optional().isURL(),
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