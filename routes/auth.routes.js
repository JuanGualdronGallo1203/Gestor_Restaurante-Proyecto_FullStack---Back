const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

// ¡Importamos el controlador real!
const authController = require('../controllers/auth.controller');

/**
 * @route   POST /api/v1/auth/register
 * @desc    Registrar un nuevo usuario
 * @access  Public
 */
router.post(
  '/register',
  [
    // Añadimos validación para 'username'
    body('username', 'El nombre de usuario es requerido').not().isEmpty(),
    body('email', 'Por favor incluye un email válido').isEmail(),
    body('password', 'La contraseña debe tener al menos 6 caracteres').isLength({ min: 6 }),
  ],
  authController.register // <-- Lo conectamos aquí
);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Autenticar (iniciar sesión) un usuario
 * @access  Public
 */
router.post(
  '/login',
  [
    // Validación
    body('email', 'Por favor incluye un email válido').isEmail(),
    body('password', 'La contraseña es requerida').exists(),
  ],
  authController.login // <-- Lo conectamos aquí
);

module.exports = router;