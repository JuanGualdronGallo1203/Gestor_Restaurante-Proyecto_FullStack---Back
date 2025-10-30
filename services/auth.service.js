const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authRepository = require('../repositories/auth.repository');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Registra un nuevo usuario.
 * @param {object} userData - Datos del usuario { username, email, password }.
 * @returns {Promise<{token: string}|{error: string}>}
 */
async function registerUser(userData) {
  // 1. Verificar si el email ya existe
  const existingUser = await authRepository.findUserByEmail(userData.email);
  if (existingUser) {
    return { error: 'El correo electrónico ya está registrado.' };
  }

  // 2. Hashear la contraseña
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(userData.password, salt);

  // 3. Crear el objeto de usuario para la DB
  const newUser = {
    username: userData.username,
    email: userData.email,
    password: hashedPassword,
    role: 'usuario', // Rol por defecto según los requisitos
  };

  // 4. Guardar en la DB
  const createdUser = await authRepository.createUser(newUser);

  // 5. Generar y devolver un token
  const token = generateToken(createdUser);
  return { token };
}

/**
 * Inicia sesión de un usuario.
 * @param {object} credentials - { email, password }.
 * @returns {Promise<{token: string}|{error: string}>}
 */
async function loginUser(credentials) {
  // 1. Buscar al usuario por email
  const user = await authRepository.findUserByEmail(credentials.email);
  if (!user) {
    return { error: 'Credenciales inválidas.' }; // Error genérico
  }

  // 2. Comparar la contraseña
  const isMatch = await bcrypt.compare(credentials.password, user.password);
  if (!isMatch) {
    return { error: 'Credenciales inválidas.' }; // Error genérico
  }

  // 3. Generar y devolver un token
  const token = generateToken(user);
  return { token };
}

/**
 * Función auxiliar para generar un JWT.
 */
function generateToken(user) {
  const payload = {
    sub: user._id, // 'sub' (subject) es el estándar para el ID
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '1h', // El token expira en 1 hora
  });
}

module.exports = {
  registerUser,
  loginUser,
};