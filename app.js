const express = require('express');
const cors = require('cors');
const passport = require('passport');
const rateLimit = require('express-rate-limit');

// Importamos la app de Express
const app = express();

// --- Middlewares Globales ---

// 1. CORS: Permite peticiones del frontend
app.use(cors());

// 2. Body Parsers: Para entender JSON y URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Passport (para autenticación JWT)
// Inicializa Passport
app.use(passport.initialize());
// Carga y usa nuestra configuración de estrategia JWT (de config/passport.js)
require('./config/passport')(passport);

// 4. Rate Limiter (para seguridad básica)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // max 100 peticiones por IP en esa ventana
  message: 'Demasiadas peticiones desde esta IP, intente más tarde.',
});
app.use(limiter);

// --- Rutas ---
// Carga el enrutador principal
const mainRouter = require('./routes/index');

// Usa el enrutador principal con el prefijo /api/v1
// Todas tus rutas ahora comenzarán con /api/v1
app.use('/api/v1', mainRouter);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'API de Restaurantes v1.0.0' });
});

// --- Manejador de Errores Centralizado ---
// (Lo crearemos más adelante)
// app.use(require('./middlewares/errorHandler.middleware'));

// Exportamos la app para que menu.js la pueda usar
module.exports = app;