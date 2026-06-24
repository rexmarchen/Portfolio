const fs = require("fs");
const path = require("path");

const dbJsonPath = path.resolve("./data/db.json");
const dbSqlitePath = path.resolve("./data/portfolio.db");
const configPath = path.resolve("./src/config/portfolio.ts");

function writeConfig(data) {
  const code = `export type VideoItem = {
  id: string;
  title: string;
  category: string;
  clientType: string;
  video: string;
  poster: string;
  featured: boolean;
};

export type PortfolioConfig = {
  brand: string;
  studioTag: string;
  headline: string;
  subheadline: string;
  availability: string;
  location: string;
  email: string;
  instagram: string;
  whatsapp: string;
  socials: {
    instagram: string;
    whatsapp: string;
    email: string;
  };
  videos: VideoItem[];
};

export const portfolio: PortfolioConfig = ${JSON.stringify(data, null, 2)};
`;

  fs.writeFileSync(configPath, code, "utf8");
  console.log("Successfully exported database config to src/config/portfolio.ts for production build.");
}

async function exportConfig() {
  if (fs.existsSync(dbSqlitePath)) {
    console.log("Found SQLite database. Exporting configuration from SQLite...");
    try {
      const sqlite3 = require("sqlite3").verbose();
      const db = new sqlite3.Database(dbSqlitePath);

      const config = {
        socials: {},
        videos: [],
      };

      db.serialize(() => {
        db.all("SELECT key, value FROM settings", (err, rows) => {
          if (err) {
            console.error("Error reading settings from SQLite:", err);
            db.close();
            exportFromJsonFallback();
            return;
          }

          for (const row of rows) {
            if (row.key === "instagram" || row.key === "whatsapp" || row.key === "email") {
              config[row.key] = row.value;
              config.socials[row.key] = row.value;
            } else {
              config[row.key] = row.value;
            }
          }

          if (config.email && !config.socials.email.startsWith("mailto:")) {
            config.socials.email = `mailto:${config.email}`;
          }

          db.all("SELECT * FROM videos", (err, vRows) => {
            db.close();
            if (err) {
              console.error("Error reading videos from SQLite:", err);
              exportFromJsonFallback();
              return;
            }

            config.videos = vRows.map((v) => ({
              id: v.id,
              title: v.title || "",
              category: v.category || "",
              clientType: v.clientType || "",
              video: v.video || "",
              poster: v.poster || "",
              featured: v.featured === 1,
            }));

            writeConfig(config);
          });
        });
      });
      return;
    } catch (err) {
      console.warn("Failed to read from SQLite database, falling back to JSON...", err);
    }
  }

  exportFromJsonFallback();
}

function exportFromJsonFallback() {
  if (fs.existsSync(dbJsonPath)) {
    try {
      const data = JSON.parse(fs.readFileSync(dbJsonPath, "utf8"));
      writeConfig(data);
    } catch (err) {
      console.error("Failed to export config from JSON:", err);
    }
  } else {
    console.log("No database source found (no db.json or portfolio.db), using existing src/config/portfolio.ts.");
  }
}

exportConfig();

