const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3001;
require('dotenv').config();

const AWS = require('aws-sdk');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

// Configure S3 client to use a local endpoint (e.g., with LocalStack)
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,         // set in your .env file
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,     // set in your .env file
  endpoint: process.env.AWS_S3_ENDPOINT,                  // e.g., "http://localhost:4572"
  s3ForcePathStyle: true,                                 // required for localstack
  region: process.env.AWS_REGION                          // e.g., "us-east-1"
});

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

const uploadRoutes = require('./routes/upload'); // new upload route
app.use("/upload", uploadRoutes); // Mount the upload route at /upload

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
