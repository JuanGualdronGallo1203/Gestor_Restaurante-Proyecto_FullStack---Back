// services/restaurant.service.js

const restaurantRepository = require('../repositories/restaurant.repository');
const categoryRepository = require('../repositories/category.repository');
const { ObjectId } = require('mongodb'); // <-- ¡IMPORTANTE AÑADIR ESTO!

/**
 * [Admin] Crea un nuevo restaurante.
 */
async function createRestaurant(restaurantData) {
  // 1. Validar que la categoría exista
  const category = await categoryRepository.findCategoryById(restaurantData.categoryId);
  if (!category) {
    return { error: 'La categoría especificada no existe.' };
  }

  // 2. Validar que el nombre no esté repetido
  const existingRestaurant = await restaurantRepository.findRestaurantByName(restaurantData.name);
  if (existingRestaurant) {
    return { error: 'Ya existe un restaurante con ese nombre.' };
  }

  // 3. Preparar el objeto final (convertimos a ObjectId)
  const newRestaurant = {
    ...restaurantData,
    categoryId: new ObjectId(restaurantData.categoryId), // Convertir a ObjectId
    createdAt: new Date(),
  };

  return await restaurantRepository.createRestaurant(newRestaurant);
}

/**
 * [Usuario] Obtiene todos los restaurantes.
 */
async function getAllRestaurants(categoryId) {
  const filter = {};
  if (categoryId) {
    filter.categoryId = new ObjectId(categoryId); // Convertir a ObjectId
  }
  return await restaurantRepository.findAllRestaurants(filter);
}

/**
 * [Usuario] Obtiene un restaurante por ID.
 */
async function getRestaurantById(id) {
  const restaurant = await restaurantRepository.findRestaurantById(id);
  
  if (!restaurant) {
    return { error: 'Restaurante no encontrado.' };
  }
  return restaurant;
}

/**
 * [Admin] Actualiza un restaurante.
 * (¡FUNCIÓN MODIFICADA!)
 */
async function updateRestaurant(id, updates) {
  
  // 1. ¡AQUÍ ESTÁ LA CORRECCIÓN!
  // Si el objeto 'updates' incluye un 'categoryId' (que viene como string)...
  if (updates.categoryId) {
    // ...lo convertimos a un ObjectId antes de enviar la actualización.
    updates.categoryId = new ObjectId(updates.categoryId);
  }

  // 2. Ahora enviamos los 'updates' (con el categoryId ya convertido) al repositorio.
  const wasUpdated = await restaurantRepository.updateRestaurant(id, updates);
  if (!wasUpdated) {
    return { error: 'Restaurante no encontrado o datos idénticos.' };
  }
  return { _id: id, ...updates };
}

/**
 * [Admin] Elimina un restaurante.
 */
async function deleteRestaurant(id) {
  const wasDeleted = await restaurantRepository.deleteRestaurant(id);
  if (!wasDeleted) {
    return { error: 'Restaurante no encontrado.' };
  }
  return { message: 'Restaurante eliminado exitosamente.' };
}

module.exports = {
  createRestaurant,
  getAllRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
};