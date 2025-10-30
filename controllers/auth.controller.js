const { validationResult } = require('express-validator');
const authService = require('../services/auth.service');

/**
 * Controlador para registrar un nuevo usuario.
 */
async function register(req, res) {
  // 1. Validar los datos de entrada
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { username, email, password } = req.body;
    const result = await authService.registerUser({ username, email, password });

    // Si el servicio devuelve un error (ej. email duplicado)
    if (result.error) {
      return res.status(409).json({ message: result.error }); // 409 Conflict
    }

    // Éxito
    return res.status(201).json(result); // Devuelve el { token }
  } catch (error) {
    console.error('Error en register controller:', error);
    return res.status(500).json({ message: 'Error interno del servidor.' });
  }
}

/**
 * Controlador para iniciar sesión.
 */
async function login(req, res) {
  // 1. Validar los datos de entrada
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;
    const result = await authService.loginUser({ email, password });

    // Si el servicio devuelve un error (ej. credenciales inválidas)
    if (result.error) {
      return res.status(401).json({ message: result.error }); // 401 Unauthorized
    }

    // Éxito
    return res.status(200).json(result); // Devuelve el { token }
  } catch (error) {
    console.error('Error en login controller:', error);
    return res.status(500).json({ message: 'Error interno del servidor.' });
  }
}

module.exports = {
  register,
  login,
};