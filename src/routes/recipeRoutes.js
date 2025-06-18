const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');
const auth = require('../middleware/auth');

// All recipe routes require authentication
router.use(auth);

// Create a new recipe
router.post('/', recipeController.create);

// Get all recipes
router.get('/', recipeController.getAll);

// Get user's recipes
router.get('/my-recipes', recipeController.getUserRecipes);

// Get a specific recipe
router.get('/:id', recipeController.getOne);

// Update a recipe
router.patch('/:id', recipeController.update);

// Delete a recipe
router.delete('/:id', recipeController.delete);

module.exports = router;
