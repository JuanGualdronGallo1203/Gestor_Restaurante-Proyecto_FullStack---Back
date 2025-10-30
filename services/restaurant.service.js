const restaurantRepository = require('../repositories/restaurant.repository');
const categoryRepository = require('../repositories/category.repository');
const { ObjectId } = require('mongodb');

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

  // 3. Preparar el objeto final (ahora es simple)
  const newRestaurant = {
    ...restaurantData,
    categoryId: new ObjectId(restaurantData.categoryId),
    createdAt: new Date(),
  };

  return await restaurantRepository.createRestaurant(newRestaurant);
}

async function getAllRestaurants(categoryId) {
  const filter = {};
  if (categoryId) {
    filter.categoryId = new ObjectId(categoryId);
  }
  return await restaurantRepository.findAllApprovedRestaurants(filter); // Nota: Debemos renombrar esta función en el repo.
}


async function getRestaurantById(id) {
  const restaurant = await restaurantRepository.findRestaurantById(id);
  
  if (!restaurant) {
    return { error: 'Restaurante no encontrado.' };
  }
  return restaurant;
}


async function updateRestaurant(id, updates) {
  const wasUpdated = await restaurantRepository.updateRestaurant(id, updates);
  if (!wasUpdated) {
    return { error: 'Restaurante no encontrado o datos idénticos.' };
  }
  return { _id: id, ...updates };
}


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