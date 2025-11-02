// routes/auth.routes.js

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/auth.controller');

// --- (INICIO) DEFINICIÓN DE TODOS LOS ESQUEMAS ---
// Pondremos todos nuestros modelos de datos aquí

/**
 * @swagger
 * components:
 * schemas:
 *
 * # ---- Esquemas de Autenticación ----
 * UserRegister:
 * type: object
 * required:
 * - username
 * - email
 * - password
 * properties:
 * username:
 * type: string
 * description: Nombre de usuario.
 * email:
 * type: string
 * description: Email del usuario (debe ser único).
 * password:
 * type: string
 * description: Contraseña (mínimo 6 caracteres).
 *
 * UserLogin:
 * type: object
 * required:
 * - email
 * - password
 * properties:
 * email:
 * type: string
 * password:
 * type: string
 *
 * AuthResponse:
 * type: object
 * properties:
 * token:
 * type: string
 * description: JSON Web Token para autenticación.
 *
 * # ---- Esquemas de Categorías ----
 * Category:
 * type: object
 * required:
 * - name
 * properties:
 * _id:
 * type: string
 * description: El ID auto-generado por MongoDB.
 * name:
 * type: string
 * description: El nombre de la categoría (ej. "Comida Rápida").
 * description:
 * type: string
 * description: Una descripción opcional de la categoría.
 *
 * CategoryInput:
 * type: object
 * required:
 * - name
 * properties:
 * name:
 * type: string
 * description: El nombre de la categoría.
 * description:
 * type: string
 * description: Una descripción opcional.
 */
// --- (FIN) DEFINICIÓN DE TODOS LOS ESQUEMAS ---


// --- Documentación de Rutas de Autenticación ---

/**
 * @swagger
 * /auth/register:
 * post:
 * summary: Registrar un nuevo usuario.
 * tags: [Autenticación]
 * description: Crea una nueva cuenta de usuario con rol 'usuario'.
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/UserRegister'
 * responses:
 * '201':
 * description: Usuario registrado exitosamente. Devuelve un token JWT.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/AuthResponse'
 * '400':
 * description: Datos de entrada inválidos.
 * '409':
 * description: El correo electrónico ya está registrado.
 * security: []
 */
router.post(
  '/register',
  [
    body('username', 'El nombre de usuario es requerido').not().isEmpty(),
    body('email', 'Por favor incluye un email válido').isEmail(),
    body('password', 'La contraseña debe tener al menos 6 caracteres').isLength({ min: 6 }),
  ],
  authController.register
);

/**
 * @swagger
 * /auth/login:
 * post:
 * summary: Iniciar sesión.
 * tags: [Autenticación]
 * description: Autentica a un usuario y devuelve un token JWT.
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/UserLogin'
 * responses:
 * '200':
 * description: Inicio de sesión exitoso. Devuelve un token JWT.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/AuthResponse'
 * '401':
 * description: Credenciales inválidas.
 * security: []
 */
router.post(
  '/login',
  [
    body('email', 'Por favor incluye un email válido').isEmail(),
    body('password', 'La contraseña es requerida').exists(),
  ],
  authController.login
);

module.exports = router;