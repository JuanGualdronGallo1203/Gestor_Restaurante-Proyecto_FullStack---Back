// /repositories/review.repository.js
const { getDb } = require('../config/db');
const { ObjectId } = require('mongodb');

function getReviewCollection() {
  const db = getDb();
  return db.collection('reviews');
}

async function createReview(reviewData) {
  const result = await getReviewCollection().insertOne(reviewData);
  return { _id: result.insertedId, ...reviewData };
}

async function findReviewById(id) {
  return await getReviewCollection().findOne({ _id: new ObjectId(id) });
}

async function updateReview(id, updates) {
  const result = await getReviewCollection().updateOne(
    { _id: new ObjectId(id) },
    { $set: updates }
  );
  return result.modifiedCount > 0;
}

async function deleteReview(id) {
  const result = await getReviewCollection().deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}

/**
 * ¡ACTUALIZADO! 
 * Ahora usa $lookup para "unir" los datos del usuario.
 */
async function findReviewsByRestaurant(restaurantId) {
  return await getReviewCollection().aggregate([
    { $match: { restaurantId: new ObjectId(restaurantId) } },
    { $sort: { createdAt: -1 } }, // Ordenar por más nuevo
    {
      $lookup: {
        from: 'users',         // La colección con la que unimos
        localField: 'userId',    // El campo en 'reviews'
        foreignField: '_id',     // El campo en 'users'
        as: 'user'             // El nombre del nuevo array
      }
    },
    { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } }, // Convertir el array 'user' en un objeto
    {
      $project: {
        // Devolvemos todo...
        comment: 1,
        rating: 1,
        createdAt: 1,
        userId: 1,
        // ...pero del usuario, solo el 'username' (para no enviar la contraseña)
        'user.username': 1,
        'user._id': 1
      }
    }
  ]).toArray();
}

module.exports = {
  createReview,
  findReviewById,
  updateReview, 
  deleteReview,
  findReviewsByRestaurant,
};