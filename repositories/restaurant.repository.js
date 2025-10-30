const { getDb } = require('../config/db');
const { ObjectId } = require('mongodb');

function getRestaurantCollection() {
  const db = getDb();
  return db.collection('restaurants');
}

/**
 * [Admin] Crea un restaurante en la DB.
 */
async function createRestaurant(restaurantData) {
  const result = await getRestaurantCollection().insertOne(restaurantData);
  return { _id: result.insertedId, ...restaurantData };
}

/**
 * Busca un restaurante por su nombre (para evitar duplicados).
 */
async function findRestaurantByName(name) {
  return await getRestaurantCollection().findOne({ name });
}

/**
 * [Usuario] Busca un restaurante por ID, incluyendo datos de su categoría.
 */
async function findRestaurantById(id) {
  // Usamos 'aggregate' para traer también los datos de la categoría
  return await getRestaurantCollection().aggregate([
    { $match: { _id: new ObjectId(id) } },
    {
      $lookup: {
        from: 'categories',
        localField: 'categoryId',
        foreignField: '_id',
        as: 'categoryDetails'
      }
    },
    // preserveNullAndEmptyArrays evita que un restaurante sin categoría desaparezca
    { $unwind: { path: '$categoryDetails', preserveNullAndEmptyArrays: true } }
  ]).next(); // .next() porque esperamos un solo documento
}

/**
 * [Usuario] Busca todos los restaurantes, aplicando filtros opcionales.
 * (Función renombrada, filtro 'status' eliminado)
 */
async function findAllRestaurants(filter = {}) {
  // 'filter' puede contener, por ej., { categoryId: new ObjectId(...) }

  return await getRestaurantCollection().aggregate([
    { $match: filter },
    {
      $lookup: {
        from: 'categories',
        localField: 'categoryId',
        foreignField: '_id',
        as: 'categoryDetails'
      }
    },
    { $unwind: { path: '$categoryDetails', preserveNullAndEmptyArrays: true } }
  ]).toArray();
}

/**
 * [Admin] Actualiza un restaurante por ID.
 * 'updates' es un objeto con $set
 */
async function updateRestaurant(id, updates) {
  // Aseguramos que 'updates' use $set si no es un operador atómico
  const updateOperation = updates.$inc ? updates : { $set: updates };

  const result = await getRestaurantCollection().updateOne(
    { _id: new ObjectId(id) },
    updateOperation
  );
  return result.modifiedCount > 0;
}

/**
 * [Admin] Elimina un restaurante por ID.
 */
async function deleteRestaurant(id) {
  const result = await getRestaurantCollection().deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}

module.exports = {
  createRestaurant,
  findRestaurantByName,
  findRestaurantById,
  findAllRestaurants, // Nombre actualizado
  updateRestaurant,
  deleteRestaurant,
};