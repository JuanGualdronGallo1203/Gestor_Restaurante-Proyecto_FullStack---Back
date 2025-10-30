const dishRepository = require('../repositories/dish.repository');
// Usamos el repo de restaurante para validar que exista
const restaurantRepository = require('../repositories/restaurant.repository');
const { ObjectId } = require('mongodb');

async function createDish(restaurantId, dishData) {
  // 1. Validar que el restaurante exista
  const restaurant = await restaurantRepository.findRestaurantById(restaurantId);
  if (!restaurant) {
    return { error: 'El restaurante especificado no existe.' };
  }

  // 2. Preparar el objeto del plato
  const newDish = {
    ...dishData,
    restaurantId: new ObjectId(restaurantId), // Vinculamos el plato
    createdAt: new Date(),
  };

  return await dishRepository.createDish(newDish);
}

async function getDishesByRestaurant(restaurantId) {
  // Validar que el restaurante exista (opcional, pero buena práctica)
  const restaurant = await restaurantRepository.findRestaurantById(restaurantId);
  if (!restaurant) {
    return { error: 'El restaurante especificado no existe.' };
  }
  
  return await dishRepository.findDishesByRestaurant(restaurantId);
}

async function updateDish(id, updates) {
  const wasUpdated = await dishRepository.updateDish(id, updates);
  if (!wasUpdated) {
    return { error: 'Plato no encontrado o datos idénticos.' };
  }
  return { _id: id, ...updates };
}

async function deleteDish(id) {
  const wasDeleted = await dishRepository.deleteDish(id);
  if (!wasDeleted) {
    return { error: 'Plato no encontrado.' };
  }
  return { message: 'Plato eliminado exitosamente.' };
}

module.exports = {
  createDish,
  getDishesByRestaurant,
  updateDish,
  deleteDish,
};