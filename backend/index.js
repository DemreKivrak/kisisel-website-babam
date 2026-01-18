import express from "express";
import sqlite3 from "sqlite3";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

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
const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? process.env.FRONTEND_URL || "*"
      : "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

// Database initialization
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error("Database connection error:", err.message);
  } else {
    console.log("Connected to SQLite database at:", DB_PATH);
    console.log("Environment variables - DB_PATH:", process.env.DB_PATH);
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

  // Users table for admin authentication
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Rental cars table
  db.run(`
    CREATE TABLE IF NOT EXISTS rental_cars (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      model TEXT NOT NULL,
      description TEXT,
      images TEXT,
      features TEXT,
      transmission TEXT,
      fuel TEXT,
      doors TEXT,
      daily_price TEXT,
      weekly_price TEXT,
      color TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Gallery table
  db.run(`
    CREATE TABLE IF NOT EXISTS gallery (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      url TEXT NOT NULL,
      thumbnail TEXT,
      title TEXT NOT NULL,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Tour Pricing table
  db.run(`
    CREATE TABLE IF NOT EXISTS tour_pricing (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tour_id INTEGER NOT NULL,
      min_persons INTEGER NOT NULL,
      max_persons INTEGER,
      price_per_person TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE
    )
  `);

  // Create default admin user if not exists
  db.get("SELECT COUNT(*) as count FROM users", (err, row) => {
    if (!err && row.count === 0) {
      const defaultUsername = "admin";
      const defaultPassword = "admin123"; // Şifrenizi değiştirin!
      bcrypt.hash(defaultPassword, 10, (err, hash) => {
        if (!err) {
          db.run("INSERT INTO users (username, password) VALUES (?, ?)", [
            defaultUsername,
            hash,
          ]);
          console.log(
            "Default admin user created - Username: admin, Password: admin123"
          );
          console.log(
            "⚠️  IMPORTANT: Change the default password immediately!"
          );
        }
      });
    }
  });

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

// JWT Secret Key
const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-this-in-production";

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// Routes

// Authentication endpoints
app.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  db.get(
    "SELECT * FROM users WHERE username = ?",
    [username],
    async (err, user) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = jwt.sign(
        { id: user.id, username: user.username },
        JWT_SECRET,
        { expiresIn: "24h" }
      );

      res.json({
        token,
        user: { id: user.id, username: user.username },
      });
    }
  );
});

// Verify token endpoint
app.get("/api/auth/verify", verifyToken, (req, res) => {
  res.json({ valid: true, user: req.user });
});

