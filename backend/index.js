import express from "express";
import pkg from "pg";
const { Pool } = pkg;
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

// Check if DATABASE_URL is provided
if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL is not set in .env file");
  console.log("\n📋 Please set up your database:");
  console.log("   Option 1: Install PostgreSQL locally");
  console.log("   - Download: https://www.postgresql.org/download/");
  console.log("   - Set DATABASE_URL in .env:");
  console.log(
    "     DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/tourism_website\n",
  );
  console.log("   Option 2: Use remote PostgreSQL (Render)");
  console.log("   - Uncomment the production DATABASE_URL in .env\n");
  process.exit(1);
}

// PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes("render.com")
    ? {
        rejectUnauthorized: false,
      }
    : process.env.NODE_ENV === "production"
      ? {
          rejectUnauthorized: false,
        }
      : false,
});

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
  origin: (origin, callback) => {
    const allowedOrigins = [
      "http://localhost:5173",
      "https://www.anatoliahorizon.com",
      "https://www.oltretour.com",
      "https://anatoliahorizon.com",
      "https://oltretour.com",
    ];

    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

// Test database connection and initialize
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("❌ Database connection error:", err);
    process.exit(1);
  } else {
    console.log("✅ Connected to PostgreSQL database");
    initializeDatabase();
  }
});

