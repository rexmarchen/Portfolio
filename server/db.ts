import fs from "fs";
import path from "path";

// Ensure the directory for data exists
const DATA_DIR = path.resolve("./data");
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, "portfolio.db");
const JSON_DB_PATH = path.join(DATA_DIR, "db.json");

// Default initial config if database is empty
const defaultPortfolio = {
  brand: "REXEDITZZ",
  studioTag: "Video Editing / Motion Graphics / Ad Creatives",
  headline: "Premium edits built to make clients stop scrolling.",
  subheadline: "Cinematic reels, launch visuals, motion graphics, thumbnails, and brand edits crafted for creators, brands, and agencies.",
  availability: "Open for premium client work",
  location: "Remote worldwide",
  email: "anshuar9065@gmail.com",
  instagram: "https://www.instagram.com/anshu_.zo?igsh=bDlsZ3RiZzVqZGRw",
  whatsapp: "https://wa.me/919317932859",
  socials: {
    instagram: "https://www.instagram.com/anshu_.zo?igsh=bDlsZ3RiZzVqZGRw",
    whatsapp: "https://wa.me/919317932859",
    email: "mailto:anshuar9065@gmail.com",
  },
  videos: [
    {
      id: "cinematic-brand-film",
      title: "Cinematic Brand Film",
      category: "Commercial Edit",
      clientType: "Brands",
      video: "/videos/updated-editing.mov",
      poster: "",
      featured: true,
      type: "reel"
    },
    {
      id: "motion-launch",
      title: "Motion Launch Visuals",
      category: "Motion Graphics",
      clientType: "Product Teams",
      video: "",
      poster: "",
      featured: true,
      type: "motion"
    },
    {
      id: "reels-pack",
      title: "High-Retention Reels Pack",
      category: "Short Form",
      clientType: "Creators",
      video: "",
      poster: "",
      featured: true,
      type: "reel"
    },
    {
      id: "social-ad-campaign",
      title: "Social Ad Campaign",
      category: "Commercial Edit",
      clientType: "E-commerce",
      video: "",
      poster: "",
      featured: true,
      type: "reel"
    },
    {
      id: "product-3d-visual",
      title: "Product 3D Visuals",
      category: "Motion Graphics",
      clientType: "Tech Brands",
      video: "",
      poster: "",
      featured: true,
      type: "motion"
    },
    {
      id: "thumbnail-breakdown",
      title: "Thumbnail Breakdown",
      category: "Creator System",
      clientType: "YouTube",
      video: "",
      poster: "",
      featured: false,
      type: "motion"
    },
    {
      id: "vlog-cinematic-intro",
      title: "Vlog Cinematic Intro",
      category: "Short Form",
      clientType: "Influencers",
      video: "",
      poster: "",
      featured: false,
      type: "reel"
    },
    {
      id: "corporate-promo-reel",
      title: "Corporate Promo Reel",
      category: "Commercial Edit",
      clientType: "Agencies",
      video: "",
      poster: "",
      featured: false,
      type: "reel"
    },
  ],
};

interface DbEngine {
  init(): Promise<void>;
  getPortfolio(): Promise<any>;
  savePortfolio(config: any): Promise<void>;
}

// ── Fallback JSON DB Implementation ──
class JsonDbEngine implements DbEngine {
  async init() {
    if (!fs.existsSync(JSON_DB_PATH)) {
      fs.writeFileSync(JSON_DB_PATH, JSON.stringify(defaultPortfolio, null, 2), "utf8");
    } else {
      try {
        const data = fs.readFileSync(JSON_DB_PATH, "utf8");
        const config = JSON.parse(data);
        const existingIds = new Set((config.videos || []).map((v: any) => v.id));
        const missing = defaultPortfolio.videos.filter((v) => !existingIds.has(v.id));
        if (missing.length > 0) {
          config.videos = [...(config.videos || []), ...missing];
          fs.writeFileSync(JSON_DB_PATH, JSON.stringify(config, null, 2), "utf8");
          console.log(`Synced ${missing.length} new default video slots to JSON DB.`);
        }
      } catch (e) {
        console.error("Failed to sync JSON database:", e);
      }
    }
  }

