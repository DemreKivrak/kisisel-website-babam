import express from "express";
import sqlite3 from "sqlite3";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const DB_PATH = process.env.DB_PATH || "./database.sqlite";

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

  db.get("SELECT COUNT(*) as count FROM tours", (err, row) => {
    if (!err && row.count === 0) {
      const tours = [
        {
          name: "ISTANBUL HIGHLIGHTS",
          destination: "Istanbul",
          price: "520 €",
          duration: "03 Nights / 04 Days",
        },
        {
          name: "CAPPADOCIA DAYDREAM",
          destination: "Cappadocia",
          price: "365 €",
          duration: "01 Night / 02 Days",
        },
        {
          name: "MEDITERRANEAN GLAMOUR",
          destination: "Antalya",
          price: "775 €",
          duration: "04 Nights / 05 Days",
        },
      ];

      const stmt = db.prepare(
        "INSERT INTO tours (name, destination, price, duration) VALUES (?, ?, ?, ?)"
      );
      tours.forEach((tour) => {
        stmt.run(tour.name, tour.destination, tour.price, tour.duration);
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
  const { name, description, img } = req.body;
  db.run(
    "INSERT INTO destinations (name, description, img) VALUES (?, ?, ?)",
    [name, description, img],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({ id: this.lastID, name, description, img });
      }
    }
  );
});

// Update destination
app.put("/api/destinations/:id", (req, res) => {
  const { name, description, img } = req.body;
  db.run(
    "UPDATE destinations SET name = ?, description = ?, img = ? WHERE id = ?",
    [name, description, img, req.params.id],
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
  const { name, destination, price, duration, description } = req.body;
  db.run(
    "INSERT INTO tours (name, destination, price, duration, description) VALUES (?, ?, ?, ?, ?)",
    [name, destination, price, duration, description],
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
        });
      }
    }
  );
});

// Update tour
app.put("/api/tours/:id", (req, res) => {
  const { name, destination, price, duration, description } = req.body;
  db.run(
    "UPDATE tours SET name = ?, destination = ?, price = ?, duration = ?, description = ? WHERE id = ?",
    [name, destination, price, duration, description, req.params.id],
    function (err) {
      if (err) {
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
