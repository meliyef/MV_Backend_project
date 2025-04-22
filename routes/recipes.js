const express = require('express');
const router = express.Router();
const { Recipe } = require('../models'); 
const ensureAuthenticated = require('../middleware/authMiddleware'); // Middleware for protected routes

// Get all recipes
router.get('/', async (req, res) => {
  try {
    const recipes = await Recipe.findAll();
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recipes', error });
  }
});

// Get a single recipe by ID
router.get('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findByPk(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.status(200).json(recipe);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recipe', error });
  }
});

// Create a new recipe (protected route)
router.post('/', ensureAuthenticated, async (req, res) => {
  try {
    const { title, description, ingredients, instructions } = req.body;
    const newRecipe = await Recipe.create({
      title,
      description,
      ingredients: JSON.stringify(ingredients), // Convert ingredients to JSON
      instructions,
      UserId: req.oidc.user.id, // Assuming `req.oidc.user.id` contains the authenticated user's ID
    });
    res.status(201).json(newRecipe);
  } catch (error) {
    res.status(500).json({ message: 'Error creating recipe', error });
  }
});

// Update a recipe by ID (protected route)
router.put('/:id', ensureAuthenticated, async (req, res) => {
  try {
    const { title, description, ingredients, instructions } = req.body;
    const recipe = await Recipe.findByPk(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    if (recipe.UserId !== req.oidc.user.id) {
      return res.status(403).json({ message: 'You are not authorized to update this recipe' });
    }
    await recipe.update({
      title,
      description,
      ingredients: JSON.stringify(ingredients),
      instructions,
    });
    res.status(200).json(recipe);
  } catch (error) {
    res.status(500).json({ message: 'Error updating recipe', error });
  }
});

// Delete a recipe by ID (protected route)
router.delete('/:id', ensureAuthenticated, async (req, res) => {
  try {
    const recipe = await Recipe.findByPk(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    if (recipe.UserId !== req.oidc.user.id) {
      return res.status(403).json({ message: 'You are not authorized to delete this recipe' });
    }
    await recipe.destroy();
    res.status(200).json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting recipe', error });
  }
});

module.exports = router;