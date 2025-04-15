const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const s3 = new S3Client({
  region: process.env.AWS_REGION, // e.g., "us-east-1"
  endpoint: process.env.AWS_S3_ENDPOINT, // e.g., "http://localhost:4566"
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID, // set in your .env file
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // set in your .env file
  },
  forcePathStyle: true, // required for LocalStack
});

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "No file provided" });
    }
    const key = `${Date.now()}-${file.originalname}`;
    const params = {
      Bucket: process.env.AWS_S3_BUCKET, // Name of your bucket (set in your .env)
      Key: key, // Unique file name
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    const command = new PutObjectCommand(params);
    await s3.send(command);

    // Construct a URL manually. Adjust the URL format if needed.
    const fileURL = `${process.env.AWS_S3_ENDPOINT}/${process.env.AWS_S3_BUCKET}/${key}`;

    res.json({
      message: "File uploaded successfully",
      data: { Location: fileURL },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error uploading file" });
  }
});

module.exports = router;
