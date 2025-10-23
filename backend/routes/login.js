const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Simple rate limiting
const loginAttempts = new Map();
const MAX_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes

const isRateLimited = (email) => {
  const attempts = loginAttempts.get(email);
  if (!attempts) return false;
  
  if (attempts.count >= MAX_ATTEMPTS) {
    const timeSinceLastAttempt = Date.now() - attempts.lastAttempt;
    if (timeSinceLastAttempt < LOCKOUT_TIME) {
      return true;
    } else {
      loginAttempts.delete(email);
      return false;
    }
  }
  return false;
};

const recordLoginAttempt = (email, success) => {
  if (success) {
    loginAttempts.delete(email);
    return;
  }
  
  const attempts = loginAttempts.get(email) || { count: 0, lastAttempt: 0 };
  attempts.count += 1;
  attempts.lastAttempt = Date.now();
  loginAttempts.set(email, attempts);
};

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required.' });
    }

    const trimmedEmail = email.trim().toLowerCase();

    if (isRateLimited(trimmedEmail)) {
      return res.status(429).json({ 
        error: 'Too many login attempts. Please try again later.' 
      });
    }

    const { rows } = await pool.query(
      'SELECT id, firstname, lastname, email, city, role, password FROM users WHERE email = $1',
      [trimmedEmail]
    );
    
    if (rows.length === 0) {
      recordLoginAttempt(trimmedEmail, false);
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    
    if (!match) {
      recordLoginAttempt(trimmedEmail, false);
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    recordLoginAttempt(trimmedEmail, true);
    delete user.password;
    
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET,
      { 
        expiresIn: process.env.JWT_EXPIRES_IN || '24h',
        issuer: 'osma-weather-api'
      }
    );
    
    return res.status(200).json({
      user,
      token,
      expiresIn: process.env.JWT_EXPIRES_IN || '24h'
    });
    
  } catch (err) {
    return res.status(500).json({ error: 'Database error.' });
  }
});

module.exports = router;