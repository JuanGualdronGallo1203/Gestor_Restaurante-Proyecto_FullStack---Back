const { getDb } = require('../config/db');
const { ObjectId } = require('mongodb');

function getRestaurantCollection() {
  const db = getDb();
  return db.collection('restaurants');
}

async function createRestaurant(restaurantData) {
  const result = await getRestaurantCollection().insertOne(restaurantData);
  return { _id: result.insertedId, ...restaurantData };
}

async function findRestaurantByName(name) {
  return await getRestaurantCollection().findOne({ name });
}

async function findRestaurantById(id) {
  // Usamos 'aggregate' para traer también los datos de la categoría
  return await getRestaurantCollection().aggregate([
    { $match: { _id: new ObjectId(id) } },
    {
      $lookup: {
        from: 'categories',
        localField: 'categoryId',
        foreignField: '_id',
        as: 'categoryDetails'
      }
    },
    { $unwind: { path: '$categoryDetails', preserveNullAndEmptyArrays: true } }
  ]).next(); // .next() porque esperamos un solo documento
}

async function findAllApprovedRestaurants(filter = {}) {
  // 'filter' puede contener, por ej., { categoryId: new ObjectId(...) }
  filter.status = 'aprobado'; // Solo trae los aprobados

  return await getRestaurantCollection().aggregate([
    { $match: filter },
    {
      $lookup: {
        from: 'categories',
        localField: 'categoryId',
        foreignField: '_id',
        as: 'categoryDetails'
      }
    },
    { $unwind: { path: '$categoryDetails', preserveNullAndEmptyArrays: true } }
  ]).toArray();
}

async function updateRestaurant(id, updates) {
  const result = await getRestaurantCollection().updateOne(
    { _id: new ObjectId(id) },
    { $set: updates }
  );
  return result.modifiedCount > 0;
}

async function deleteRestaurant(id) {
  const result = await getRestaurantCollection().deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}

module.exports = {
  createRestaurant,
  findRestaurantByName,
  findRestaurantById,
  findAllApprovedRestaurants,
  updateRestaurant,
  deleteRestaurant,
};