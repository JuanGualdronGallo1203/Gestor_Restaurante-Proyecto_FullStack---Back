const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const restaurantController = require('../controllers/restaurant.controller');
const { isAdmin, isAuthenticated } = require('../middlewares/auth.middleware');

// --- Rutas Públicas (Sin autenticación) ---

/**
 * @route   GET /api/v1/restaurants
 * @desc    Obtener lista de restaurantes (solo aprobados)
 * @access  Public
 */
router.get('/', restaurantController.getAll);

/**
 * @route   GET /api/v1/restaurants/:id
 * @desc    Obtener un restaurante por ID (solo si está aprobado)
 * @access  Public
 */
router.get('/:id', restaurantController.getOne);


// --- Rutas de Usuario (Requiere estar logueado) ---

/**
 * @route   POST /api/v1/restaurants
 * @desc    Crear un nuevo restaurante (queda pendiente)
 * @access  Usuario Autenticado
 */
router.post(
  '/',
  isAuthenticated, // <-- Solo usuarios logueados
  [
    body('name', 'El nombre es requerido').not().isEmpty(),
    body('description', 'La descripción es requerida').not().isEmpty(),
    body('categoryId', 'El ID de la categoría es requerido').isMongoId(),
  ],
  restaurantController.create
);


// --- Rutas de Administrador (Requiere rol de admin) ---

/**
 * @route   PATCH /api/v1/restaurants/:id/approve
 * @desc    Aprobar un restaurante (Solo Admin)
 * @access  Admin
 */
router.patch('/:id/approve', isAdmin, restaurantController.approve);

/**
 * @route   PUT /api/v1/restaurants/:id
 * @desc    Actualizar un restaurante (Solo Admin)
 * @access  Admin
 */
router.put(
  '/:id',
  isAdmin,
  [
    body('name', 'El nombre es requerido').optional().not().isEmpty(),
    body('description', 'La descripción es requerida').optional().not().isEmpty(),
    body('categoryId', 'El ID de la categoría es requerido').optional().isMongoId(),
  ],
  restaurantController.update
);

/**
 * @route   DELETE /api/v1/restaurants/:id
 * @desc    Eliminar un restaurante (Solo Admin)
 * @access  Admin
 */
router.delete('/:id', isAdmin, restaurantController.deleteOne);

module.exports = router;