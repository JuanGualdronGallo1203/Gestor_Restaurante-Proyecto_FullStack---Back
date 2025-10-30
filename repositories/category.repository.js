const { getDb } = require('../config/db');
const { ObjectId } = require('mongodb');

function getCategoryCollection() {
  const db = getDb();
  return db.collection('categories');
}

async function findCategoryByName(name) {
  return await getCategoryCollection().findOne({ name });
}

async function createCategory(categoryData) {
  const result = await getCategoryCollection().insertOne(categoryData);
  return { _id: result.insertedId, ...categoryData };
}

async function getAllCategories() {
  return await getCategoryCollection().find({}).toArray();
}

async function findCategoryById(id) {
  return await getCategoryCollection().findOne({ _id: new ObjectId(id) });
}

async function updateCategory(id, updates) {
  const result = await getCategoryCollection().updateOne(
    { _id: new ObjectId(id) },
    { $set: updates }
  );
  return result.modifiedCount > 0;
}

async function deleteCategory(id) {
  const result = await getCategoryCollection().deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}

module.exports = {
  findCategoryByName,
  createCategory,
  getAllCategories,
  findCategoryById,
  updateCategory,
  deleteCategory,
};