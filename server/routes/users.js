const express = require('express');
const router  = express.Router();
const pool    = require('../config/db');

// CREATE user
router.post('/', async (req, res) => {
  const { name, email, password, dob, blood_type } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO users (name, email, password, dob, blood_type)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [name, email, password, dob, blood_type]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ all users
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;