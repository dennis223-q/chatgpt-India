const express = require("express");
const fs = require("fs");
const router = express.Router();

router.get("/logs", (req, res) => {
  fs.readFile("chatlog.txt", "utf-8", (err, data) => {
    if (err) return res.status(500).json({ logs: [] });
    const logs = data.trim().split("\n");
    res.json({ logs });
  });
});

module.exports = router;
