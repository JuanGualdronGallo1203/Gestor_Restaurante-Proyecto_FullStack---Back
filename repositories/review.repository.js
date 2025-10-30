const { getDb } = require('../config/db');
const { ObjectId } = require('mongodb');

function getReviewCollection() {
  const db = getDb();
  return db.collection('reviews');
}


 //Crea una reseña.
 
async function createReview(reviewData) {
  const result = await getReviewCollection().insertOne(reviewData);
  return { _id: result.insertedId, ...reviewData };
}


//Busca una reseña por su ID.

async function findReviewById(id) {
  return await getReviewCollection().findOne({ _id: new ObjectId(id) });
}

 // Actualiza una reseña (solo el dueño).
async function updateReview(id, updates) {
  const result = await getReviewCollection().updateOne(
    { _id: new ObjectId(id) },
    { $set: updates }
  );
  return result.modifiedCount > 0;
}

/**
 * Elimina una reseña.
 */
async function deleteReview(id) {
  const result = await getReviewCollection().deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}


// Obtiene todas las reseñas de un restaurante.

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