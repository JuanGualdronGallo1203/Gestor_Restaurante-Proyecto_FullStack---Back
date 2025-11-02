// /repositories/dishReview.repository.js
const { getDb } = require('../config/db');
const { ObjectId } = require('mongodb');

function getDishReviewCollection() {
  const db = getDb();
  return db.collection('dish_reviews'); 
}

async function createReview(reviewData) {
  const result = await getDishReviewCollection().insertOne(reviewData);
  return { _id: result.insertedId, ...reviewData };
}

async function findReviewById(id) {
  return await getDishReviewCollection().findOne({ _id: new ObjectId(id) });
}

async function updateReview(id, updates) {
  const result = await getDishReviewCollection().updateOne(
    { _id: new ObjectId(id) },
    { $set: updates }
  );
  return result.modifiedCount > 0;
}

async function deleteReview(id) {
  const result = await getDishReviewCollection().deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}

/**
 * ¡ACTUALIZADO! 
 * Ahora usa $lookup para "unir" los datos del usuario.
 */
async function findReviewsByDish(dishId) {
  return await getDishReviewCollection().aggregate([
    { $match: { dishId: new ObjectId(dishId) } },
    { $sort: { createdAt: -1 } }, // Ordenar por más nuevo
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'user'
      }
    },
    { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
    {
      $project: {
        comment: 1,
        rating: 1,
        createdAt: 1,
        userId: 1,
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
  findReviewsByDish,
};