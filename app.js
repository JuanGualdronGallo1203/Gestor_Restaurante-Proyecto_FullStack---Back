// app.js

const express = require('express');
const cors = require('cors');
const passport = require('passport');
const rateLimit = require('express-rate-limit');

// --- ¡NUEVO: Imports de Swagger! ---
//const swaggerUi = require('swagger-ui-express');
//const swaggerSpecs = require('./config/swagger'); // Importamos nuestra config

// Importamos la app de Express
const app = express();

// --- Middlewares Globales ---
app.use(cors({
  origin: 'http://127.0.0.1:5500', // Permite SOLO a tu frontend
  methods: 'GET,POST,PUT,DELETE,PATCH', // Permite todos los métodos que usamos
  allowedHeaders: 'Content-Type, Authorization' // Permite los headers que enviamos
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Passport
app.use(passport.initialize());
require('./config/passport')(passport);

// Rate Limiter
//const limiter = rateLimit({ /* ... (tu config de rate limit) ... */ });
//app.use(limiter);

// --- Rutas ---
const mainRouter = require('./routes/index');
app.use('/api/v1', mainRouter);

// --- ¡NUEVO: Ruta de Documentación Swagger! ---
// Esta ruta servirá la documentación interactiva
//app.use(
//  '/api/v1/docs',  // La URL donde verás la documentación
//  swaggerUi.serve, 
//  swaggerUi.setup(swaggerSpecs, { explorer: true })
//);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'API de Restaurantes v1.0.0' });
});

// --- Manejador de Errores Centralizado ---
// (Lo crearemos más adelante)
// app.use(require('./middlewares/errorHandler.middleware'));

module.exports = app;