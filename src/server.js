import dotenv from 'dotenv';
import express from "express";
import http from "http";
import cors from "cors";
import axios from "axios";
import { initSockets } from "./sockets/index.js";

dotenv.config();
const app = express();
const server = http.createServer(app);

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Missing 'message'." });

    const response = await axios.post(
      "https://api.perplexity.ai/chat/completions",
      {
        model: process.env.PERPLEXITY_MODEL || "sonar-pro",
        messages: [
          { role: "system", content: "You are a helpful AI chatbot." },
          { role: "user", content: message },
        ],
        // stream: true, // uncomment to enable streaming support
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
          "Content-Type": "application/json",
        },
        responseType: "json",
      }
    );

    const reply = response.data.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error("Perplexity Error:", err.response?.data || err.message);
    res.status(500).json({
      error: "Failed to fetch response from Perplexity",
      details: err.response?.data || err.message,
    });
  }
});

initSockets(server);
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
