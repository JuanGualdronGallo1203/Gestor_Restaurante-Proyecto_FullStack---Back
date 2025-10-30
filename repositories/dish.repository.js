const { getDb } = require('../config/db');
const { ObjectId } = require('mongodb');

function getDishCollection() {
  const db = getDb();
  return db.collection('dishes');
}

async function createDish(dishData) {
  const result = await getDishCollection().insertOne(dishData);
  return { _id: result.insertedId, ...dishData };
}

async function findDishesByRestaurant(restaurantId) {
  return await getDishCollection().find({ 
    restaurantId: new ObjectId(restaurantId) 
  }).toArray();
}

async function findDishById(id) {
  return await getDishCollection().findOne({ _id: new ObjectId(id) });
}

async function updateDish(id, updates) {
  const result = await getDishCollection().updateOne(
    { _id: new ObjectId(id) },
    { $set: updates }
  );
  return result.modifiedCount > 0;
}

async function deleteDish(id) {
  const result = await getDishCollection().deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}

module.exports = {
  createDish,
  findDishesByRestaurant,
  findDishById,
  updateDish,
  deleteDish,
};