  async getPortfolio() {
    try {
      const data = fs.readFileSync(JSON_DB_PATH, "utf8");
      return JSON.parse(data);
    } catch {
      return defaultPortfolio;
    }
  }

  async savePortfolio(config: any) {
    fs.writeFileSync(JSON_DB_PATH, JSON.stringify(config, null, 2), "utf8");
  }
}

// ── SQLite DB Implementation ──
class SqliteDbEngine implements DbEngine {
  private db: any = null;
  private sqlite3Module: any = null;
  private saveQueue: Promise<void> = Promise.resolve();

  constructor(sqlite3Module: any) {
    this.sqlite3Module = sqlite3Module;
  }

  async init() {
    return new Promise<void>((resolve, reject) => {
      this.db = new this.sqlite3Module.Database(DB_PATH, (err: any) => {
        if (err) return reject(err);

        // Create tables
        this.db.serialize(() => {
          // Table for general settings
          this.db.run(
            `CREATE TABLE IF NOT EXISTS settings (
              key TEXT PRIMARY KEY,
              value TEXT
            )`
          );

          // Table for videos
          this.db.run(
            `CREATE TABLE IF NOT EXISTS videos (
              id TEXT PRIMARY KEY,
              title TEXT,
              category TEXT,
              clientType TEXT,
              video TEXT,
              poster TEXT,
              featured INTEGER,
              type TEXT
            )`,
            async (err: any) => {
              if (err) return reject(err);

              // Safe migration: Add 'type' column if it doesn't exist
              this.db.run(`ALTER TABLE videos ADD COLUMN type TEXT`, async () => {
                // Seed if empty
                try {
                  const needsSeed = await this.isSettingsEmpty();
                  if (needsSeed) {
                    await this.seedDefaults();
                  } else {
                    await this.syncContactDetails();
                    await this.syncNewDefaultSlots();
                  }
                  resolve();
                } catch (seedErr) {
                  reject(seedErr);
                }
              });
            }
          );
        });
      });
    });
  }