// Change password endpoint
app.post("/api/auth/change-password", verifyToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res
      .status(400)
      .json({ error: "Current password and new password are required" });
  }

  if (newPassword.length < 6) {
    return res
      .status(400)
      .json({ error: "New password must be at least 6 characters" });
  }

  try {
    // Get current user from database
    db.get(
      "SELECT * FROM users WHERE id = ?",
      [req.user.id],
      async (err, user) => {
        if (err) {
          return res.status(500).json({ error: "Database error" });
        }

        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }

        // Verify current password
        const isValidPassword = await bcrypt.compare(
          currentPassword,
          user.password
        );
        if (!isValidPassword) {
          return res
            .status(401)
            .json({ error: "Current password is incorrect" });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password in database
        db.run(
          "UPDATE users SET password = ? WHERE id = ?",
          [hashedPassword, req.user.id],
          (err) => {
            if (err) {
              return res
                .status(500)
                .json({ error: "Failed to update password" });
            }

            res.json({ message: "Password changed successfully" });
          }
        );
      }
    );
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Setup admin endpoint (TEMPORARY - remove after first use)
app.post("/api/setup-admin", async (req, res) => {
  try {
    // Check if any users exist
    db.get("SELECT COUNT(*) as count FROM users", async (err, row) => {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }

      // If users exist, don't allow setup
      if (row.count > 0) {
        return res.status(400).json({ error: "Admin already exists" });
      }

      // Create default admin
      const defaultUsername = "admin";
      const defaultPassword = "admin123";
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);

      db.run(
        "INSERT INTO users (username, password) VALUES (?, ?)",
        [defaultUsername, hashedPassword],
        (err) => {
          if (err) {
            return res.status(500).json({ error: "Failed to create admin" });
          }

          res.json({
            message: "Admin user created successfully",
            username: defaultUsername,
            password: defaultPassword,
          });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

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
app.post("/api/destinations", verifyToken, (req, res) => {
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
app.put("/api/destinations/:id", verifyToken, (req, res) => {
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
app.delete("/api/destinations/:id", verifyToken, (req, res) => {
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

  db.all(query, params, (err, tours) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      // Get pricing for each tour
      const tourIds = tours.map((t) => t.id);
      if (tourIds.length === 0) {
        return res.json(tours);
      }

      const placeholders = tourIds.map(() => "?").join(",");
      db.all(
        `SELECT * FROM tour_pricing WHERE tour_id IN (${placeholders}) ORDER BY min_persons ASC`,
        tourIds,
        (err, pricingData) => {
          if (err) {
            console.error("Error fetching pricing:", err);
            return res.json(tours);
          }

          // Attach pricing to tours
          const toursWithPricing = tours.map((tour) => ({
            ...tour,
            pricing: pricingData.filter((p) => p.tour_id === tour.id),
          }));

          res.json(toursWithPricing);
        }
      );
    }
  });
});

// Get single tour
app.get("/api/tours/:id", (req, res) => {
  db.get("SELECT * FROM tours WHERE id = ?", [req.params.id], (err, tour) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (!tour) {
      res.status(404).json({ error: "Tour not found" });
    } else {
      // Get pricing for this tour
      db.all(
        "SELECT * FROM tour_pricing WHERE tour_id = ? ORDER BY min_persons ASC",
        [tour.id],
        (err, pricing) => {
          if (err) {
            console.error("Error fetching pricing:", err);
            return res.json(tour);
          }

          res.json({
            ...tour,
            pricing: pricing || [],
          });
        }
      );
    }
  });
});

// Create new tour
app.post("/api/tours", verifyToken, (req, res) => {
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
app.put("/api/tours/:id", verifyToken, (req, res) => {
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
app.delete("/api/tours/:id", verifyToken, (req, res) => {
  db.run("DELETE FROM tours WHERE id = ?", [req.params.id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ message: "Tour deleted", changes: this.changes });
    }
  });
});

// ===== TOUR PRICING ENDPOINTS =====

// Get pricing for a specific tour
app.get("/api/tours/:tourId/pricing", (req, res) => {
  db.all(
    "SELECT * FROM tour_pricing WHERE tour_id = ? ORDER BY min_persons ASC",
    [req.params.tourId],
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json(rows);
      }
    }
  );
});

// Create new pricing entry for a tour
app.post("/api/tours/:tourId/pricing", verifyToken, (req, res) => {
  const { min_persons, max_persons, price_per_person } = req.body;
  const tourId = req.params.tourId;

  if (!min_persons || !price_per_person) {
    return res
      .status(400)
      .json({ error: "min_persons and price_per_person are required" });
  }

  db.run(
    "INSERT INTO tour_pricing (tour_id, min_persons, max_persons, price_per_person) VALUES (?, ?, ?, ?)",
    [tourId, min_persons, max_persons, price_per_person],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({
          id: this.lastID,
          tour_id: tourId,
          min_persons,
          max_persons,
          price_per_person,
        });
      }
    }
  );
});

// Update pricing entry
app.put("/api/tours/:tourId/pricing/:id", verifyToken, (req, res) => {
  const { min_persons, max_persons, price_per_person } = req.body;

  db.run(
    "UPDATE tour_pricing SET min_persons = ?, max_persons = ?, price_per_person = ? WHERE id = ? AND tour_id = ?",
    [
      min_persons,
      max_persons,
      price_per_person,
      req.params.id,
      req.params.tourId,
    ],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({ message: "Pricing updated", changes: this.changes });
      }
    }
  );
});

// Delete pricing entry
app.delete("/api/tours/:tourId/pricing/:id", verifyToken, (req, res) => {
  db.run(
    "DELETE FROM tour_pricing WHERE id = ? AND tour_id = ?",
    [req.params.id, req.params.tourId],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({ message: "Pricing deleted", changes: this.changes });
      }
    }
  );
});

// Image upload endpoint
app.post("/api/upload", verifyToken, upload.single("image"), (req, res) => {
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

// ===== RENTAL CARS ENDPOINTS =====

// Get all rental cars
app.get("/api/rental-cars", (req, res) => {
  db.all("SELECT * FROM rental_cars ORDER BY created_at DESC", (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      // Parse JSON strings back to arrays/objects
      const cars = rows.map((car) => ({
        ...car,
        images: car.images ? JSON.parse(car.images) : [],
        features: car.features ? JSON.parse(car.features) : [],
      }));
      res.json(cars);
    }
  });
});

// Get single rental car
app.get("/api/rental-cars/:id", (req, res) => {
  db.get(
    "SELECT * FROM rental_cars WHERE id = ?",
    [req.params.id],
    (err, row) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else if (!row) {
        res.status(404).json({ error: "Rental car not found" });
      } else {
        const car = {
          ...row,
          images: row.images ? JSON.parse(row.images) : [],
          features: row.features ? JSON.parse(row.features) : [],
        };
        res.json(car);
      }
    }
  );
});

