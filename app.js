require('dotenv').config(); // Load env variables

const express = require('express');
const cors = require('cors');
const passport = require('passport');

const jwt = require('jsonwebtoken');
const recipeRoutes = require('./routes/recipes');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');

const { authenticateJWT } = require('./middleware/authMiddleware');


const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // Parse JSON request bodies
app.use(passport.initialize()); // Initialize Passport for OAuth

// Health check route
app.get('/', (req, res) => {
  res.send('RecipeShare API is running successfully!');
});

// Public Routes (auth routes)
app.use('/auth', authRoutes); // Contains both local & OAuth login
// Protected Routes (require valid JWT token)
app.use('/recipes', authenticateJWT, recipeRoutes);
app.use('/users', authenticateJWT, userRoutes);
app.use('/admin', authenticateJWT, adminRoutes);
// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!' });
});

module.exports = app;
