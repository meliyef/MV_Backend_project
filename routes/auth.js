const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const  User  = require('../models/userModel');


router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    // Create the user in the database
    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    res.status(201).json({
      message: 'User registered successfully!',
      user: { id: user.id, name: user.name, email: user.email, role: user.role }, // exclude password
    });
  } catch (error) {
    console.error('Registration error:', error);
    const message =
      error.name === 'SequelizeUniqueConstraintError'
        ? 'Email already in use'
        : error.message || 'Something went wrong';
    res.status(400).json({ message, error: error.errors || error });
  }
});


router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare provided password with hashed one
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error(' Login error:', error);
    res.status(400).json({
      message: 'Error logging in',
      error: error.message || error,
    });
  }
});

module.exports = router;