// Initialize database tables
async function initializeDatabase() {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Destinations table
    await client.query(`
      CREATE TABLE IF NOT EXISTS destinations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        img TEXT,
        highlights TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tours table
    await client.query(`
      CREATE TABLE IF NOT EXISTS tours (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        destination VARCHAR(255) NOT NULL,
        price VARCHAR(100),
        duration VARCHAR(100),
        description TEXT,
        images TEXT,
        overview TEXT,
        highlights TEXT,
        included TEXT,
        not_included TEXT,
        itinerary TEXT,
        is_recommended INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Users table - UPDATED with role and multi-admin support
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE,
        full_name VARCHAR(255),
        role VARCHAR(50) DEFAULT 'admin',
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Rental cars table
    await client.query(`
      CREATE TABLE IF NOT EXISTS rental_cars (
        id SERIAL PRIMARY KEY,
        model VARCHAR(255) NOT NULL,
        description TEXT,
        images TEXT,
        features TEXT,
        transmission VARCHAR(50),
        fuel VARCHAR(50),
        doors VARCHAR(50),
        daily_price VARCHAR(100),
        weekly_price VARCHAR(100),
        color VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Gallery table
    await client.query(`
      CREATE TABLE IF NOT EXISTS gallery (
        id SERIAL PRIMARY KEY,
        type VARCHAR(50) NOT NULL,
        url TEXT NOT NULL,
        thumbnail TEXT,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tour Pricing table
    await client.query(`
      CREATE TABLE IF NOT EXISTS tour_pricing (
        id SERIAL PRIMARY KEY,
        tour_id INTEGER NOT NULL,
        min_persons INTEGER NOT NULL,
        max_persons INTEGER,
        price_per_person VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE
      )
    `);

    // Admin activity log table - NEW
    await client.query(`
      CREATE TABLE IF NOT EXISTS admin_activity_log (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        action VARCHAR(255) NOT NULL,
        details TEXT,
        ip_address VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    await client.query("COMMIT");
    console.log("✅ Database tables initialized");

    // Create default admin user if not exists
    const userCheck = await client.query("SELECT COUNT(*) as count FROM users");
    if (parseInt(userCheck.rows[0].count) === 0) {
      const defaultUsername = "admin";
      const defaultPassword = "admin123";
      const hash = await bcrypt.hash(defaultPassword, 10);

      await client.query(
        "INSERT INTO users (username, password, role, email, full_name) VALUES ($1, $2, $3, $4, $5)",
        [
          defaultUsername,
          hash,
          "super_admin",
          "admin@example.com",
          "Super Admin",
        ],
      );

      console.log(
        "✅ Default admin created - Username: admin, Password: admin123",
      );
      console.log("⚠️  IMPORTANT: Change the default password immediately!");
    }
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Error initializing database:", err);
  } finally {
    client.release();
  }
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

// Middleware to verify super admin role
const verifySuperAdmin = (req, res, next) => {
  if (req.user.role !== "super_admin") {
    return res.status(403).json({ error: "Access denied. Super admin only." });
  }
  next();
};

// Helper function to log admin activity
async function logActivity(userId, action, details = null, ipAddress = null) {
  try {
    await pool.query(
      "INSERT INTO admin_activity_log (user_id, action, details, ip_address) VALUES ($1, $2, $3, $4)",
      [userId, action, details, ipAddress],
    );
  } catch (err) {
    console.error("Error logging activity:", err);
  }
}

// Routes

// ===== AUTHENTICATION ENDPOINTS =====

// Login
app.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE username = $1 AND is_active = true",
      [username],
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = result.rows[0];
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: "24h" },
    );

    await logActivity(user.id, "LOGIN", null, req.ip);

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        email: user.email,
        full_name: user.full_name,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Verify token
app.get("/api/auth/verify", verifyToken, (req, res) => {
  res.json({ valid: true, user: req.user });
});

// Change password
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
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [
      req.user.id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = result.rows[0];
    const isValidPassword = await bcrypt.compare(
      currentPassword,
      user.password,
    );

    if (!isValidPassword) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query(
      "UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2",
      [hashedPassword, req.user.id],
    );

    await logActivity(req.user.id, "CHANGE_PASSWORD");

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// ===== DESTINATIONS ENDPOINTS =====

// Get all destinations
app.get("/api/destinations", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM destinations ORDER BY created_at DESC",
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single destination
app.get("/api/destinations/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM destinations WHERE id = $1",
      [req.params.id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Destination not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create destination
app.post("/api/destinations", verifyToken, async (req, res) => {
  const { name, description, img, highlights } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO destinations (name, description, img, highlights) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, description, img, highlights || ""],
    );

    await logActivity(req.user.id, "CREATE_DESTINATION", `Created: ${name}`);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update destination
app.put("/api/destinations/:id", verifyToken, async (req, res) => {
  const { name, description, img, highlights } = req.body;

  try {
    const result = await pool.query(
      "UPDATE destinations SET name = $1, description = $2, img = $3, highlights = $4 WHERE id = $5 RETURNING *",
      [name, description, img, highlights || "", req.params.id],
    );

    await logActivity(
      req.user.id,
      "UPDATE_DESTINATION",
      `Updated ID: ${req.params.id}`,
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete destination
app.delete("/api/destinations/:id", verifyToken, async (req, res) => {
  try {
    await pool.query("DELETE FROM destinations WHERE id = $1", [req.params.id]);
    await logActivity(
      req.user.id,
      "DELETE_DESTINATION",
      `Deleted ID: ${req.params.id}`,
    );
    res.json({ message: "Destination deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== TOURS ENDPOINTS =====

// Get all tours
app.get("/api/tours", async (req, res) => {
  const { destination } = req.query;

  try {
    let query = "SELECT * FROM tours";
    let params = [];

    if (destination) {
      query += " WHERE destination = $1";
      params.push(destination);
    }

    query += " ORDER BY created_at DESC";

    const toursResult = await pool.query(query, params);
    const tours = toursResult.rows;

    if (tours.length === 0) {
      return res.json([]);
    }

    // Get pricing for all tours
    const tourIds = tours.map((t) => t.id);
    const pricingResult = await pool.query(
      "SELECT * FROM tour_pricing WHERE tour_id = ANY($1) ORDER BY min_persons ASC",
      [tourIds],
    );

    // Attach pricing to tours
    const toursWithPricing = tours.map((tour) => ({
      ...tour,
      pricing: pricingResult.rows.filter((p) => p.tour_id === tour.id),
    }));

    res.json(toursWithPricing);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single tour
app.get("/api/tours/:id", async (req, res) => {
  try {
    const tourResult = await pool.query("SELECT * FROM tours WHERE id = $1", [
      req.params.id,
    ]);

    if (tourResult.rows.length === 0) {
      return res.status(404).json({ error: "Tour not found" });
    }

    const tour = tourResult.rows[0];

    // Get pricing
    const pricingResult = await pool.query(
      "SELECT * FROM tour_pricing WHERE tour_id = $1 ORDER BY min_persons ASC",
      [tour.id],
    );

    res.json({
      ...tour,
      pricing: pricingResult.rows,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create tour
app.post("/api/tours", verifyToken, async (req, res) => {
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

  try {
    const result = await pool.query(
      `INSERT INTO tours (name, destination, price, duration, description, images, overview, highlights, included, not_included, itinerary, is_recommended) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
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
    );

    await logActivity(req.user.id, "CREATE_TOUR", `Created: ${name}`);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update tour
app.put("/api/tours/:id", verifyToken, async (req, res) => {
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

  try {
    const result = await pool.query(
      `UPDATE tours SET name = $1, destination = $2, price = $3, duration = $4, description = $5, images = $6, 
       overview = $7, highlights = $8, included = $9, not_included = $10, itinerary = $11, is_recommended = $12 
       WHERE id = $13 RETURNING *`,
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
    );

    await logActivity(
      req.user.id,
      "UPDATE_TOUR",
      `Updated ID: ${req.params.id}`,
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete tour
app.delete("/api/tours/:id", verifyToken, async (req, res) => {
  try {
    await pool.query("DELETE FROM tours WHERE id = $1", [req.params.id]);
    await logActivity(
      req.user.id,
      "DELETE_TOUR",
      `Deleted ID: ${req.params.id}`,
    );
    res.json({ message: "Tour deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== TOUR PRICING ENDPOINTS =====

// Get pricing for a tour
app.get("/api/tours/:tourId/pricing", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM tour_pricing WHERE tour_id = $1 ORDER BY min_persons ASC",
      [req.params.tourId],
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create pricing entry
app.post("/api/tours/:tourId/pricing", verifyToken, async (req, res) => {
  const { min_persons, max_persons, price_per_person } = req.body;
  const tourId = req.params.tourId;

  if (!min_persons || !price_per_person) {
    return res
      .status(400)
      .json({ error: "min_persons and price_per_person are required" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO tour_pricing (tour_id, min_persons, max_persons, price_per_person) VALUES ($1, $2, $3, $4) RETURNING *",
      [tourId, min_persons, max_persons, price_per_person],
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update pricing entry
app.put("/api/tours/:tourId/pricing/:id", verifyToken, async (req, res) => {
  const { min_persons, max_persons, price_per_person } = req.body;

  try {
    const result = await pool.query(
      "UPDATE tour_pricing SET min_persons = $1, max_persons = $2, price_per_person = $3 WHERE id = $4 AND tour_id = $5 RETURNING *",
      [
        min_persons,
        max_persons,
        price_per_person,
        req.params.id,
        req.params.tourId,
      ],
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete pricing entry
app.delete("/api/tours/:tourId/pricing/:id", verifyToken, async (req, res) => {
  try {
    await pool.query(
      "DELETE FROM tour_pricing WHERE id = $1 AND tour_id = $2",
      [req.params.id, req.params.tourId],
    );
    res.json({ message: "Pricing deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== IMAGE UPLOAD =====

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
app.get("/api/rental-cars", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM rental_cars ORDER BY created_at DESC",
    );
    const cars = result.rows.map((car) => ({
      ...car,
      images: car.images ? JSON.parse(car.images) : [],
      features: car.features ? JSON.parse(car.features) : [],
    }));
    res.json(cars);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single rental car
app.get("/api/rental-cars/:id", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM rental_cars WHERE id = $1", [
      req.params.id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Rental car not found" });
    }

    const car = result.rows[0];
    res.json({
      ...car,
      images: car.images ? JSON.parse(car.images) : [],
      features: car.features ? JSON.parse(car.features) : [],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create rental car
app.post("/api/rental-cars", verifyToken, async (req, res) => {
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

  try {
    const result = await pool.query(
      `INSERT INTO rental_cars (model, description, images, features, transmission, fuel, doors, daily_price, weekly_price, color)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
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
    );

    await logActivity(req.user.id, "CREATE_CAR", `Created: ${model}`);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update rental car
app.put("/api/rental-cars/:id", verifyToken, async (req, res) => {
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

  try {
    const result = await pool.query(
      `UPDATE rental_cars SET model = $1, description = $2, images = $3, features = $4, transmission = $5, fuel = $6, doors = $7, daily_price = $8, weekly_price = $9, color = $10 WHERE id = $11 RETURNING *`,
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
    );

    await logActivity(
      req.user.id,
      "UPDATE_CAR",
      `Updated ID: ${req.params.id}`,
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete rental car
app.delete("/api/rental-cars/:id", verifyToken, async (req, res) => {
  try {
    await pool.query("DELETE FROM rental_cars WHERE id = $1", [req.params.id]);
    await logActivity(
      req.user.id,
      "DELETE_CAR",
      `Deleted ID: ${req.params.id}`,
    );
    res.json({ message: "Rental car deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== GALLERY ENDPOINTS =====

// Get all gallery items
app.get("/api/gallery", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM gallery ORDER BY created_at DESC",
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add gallery image
app.post(
  "/api/gallery/image",
  verifyToken,
  upload.single("image"),
  async (req, res) => {
    const { title, description } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "Image file is required" });
    }

    const url = req.file.path;
    const thumbnail = req.file.path.replace(
      "/upload/",
      "/upload/w_400,h_300,c_fill/",
    );

    try {
      const result = await pool.query(
        "INSERT INTO gallery (type, url, thumbnail, title, description) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        ["image", url, thumbnail, title, description],
      );

      await logActivity(req.user.id, "ADD_GALLERY_IMAGE", title);
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
);

// Add gallery video
app.post("/api/gallery/video", verifyToken, async (req, res) => {
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

  const videoId = embedUrl.split("/embed/")[1]?.split("?")[0];
  const thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  try {
    const result = await pool.query(
      "INSERT INTO gallery (type, url, thumbnail, title, description) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      ["video", embedUrl, thumbnail, title, description],
    );

    await logActivity(req.user.id, "ADD_GALLERY_VIDEO", title);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update gallery item
app.put("/api/gallery/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  try {
    const result = await pool.query(
      "UPDATE gallery SET title = $1, description = $2 WHERE id = $3 RETURNING *",
      [title, description, id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Gallery item not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete gallery item
app.delete("/api/gallery/:id", verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query("SELECT * FROM gallery WHERE id = $1", [
      id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Gallery item not found" });
    }

    const item = result.rows[0];

    // If image, delete from Cloudinary
    if (item.type === "image" && item.url.includes("cloudinary")) {
      const publicId = item.url.split("/").slice(-2).join("/").split(".")[0];
      cloudinary.uploader.destroy(publicId, (error) => {
        if (error) console.error("Error deleting from Cloudinary:", error);
      });
    }

    await pool.query("DELETE FROM gallery WHERE id = $1", [id]);
    await logActivity(req.user.id, "DELETE_GALLERY", item.title);

    res.json({ message: "Gallery item deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== UTILITY ENDPOINTS =====

// ===== ADMIN MANAGEMENT ENDPOINTS (SUPER ADMIN ONLY) =====

// Get all admins
app.get("/api/admin/users", verifyToken, verifySuperAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, username, email, full_name, role, is_active, created_at FROM users ORDER BY created_at DESC",
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new admin
app.post(
  "/api/admin/users",
  verifyToken,
  verifySuperAdmin,
  async (req, res) => {
    const { username, password, email, full_name, role } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters" });
    }

    if (!role || !["admin", "super_admin"].includes(role)) {
      return res
        .status(400)
        .json({ error: "Invalid role. Must be 'admin' or 'super_admin'" });
    }

    try {
      // Check if username already exists
      const existingUser = await pool.query(
        "SELECT id FROM users WHERE username = $1",
        [username],
      );

      if (existingUser.rows.length > 0) {
        return res.status(400).json({ error: "Username already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert new user
      const result = await pool.query(
        "INSERT INTO users (username, password, email, full_name, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, username, email, full_name, role, created_at",
        [username, hashedPassword, email || null, full_name || null, role],
      );

      await logActivity(
        req.user.id,
        "CREATE_ADMIN",
        `Created new admin: ${username}`,
        req.ip,
      );

      res.status(201).json({
        message: "Admin created successfully",
        user: result.rows[0],
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
);

// Update admin
app.put(
  "/api/admin/users/:id",
  verifyToken,
  verifySuperAdmin,
  async (req, res) => {
    const { id } = req.params;
    const { username, email, full_name, role, is_active } = req.body;

    if (!role || !["admin", "super_admin"].includes(role)) {
      return res
        .status(400)
        .json({ error: "Invalid role. Must be 'admin' or 'super_admin'" });
    }

    try {
      // Check if user exists
      const userCheck = await pool.query("SELECT * FROM users WHERE id = $1", [
        id,
      ]);

      if (userCheck.rows.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      // Don't allow changing own super_admin status
      if (parseInt(id) === req.user.id && role !== "super_admin") {
        return res
          .status(400)
          .json({ error: "Cannot change your own super admin status" });
      }

      // Update user
      const result = await pool.query(
        "UPDATE users SET username = $1, email = $2, full_name = $3, role = $4, is_active = $5, updated_at = CURRENT_TIMESTAMP WHERE id = $6 RETURNING id, username, email, full_name, role, is_active, updated_at",
        [
          username,
          email,
          full_name,
          role,
          is_active !== undefined ? is_active : true,
          id,
        ],
      );

      await logActivity(
        req.user.id,
        "UPDATE_ADMIN",
        `Updated admin: ${username}`,
        req.ip,
      );

      res.json({
        message: "Admin updated successfully",
        user: result.rows[0],
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
);

// Delete admin
app.delete(
  "/api/admin/users/:id",
  verifyToken,
  verifySuperAdmin,
  async (req, res) => {
    const { id } = req.params;

    try {
      // Check if user exists
      const userCheck = await pool.query("SELECT * FROM users WHERE id = $1", [
        id,
      ]);

      if (userCheck.rows.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      // Don't allow deleting yourself
      if (parseInt(id) === req.user.id) {
        return res
          .status(400)
          .json({ error: "Cannot delete your own account" });
      }

      const username = userCheck.rows[0].username;

      // Delete user
      await pool.query("DELETE FROM users WHERE id = $1", [id]);

      await logActivity(
        req.user.id,
        "DELETE_ADMIN",
        `Deleted admin: ${username}`,
        req.ip,
      );

      res.json({ message: "Admin deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
);

// Reset admin password (by super admin)
app.post(
  "/api/admin/users/:id/reset-password",
  verifyToken,
  verifySuperAdmin,
  async (req, res) => {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ error: "New password is required" });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters" });
    }

    try {
      // Check if user exists
      const userCheck = await pool.query("SELECT * FROM users WHERE id = $1", [
        id,
      ]);

      if (userCheck.rows.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      const username = userCheck.rows[0].username;

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update password
      await pool.query(
        "UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2",
        [hashedPassword, id],
      );

      await logActivity(
        req.user.id,
        "RESET_PASSWORD",
        `Reset password for: ${username}`,
        req.ip,
      );

      res.json({ message: "Password reset successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
);

// Get admin activity logs
app.get(
  "/api/admin/activity-logs",
  verifyToken,
  verifySuperAdmin,
  async (req, res) => {
    const limit = parseInt(req.query.limit) || 100;

    try {
      const result = await pool.query(
        `SELECT 
        l.id, 
        l.action, 
        l.details, 
        l.ip_address, 
        l.created_at,
        u.username,
        u.full_name
      FROM admin_activity_log l
      JOIN users u ON l.user_id = u.id
      ORDER BY l.created_at DESC
      LIMIT $1`,
        [limit],
      );
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
);

// ===== UTILITY ENDPOINTS =====

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    database: "PostgreSQL",
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Tourism Website API - PostgreSQL",
    status: "running",
    endpoints: {
      auth: "/api/auth",
      destinations: "/api/destinations",
      tours: "/api/tours",
      rentalCars: "/api/rental-cars",
      gallery: "/api/gallery",
      admin: "/api/admin",
      upload: "/api/upload",
      health: "/api/health",
    },
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Database: PostgreSQL`);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n🛑 Shutting down gracefully...");
  await pool.end();
  console.log("✅ Database connection closed");
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("\n🛑 SIGTERM received. Shutting down gracefully...");
  await pool.end();
  console.log("✅ Database connection closed");
  process.exit(0);
});
