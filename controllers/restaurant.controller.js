const { validationResult } = require('express-validator');
const restaurantService = require('../services/restaurant.service');

// Función de ayuda para manejar errores de ID BSON
function handleBsonError(res, error) {
  if (error.name === 'BSONError') {
    return res.status(400).json({ message: 'El ID proporcionado es inválido.' });
  }
  return res.status(500).json({ message: 'Error interno del servidor.' });
}

// Usuario autenticado crea un restaurante (queda pendiente)
async function create(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const restaurantData = req.body;
    const userId = req.user._id; // Viene del middleware 'isAuthenticated'
    
    const result = await restaurantService.createRestaurant(restaurantData, userId);

    if (result.error) {
      return res.status(400).json({ message: result.error });
    }
    
    return res.status(201).json(result);
  } catch (error) {
    return handleBsonError(res, error);
  }
}

// Admin aprueba un restaurante
async function approve(req, res) {
  try {
    const { id } = req.params;
    const result = await restaurantService.approveRestaurant(id);

    if (result.error) {
      return res.status(404).json({ message: result.error });
    }
    
    return res.status(200).json(result);
  } catch (error) {
    return handleBsonError(res, error);
  }
}

// Público obtiene lista de restaurantes (solo aprobados)
async function getAll(req, res) {
  try {
    const { categoryId } = req.query; // Para filtrar por categoría
    const restaurants = await restaurantService.getAllApprovedRestaurants(categoryId);
    return res.status(200).json(restaurants);
  } catch (error) {
     return handleBsonError(res, error); // Por si el categoryId es inválido
  }
}

// Público obtiene un restaurante (solo si está aprobado)
async function getOne(req, res) {
  try {
    const { id } = req.params;
    const result = await restaurantService.getApprovedRestaurantById(id);
    
    if (result.error) {
      return res.status(404).json({ message: result.error });
    }
    
    return res.status(200).json(result);
  } catch (error) {
    return handleBsonError(res, error);
  }
}

// Admin actualiza un restaurante
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
    return handleBsonError(res, error);
  }
}

// Admin elimina un restaurante
async function deleteOne(req, res) {
  try {
    const { id } = req.params;
    const result = await restaurantService.deleteRestaurant(id);

    if (result.error) {
      return res.status(404).json({ message: result.error });
    }
    
    return res.status(200).json(result);
  } catch (error) {
    return handleBsonError(res, error);
  }
}

module.exports = {
  create,
  approve,
  getAll,
  getOne,
  update,
  deleteOne,
};