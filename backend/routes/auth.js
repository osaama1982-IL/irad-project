const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcryptjs');

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

router.post('/register', async (req, res) => {
  try {
    const { firstname, lastname, email, city, role, password } = req.body;
    const userRole = role || 'user';

    if (!firstname || !lastname || !email || !city || !password) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedFirstname = firstname.trim();
    const trimmedLastname = lastname.trim();
    const trimmedCity = city.trim();

    if (!validateEmail(trimmedEmail)) {
      return res.status(400).json({ error: 'Invalid email format.' });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({ 
        error: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.' 
      });
    }

    if (userRole !== 'user' && userRole !== 'admin') {
      return res.status(400).json({ error: 'Invalid role specified.' });
    }

    const { rows: existing } = await pool.query('SELECT id FROM users WHERE email = $1', [trimmedEmail]);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Email already registered.' });
    }

    const hashed = await bcrypt.hash(password, 12);

    const insertQuery = `
      INSERT INTO users (firstname, lastname, email, city, role, password)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, firstname, lastname, email, city, role
    `;
    const values = [trimmedFirstname, trimmedLastname, trimmedEmail, trimmedCity, userRole, hashed];
    const { rows } = await pool.query(insertQuery, values);

    return res.status(201).json(rows[0]);
    
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Email already registered.' });
    }
    return res.status(500).json({ error: 'Database error.' });
  }
});

module.exports = router;
