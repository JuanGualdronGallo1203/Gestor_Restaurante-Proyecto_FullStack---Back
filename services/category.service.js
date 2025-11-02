// services/category.service.js
const categoryRepository = require('../repositories/category.repository');

async function createCategory(categoryData) {
  const existingCategory = await categoryRepository.findCategoryByName(categoryData.name);
  if (existingCategory) {
    return { error: 'Ya existe una categoría con ese nombre.' };
  }
  return await categoryRepository.createCategory(categoryData);
}

async function getAllCategories() {
  return await categoryRepository.getAllCategories();
}

/**
 * ¡NUEVO!
 * Obtiene una categoría por su ID.
 */
async function getCategoryById(id) {
  const category = await categoryRepository.findCategoryById(id);
  if (!category) {
    return { error: 'Categoría no encontrada.' };
  }
  return category;
}

async function updateCategory(id, updates) {
  if (updates.name) {
    const existingCategory = await categoryRepository.findCategoryByName(updates.name);
    if (existingCategory && existingCategory._id.toString() !== id) {
      return { error: 'Ya existe otra categoría con ese nombre.' };
    }
  }
  const wasUpdated = await categoryRepository.updateCategory(id, updates);
  if (!wasUpdated) {
    return { error: 'Categoría no encontrada o datos idénticos.' };
  }
  return { _id: id, ...updates };
}

async function deleteCategory(id) {
  const wasDeleted = await categoryRepository.deleteCategory(id);
  if (!wasDeleted) {
    return { error: 'Categoría no encontrada.' };
  }
  return { message: 'Categoría eliminada exitosamente.' };
}

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById, // <-- Añadido
  updateCategory,
  deleteCategory,
};