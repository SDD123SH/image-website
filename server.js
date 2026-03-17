const express = require("express");
const multer = require("multer");
const app = express();

const storage = multer.diskStorage({
 destination: "uploads/",
 filename: (req, file, cb) => {
   cb(null, Date.now() + "-" + file.originalname);
 }
});

const upload = multer({ storage });

app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

app.post("/upload", upload.single("image"), (req, res) => {
 res.send("Image uploaded successfully!");
});

app.listen(3000, () => {
 console.log("Server running on http://localhost:3000");
});