  private isSettingsEmpty(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.db.get("SELECT COUNT(*) as count FROM settings", (err: any, row: any) => {
        if (err) return reject(err);
        resolve(row.count === 0);
      });
    });
  }

  private async seedDefaults() {
    console.log("Seeding SQLite database with default settings...");
    await this.savePortfolio(defaultPortfolio);
  }

  private async syncNewDefaultSlots(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.db.all("SELECT id FROM videos", (err: any, rows: any[]) => {
        if (err) return reject(err);

        const existingIds = new Set(rows.map((row) => row.id));
        const missingVideos = defaultPortfolio.videos.filter((v) => !existingIds.has(v.id));

        if (missingVideos.length === 0) {
          return resolve();
        }

        console.log(`Syncing ${missingVideos.length} new default video slots...`);
        this.db.serialize(() => {
          const stmt = this.db.prepare(
            "INSERT INTO videos (id, title, category, clientType, video, poster, featured, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
          );
          for (const v of missingVideos) {
            stmt.run(v.id, v.title, v.category, v.clientType, v.video, v.poster, v.featured ? 1 : 0, v.type || "reel");
          }
          stmt.finalize((err) => {
            if (err) return reject(err);
            resolve();
          });
        });
      });
    });
  }

  private async syncContactDetails(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      console.log("Checking and syncing contact details in database...");
      this.db.serialize(() => {
        this.db.run(
          `UPDATE settings SET value = ? WHERE key = ? AND (value = ? OR value = ? OR value = '')`,
          ["anshuar9065@gmail.com", "email", "rexeditzz@example.com", "mailto:rexeditzz@example.com"]
        );
        this.db.run(
          `UPDATE settings SET value = ? WHERE key = ? AND (value = ? OR value = '')`,
          ["https://wa.me/919317932859", "whatsapp", "https://wa.me/910000000000"]
        );
        this.db.run(
          `UPDATE settings SET value = ? WHERE key = ? AND (value = ? OR value = '')`,
          ["https://www.instagram.com/anshu_.zo?igsh=bDlsZ3RiZzVqZGRw", "instagram", "https://instagram.com/rexeditzz"],
          (err: any) => {
            if (err) return reject(err);
            resolve();
          }
        );
      });
    });
  }

  getPortfolio(): Promise<any> {
    return new Promise((resolve, reject) => {
      const config: any = {
        socials: {},
        videos: [],
      };

      this.db.serialize(() => {
        // Read settings
        this.db.all("SELECT key, value FROM settings", (err: any, rows: any[]) => {
          if (err) return reject(err);

          for (const row of rows) {
            if (row.key === "instagram" || row.key === "whatsapp" || row.key === "email") {
              config[row.key] = row.value;
              config.socials[row.key] = row.value;
            } else {
              config[row.key] = row.value;
            }
          }

          // Special socials email mailto link
          if (config.email && !config.socials.email.startsWith("mailto:")) {
            config.socials.email = `mailto:${config.email}`;
          }

          // Read videos
          this.db.all("SELECT * FROM videos", (err: any, vRows: any[]) => {
            if (err) return reject(err);

            config.videos = vRows.map((v) => ({
              id: v.id,
              title: v.title,
              category: v.category,
              clientType: v.clientType,
              video: v.video,
              poster: v.poster,
              featured: v.featured === 1,
              type: v.type || ((v.category || "").toLowerCase().match(/motion|graphics/) ? "motion" : "reel"),
            }));

            resolve(config);
          });
        });
      });
    });
  }

  savePortfolio(config: any): Promise<void> {
    const runSave = () => {
      return new Promise<void>((resolve, reject) => {
        this.db.serialize(() => {
          // Begin transaction
          this.db.run("BEGIN TRANSACTION");

          // Insert/replace settings
          const keys = [
            "brand",
            "studioTag",
            "headline",
            "subheadline",
            "availability",
            "location",
            "email",
            "instagram",
            "whatsapp",
          ];

          const stmt = this.db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)");
          for (const key of keys) {
            let val = config[key];
            if (key === "instagram" && config.socials?.instagram) val = config.socials.instagram;
            if (key === "whatsapp" && config.socials?.whatsapp) val = config.socials.whatsapp;
            if (key === "email" && config.socials?.email) {
              val = config.socials.email.replace("mailto:", "");
            }
            stmt.run(key, val || "");
          }
          stmt.finalize();

          // Clear existing videos
          this.db.run("DELETE FROM videos", (err: any) => {
            if (err) {
              this.db.run("ROLLBACK");
              return reject(err);
            }

            // Insert videos
            if (config.videos && Array.isArray(config.videos)) {
              const vStmt = this.db.prepare(
                "INSERT INTO videos (id, title, category, clientType, video, poster, featured, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
              );
              for (const v of config.videos) {
                const resolvedType = v.type || ((v.category || "").toLowerCase().match(/motion|graphics/) ? "motion" : "reel");
                vStmt.run(
                  v.id,
                  v.title || "",
                  v.category || "",
                  v.clientType || "",
                  v.video || "",
                  v.poster || "",
                  v.featured ? 1 : 0,
                  resolvedType
                );
              }
              vStmt.finalize();
            }

            // Commit
            this.db.run("COMMIT", (err: any) => {
              if (err) {
                this.db.run("ROLLBACK");
                return reject(err);
              }
              resolve();
            });
          });
        });
      });
    };

    // Chain to previous save operations to prevent overlapping transactions
    this.saveQueue = this.saveQueue.then(runSave, runSave);
    return this.saveQueue;
  }
}

// ── Factory/Loader ──
let dbEngine: DbEngine | null = null;
let initPromise: Promise<DbEngine> | null = null;

async function getEngine(): Promise<DbEngine> {
  if (dbEngine) return dbEngine;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    let engine: DbEngine;
    try {
      const sqlite3 = (await import("sqlite3")).default;
      engine = new SqliteDbEngine(sqlite3);
      console.log("Using SQLite Database Engine.");
    } catch (e) {
      console.warn("Could not import sqlite3, falling back to JSON Database Engine.");
      engine = new JsonDbEngine();
    }

    await engine.init();
    dbEngine = engine;
    return engine;
  })();

  return initPromise;
}

export async function getPortfolioFromDb() {
  const engine = await getEngine();
  return engine.getPortfolio();
}

export async function savePortfolioToDb(config: any) {
  const engine = await getEngine();
  return engine.savePortfolio(config);
}
