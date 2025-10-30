const { validationResult } = require('express-validator');
const reviewService = require('../services/review.service');

// Función de ayuda para manejar errores de ID BSON
function handleBsonError(res, error) {
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
    const { restaurantId } = req.params;
    const reviewData = req.body; // { comment, rating }
    const userId = req.user._id; // Viene de 'isAuthenticated'
    
    const result = await reviewService.createReview(restaurantId, reviewData, userId);
    if (result.error) {
      // 403 Forbidden (ej. no autorizado), 404 Not Found (restaurante)
      return res.status(400).json({ message: result.error });
    }
    return res.status(201).json(result);
  } catch (error) {
    return handleBsonError(res, error);
  }
}

async function deleteOne(req, res) {
  try {
    const { id } = req.params; // ID de la reseña
    const userId = req.user._id;

    const result = await reviewService.deleteReview(id, userId);
    if (result.error) {
      // 403 si no es el dueño, 404 si no existe
      return res.status(403).json({ message: result.error });
    }
    return res.status(200).json(result);
  } catch (error) {
    return handleBsonError(res, error);
  }
}

async function like(req, res) {
  try {
    const { id } = req.params; // ID de la reseña
    const userId = req.user._id;
    
    // Simplificamos: 'like'
    const result = await reviewService.toggleLike(id, userId, 'like');
    if (result.error) {
      return res.status(403).json({ message: result.error });
    }
    return res.status(200).json(result);
  } catch (error) {
    return handleBsonError(res, error);
  }
}

async function dislike(req, res) {
  try {
    const { id } = req.params; // ID de la reseña
    const userId = req.user._id;

    // Simplificamos: 'dislike'
    const result = await reviewService.toggleLike(id, userId, 'dislike');
    if (result.error) {
      return res.status(403).json({ message: result.error });
    }
    return res.status(200).json(result);
  } catch (error) {
    return handleBsonError(res, error);
  }
}

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
  deleteOne,
  like,
  dislike,
  getAllByRestaurant
};