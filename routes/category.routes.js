// routes/category.routes.js

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const categoryController = require('../controllers/category.controller');
const { isAdmin } = require('../middlewares/auth.middleware');

// --- Documentación de Rutas de Categorías ---
// (No se definen 'components' ni 'tags:' aquí)

/**
 * @swagger
 * /categories:
 * post:
 * summary: Crear una nueva categoría.
 * tags: [Categorías]
 * description: Crea una nueva categoría para los restaurantes (Solo Admin).
 * security:
 * - BearerAuth: [] # Esta ruta requiere autenticación JWT
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/CategoryInput' # Referencia al schema definido en auth.routes.js
 * responses:
 * '201':
 * description: Categoría creada exitosamente.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Category' # Referencia al schema definido en auth.routes.js
 * '400':
 * description: Datos de entrada inválidos.
 * '401':
 * description: No autorizado (Token inválido o no provisto).
 * '403':
 * description: Acceso denegado (No es administrador).
 * '409':
 * description: Ya existe una categoría con ese nombre.
 */
router.post(
  '/',
  isAdmin,
  [
    body('name', 'El nombre es requerido').not().isEmpty(),
    body('description', 'La descripción es opcional').optional().isString(),
  ],
  categoryController.create
);

/**
 * @swagger
 * /categories:
 * get:
 * summary: Obtener todas las categorías.
 * tags: [Categorías]
 * description: Devuelve una lista de todas las categorías (Solo Admin).
 * security:
 * - BearerAuth: []
 * responses:
 * '200':
 * description: Lista de categorías.
 * content:
 * application/json:
 * schema:
 * type: array
 * items:
 * $ref: '#/components/schemas/Category'
 * '401':
 * description: No autorizado.
 * '403':
 * description: Acceso denegado (No es administrador).
 */
router.get('/', isAdmin, categoryController.getAll);

/**
 * @swagger
 * /categories/{id}:
 * get:
 * summary: Obtener una categoría por ID.
 * tags: [Categorías]
 * description: Devuelve los detalles de una categoría específica (Solo Admin).
 * security:
 * - BearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * description: El ID de la categoría.
 * responses:
 * '200':
 * description: Detalles de la categoría.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Category'
 * '401':
 * description: No autorizado.
 * '403':
 * description: Acceso denegado.
 * '404':
 * description: Categoría no encontrada.
 */
router.get('/:id', isAdmin, categoryController.getOne);

/**
 * @swagger
 * /categories/{id}:
 * put:
 * summary: Actualizar una categoría.
 * tags: [Categorías]
 * description: Actualiza los detalles de una categoría (Solo Admin).
 * security:
 * - BearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * description: El ID de la categoría a actualizar.
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/CategoryInput'
 * responses:
 * '200':
 * description: Categoría actualizada.
 * '400':
 * description: Datos inválidos o ID inválido.
 * '401':
 * description: No autorizado.
 * '403':
 * description: Acceso denegado.
 * '404':
 * description: Categoría no encontrada.
 */
router.put(
  '/:id',
  isAdmin,
  [body('name', 'El nombre es requerido').not().isEmpty()],
  categoryController.update
);

/**
 * @swagger
 * /categories/{id}:
 * delete:
 * summary: Eliminar una categoría.
 * tags: [Categorías]
 * description: Elimina una categoría por su ID (Solo Admin).
 * security:
 * - BearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * description: El ID de la categoría a eliminar.
 * responses:
 * '200':
 * description: Categoría eliminada exitosamente.
 * '401':
 * description: No autorizado.
 * '403':
 * description: Acceso denegado.
 * '404':
 * description: Categoría no encontrada.
 */
router.delete('/:id', isAdmin, categoryController.deleteOne);

module.exports = router;