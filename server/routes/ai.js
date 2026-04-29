const express = require('express');
const router  = express.Router();
const { summarizeHealthHistory } = require('../services/aiService');

router.get('/summary/:userId', async (req, res) => {
  try {
    const summary = await summarizeHealthHistory(req.params.userId);
    res.json({ summary });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;