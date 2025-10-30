const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const categoryController = require('../controllers/category.controller');
const { isAdmin } = require('../middlewares/auth.middleware'); // <-- ¡El guardián!

// TODAS las rutas en este archivo requerirán ser administrador.
router.use(isAdmin);

/**
 * @route   POST /api/v1/categories
 * @desc    Crear una nueva categoría (Solo Admin)
 */
router.post(
  '/',
  [
    body('name', 'El nombre es requerido').not().isEmpty(),
    body('description', 'La descripción es opcional').optional().isString(),
  ],
  categoryController.create
);

/**
 * @route   GET /api/v1/categories
 * @desc    Obtener todas las categorías (Solo Admin)
 * @note    Podríamos querer una ruta PÚBLICA para esto.
 * Si es así, la moveríamos a otro archivo o le quitaríamos 'isAdmin'.
 * Por ahora, seguimos los requisitos (gestión de admin).
 */
router.get('/', categoryController.getAll);

/**
 * @route   GET /api/v1/categories/:id
 * @desc    Obtener una categoría por ID (Solo Admin)
 */
router.get('/:id', categoryController.getOne);

/**
 * @route   PUT /api/v1/categories/:id
 * @desc    Actualizar una categoría (Solo Admin)
 */
router.put(
  '/:id',
  [body('name', 'El nombre es requerido').not().isEmpty()],
  categoryController.update
);

/**
 * @route   DELETE /api/v1/categories/:id
 * @desc    Eliminar una categoría (Solo Admin)
 */
router.delete('/:id', categoryController.deleteOne);

module.exports = router;