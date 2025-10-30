const dishReviewRepository = require('../repositories/dishReview.repository');
// Usamos el repo de platillos para validar que exista
const dishRepository = require('../repositories/dish.repository'); 
const { ObjectId } = require('mongodb');

/**
 * [Usuario] Crea una reseña para un platillo.
 */
async function createReview(dishId, reviewData, userId) {
  // 1. Validar que el platillo exista
  const dish = await dishRepository.findDishById(dishId);
  if (!dish) {
    return { error: 'Platillo no encontrado.' };
  }

  // 2. Preparar la reseña
  const newReview = {
    ...reviewData, // comment y rating
    dishId: new ObjectId(dishId),
    userId: new ObjectId(userId), // El "dueño" de la reseña
    createdAt: new Date(),
  };

  return await dishReviewRepository.createReview(newReview);
}

/**
 * [Usuario] Actualiza su propia reseña de platillo.
 */
async function updateReview(reviewId, userId, updates) {
  // 1. Buscar la reseña
  const review = await dishReviewRepository.findReviewById(reviewId);
  if (!review) {
    return { error: 'Reseña de platillo no encontrada.', status: 404 };
  }

  // 2. Validar propiedad
  if (review.userId.toString() !== userId.toString()) {
    return { error: 'No autorizado para editar esta reseña.', status: 403 };
  }

  // 3. Actualizar
  const wasUpdated = await dishReviewRepository.updateReview(reviewId, updates);
  if (!wasUpdated) {
    return { error: 'No se pudo actualizar la reseña.', status: 500 };
  }
  
  return { _id: reviewId, ...updates };
}

/**
 * [Usuario o Admin] Elimina una reseña de platillo.
 */
async function deleteReview(reviewId, userId, userRole) {
  // 1. Buscar la reseña
  const review = await dishReviewRepository.findReviewById(reviewId);
  if (!review) {
    return { error: 'Reseña de platillo no encontrada.', status: 404 };
  }

  // 2. Validar permisos (Debe ser el dueño O un admin)
  const isOwner = review.userId.toString() === userId.toString();
  const isAdmin = userRole === 'administrador';

  if (!isOwner && !isAdmin) {
    return { error: 'No autorizado para eliminar esta reseña.', status: 403 };
  }

  // 3. Eliminar
  const wasDeleted = await dishReviewRepository.deleteReview(reviewId);
  if (!wasDeleted) {
    return { error: 'No se pudo eliminar la reseña.', status: 500 };
  }
  
  return { message: 'Reseña de platillo eliminada exitosamente.' };
}

/**
 * [Usuario] Obtiene las reseñas de un platillo.
 */
async function getReviewsByDish(dishId) {
    const dish = await dishRepository.findDishById(dishId);
    if (!dish) {
      return { error: 'Platillo no encontrado.' };
    }
    return await dishReviewRepository.findReviewsByDish(dishId);
}

module.exports = {
  createReview,
  updateReview,
  deleteReview,
  getReviewsByDish
};