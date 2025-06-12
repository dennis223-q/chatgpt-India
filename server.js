// 🔼 Required modules at top
const express = require("express");
const app = express();

const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");
const path = require("path");
const fs = require("fs");

// 🔼 Admin routes
const adminRoutes = require("./routes/admin");

// 🔼 Middleware
app.use(cors());
app.use(bodyParser.json());

// 🔼 Static folders
app.use(express.static(path.join(__dirname, "public")));
app.use("/dashboard", express.static(path.join(__dirname, "dashboard")));

// 🔼 Use admin routes
app.use("/admin", adminRoutes);

// 🔐 Your OpenRouter API key
const API_KEY = "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"; // Replace with your own

// 🧠 Mistral AI Chat Route
app.post("/chat", async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "mistralai/mistral-7b-instruct",
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const reply = response.data.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    if (err.code === "ENOTFOUND" || err.code === "ECONNREFUSED") {
      res.status(503).json({ reply: "❌ No internet connection." });
    } else {
      console.error("❌ OpenRouter Error:", err.message);
      res.status(500).json({ reply: "❌ API error." });
    }
  }
});

// 🔍 Google Search Route (via SerpAPI)
app.post("/google-search", async (req, res) => {
  const { query } = req.body;
  try {
    const response = await axios.get("https://serpapi.com/search", {
      params: {
        q: query,
        api_key: "b3196f697b22e529581e18333755cea1c713e0166b3dc2c9d3338e530af5bbf4", // Replace with your own
        engine: "google"
      }
    });

    const results = response.data.organic_results
      .map(r => `${r.title} - ${r.link}`)
      .join("\n");

    res.json({ result: results });
  } catch (error) {
    console.error("Google Search Error:", error.message);
    res.status(500).json({ result: "Search error." });
  }
});

// 🔎 Decide whether to use Google Search
function needsGoogleSearch(prompt) {
  const realtimeTriggers = ["latest", "now", "today", "live", "current", "score", "weather"];
  return realtimeTriggers.some(word => prompt.toLowerCase().includes(word));
}

// 🟢 Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
app.use((req, res, next) => {
  console.log("📥 Incoming request:", req.method, req.url);
  next();
});
require("dotenv").config();


const SERP_API_KEY = "b3196f697b22e529581e18333755cea1c713e0166b3dc2c9d3338e530af5bbf4"
