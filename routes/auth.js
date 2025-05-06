const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const passport = require('passport');
const OAuth2Strategy = require('passport-oauth2');
const axios = require('axios'); // We need axios to make a POST request to Auth0 to exchange the code for a token
require('dotenv').config();

// --- Auth0 OAuth2 Strategy Configuration ---
passport.use(new OAuth2Strategy({
  authorizationURL: `https://${process.env.AUTH0_DOMAIN}/authorize`,
  tokenURL: `https://${process.env.AUTH0_DOMAIN}/oauth/token`,
  clientID: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  callbackURL: process.env.AUTH0_CALLBACK_URL,
  scope: 'openid profile email',
},
async (accessToken, refreshToken, params, profile, done) => {
  try {
    // Decode ID token to extract user info
    const decoded = jwt.decode(params.id_token);

    const email = decoded.email;
    const name = decoded.name;

    // Check if user exists in your DB, otherwise create one
    let user = await User.findOne({ where: { email } });
    if (!user) {
      user = await User.create({ name, email, password: '', role: 'user' });
    }

    // Pass user info to next middleware
    return done(null, { id: user.id, email: user.email, role: user.role });
  } catch (err) {
    return done(err);
  }
}));

// Initialize Passport
router.use(passport.initialize());

// --- LOCAL REGISTER ---
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    res.status(201).json({
      message: 'User registered successfully!',
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
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

// --- LOCAL LOGIN ---
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

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
    console.error('Login error:', error);
    res.status(400).json({ message: 'Error logging in', error: error.message || error });
  }
});

// --- AUTH0 OAUTH LOGIN ---
router.get('/login/oauth', passport.authenticate('oauth2'));

// --- AUTH0 CALLBACK ---
router.get('/callback', async (req, res) => {
  try {
    const authorizationCode = req.query.code; // Extract the authorization code from the query

    // Make a POST request to exchange the code for access tokens (JWT, ID token)
    const tokenResponse = await axios.post(`https://${process.env.AUTH0_DOMAIN}/oauth/token`, {
      grant_type: 'authorization_code',
      client_id: process.env.AUTH0_CLIENT_ID,
      client_secret: process.env.AUTH0_CLIENT_SECRET,
      code: authorizationCode,
      redirect_uri: process.env.AUTH0_CALLBACK_URL,
    });

    const { access_token, id_token } = tokenResponse.data; // Access token and ID token received

    // Decode the ID token to extract user info
    const decoded = jwt.decode(id_token);

    const email = decoded.email;
    const name = decoded.name;

    // Check if user exists in your DB, otherwise create one
    let user = await User.findOne({ where: { email } });
    if (!user) {
      user = await User.create({ name, email, password: '', role: 'user' });
    }

    // Generate your own JWT token for the user to use in your API
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Redirect to frontend with JWT token (you can customize this URL)
    res.redirect(`http://localhost:3000?token=${token}`); // Redirect to frontend with JWT token
  } catch (error) {
    console.error('Callback error:', error);
    res.status(500).json({ message: 'Something went wrong during callback handling' });
  }
});

module.exports = router;
