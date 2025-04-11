const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json()); // to parse JSON bodies

app.get("/", (req, res) => {
  res.send("Hello from Album Store Server!");
});

// albums table routes
const albumsRoutes = require("./routes/albums");
app.use("/albums", albumsRoutes);

// tracks table routs
const tracksRoutes = require('./routes/tracks');
app.use('/tracks', tracksRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const pool = require("./db");
// Test connection
app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB connection failed" });
  }
});
