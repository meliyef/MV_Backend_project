const express = require('express');
const router = express.Router();
const { Recipe } = require('../models');
const { authenticateJWT } = require('../middleware/authMiddleware');

router.get('/', authenticateJWT, async (req, res) => {
  try {
    const recipes = await Recipe.findAll({ where: { UserId: req.user.id } });
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching your recipes', error });
  }
});

router.post('/', authenticateJWT, async (req, res) => {
  try {
    const { title, description, ingredients, instructions } = req.body;
    const recipe = await Recipe.create({
      title,
      description,
      ingredients: JSON.stringify(ingredients),
      instructions,
      UserId: req.user.id,
    });
    res.status(201).json(recipe);
  } catch (error) {
    res.status(500).json({ message: 'Error creating recipe', error });
  }
});

router.put('/:id', authenticateJWT, async (req, res) => {
  try {
    const recipe = await Recipe.findByPk(req.params.id);
    if (!recipe || recipe.UserId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this recipe' });
    }

    const { title, description, ingredients, instructions } = req.body;
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

router.delete('/:id', authenticateJWT, async (req, res) => {
  try {
    const recipe = await Recipe.findByPk(req.params.id);
    if (!recipe || recipe.UserId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this recipe' });
    }

    await recipe.destroy();
    res.status(200).json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting recipe', error });
  }
});

module.exports = router;