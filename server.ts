import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import axios from "axios";
import cors from "cors";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Base URL for the external Render API
  const RENDER_API_URL = "https://igrejaatalaiaapi.onrender.com";

  // Proxy all /api/* requests to external Render API to avoid CORS and 405 errors
  app.all("/api/*", async (req, res) => {
    const targetUrl = `${RENDER_API_URL}${req.path}`;
    console.log(`[Proxy] ${req.method} ${req.path} -> ${targetUrl}`);
    
    try {
      // Basic headers for the proxied request
      const headers: any = {
        'Accept': 'application/json',
      };

      // Forward Authorization header if present
      if (req.headers.authorization) {
        headers['Authorization'] = req.headers.authorization;
      }

      // Forward Content-Type if present
      if (req.headers['content-type']) {
        headers['Content-Type'] = req.headers['content-type'];
      }

      const response = await axios({
        method: req.method as any,
        url: targetUrl,
        data: req.method !== 'GET' && req.method !== 'HEAD' ? req.body : undefined,
        params: req.query,
        headers: headers,
        timeout: 90000, // 90s for Render cold starts
        validateStatus: (status) => true, // Catch all statuses and pass them back
      });

      console.log(`[Proxy] Response: ${response.status} from ${targetUrl}`);
      
      // Copy some essential headers from the original response back to the client
      if (response.headers['content-type']) {
        res.setHeader('Content-Type', response.headers['content-type']);
      }

      res.status(response.status).send(response.data);
    } catch (error: any) {
      console.error(`[Proxy] Error for ${req.path}:`, error.message);
      
      if (error.response) {
        res.status(error.response.status).json(error.response.data);
      } else if (error.request) {
        // The request was made but no response was received
        res.status(504).json({
          success: false,
          message: "O servidor da API (Render) não respondeu a tempo. Pode estar iniciando (cold start).",
          error: "TIMEOUT_GATEWAY"
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Erro interno no servidor ao tentar processar a requisição.",
          error: error.message
        });
      }
    }
  });

  // Health check
  app.get("/health", (req, res) => {
    res.json({ status: "ok", mode: process.env.NODE_ENV });
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
