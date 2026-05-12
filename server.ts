import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import axios from "axios";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Base URL for the external Render API
  const RENDER_API_URL = "https://igrejaatalaiaapi.onrender.com";

  // Proxy all /api/* requests to external Render API to avoid CORS
  app.all("/api/*", async (req, res) => {
    try {
      const url = `${RENDER_API_URL}${req.originalUrl}`;
      
      // Filter out headers that might cause issues with proxying
      const safeHeaders: any = {};
      const sensitiveHeaders = ['host', 'connection', 'content-length', 'accept-encoding'];
      
      Object.keys(req.headers).forEach(key => {
        if (!sensitiveHeaders.includes(key.toLowerCase())) {
          safeHeaders[key] = req.headers[key];
        }
      });

      console.log(`Proxying ${req.method} ${req.originalUrl} to External API...`);
      if (req.headers.authorization) {
        console.log(`Auth header present: ${req.headers.authorization.substring(0, 15)}...`);
      }

      const response = await axios({
        method: req.method as any,
        url: url,
        data: req.body,
        params: req.query,
        headers: {
          ...safeHeaders,
          'Accept': 'application/json',
        },
        timeout: 15000,
        validateStatus: (status) => (status >= 200 && status < 300) || status === 304,
      });

      console.log(`External API Response: ${response.status} for ${req.originalUrl}`);
      res.status(response.status).json(response.data);
    } catch (error: any) {
      if (error.response) {
        console.log(`External API Error ${error.response.status} for ${req.originalUrl}:`, error.response.data);
        res.status(error.response.status).json(error.response.data);
      } else {
        console.error(`Proxy network error for ${req.originalUrl}:`, error.message);
        res.status(500).json({ 
          success: false, 
          message: "Erro ao conectar com o servidor da API. Verifique a conexão.",
          error: error.message 
        });
      }
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
