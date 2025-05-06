const jwt = require('jsonwebtoken');

function isAdmin(req, res, next) {
  // Check if the user is authenticated and has the 'admin' role
  if (req.user && req.user.role === 'admin') {
    return next(); // User is an admin, proceed to the next middleware or route handler
  }
  return res.status(403).json({ message: 'Access denied. Admins only.' });
}

// Middleware to authenticate JWT
function authenticateJWT(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]; // Extract token from "Authorization: Bearer <token>"
  if (!token) {
    return res.status(401).json({ message: 'Access token is missing or invalid' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
    req.user = decoded; // Attach decoded user info to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    res.status(403).json({ message: 'Invalid or expired token' });
  }
}

// Middleware for role-based access control
function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'You are not authorized to access this resource' });
    }
    next();
  };
}

module.exports = { authenticateJWT, authorizeRoles,isAdmin };
  