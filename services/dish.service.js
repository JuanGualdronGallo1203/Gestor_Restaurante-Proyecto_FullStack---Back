// services/dish.service.js

const dishRepository = require('../repositories/dish.repository');
const restaurantRepository = require('../repositories/restaurant.repository');
const { ObjectId } = require('mongodb');

/**
 * [Admin] Crea un nuevo platillo.
 */
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

/**
 * [Usuario/Admin] Obtiene los platillos de un restaurante.
 */
async function getDishesByRestaurant(restaurantId) {
  // Validar que el restaurante exista (opcional, pero buena práctica)
  const restaurant = await restaurantRepository.findRestaurantById(restaurantId);
  if (!restaurant) {
    return { error: 'El restaurante especificado no existe.' };
  }
  
  return await dishRepository.findDishesByRestaurant(restaurantId);
}

/**
 * [Admin] Actualiza un platillo.
 */
async function updateDish(id, updates) {
  // Si se está actualizando la URL, ya viene validada por express-validator
  // Si se actualiza el precio, ya viene validado
  
  const wasUpdated = await dishRepository.updateDish(id, updates);
  if (!wasUpdated) {
    return { error: 'Plato no encontrado o datos idénticos.' };
  }
  return { _id: id, ...updates };
}

/**
 * [Admin] Elimina un platillo.
 */
async function deleteDish(id) {
  const wasDeleted = await dishRepository.deleteDish(id);
  if (!wasDeleted) {
    return { error: 'Plato no encontrado.' };
  }
  return { message: 'Plato eliminado exitosamente.' };
}

/**
 * [Admin] Obtiene un solo platillo por su ID.
 * (Función añadida en el último paso)
 */
async function getDishById(id) {
  const dish = await dishRepository.findDishById(id);
  if (!dish) {
    return { error: 'Plato no encontrado.' };
  }
  return dish;
}

module.exports = {
  createDish,
  getDishesByRestaurant,
  updateDish,
  deleteDish,
  getDishById, // <-- Función añadida
};