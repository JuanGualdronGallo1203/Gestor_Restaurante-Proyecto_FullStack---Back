const swaggerJsdoc = require('swagger-jsdoc');
require('dotenv').config(); // Para leer el PORT

// Opciones de configuración para swagger-jsdoc
const options = {
  // 1. Definición principal de la API
  swaggerDefinition: {
    openapi: '3.0.0', // Especificación de OpenAPI
    info: {
      title: 'API de Reseñas de Restaurantes',
      version: '1.0.0',
      description:
        'API backend para la aplicación de reseñas de restaurantes y platillos. \
         Construida con Node.js, Express y MongoDB.',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3001}/api/v1`,
        description: 'Servidor de Desarrollo',
      },
    ],
    
    // --- ¡NUEVO! DEFINICIÓN GLOBAL DE TAGS ---
    // Aquí definimos todas las secciones de nuestra API
    tags: [
      {
        name: 'Autenticación',
        description: 'API para registro e inicio de sesión.'
      },
      {
        name: 'Categorías',
        description: 'API para la gestión de categorías (Solo Admin).'
      }
      // (Aquí añadiremos 'Restaurantes', 'Platos', etc. después)
    ],
    // ------------------------------------------

    components: {
      securitySchemes: {
        BearerAuth: { 
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Ingresa el token JWT (sin el prefijo "Bearer ")'
        }
      }
    },
    security: [
      {
        BearerAuth: [] 
      }
    ]
  },
  // 2. Dónde buscar los comentarios de la API
  apis: ['./routes/*.js'], 
};

// Generar las especificaciones de Swagger
const swaggerSpecs = swaggerJsdoc(options);

module.exports = swaggerSpecs;