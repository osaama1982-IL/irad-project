const jwt = require('jsonwebtoken');
const tokenBlacklist = require('./tokenBlacklist');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  if (tokenBlacklist.isBlacklisted(token)) {
    return res.status(401).json({ error: 'Token has been invalidated' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token has expired' });
      } else if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: 'Invalid token' });
      } else {
        return res.status(401).json({ error: 'Token verification failed' });
      }
    }

    req.user = {
      userId: decoded.userId,
      email: decoded.email,
    };
    req.token = token;
    next();
  });
};

const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next();
  }

  if (tokenBlacklist.isBlacklisted(token)) {
    return next();
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (!err) {
      req.user = {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role
      };
      req.token = token;
    }
    next();
  });
};

const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  next();
};

module.exports = {
  authenticateToken,
  optionalAuth,
  requireAdmin
};