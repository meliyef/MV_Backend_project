const express = require('express');
const isAdmin = require('./middleware/authMiddleware');

const router = express.Router();

// Get all users (Admin only)
router.get('/users', isAdmin, (req, res) => {
    res.json({ message: 'Get all users' });
});

// Get a specific user by ID (Admin only)
router.get('/users/:id', isAdmin, (req, res) => {
    const userId = req.params.id;
    res.json({ message: `Get user with ID: ${userId}` });
});

// Create a new user (Admin only)
router.post('/users', isAdmin, (req, res) => {
    const newUser = req.body;
    res.json({ message: 'User created', user: newUser });
});

// Update a user by ID (Admin only)
router.put('/users/:id', isAdmin, (req, res) => {
    const userId = req.params.id;
    const updatedUser = req.body;
    res.json({ message: `User with ID: ${userId} updated`, user: updatedUser });
});

// Delete a user by ID (Admin only)
router.delete('/users/:id', isAdmin, (req, res) => {
    const userId = req.params.id;
    res.json({ message: `User with ID: ${userId} deleted` });
});

//Get Admin recipe route (All recipes from all users)
router.get('/admin/recipes', isAdmin, (req,res) => {
    // Fetch all recipes from the database (mocked for now)
    const recipes = [
        { id: 1, title: 'Spaghetti Bolognese', author: 'User1' },
        { id: 2, title: 'Chicken Curry', author: 'User2' },
        { id: 3, title: 'Beef Stroganoff', author: 'User3' }
    ];

    res.json({ message: 'All recipes retrieved successfully', recipes });
})

module.exports = router
