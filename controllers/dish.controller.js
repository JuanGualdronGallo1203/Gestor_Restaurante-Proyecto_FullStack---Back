const { validationResult } = require('express-validator');
const dishService = require('../services/dish.service');

// Función de ayuda para manejar errores de ID BSON
function handleBsonError(res, error) {
  if (error.name === 'BSONError') {
    return res.status(400).json({ message: 'El ID proporcionado es inválido.' });
  }
  return res.status(500).json({ message: 'Error interno del servidor.' });
}

// Admin crea un plato para un restaurante
async function create(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { restaurantId } = req.params; // Obtenido de la URL
    const dishData = req.body;
    
    const result = await dishService.createDish(restaurantId, dishData);

    if (result.error) {
      return res.status(400).json({ message: result.error });
    }
    
    return res.status(201).json(result);
  } catch (error) {
    return handleBsonError(res, error);
  }
}

// Público obtiene los platos de un restaurante
async function getAllByRestaurant(req, res) {
  try {
    const { restaurantId } = req.params; // Obtenido de la URL
    const result = await dishService.getDishesByRestaurant(restaurantId);
    
    if (result.error) {
      return res.status(404).json({ message: result.error });
    }
    
    return res.status(200).json(result);
  } catch (error) {
    return handleBsonError(res, error);
  }
}

// Admin actualiza un plato
async function update(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id } = req.params; // ID del plato
    const updates = req.body;
    const result = await dishService.updateDish(id, updates);

    if (result.error) {
      return res.status(404).json({ message: result.error });
    }
    
    return res.status(200).json(result);
  } catch (error) {
    return handleBsonError(res, error);
  }
}

// Admin elimina un plato
async function deleteOne(req, res) {
  try {
    const { id } = req.params; // ID del plato
    const result = await dishService.deleteDish(id);

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
  getAllByRestaurant,
  update,
  deleteOne,
};