// controllers/restaurant.controller.js

const { validationResult } = require('express-validator');
const restaurantService = require('../services/restaurant.service');

// Función de ayuda para manejar errores
function handleControllerError(res, error) {
  console.error(error); 
  if (error.name === 'BSONError') {
    return res.status(400).json({ message: 'El ID proporcionado es inválido.' });
  }
  return res.status(500).json({ message: 'Error interno del servidor.' });
}

async function create(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const restaurantData = req.body;
    const result = await restaurantService.createRestaurant(restaurantData);
    if (result.error) {
      return res.status(400).json({ message: result.error });
    }
    return res.status(201).json(result);
  } catch (error) {
    return handleControllerError(res, error); // Usamos la nueva función
  }
}

async function getAll(req, res) {
  try {
    const { categoryId } = req.query;
    const restaurants = await restaurantService.getAllRestaurants(categoryId); 
    return res.status(200).json(restaurants);
  } catch (error) {
     return handleControllerError(res, error); // Usamos la nueva función
  }
}

async function getOne(req, res) {
  try {
    const { id } = req.params;
    const result = await restaurantService.getRestaurantById(id); 
    if (result.error) {
      return res.status(404).json({ message: result.error });
    }
    return res.status(200).json(result);
  } catch (error) {
    return handleControllerError(res, error); // Usamos la nueva función
  }
}

async function update(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { id } = req.params;
    const updates = req.body;
    const result = await restaurantService.updateRestaurant(id, updates);
    if (result.error) {
      return res.status(404).json({ message: result.error });
    }
    return res.status(200).json(result);
  } catch (error) {
    return handleControllerError(res, error); // Usamos la nueva función
  }
}

async function deleteOne(req, res) {
  try {
    const { id } = req.params;
    const result = await restaurantService.deleteRestaurant(id);
    if (result.error) {
      return res.status(404).json({ message: result.error });
    }
    return res.status(200).json(result);
  } catch (error) {
    return handleControllerError(res, error); // Usamos la nueva función
  }
}

module.exports = {
  create,
  getAll,
  getOne,
  update,
  deleteOne,
};