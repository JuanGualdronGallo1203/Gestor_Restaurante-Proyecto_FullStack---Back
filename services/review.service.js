const reviewRepository = require('../repositories/review.repository');
const restaurantRepository = require('../repositories/restaurant.repository');
const { ObjectId } = require('mongodb');

/**
 * [Usuario] Crea una reseña para un restaurante.
 */
async function createReview(restaurantId, reviewData, userId) {
  // 1. Validar que el restaurante exista
  const restaurant = await restaurantRepository.findRestaurantById(restaurantId);
  if (!restaurant) {
    return { error: 'Restaurante no encontrado.' };
  }

  // 2. Preparar la reseña
  const newReview = {
    ...reviewData, // comment y rating
    restaurantId: new ObjectId(restaurantId),
    userId: new ObjectId(userId), // El "dueño" de la reseña
    createdAt: new Date(),
  };

  return await reviewRepository.createReview(newReview);
}

/**
 * [Usuario] Actualiza su propia reseña.
 */
async function updateReview(reviewId, userId, updates) {
  // 1. Buscar la reseña
  const review = await reviewRepository.findReviewById(reviewId);
  if (!review) {
    return { error: 'Reseña no encontrada.', status: 404 };
  }

  // 2. Validar propiedad
  if (review.userId.toString() !== userId.toString()) {
    return { error: 'No autorizado para editar esta reseña.', status: 403 };
  }

  // 3. Actualizar
  const wasUpdated = await reviewRepository.updateReview(reviewId, updates);
  if (!wasUpdated) {
    return { error: 'No se pudo actualizar la reseña.', status: 500 };
  }
  
  return { _id: reviewId, ...updates };
}


/**
 * [Usuario o Admin] Elimina una reseña.
 */
async function deleteReview(reviewId, userId, userRole) {
  // 1. Buscar la reseña
  const review = await reviewRepository.findReviewById(reviewId);
  if (!review) {
    return { error: 'Reseña no encontrada.', status: 404 };
  }

  // 2. Validar permisos (Debe ser el dueño O un admin)
  const isOwner = review.userId.toString() === userId.toString();
  const isAdmin = userRole === 'administrador';

  if (!isOwner && !isAdmin) {
    return { error: 'No autorizado para eliminar esta reseña.', status: 403 };
  }

  // 3. Eliminar
  const wasDeleted = await reviewRepository.deleteReview(reviewId);
  if (!wasDeleted) {
    return { error: 'No se pudo eliminar la reseña.', status: 500 };
  }
  
  return { message: 'Reseña eliminada exitosamente.' };
}

/**
 * [Usuario] Obtiene las reseñas de un restaurante.
 */
async function getReviewsByRestaurant(restaurantId) {
    const restaurant = await restaurantRepository.findRestaurantById(restaurantId);
    if (!restaurant) {
      return { error: 'Restaurante no encontrado.' };
    }
    return await reviewRepository.findReviewsByRestaurant(restaurantId);
}

module.exports = {
  createReview,
  updateReview, 
  deleteReview,
  getReviewsByRestaurant
  
};