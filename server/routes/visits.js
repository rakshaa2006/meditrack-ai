const express = require('express');
const router  = express.Router();
const pool    = require('../config/db');

// CREATE
router.post('/', async (req, res) => {
  const { user_id, doctor_name, specialty, visit_date, notes, diagnosis } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO visits (user_id, doctor_name, specialty, visit_date, notes, diagnosis)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [user_id, doctor_name, specialty, visit_date, notes, diagnosis]
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
      'SELECT * FROM visits WHERE user_id = $1 ORDER BY visit_date DESC',
      [req.params.userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
router.put('/:id', async (req, res) => {
  const { notes, diagnosis } = req.body;
  try {
    const result = await pool.query(
      'UPDATE visits SET notes=$1, diagnosis=$2 WHERE id=$3 RETURNING *',
      [notes, diagnosis, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM visits WHERE id=$1', [req.params.id]);
    res.json({ message: 'Visit deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;