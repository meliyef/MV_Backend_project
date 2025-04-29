require('dotenv').config(); // Load env variables

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const recipeRoutes = require('./routes/recipes');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');

const { authenticateJWT } = require('./middleware/authMiddleware'); // Correct import

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // for parsing application/json

const {
  AUTH0_SECRET = 'a long, randomly-generated string stored in env', // generate one by using: `openssl rand -base64 32`
  AUTH0_AUDIENCE = 'http://localhost:3000',
  AUTH0_CLIENT_ID,
  AUTH0_BASE_URL,
} = process.env;

const config = {
  authRequired: true, // require login for all routes
  auth0Logout: true,
  secret: AUTH0_SECRET,
  baseURL: AUTH0_AUDIENCE,
  clientID: AUTH0_CLIENT_ID,
  issuerBaseURL: AUTH0_BASE_URL,
};

// Health check
app.get('/', (req, res) => {
  res.send('RecipeShare API is running successfully!');
});

// Public Routes (auth routes)
app.use('/auth', authRoutes);  // No authenticateJWT here, since auth routes should be accessible to everyone

// Protected Routes (requires JWT token)
app.use('/recipes', authenticateJWT, recipeRoutes);
app.use('/users', authenticateJWT, userRoutes);

// Error Handling Middleware (optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!' });
});

module.exports = app;
