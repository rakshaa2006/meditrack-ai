const express = require('express');
const router  = express.Router();
const pool    = require('../config/db');

// CREATE
router.post('/', async (req, res) => {
  const { user_id, name, dosage, frequency, start_date, end_date } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO medications (user_id, name, dosage, frequency, start_date, end_date)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [user_id, name, dosage, frequency, start_date, end_date]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ
router.get('/:userId', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM medications WHERE user_id = $1 ORDER BY start_date DESC',
      [req.params.userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
router.put('/:id', async (req, res) => {
  const { dosage, frequency, is_active } = req.body;
  try {
    const result = await pool.query(
      'UPDATE medications SET dosage=$1, frequency=$2, is_active=$3 WHERE id=$4 RETURNING *',
      [dosage, frequency, is_active, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM medications WHERE id=$1', [req.params.id]);
    res.json({ message: 'Medication deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;