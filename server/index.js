const express = require("express");
const cors = require("cors");
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());

const upload = multer({ dest: "uploads/" });

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const formData = new FormData();
    formData.append("file", fs.createReadStream(req.file.path));

    Object.keys(req.body).forEach(key => {
      formData.append(key, req.body[key]);
    });

    const response = await axios.post(
      "http://localhost:6000/process",
      formData,
      { headers: formData.getHeaders() }
    );

    res.json(response.data);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Python server error" });
  }
});
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    console.log("📥 File received in Node");

    const formData = new FormData();
    formData.append("file", fs.createReadStream(req.file.path));

    Object.keys(req.body).forEach(key => {
      formData.append(key, req.body[key]);
    });

    console.log("➡ Sending to Python...");

    const response = await axios.post(
      "http://localhost:6000/process",
      formData,
      { headers: formData.getHeaders() }
    );

    console.log("✅ Response from Python:", response.data);

    res.json(response.data);

  } catch (err) {
    console.error("❌ ERROR:", err);
    res.status(500).json({ error: "Python server error" });
  }
});


app.get("/download/:filename", async (req, res) => {
  const filename = req.params.filename;
  res.redirect(`http://localhost:6000/download?file=${filename}`);
});

app.listen(5000, () => {
  console.log("Node running on port 5000");
});
