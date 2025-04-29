const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../middleware/authMiddleware');
const User = require('../models/userModel');

// Get current logged-in user
router.get('/me', authenticateJWT, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }, // Don't return password
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching user', error });
  }
});

// Update current user info
router.put('/me', authenticateJWT, async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findByPk(req.user.id, {
        attributes: { exclude: ['password'] }, // Don't return password
      });
    if (!user) return res.status(404).json({ message: 'User not found' });

    await user.update({ name, email });
    res.status(200).json({ message: 'User updated successfully', user });
  } catch (error) {
    res.status(400).json({ message: 'Error updating user', error });
  }
});

// Delete current user account
router.delete('/me', authenticateJWT, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await user.destroy();
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting user', error });
  }
});

module.exports = router;
