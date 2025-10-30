const { getClient } = require('../config/db'); // ¡Importamos el cliente!
const reviewRepository = require('../repositories/review.repository');
const restaurantRepository = require('../repositories/restaurant.repository');
const { ObjectId } = require('mongodb');

/**
 * Crea una reseña y actualiza el restaurante DENTRO de una transacción.
 */
async function createReview(restaurantId, reviewData, userId) {
  const client = getClient();
  const session = client.startSession();

  try {
    let createdReview;
    await session.withTransaction(async () => {
      // 1. Validar que el restaurante exista (dentro de la sesión)
      const restaurant = await restaurantRepository.findRestaurantById(restaurantId, session);
      if (!restaurant) {
        throw new Error('Restaurante no encontrado.');
      }

      // 2. Preparar la reseña
      const newReview = {
        ...reviewData,
        restaurantId: new ObjectId(restaurantId),
        userId: new ObjectId(userId),
        likes: [],
        dislikes: [],
        createdAt: new Date(),
      };
      
      // 3. Crear la reseña
      createdReview = await reviewRepository.createReview(newReview, session);

      // 4. Actualizar el restaurante (para el ranking)
      // Usamos $inc para sumar de forma atómica
      await restaurantRepository.updateRestaurant(
        restaurantId,
        { 
          $inc: { 
            totalRatingSum: newReview.rating, 
            reviewCount: 1 
          } 
        },
        session
      );
    });
    return createdReview;
  } catch (error) {
    console.error('Error en la transacción de crear reseña:', error);
    return { error: error.message };
  } finally {
    session.endSession();
  }
}

/**
 * Elimina una reseña y actualiza el restaurante DENTRO de una transacción.
 */
async function deleteReview(reviewId, userId) {
  const client = getClient();
  const session = client.startSession();

  try {
    let result;
    await session.withTransaction(async () => {
      // 1. Validar que la reseña exista Y que el usuario sea el propietario
      const review = await reviewRepository.findReviewById(reviewId, session);
      if (!review) {
        throw new Error('Reseña no encontrada.');
      }
      if (review.userId.toString() !== userId.toString()) {
        throw new Error('No autorizado para eliminar esta reseña.');
      }

      // 2. Eliminar la reseña
      await reviewRepository.deleteReview(reviewId, session);

      // 3. Actualizar el restaurante (restando el rating)
      await restaurantRepository.updateRestaurant(
        review.restaurantId,
        {
          $inc: {
            totalRatingSum: -review.rating, // Restamos el rating
            reviewCount: -1
          }
        },
        session
      );
      result = { message: 'Reseña eliminada.' };
    });
    return result;
  } catch (error) {
    console.error('Error en la transacción de eliminar reseña:', error);
    return { error: error.message };
  } finally {
    session.endSession();
  }
}

/**
 * Gestiona un Like/Dislike DENTRO de una transacción.
 */
async function toggleLike(reviewId, userId, action) {
  const client = getClient();
  const session = client.startSession();

  try {
    let result;
    await session.withTransaction(async () => {
      const review = await reviewRepository.findReviewById(reviewId, session);
      if (!review) {
        throw new Error('Reseña no encontrada.');
      }
      
      // Lógica de negocio: No puedes dar like/dislike a tu propia reseña
      if (review.userId.toString() === userId.toString()) {
        throw new Error('No puedes votar en tu propia reseña.');
      }

      const restaurantId = review.restaurantId;
      const updateReviewOps = {};
      const updateRestaurantOps = {};

      // Lógica para añadir/quitar like/dislike (usando $pull y $addToSet)
      // (Esta es una lógica compleja, la simplificamos por ahora)
      
      if (action === 'like') {
        updateReviewOps.$addToSet = { likes: new ObjectId(userId) }; // Añade si no existe
        updateReviewOps.$pull = { dislikes: new ObjectId(userId) }; // Quita de dislikes
        updateRestaurantOps.$inc = { totalLikes: 1, totalDislikes: -1 }; // Ajuste neto
      } else if (action === 'dislike') {
        updateReviewOps.$addToSet = { dislikes: new ObjectId(userId) };
        updateReviewOps.$pull = { likes: new ObjectId(userId) };
        updateRestaurantOps.$inc = { totalLikes: -1, totalDislikes: 1 };
      }
      
      // 1. Actualizar la reseña (quién dio like)
      await reviewRepository.updateReview(reviewId, updateReviewOps, session);
      // 2. Actualizar el restaurante (conteo de likes)
      await restaurantRepository.updateRestaurant(restaurantId, updateRestaurantOps, session);
      
      result = { message: `Acción de '${action}' registrada.` };
    });
    return result;
  } catch (error) {
    console.error('Error en la transacción de like/dislike:', error);
    return { error: error.message };
  } finally {
    session.endSession();
  }
}

async function getReviewsByRestaurant(restaurantId) {
    const restaurant = await restaurantRepository.findRestaurantById(restaurantId);
    if (!restaurant) {
      return { error: 'Restaurante no encontrado.' };
    }
    return await reviewRepository.findReviewsByRestaurant(restaurantId);
}

module.exports = {
  createReview,
  deleteReview,
  toggleLike,
  getReviewsByRestaurant
};