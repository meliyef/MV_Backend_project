const express = require('express');
const router = express.Router();
const { authenticateJWT, isAdmin } = require('../middleware/authMiddleware');
const User = require('../models/userModel'); // Import the User model
const Recipe = require('../models/recipeModel'); // Import the Recipe model

// Get all users (Admin only)
router.get('/users', authenticateJWT, isAdmin, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] }, // Exclude passwords from the response
    });
    res.status(200).json({ message: 'All users retrieved successfully', users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users', error });
  }
});

// Get a specific user by ID (Admin only)
router.get('/users/:id', authenticateJWT, isAdmin, async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }, // Exclude passwords from the response
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: `User with ID: ${userId} retrieved successfully`, user });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Error fetching user', error });
  }
});

// Create a new user (Admin only)
router.post('/users', authenticateJWT, isAdmin, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if the email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Create the new user
    const newUser = await User.create({ name, email, password, role });
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Error creating user', error });
  }
});

// Update a user by ID (Admin only)
router.put('/users/:id', authenticateJWT, isAdmin, async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, email, role } = req.body;

    // Find the user by ID
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the user
    await user.update({ name, email, role });
    res.status(200).json({ message: `User with ID: ${userId} updated successfully`, user });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Error updating user', error });
  }
});

// Delete a user by ID (Admin only)
router.delete('/users/:id', authenticateJWT, isAdmin, async (req, res) => {
  try {
    const userId = req.params.id;

    // Find the user by ID
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete the user
    await user.destroy();
    res.status(200).json({ message: `User with ID: ${userId} deleted successfully` });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Error deleting user', error });
  }
});

// Get all recipes (Admin only)
router.get('/recipes', authenticateJWT, isAdmin, async (req, res) => {
  try {
    const recipes = await Recipe.findAll({
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email'], // Include user details
        },
      ],
    });

    res.status(200).json({ message: 'All recipes retrieved successfully', recipes });
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ message: 'Error fetching recipes', error });
  }
});

module.exports = router;