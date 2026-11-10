require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.get("/api/db-test", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 + 1 AS result");
    res.json({ message: "Database connected", rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Each area of the system has its own file in the routes folder
app.use("/api/users", require("./routes/users"));
app.use("/api/franchises", require("./routes/franchises"));

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
