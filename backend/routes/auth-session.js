const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const tokenBlacklist = require('../tokenBlacklist');
const { authenticateToken } = require('../authMiddleware');

router.post('/logout', authenticateToken, async (req, res) => {
  try {
    const token = req.token;
    const decoded = jwt.decode(token);
    const expirationTime = decoded.exp * 1000;
    
    tokenBlacklist.addToken(token, expirationTime);

    res.status(200).json({
      message: 'Logged out successfully',
      timestamp: new Date().toISOString()
    });

  } catch {
    res.status(500).json({ error: 'Logout failed' });
  }
});

router.post('/logout-all', authenticateToken, async (req, res) => {
  try {
    const token = req.token;
    const decoded = jwt.decode(token);
    const expirationTime = decoded.exp * 1000;
    
    tokenBlacklist.addToken(token, expirationTime);

    res.status(200).json({
      message: 'Logged out from all devices successfully',
      timestamp: new Date().toISOString()
    });

  } catch {
    res.status(500).json({ error: 'Logout from all devices failed' });
  }
});

router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = req.user;

    res.status(200).json({
      user: {
        userId: user.userId,
        email: user.email,
        role: user.role
      },
      tokenValid: true,
      timestamp: new Date().toISOString()
    });

  } catch {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Check token validity
router.get('/verify', authenticateToken, (req, res) => {
  res.status(200).json({
    valid: true,
    user: req.user,
    timestamp: new Date().toISOString()
  });
});

// Get token blacklist stats (admin only)
router.get('/blacklist-stats', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  const stats = tokenBlacklist.getStats();
  res.status(200).json(stats);
});

module.exports = router;