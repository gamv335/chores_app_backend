// middleware/auth.js
const jwt = require('jsonwebtoken');

// JWT secret
const JWT_SECRET = 'your_jwt_secret';  // Replace with your actual secret

module.exports = function (req, res, next) {
  // Get token from the header
  const token = req.header('x-auth-token');

  // Check if token is not provided
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // The decoded token contains the user's ID (if passed in during token creation)
    next(); // Move to the next middleware or route handler
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
