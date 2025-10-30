const { validationResult } = require('express-validator');
const categoryService = require('../services/category.service');

async function create(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, description } = req.body;
    const result = await categoryService.createCategory({ name, description });

    if (result.error) {
      return res.status(409).json({ message: result.error }); // 409 Conflict
    }
    
    return res.status(201).json(result);
  } catch (error) {
    return res.status(500).json({ message: 'Error interno del servidor.' });
  }
}

async function getAll(req, res) {
  try {
    const categories = await categoryService.getAllCategories();
    return res.status(200).json(categories);
  } catch (error) {
    return res.status(500).json({ message: 'Error interno del servidor.' });
  }
}

async function getOne(req, res) {
  try {
    const { id } = req.params;
    const result = await categoryService.getCategoryById(id);
    
    if (result.error) {
      return res.status(404).json({ message: result.error }); // 404 Not Found
    }
    
    return res.status(200).json(result);
  } catch (error) {
    // Manejo de error si el ID es inválido para MongoDB
    if (error.name === 'BSONError') {
      return res.status(400).json({ message: 'ID de categoría inválido.' });
    }
    return res.status(500).json({ message: 'Error interno del servidor.' });
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
    if (error.name === 'BSONError') {
      return res.status(400).json({ message: 'ID de categoría inválido.' });
    }
    return res.status(500).json({ message: 'Error interno del servidor.' });
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
    if (error.name === 'BSONError') {
      return res.status(400).json({ message: 'ID de categoría inválido.' });
    }
    return res.status(500).json({ message: 'Error interno del servidor.' });
  }
}

module.exports = {
  create,
  getAll,
  getOne,
  update,
  deleteOne,
};