// controllers/category.controller.js

const { validationResult } = require('express-validator');
const categoryService = require('../services/category.service');

// Función de ayuda para manejar errores
function handleControllerError(res, error) {
  console.error(error); // <-- ¡LA LÍNEA QUE FALTABA!
  if (error.name === 'BSONError') {
    return res.status(400).json({ message: 'ID de categoría inválido.' });
  }
  return res.status(500).json({ message: 'Error interno del servidor.' });
}

async function create(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { name, description } = req.body;
    const result = await categoryService.createCategory({ name, description });
    if (result.error) {
      return res.status(409).json({ message: result.error });
    }
    return res.status(201).json(result);
  } catch (error) {
    return handleControllerError(res, error); // Usamos la nueva función
  }
}

async function getAll(req, res) {
  try {
    const categories = await categoryService.getAllCategories();
    return res.status(200).json(categories);
  } catch (error) {
    return handleControllerError(res, error); // Usamos la nueva función
  }
}

async function getOne(req, res) {
  try {
    const { id } = req.params;
    const result = await categoryService.getCategoryById(id);
    if (result.error) {
      return res.status(404).json({ message: result.error });
    }
    return res.status(200).json(result);
  } catch (error) {
    return handleControllerError(res, error); // Usamos la nueva función
  }
}

async function update(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const result = await categoryService.updateCategory(id, { name, description });
    if (result.error) {
      return res.status(404).json({ message: result.error });
    }
    return res.status(200).json(result);
  } catch (error) {
    return handleControllerError(res, error); // Usamos la nueva función
  }
}

async function deleteOne(req, res) {
  try {
    const { id } = req.params;
    const result = await categoryService.deleteCategory(id);
    if (result.error) {
      return res.status(404).json({ message: result.error });
    }
    return res.status(200).json(result);
  } catch (error) {
    return handleControllerError(res, error); // Usamos la nueva función
  }
}

module.exports = {
  create,
  getAll,
  getOne,
  update,
  deleteOne,
};