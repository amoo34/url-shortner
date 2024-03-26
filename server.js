// Import modules

const express = require("express");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
var bodyParser = require('body-parser') 

// Create Express instance
const app = express();
const PORT = process.env.PORT || 3000;

const urlMapFile = path.join(__dirname, "/url.json");
// Read URL mappings from file

// Middleware to parse JSON requests  
// parse application/x-www-form-urlencoded
app.use(bodyParser.json()) 

// Function to generate a random combination of capital letters, small letters, and numbers
function generateShortUrl() {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let shortUrl = "";
  for (let i = 0; i < 7; i++) {
    shortUrl += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return shortUrl;
}

// Endpoint to shorten URL
app.post("/api/shorten", (req, res) => {
  const { originalUrl } = req.body;
  console.log('awda',originalUrl,req.body)
  const shortUrl = generateShortUrl();
  let urlMap = {};
  if (fs.existsSync(urlMapFile)) {
    const data = fs.readFileSync(urlMapFile, "utf8");
    urlMap = data ? JSON.parse(data) : {};
  }

  urlMap[shortUrl] = originalUrl;

  // Write URL mappings to file
  fs.writeFile(urlMapFile, JSON.stringify(urlMap, null, 2), (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.status(201).json({ shortUrl });
  });
});

// Endpoint to redirect short URL
app.get("/:shortUrl", (req, res) => {
  const { shortUrl } = req.params;
  const originalUrl = urlMap[shortUrl];
  if (originalUrl) {
    res.redirect(originalUrl);
  } else {
    res.status(404).json({ error: "URL not found" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
