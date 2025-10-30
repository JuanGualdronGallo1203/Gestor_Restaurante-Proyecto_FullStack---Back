const { getDb } = require('../config/db');
const { ObjectId } = require('mongodb');

function getReviewCollection() {
  const db = getDb();
  return db.collection('reviews');
}

/**
 * Crea una reseña. Acepta una sesión opcional.
 */
async function createReview(reviewData, session) {
  const result = await getReviewCollection().insertOne(reviewData, { session });
  return { _id: result.insertedId, ...reviewData };
}

/**
 * Busca una reseña por su ID.
 */
async function findReviewById(id, session) {
  return await getReviewCollection().findOne({ _id: new ObjectId(id) }, { session });
}

/**
 * Actualiza una reseña (ej. un like). Acepta una sesión opcional.
 */
async function updateReview(id, updates, session) {
  const result = await getReviewCollection().updateOne(
    { _id: new ObjectId(id) },
    updates,
    { session }
  );
  return result.modifiedCount > 0;
}

/**
 * Elimina una reseña. Acepta una sesión opcional.
 */
async function deleteReview(id, session) {
  const result = await getReviewCollection().deleteOne({ _id: new ObjectId(id) }, { session });
  return result.deletedCount > 0;
}

/**
 * Obtiene todas las reseñas de un restaurante.
 */
async function findReviewsByRestaurant(restaurantId) {
  return await getReviewCollection().find({ 
    restaurantId: new ObjectId(restaurantId) 
  }).toArray();
}

module.exports = {
  createReview,
  findReviewById,
  updateReview,
  deleteReview,
  findReviewsByRestaurant,
};