// routes/restaurant.routes.js

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const restaurantController = require('../controllers/restaurant.controller');
const { isAdmin, isAuthenticated } = require('../middlewares/auth.middleware');

// --- Rutas de Usuario (Requiere estar logueado) ---

/**
 * @route   GET /api/v1/restaurants
 * @desc    Obtener lista de restaurantes
 * @access  Usuario Autenticado
 */
router.get('/', isAuthenticated, restaurantController.getAll);

/**
 * @route   GET /api/v1/restaurants/:id
 * @desc    Obtener un restaurante por ID
 * @access  Usuario Autenticado
 */
router.get('/:id', isAuthenticated, restaurantController.getOne);


// --- Rutas de Administrador (Requiere rol de admin) ---

/**
 * @route   POST /api/v1/restaurants
 * @desc    Crear un nuevo restaurante (Solo Admin)
 * @access  Admin
 */
router.post(
  '/',
  isAdmin,
  [
    body('name', 'El nombre es requerido').not().isEmpty(),
    body('description', 'La descripción es requerida').not().isEmpty(),
    body('categoryId', 'El ID de la categoría es requerido').isMongoId(),
    // --- ¡LÍNEA AÑADIDA! ---
    body('imageUrl', 'Debe ser una URL válida').optional().isURL() 
  ],
  restaurantController.create
);

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
    // --- ¡LÍNEA AÑADIDA! ---
    body('imageUrl', 'Debe ser una URL válida').optional().isURL()
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