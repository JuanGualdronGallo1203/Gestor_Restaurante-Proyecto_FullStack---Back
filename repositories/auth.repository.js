const { getDb } = require('../config/db');

/**
 * Obtiene la colección 'users' de la base de datos.
 * @returns {import('mongodb').Collection}
 */
function getUserCollection() {
  const db = getDb();
  return db.collection('users');
}

/**
 * Busca un usuario por su email.
 * @param {string} email - El email del usuario.
 * @returns {Promise<object|null>} El documento del usuario o null.
 */
async function findUserByEmail(email) {
  return await getUserCollection().findOne({ email: email });
}

/**
 * Crea un nuevo usuario en la base de datos.
 * @param {object} userData - Los datos del usuario (email, password hasheada, role).
 * @returns {Promise<object>} El usuario creado (con su _id).
 */
async function createUser(userData) {
  const result = await getUserCollection().insertOne(userData);
  // Devolvemos el _id insertado junto con los datos
  return { _id: result.insertedId, ...userData };
}

module.exports = {
  findUserByEmail,
  createUser,
};