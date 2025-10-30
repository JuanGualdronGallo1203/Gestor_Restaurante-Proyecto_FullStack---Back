const restaurantRepository = require('../repositories/restaurant.repository');
const categoryRepository = require('../repositories/category.repository'); // Para validar la categoría
const { ObjectId } = require('mongodb');

async function createRestaurant(restaurantData, userId) {
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

  // 3. Preparar el objeto final
  const newRestaurant = {
    ...restaurantData,
    categoryId: new ObjectId(restaurantData.categoryId), // Aseguramos que sea un ObjectId
    ownerId: new ObjectId(userId), // El usuario que lo creó
    status: 'pendiente', // Estado inicial según requisitos
    createdAt: new Date(),
  };

  return await restaurantRepository.createRestaurant(newRestaurant);
}

async function approveRestaurant(id) {
  const restaurant = await restaurantRepository.findRestaurantById(id);
  if (!restaurant) {
    return { error: 'Restaurante no encontrado.' };
  }

  const wasUpdated = await restaurantRepository.updateRestaurant(id, { status: 'aprobado' });
  if (!wasUpdated) {
    return { error: 'El restaurante ya estaba aprobado o no se pudo actualizar.' };
  }
  
  return { message: 'Restaurante aprobado exitosamente.' };
}

async function getAllApprovedRestaurants(categoryId) {
  const filter = {};
  if (categoryId) {
    filter.categoryId = new ObjectId(categoryId);
  }
  return await restaurantRepository.findAllApprovedRestaurants(filter);
}

async function getApprovedRestaurantById(id) {
  const restaurant = await restaurantRepository.findRestaurantById(id);
  
  // El público solo puede ver restaurantes aprobados
  if (!restaurant || restaurant.status !== 'aprobado') {
    return { error: 'Restaurante no encontrado o no está aprobado.' };
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
  approveRestaurant,
  getAllApprovedRestaurants,
  getApprovedRestaurantById,
  updateRestaurant,
  deleteRestaurant,
};