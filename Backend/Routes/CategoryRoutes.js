
const express = require('express');
const router = express.Router();
const categoryController = require('../Controllers/CategoryController');
const { authenticateUser, isAdmin } = require('../Middlewares/authMiddleware');

// Routes for CRUD operations
router.post('/',authenticateUser, isAdmin, categoryController.createCategory);
router.get('/',categoryController.getAllCategories); // New route for getting all categories
router.get('/:id', categoryController.getCategory);
router.put('/:id',authenticateUser, isAdmin, categoryController.updateCategory);
router.delete('/:id',authenticateUser, isAdmin, categoryController.deleteCategory);

module.exports = router;
