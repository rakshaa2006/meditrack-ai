const express = require('express');
const router  = express.Router();
const pool    = require('../config/db');

// CREATE
router.post('/', async (req, res) => {
  const { user_id, visit_id, test_name, value, unit, reference_min, reference_max, test_date } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO lab_results (user_id, visit_id, test_name, value, unit, reference_min, reference_max, test_date)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [user_id, visit_id, test_name, value, unit, reference_min, reference_max, test_date]
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
      'SELECT * FROM lab_results WHERE user_id = $1 ORDER BY test_date DESC',
      [req.params.userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM lab_results WHERE id=$1', [req.params.id]);
    res.json({ message: 'Lab result deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;