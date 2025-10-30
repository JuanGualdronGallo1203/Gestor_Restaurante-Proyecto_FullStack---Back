// controllers/review.controller.js

const { validationResult } = require('express-validator');
const reviewService = require('../services/review.service');

// Función de ayuda para manejar errores de ID BSON
function handleBsonError(res, error) {
  if (error.name === 'BSONError') {
    return res.status(400).json({ message: 'El ID proporcionado es inválido.' });
  }
  return res.status(500).json({ message: 'Error interno del servidor.' });
}

/**
 * [Usuario] Crea una reseña.
 */
async function create(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { restaurantId } = req.params;
    const reviewData = req.body; // { comment, rating }
    const userId = req.user._id; // Viene de 'isAuthenticated'
    
    const result = await reviewService.createReview(restaurantId, reviewData, userId);
    if (result.error) {
      return res.status(400).json({ message: result.error });
    }
    return res.status(201).json(result);
  } catch (error) {
    return handleBsonError(res, error);
  }
}

/**
 * [Usuario] Actualiza su propia reseña. (NUEVO)
 */
async function update(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id } = req.params; // ID de la reseña
    const userId = req.user._id;
    const updates = req.body; // { comment, rating }

    // Solo se pueden actualizar estos campos
    const allowedUpdates = {};
    if (updates.comment) allowedUpdates.comment = updates.comment;
    if (updates.rating) allowedUpdates.rating = updates.rating;

    const result = await reviewService.updateReview(id, userId, allowedUpdates);
    if (result.error) {
      return res.status(result.status || 400).json({ message: result.error });
    }
    return res.status(200).json(result);
  } catch (error) {
    return handleBsonError(res, error);
  }
}

/**
 * [Usuario o Admin] Elimina una reseña.
 */
async function deleteOne(req, res) {
  try {
    const { id } = req.params; // ID de la reseña
    const userId = req.user._id;
    const userRole = req.user.role; // Pasamos el rol al servicio

    const result = await reviewService.deleteReview(id, userId, userRole);
    if (result.error) {
      return res.status(result.status || 400).json({ message: result.error });
    }
    return res.status(200).json(result);
  } catch (error) {
    return handleBsonError(res, error);
  }
}

/**
 * [Usuario] Obtiene todas las reseñas de un restaurante.
 */
async function getAllByRestaurant(req, res) {
    try {
        const { restaurantId } = req.params;
        const result = await reviewService.getReviewsByRestaurant(restaurantId);
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
  update, // <-- Nueva
  deleteOne,
  getAllByRestaurant
  // like y dislike eliminados
};