// Create new rental car
app.post("/api/rental-cars", verifyToken, (req, res) => {
  const {
    model,
    description,
    images,
    features,
    transmission,
    fuel,
    doors,
    daily_price,
    weekly_price,
    color,
  } = req.body;

  db.run(
    `INSERT INTO rental_cars (model, description, images, features, transmission, fuel, doors, daily_price, weekly_price, color)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      model,
      description,
      JSON.stringify(images || []),
      JSON.stringify(features || []),
      transmission,
      fuel,
      doors,
      daily_price,
      weekly_price,
      color,
    ],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({ id: this.lastID, message: "Rental car created" });
      }
    }
  );
});

// Update rental car
app.put("/api/rental-cars/:id", verifyToken, (req, res) => {
  const {
    model,
    description,
    images,
    features,
    transmission,
    fuel,
    doors,
    daily_price,
    weekly_price,
    color,
  } = req.body;

  db.run(
    `UPDATE rental_cars SET model = ?, description = ?, images = ?, features = ?, transmission = ?, fuel = ?, doors = ?, daily_price = ?, weekly_price = ?, color = ? WHERE id = ?`,
    [
      model,
      description,
      JSON.stringify(images || []),
      JSON.stringify(features || []),
      transmission,
      fuel,
      doors,
      daily_price,
      weekly_price,
      color,
      req.params.id,
    ],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({ message: "Rental car updated" });
      }
    }
  );
});

// Delete rental car
app.delete("/api/rental-cars/:id", verifyToken, (req, res) => {
  db.run(
    "DELETE FROM rental_cars WHERE id = ?",
    [req.params.id],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({ message: "Rental car deleted" });
      }
    }
  );
});

// ============================================
// Gallery Routes
// ============================================

// Get all gallery items
app.get("/api/gallery", (req, res) => {
  db.all("SELECT * FROM gallery ORDER BY created_at DESC", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// Add gallery item (image)
app.post(
  "/api/gallery/image",
  verifyToken,
  upload.single("image"),
  (req, res) => {
    const { title, description } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "Image file is required" });
    }

    const url = req.file.path;
    const thumbnail = req.file.path.replace(
      "/upload/",
      "/upload/w_400,h_300,c_fill/"
    );

    db.run(
      "INSERT INTO gallery (type, url, thumbnail, title, description) VALUES (?, ?, ?, ?, ?)",
      ["image", url, thumbnail, title, description],
      function (err) {
        if (err) {
          res.status(500).json({ error: err.message });
        } else {
          res.json({
            id: this.lastID,
            type: "image",
            url,
            thumbnail,
            title,
            description,
          });
        }
      }
    );
  }
);

// Add gallery item (video)
app.post("/api/gallery/video", verifyToken, (req, res) => {
  const { url, title, description } = req.body;

  if (!url || !title) {
    return res.status(400).json({ error: "URL and title are required" });
  }

  // Convert YouTube URL to embed format
  let embedUrl = url;
  if (url.includes("youtube.com/watch?v=")) {
    const videoId = url.split("v=")[1]?.split("&")[0];
    embedUrl = `https://www.youtube.com/embed/${videoId}`;
  } else if (url.includes("youtu.be/")) {
    const videoId = url.split("youtu.be/")[1]?.split("?")[0];
    embedUrl = `https://www.youtube.com/embed/${videoId}`;
  }

  // Get YouTube thumbnail
  const videoId = embedUrl.split("/embed/")[1]?.split("?")[0];
  const thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  db.run(
    "INSERT INTO gallery (type, url, thumbnail, title, description) VALUES (?, ?, ?, ?, ?)",
    ["video", embedUrl, thumbnail, title, description],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({
          id: this.lastID,
          type: "video",
          url: embedUrl,
          thumbnail,
          title,
          description,
        });
      }
    }
  );
});

// Update gallery item
app.put("/api/gallery/:id", verifyToken, (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  db.run(
    "UPDATE gallery SET title = ?, description = ? WHERE id = ?",
    [title, description, id],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else if (this.changes === 0) {
        res.status(404).json({ error: "Gallery item not found" });
      } else {
        res.json({ message: "Gallery item updated" });
      }
    }
  );
});

// Delete gallery item
app.delete("/api/gallery/:id", verifyToken, (req, res) => {
  const { id } = req.params;

  db.get("SELECT * FROM gallery WHERE id = ?", [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: "Gallery item not found" });
    }

    // If it's an image, delete from Cloudinary
    if (row.type === "image" && row.url.includes("cloudinary")) {
      const publicId = row.url.split("/").slice(-2).join("/").split(".")[0];
      cloudinary.uploader.destroy(publicId, (error) => {
        if (error) console.error("Error deleting from Cloudinary:", error);
      });
    }

    db.run("DELETE FROM gallery WHERE id = ?", [id], function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({ message: "Gallery item deleted" });
      }
    });
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Root endpoint - API info
app.get("/", (req, res) => {
  res.json({
    message: "Tourism Website API",
    status: "running",
    endpoints: {
      destinations: "/api/destinations",
      tours: "/api/tours",
      auth: "/api/auth",
      upload: "/api/upload",
      health: "/api/health",
    },
  });
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
