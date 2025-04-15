const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET all albums
router.get("/", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM albums");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// GET an album
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query(
      "SELECT * FROM albums WHERE album_id = $1",
      [id]
    );
    if (!rows[0]) {
      return res.status(404).json({ error: "Album not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// CREATE an album
router.post("/", async (req, res) => {
  const { title, thumbnail_url = null } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO albums (title, thumbnail_url)
       VALUES ($1, $2) RETURNING *`,
      [title, thumbnail_url]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error creating album" });
  }
});

// UPDATE an album
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, thumbnail_url = null } = req.body;

  try {
    const result = await pool.query(
      `UPDATE albums
       SET title = $1, thumbnail_url = $2, updated_at = NOW()
       WHERE album_id = $3
       RETURNING *`,
      [title, thumbnail_url, id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Album not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error updating album" });
  }
});

// update album thumbnail
router.put("/:id/thumbnail", async (req, res) => {
  const { id } = req.params;
  const { thumbnail_url} = req.body;

  try {
    const result = await pool.query(
      `UPDATE albums
       SET thumbnail_url = $1, updated_at = NOW()
       WHERE album_id = $2
       RETURNING *`,
      [thumbnail_url, id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Album not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error updating album thumbnail" });
  }
});

// INCREMENT likes for an album
router.post("/:id/like", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `UPDATE albums
       SET like_count = COALESCE(like_count, 0) + 1
       WHERE album_id = $1
       RETURNING *`,
      [id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Album not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error incrementing likes" });
  }
});

// INCREMENT dislikes for an album
router.post("/:id/dislike", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `UPDATE albums
       SET dislike_count = COALESCE(dislike_count, 0) + 1
       WHERE album_id = $1
       RETURNING *`,
      [id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Album not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error incrementing dislikes" });
  }
});

// DELETE an album
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM albums WHERE album_id = $1 RETURNING *",
      [id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Album not found" });
    }
    res.json({
      message: "Album deleted successfully",
      deletedAlbum: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error deleting album" });
  }
});

module.exports = router;
