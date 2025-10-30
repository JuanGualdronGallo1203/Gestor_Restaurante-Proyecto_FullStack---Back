const { validationResult } = require('express-validator');
const dishReviewService = require('../services/dishReview.service');

// Función de ayuda para manejar errores de ID BSON
function handleBsonError(res, error) {
  if (error.name === 'BSONError') {
    return res.status(400).json({ message: 'El ID proporcionado es inválido.' });
  }
  return res.status(500).json({ message: 'Error interno del servidor.' });
}

/**
 * [Usuario] Crea una reseña de platillo.
 */
async function create(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { dishId } = req.params; // Viene de la URL anidada
    const reviewData = req.body; // { comment, rating }
    const userId = req.user._id; 
    
    const result = await dishReviewService.createReview(dishId, reviewData, userId);
    if (result.error) {
      return res.status(400).json({ message: result.error });
    }
    return res.status(201).json(result);
  } catch (error) {
    return handleBsonError(res, error);
  }
}

/**
 * [Usuario] Actualiza su propia reseña de platillo.
 */
async function update(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id } = req.params; // ID de la reseña de platillo
    const userId = req.user._id;
    const updates = req.body; // { comment, rating }

    const allowedUpdates = {};
    if (updates.comment) allowedUpdates.comment = updates.comment;
    if (updates.rating) allowedUpdates.rating = updates.rating;

    const result = await dishReviewService.updateReview(id, userId, allowedUpdates);
    if (result.error) {
      return res.status(result.status || 400).json({ message: result.error });
    }
    return res.status(200).json(result);
  } catch (error) {
    return handleBsonError(res, error);
  }
}

/**
 * [Usuario o Admin] Elimina una reseña de platillo.
 */
async function deleteOne(req, res) {
  try {
    const { id } = req.params; // ID de la reseña de platillo
    const userId = req.user._id;
    const userRole = req.user.role; 

    const result = await dishReviewService.deleteReview(id, userId, userRole);
    if (result.error) {
      return res.status(result.status || 400).json({ message: result.error });
    }
    return res.status(200).json(result);
  } catch (error) {
    return handleBsonError(res, error);
  }
}

/**
 * [Usuario] Obtiene todas las reseñas de un platillo.
 */
async function getAllByDish(req, res) {
    try {
        const { dishId } = req.params;
        const result = await dishReviewService.getReviewsByDish(dishId);
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
  update,
  deleteOne,
  getAllByDish
};