const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET
router.get('/:album_id', async (req, res) => {
  const { album_id } = req.params;
  const { limit = 10, offset = 0 } = req.query; // Default values for pagination
  try {
    const result = await pool.query(
      `SELECT * FROM tracks
      WHERE album_id = $1
      LIMIT $2 OFFSET $3`,
      [album_id, parseInt(limit), parseInt(offset)]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching tracks' });
  }
});

// CREATE a track for a specific album
router.post('/:album_id', async (req, res) => {
  const { album_id } = req.params;
  const { youtube_link } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO tracks (album_id, youtube_link)
       VALUES ($1, $2)
       RETURNING *`,
      [album_id, youtube_link]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error creating track' });
  }
});

// DELETE a track in an album
router.delete('/:album_id/:track_id', async (req, res) => {
  const { album_id, track_id } = req.params;
  try {
    const result = await pool.query(
      `DELETE FROM tracks
       WHERE album_id = $1 AND track_id = $2
       RETURNING *`,
      [album_id, track_id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Track not found' });
    }
    res.json({ message: 'Track deleted successfully', deletedTrack: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error deleting track' });
  }
});

module.exports = router;