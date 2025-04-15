const express = require('express');
const router = express.Router();

// Register a new user
router.post('/register', (req, res) => {
    res.status(201).json({ message: 'User registered successfully!' });
});

// Log in a user
router.post('/login', (req, res) => {
    res.status(200).json({ message: 'User logged in successfully!' });
});

module.exports = router;
