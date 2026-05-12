import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import mongoose from "mongoose";

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
    mongoose.connect(mongodbUri).then(() => {
      console.log("Connected to MongoDB successfully");
    }).catch((err) => {
      console.error("CRITICAL: MongoDB connection error. Please check your MONGODB_URI in Settings > Secrets.");
      console.error("Error details:", err.message);
    });
  } else {
    console.warn("MONGODB_URI not found in environment. Database features will be non-functional.");
  }

  app.use(express.json());

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
