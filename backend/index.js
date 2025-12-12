import express from "express";
import sqlite3 from "sqlite3";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const DB_PATH = process.env.DB_PATH || "./database.sqlite";

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer + Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "tourism-website",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 1200, height: 800, crop: "limit" }],
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Middleware
app.use(cors());
app.use(express.json());

// Database initialization
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error("Database connection error:", err.message);
  } else {
    console.log("Connected to SQLite database");
    initializeDatabase();
  }
});

// Initialize database tables
function initializeDatabase() {
  // Destinations table
  db.run(`
    CREATE TABLE IF NOT EXISTS destinations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      img TEXT,
      highlights TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Tours table
  db.run(`
    CREATE TABLE IF NOT EXISTS tours (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      destination TEXT NOT NULL,
      price TEXT,
      duration TEXT,
      description TEXT,
      images TEXT,
      overview TEXT,
      highlights TEXT,
      included TEXT,
      not_included TEXT,
      itinerary TEXT,
      is_recommended INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Insert sample data if tables are empty
  db.get("SELECT COUNT(*) as count FROM destinations", (err, row) => {
    if (!err && row.count === 0) {
      const destinations = [
        {
          name: "Istanbul",
          description: "Where East meets West",
          img: "istanbul.jpg",
        },
        {
          name: "Cappadocia",
          description: "Fairy chimneys and balloons",
          img: "cappadocia.jpg",
        },
        {
          name: "Antalya",
          description: "Mediterranean paradise",
          img: "antalya.jpg",
        },
      ];

      const stmt = db.prepare(
        "INSERT INTO destinations (name, description, img) VALUES (?, ?, ?)"
      );
      destinations.forEach((dest) => {
        stmt.run(dest.name, dest.description, dest.img);
      });
      stmt.finalize();
    }
  });
}

// Routes

// Get all destinations
app.get("/api/destinations", (req, res) => {
  db.all("SELECT * FROM destinations ORDER BY created_at DESC", (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// Get single destination
app.get("/api/destinations/:id", (req, res) => {
  db.get(
    "SELECT * FROM destinations WHERE id = ?",
    [req.params.id],
    (err, row) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else if (!row) {
        res.status(404).json({ error: "Destination not found" });
      } else {
        res.json(row);
      }
    }
  );
});

// Create new destination
app.post("/api/destinations", (req, res) => {
  const { name, description, img, highlights } = req.body;
  db.run(
    "INSERT INTO destinations (name, description, img, highlights) VALUES (?, ?, ?, ?)",
    [name, description, img, highlights || ""],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({ id: this.lastID, name, description, img, highlights });
      }
    }
  );
});

// Update destination
app.put("/api/destinations/:id", (req, res) => {
  const { name, description, img, highlights } = req.body;
  db.run(
    "UPDATE destinations SET name = ?, description = ?, img = ?, highlights = ? WHERE id = ?",
    [name, description, img, highlights || "", req.params.id],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({ message: "Destination updated", changes: this.changes });
      }
    }
  );
});

// Delete destination
app.delete("/api/destinations/:id", (req, res) => {
  db.run(
    "DELETE FROM destinations WHERE id = ?",
    [req.params.id],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({ message: "Destination deleted", changes: this.changes });
      }
    }
  );
});

// Get all tours
app.get("/api/tours", (req, res) => {
  const { destination } = req.query;
  let query = "SELECT * FROM tours";
  let params = [];

  if (destination) {
    query += " WHERE destination = ?";
    params.push(destination);
  }

  query += " ORDER BY created_at DESC";

  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// Get single tour
app.get("/api/tours/:id", (req, res) => {
  db.get("SELECT * FROM tours WHERE id = ?", [req.params.id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (!row) {
      res.status(404).json({ error: "Tour not found" });
    } else {
      res.json(row);
    }
  });
});

// Create new tour
app.post("/api/tours", (req, res) => {
  const {
    name,
    destination,
    price,
    duration,
    description,
    images,
    overview,
    highlights,
    included,
    not_included,
    itinerary,
    is_recommended,
  } = req.body;
  db.run(
    "INSERT INTO tours (name, destination, price, duration, description, images, overview, highlights, included, not_included, itinerary, is_recommended) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      name,
      destination,
      price,
      duration,
      description,
      images,
      overview,
      highlights,
      included,
      not_included,
      itinerary,
      is_recommended ? 1 : 0,
    ],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({
          id: this.lastID,
          name,
          destination,
          price,
          duration,
          description,
          images,
          overview,
          highlights,
          included,
          not_included,
          itinerary,
        });
      }
    }
  );
});

// Update tour
app.put("/api/tours/:id", (req, res) => {
  const {
    name,
    destination,
    price,
    duration,
    description,
    images,
    overview,
    highlights,
    included,
    not_included,
    itinerary,
    is_recommended,
  } = req.body;
  db.run(
    "UPDATE tours SET name = ?, destination = ?, price = ?, duration = ?, description = ?, images = ?, overview = ?, highlights = ?, included = ?, not_included = ?, itinerary = ?, is_recommended = ? WHERE id = ?",
    [
      name,
      destination,
      price,
      duration,
      description,
      images,
      overview,
      highlights,
      included,
      not_included,
      itinerary,
      is_recommended ? 1 : 0,
      req.params.id,
    ],
    function (err) {
      if (err) {
        console.error("Update tour error:", err);
        res.status(500).json({ error: err.message });
      } else {
        res.json({ message: "Tour updated", changes: this.changes });
      }
    }
  );
});

// Delete tour
app.delete("/api/tours/:id", (req, res) => {
  db.run("DELETE FROM tours WHERE id = ?", [req.params.id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ message: "Tour deleted", changes: this.changes });
    }
  });
});

// Image upload endpoint
app.post("/api/upload", upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    res.json({
      url: req.file.path,
      public_id: req.file.filename,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Failed to upload image" });
  }
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on("SIGINT", () => {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log("Database connection closed");
    process.exit(0);
  });
});
