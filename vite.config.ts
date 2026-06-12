import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import fs from "fs";
import path from "path";
import { getPortfolioFromDb, savePortfolioToDb } from "./server/db";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: "portfolio-api",
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          const url = req.url || "";

          // ── GET /api/portfolio ──
          if (url === "/api/portfolio" && req.method === "GET") {
            try {
              const data = await getPortfolioFromDb();
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(JSON.stringify(data));
            } catch (err: any) {
              res.writeHead(500, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ error: err.message }));
            }
            return;
          }

          // ── POST /api/portfolio ──
          if (url === "/api/portfolio" && req.method === "POST") {
            let body = "";
            req.on("data", (chunk) => {
              body += chunk.toString();
            });
            req.on("end", async () => {
              try {
                const config = JSON.parse(body);
                await savePortfolioToDb(config);
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: true }));
              } catch (err: any) {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: err.message }));
              }
            });
            return;
          }

          // ── POST /api/upload ──
          if (url.startsWith("/api/upload") && req.method === "POST") {
            const filename = req.headers["x-filename"] as string;
            const folder = (req.headers["x-folder"] as string) || "videos";

            if (!filename) {
              res.writeHead(400, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ error: "x-filename header is required" }));
              return;
            }

            // Clean up filename to prevent path traversal
            const safeName = path.basename(filename).replace(/[^a-zA-Z0-9.\-_]/g, "_");
            const targetDir = path.resolve(`./public/${folder}`);

            if (!fs.existsSync(targetDir)) {
              fs.mkdirSync(targetDir, { recursive: true });
            }

            const targetPath = path.join(targetDir, safeName);
            const chunks: any[] = [];

            req.on("data", (chunk) => {
              chunks.push(chunk);
            });

            req.on("end", () => {
              try {
                const buffer = Buffer.concat(chunks);
                fs.writeFileSync(targetPath, buffer);
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(
                  JSON.stringify({
                    success: true,
                    url: `/${folder}/${safeName}`,
                  })
                );
              } catch (err: any) {
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: err.message }));
              }
            });
            return;
          }

          // Fallthrough to normal dev server handling
          next();
        });
      },
    },
  ],
});

