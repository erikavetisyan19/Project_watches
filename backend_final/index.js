import express from "express";
import mysql from "mysql";
import cors from "cors";
import multer from "multer";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Creating the app
const app = express();

// Connecting to the database
let db;

try {
    db = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "watchesadmin",
        database: "watches"
    });
    db.connect();
} catch (error) {
    console.log(error);
}

// Allows us to send any JSON file to the client
app.use(express.json());

// Allows our backend server to use the API
app.use(cors());

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage }); // Specify the storage configuration for uploaded files

// Get the current file path
const __filename = fileURLToPath(import.meta.url);
// Get the current directory path
const __dirname = dirname(__filename);

// Serve static files from the "uploads" directory
app.use("/uploads", express.static("uploads"));


// API endpoint for the root URL
app.get("/", (req, res) => {
    res.json("Hello, this is the backend");
});

// API endpoint to fetch models
app.get("/models", (req, res) => {
    const q = "SELECT * FROM models";
    db.query(q, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

// API endpoint to create a new model
app.post("/models", upload.single("face"), (req, res) => {
    const q = "INSERT INTO models (`Title`, `desc`, `price`, `face`) VALUES (?, ?, ?, ?)";
    const avatar = req.file ? req.file.originalname : null;
    const values = [
        req.body.Title,
        req.body.desc,
        req.body.price,
        avatar
    ];

    db.query(q, values, (err, data) => {
        if (err) return res.json(err);
        return res.json("Watch has been created");
    });
});

// API endpoint to delete a model
app.delete("/models/:id", (req, res) => {
    const modelId = req.params.id;
    const q = "DELETE FROM models WHERE id = ?";

    db.query(q, [modelId], (err, data) => {
        if (err) return res.json(err);
        return res.json("Watch has been deleted");
    });
});

// API endpoint to update a model
app.put("/models/:id", upload.single("face"), (req, res) => {
    const modelId = req.params.id;
    const q =
      "UPDATE models SET `Title` = ?, `desc` = ?, `price` = ?, `face` = ? WHERE id = ?";
  
    const avatar = req.file ? req.file.originalname : null;
    const values = [
      req.body.Title,
      req.body.desc,
      req.body.price,
      avatar,
      modelId
    ];
  
    db.query(q, values, (err, data) => {
      if (err) return res.json(err);
      return res.json("Watch has been updated");
    });
  });
  

// Specifying the port to connect
app.listen(8800, () => {
    console.log("Connected to backend");
});
