const jwt = require('jsonwebtoken');
const { User } = require('../models');

exports.verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }
  
  // Handle "Bearer <token>" format
  const tokenString = token.startsWith('Bearer ') ? token.slice(7, token.length) : token;

  jwt.verify(tokenString, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const user = await User.findByPk(decoded.userId);
        if(!user) return res.status(404).json({message: 'User not found'});
        req.user = user;
        next();
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
  });
};

exports.checkSession = async (req, res, next) => {
  if (req.session && req.session.userId) {
      // Optional: Re-fetch user from DB to ensure it still exists/is valid
      try {
          const user = await User.findByPk(req.session.userId);
          if (user) {
              req.user = user; // Attach to req for consistency
              return next();
          }
      } catch (error) {
          console.error("Session user fetch error", error);
      }
  }
  res.status(401).json({ message: 'Unauthorized: No active session' });
};
