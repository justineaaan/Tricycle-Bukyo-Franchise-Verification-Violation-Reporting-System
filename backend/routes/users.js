const express = require("express");
const bcrypt = require("bcryptjs");
const pool = require("../db");

const router = express.Router();

// ADMIN: create a new account

router.post("/", async (req, res) => {
  try {
    const { full_name, employee_id, role, password } = req.body;
    const roles = ["admin", "sp_personnel", "tops_officer", "treasury"];

    if (!full_name || !employee_id || !password) {
      return res
        .status(400)
        .json({ error: "Name, ID number and password are required." });
    }
    if (!roles.includes(role)) {
      return res.status(400).json({ error: "Invalid role." });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters." });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      `INSERT INTO users (full_name, employee_id, password_hash, role)
       VALUES (?, ?, ?, ?)`,
      [full_name.trim(), employee_id.trim(), password_hash, role],
    );

    res.status(201).json({ id: result.insertId, message: "Account created" });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "That ID number already exists." });
    }
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
