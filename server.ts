import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import mongoose from "mongoose";
import axios from "axios";

// MongoDB Schema
const prayerRequestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  request: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const PrayerRequest = mongoose.model("PrayerRequest", prayerRequestSchema);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Connect to MongoDB
  const mongodbUri = process.env.MONGODB_URI;
  if (mongodbUri) {
    mongoose.connect(mongodbUri, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    }).then(() => {
      console.log("✅ Connected to MongoDB successfully");
    }).catch((err) => {
      console.error("❌ CRITICAL: MongoDB connection error.");
      console.error("Reason:", err.message);
      console.error("Please verify your MONGODB_URI in Settings > Secrets. Ensure the username and password are correct.");
    });
  } else {
    console.warn("MONGODB_URI not found in environment. Database features will be non-functional.");
  }

  app.use(express.json());

  const RENDER_API_URL = "https://igrejaatalaiaapi.onrender.com";

  // Proxy Auth Routes to external Render API
  app.all("/api/auth/*", async (req, res) => {
    try {
      const url = `${RENDER_API_URL}${req.originalUrl}`;
      const response = await axios({
        method: req.method as any,
        url: url,
        data: req.body,
        params: req.query,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(req.headers.authorization ? { 'Authorization': req.headers.authorization } : {}),
        },
        timeout: 15000,
      });
      res.status(response.status).json(response.data);
    } catch (error: any) {
      if (error.response) {
        // Only log serious server errors, not client auth errors
        if (error.response.status >= 500) {
          console.error(`External API Error ${error.response.status} for ${req.originalUrl}:`, error.message);
        }
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

  // API Routes
  app.post("/api/prayer-requests", async (req, res) => {
    const { name, request } = req.body;
    
    if (!name || !request) {
      return res.status(400).json({ error: "Nome e pedido são obrigatórios." });
    }

    // Check if database is connected
    if (mongoose.connection.readyState !== 1) {
      console.error("Database not connected. ReadyState:", mongoose.connection.readyState);
      return res.status(503).json({ error: "O serviço de banco de dados está temporariamente indisponível. Por favor, tente novamente em instantes." });
    }

    try {
      const newRequest = new PrayerRequest({ name, request });
      await newRequest.save();
      console.log("Novo pedido de oração recebido e salvo no MongoDB:", newRequest);
      res.status(201).json({ 
        message: "Pedido enviado com sucesso! Estaremos orando por você.", 
        data: newRequest 
      });
    } catch (e) {
      console.error("Error saving prayer request to MongoDB", e);
      res.status(500).json({ error: "Erro ao salvar o pedido no banco de dados." });
    }
  });

  app.get("/api/prayer-requests", async (req, res) => {
    // Check if database is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: "Banco de dados indisponível." });
    }

    try {
      const requests = await PrayerRequest.find().sort({ createdAt: -1 });
      res.json(requests);
    } catch (e) {
      console.error("Error fetching prayer requests", e);
      res.status(500).json({ error: "Erro ao buscar pedidos." });
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
