// middleware/authMiddleware.js
function ensureAuthenticated(req, res, next) {
    if (!req.oidc || !req.oidc.isAuthenticated()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    next();
  }
  
  module.exports = ensureAuthenticated;
  