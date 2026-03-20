const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();

// Storage setup
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Serve static files
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

// Home route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Upload route
app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.send("No file uploaded");
  }

  res.send(`
    <h2>Image Uploaded Successfully ✅</h2>
    <img src="/uploads/${req.file.filename}" width="300"/>
    <br><br>
    <a href="/">Upload another</a>
    <br><br>
    <a href="/gallery">Go to Gallery</a>
  `);
});

// ✅ Gallery route (ONLY ONCE)
app.get("/gallery", (req, res) => {
  fs.readdir("uploads", (err, files) => {
    if (err) {
      return res.send("Error loading images");
    }

    let images = files.map(file => {
      return `<img src="/uploads/${file}" width="200" style="margin:10px;">`;
    }).join("");

    res.send(`
      <h1>Gallery</h1>
      ${images}
      <br><br>
      <a href="/">Back to Upload</a>
    `);
  });
});

// Port
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});