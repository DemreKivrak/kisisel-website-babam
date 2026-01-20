import sqlite3 from "sqlite3";
import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, "../.env") });

const SQLITE_PATH = process.env.SQLITE_PATH || "./database.sqlite";

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? {
          rejectUnauthorized: false,
        }
      : false,
});

console.log("🔄 Starting migration from SQLite to PostgreSQL...\n");

async function migrateData() {
  const sqliteDb = new sqlite3.Database(SQLITE_PATH, (err) => {
    if (err) {
      console.error("❌ Error connecting to SQLite:", err.message);
      process.exit(1);
    }
    console.log("✅ Connected to SQLite database");
  });

  try {
    // Test PostgreSQL connection
    await pool.query("SELECT NOW()");
    console.log("✅ Connected to PostgreSQL database\n");

    // Helper function to get all rows from SQLite
    const getRows = (query) => {
      return new Promise((resolve, reject) => {
        sqliteDb.all(query, [], (err, rows) => {
          if (err) reject(err);
          else resolve(rows || []);
        });
      });
    };

    // 1. Migrate destinations
    console.log("📦 Migrating destinations...");
    const destinations = await getRows("SELECT * FROM destinations");
    if (destinations.length > 0) {
      for (const dest of destinations) {
        await pool.query(
          `INSERT INTO destinations (id, name, description, img, highlights, created_at) 
           VALUES ($1, $2, $3, $4, $5, $6)
           ON CONFLICT (id) DO NOTHING`,
          [
            dest.id,
            dest.name,
            dest.description,
            dest.img,
            dest.highlights,
            dest.created_at,
          ],
        );
      }
      // Update sequence
      const maxId = Math.max(...destinations.map((d) => d.id));
      await pool.query(`SELECT setval('destinations_id_seq', $1)`, [maxId]);
      console.log(`   ✅ Migrated ${destinations.length} destinations`);
    } else {
      console.log("   ℹ️  No destinations to migrate");
    }

    // 2. Migrate tours
    console.log("📦 Migrating tours...");
    const tours = await getRows("SELECT * FROM tours");
    if (tours.length > 0) {
      for (const tour of tours) {
        await pool.query(
          `INSERT INTO tours (id, name, destination, price, duration, description, images, overview, highlights, included, not_included, itinerary, is_recommended, created_at) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
           ON CONFLICT (id) DO NOTHING`,
          [
            tour.id,
            tour.name,
            tour.destination,
            tour.price,
            tour.duration,
            tour.description,
            tour.images,
            tour.overview,
            tour.highlights,
            tour.included,
            tour.not_included,
            tour.itinerary,
            tour.is_recommended,
            tour.created_at,
          ],
        );
      }
      const maxId = Math.max(...tours.map((t) => t.id));
      await pool.query(`SELECT setval('tours_id_seq', $1)`, [maxId]);
      console.log(`   ✅ Migrated ${tours.length} tours`);
    } else {
      console.log("   ℹ️  No tours to migrate");
    }

    // 3. Migrate users
    console.log("📦 Migrating users...");
    const users = await getRows("SELECT * FROM users");
    if (users.length > 0) {
      for (const user of users) {
        await pool.query(
          `INSERT INTO users (id, username, password, created_at) 
           VALUES ($1, $2, $3, $4)
           ON CONFLICT (username) DO NOTHING`,
          [user.id, user.username, user.password, user.created_at],
        );
      }
      const maxId = Math.max(...users.map((u) => u.id));
      await pool.query(`SELECT setval('users_id_seq', $1)`, [maxId]);
      console.log(`   ✅ Migrated ${users.length} users`);
    } else {
      console.log("   ℹ️  No users to migrate");
    }

    // 4. Migrate rental cars
    console.log("📦 Migrating rental cars...");
    const cars = await getRows("SELECT * FROM rental_cars");
    if (cars.length > 0) {
      for (const car of cars) {
        await pool.query(
          `INSERT INTO rental_cars (id, model, description, images, features, transmission, fuel, doors, daily_price, weekly_price, color, created_at) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
           ON CONFLICT (id) DO NOTHING`,
          [
            car.id,
            car.model,
            car.description,
            car.images,
            car.features,
            car.transmission,
            car.fuel,
            car.doors,
            car.daily_price,
            car.weekly_price,
            car.color,
            car.created_at,
          ],
        );
      }
      const maxId = Math.max(...cars.map((c) => c.id));
      await pool.query(`SELECT setval('rental_cars_id_seq', $1)`, [maxId]);
      console.log(`   ✅ Migrated ${cars.length} rental cars`);
    } else {
      console.log("   ℹ️  No rental cars to migrate");
    }

    // 5. Migrate gallery
    console.log("📦 Migrating gallery...");
    const gallery = await getRows("SELECT * FROM gallery");
    if (gallery.length > 0) {
      for (const item of gallery) {
        await pool.query(
          `INSERT INTO gallery (id, type, url, thumbnail, title, description, created_at) 
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           ON CONFLICT (id) DO NOTHING`,
          [
            item.id,
            item.type,
            item.url,
            item.thumbnail,
            item.title,
            item.description,
            item.created_at,
          ],
        );
      }
      const maxId = Math.max(...gallery.map((g) => g.id));
      await pool.query(`SELECT setval('gallery_id_seq', $1)`, [maxId]);
      console.log(`   ✅ Migrated ${gallery.length} gallery items`);
    } else {
      console.log("   ℹ️  No gallery items to migrate");
    }

    // 6. Migrate tour pricing
    console.log("📦 Migrating tour pricing...");
    const pricing = await getRows("SELECT * FROM tour_pricing");
    if (pricing.length > 0) {
      for (const price of pricing) {
        await pool.query(
          `INSERT INTO tour_pricing (id, tour_id, min_persons, max_persons, price_per_person, created_at) 
           VALUES ($1, $2, $3, $4, $5, $6)
           ON CONFLICT (id) DO NOTHING`,
          [
            price.id,
            price.tour_id,
            price.min_persons,
            price.max_persons,
            price.price_per_person,
            price.created_at,
          ],
        );
      }
      const maxId = Math.max(...pricing.map((p) => p.id));
      await pool.query(`SELECT setval('tour_pricing_id_seq', $1)`, [maxId]);
      console.log(`   ✅ Migrated ${pricing.length} pricing entries`);
    } else {
      console.log("   ℹ️  No pricing entries to migrate");
    }

    console.log("\n🎉 Migration completed successfully!");
    console.log("\n📊 Summary:");
    console.log(`   - Destinations: ${destinations.length}`);
    console.log(`   - Tours: ${tours.length}`);
    console.log(`   - Users: ${users.length}`);
    console.log(`   - Rental Cars: ${cars.length}`);
    console.log(`   - Gallery Items: ${gallery.length}`);
    console.log(`   - Tour Pricing: ${pricing.length}`);
  } catch (error) {
    console.error("\n❌ Migration failed:", error.message);
    console.error(error);
    process.exit(1);
  } finally {
    sqliteDb.close();
    await pool.end();
  }
}

migrateData();
