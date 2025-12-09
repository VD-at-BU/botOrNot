// server/app.js
const express = require("express");
const path = require("path");

const app = express();

// Serve everything in /public as static assets
app.use(express.static(path.join(__dirname, "public")));

// Optional: explicit routes for top-level pages
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/puzzles", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "puzzles.html"));
});

app.get("/contact", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "contact.html"));
});

app.get("/how-it-works", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "how-it-works.html"));
});

app.get("/results", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "results.html"));
});

// Fallback 404
app.use((req, res) => {
  res.status(404).send("404 – Page Not Found");
});

module.exports = app;
