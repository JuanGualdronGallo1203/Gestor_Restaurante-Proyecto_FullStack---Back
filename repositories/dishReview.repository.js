const { getDb } = require('../config/db');
const { ObjectId } = require('mongodb');

function getDishReviewCollection() {
  const db = getDb();
  return db.collection('dish_reviews'); // Nueva colección
}

/**
 * Crea una reseña de platillo.
 */
async function createReview(reviewData) {
  const result = await getDishReviewCollection().insertOne(reviewData);
  return { _id: result.insertedId, ...reviewData };
}

/**
 * Busca una reseña de platillo por su ID.
 */
async function findReviewById(id) {
  return await getDishReviewCollection().findOne({ _id: new ObjectId(id) });
}

/**
 * Actualiza una reseña de platillo (solo el dueño).
 */
async function updateReview(id, updates) {
  const result = await getDishReviewCollection().updateOne(
    { _id: new ObjectId(id) },
    { $set: updates }
  );
  return result.modifiedCount > 0;
}

/**
 * Elimina una reseña de platillo.
 */
async function deleteReview(id) {
  const result = await getDishReviewCollection().deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}

/**
 * Obtiene todas las reseñas de un platillo específico.
 */
async function findReviewsByDish(dishId) {
  return await getDishReviewCollection().find({ 
    dishId: new ObjectId(dishId) 
  }).toArray();
}

module.exports = {
  createReview,
  findReviewById,
  updateReview,
  deleteReview,
  findReviewsByDish,
};