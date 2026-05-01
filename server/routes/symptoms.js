const express = require('express');
const router  = express.Router();
const pool    = require('../config/db');

router.post('/', async (req, res) => {
  const { user_id, symptom, severity } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO symptoms (user_id, symptom, severity)
       VALUES ($1,$2,$3) RETURNING *`,
      [user_id, symptom, severity]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:userId', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM symptoms WHERE user_id=$1 ORDER BY logged_at DESC',
      [req.params.userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM symptoms WHERE id=$1', [req.params.id]);
    res.json({ message: 'Symptom deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;