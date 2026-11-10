const express = require("express");
const pool = require("../db");

const router = express.Router();

// column for franchise user form
const fields = [
  "sticker_no",
  "operator_name",
  "new_mtop",
  "make",
  "body_number",
  "mtc_number",
  "motor_no",
  "chassis_no",
  "plate_no",
  "or_number",
  "cr_number",
  "prev_operator_name",
  "vehicle_status",
  "prev_motor_no",
  "prev_chassis_no",
  "date_processed",
  "franchise_date",
  "expiration_date",
  "zone",
  "remarks",
];

// Turns empty text into null so empty boxes are stored as "nothing"
const clean = (value) => {
  if (value === undefined || value === null) return null;
  const text = String(value).trim();
  return text === "" ? null : text;
};

// Builds the list of values in the same order as the fields list
const readBody = (body) => {
  const data = {};
  fields.forEach((f) => {
    data[f] = clean(body[f]);
  });
  data.vehicle_status = data.vehicle_status || "Registered";
  return data;
};

// LIST + SEARCH: GET /api/franchises?status=Registered&zone=Zone I-A&search=cruz
router.get("/", async (req, res) => {
  try {
    const { status, zone, search } = req.query;
    const conditions = [];
    const params = [];

    if (status) {
      conditions.push("vehicle_status = ?");
      params.push(status);
    }

    if (zone) {
      conditions.push("zone = ?");
      params.push(zone);
    }

    if (search) {
      const like = `%${search}%`;
      conditions.push(
        `(operator_name LIKE ? OR sticker_no LIKE ? OR new_mtop LIKE ?
          OR plate_no LIKE ? OR motor_no LIKE ? OR chassis_no LIKE ?
          OR body_number LIKE ?)`,
      );
      params.push(like, like, like, like, like, like, like);
    }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    const [rows] = await pool.query(
      `SELECT * FROM franchises ${where} ORDER BY operator_name ASC LIMIT 500`,
      params,
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE a new record: POST /api/franchises
router.post("/", async (req, res) => {
  try {
    const data = readBody(req.body);

    if (!data.operator_name) {
      return res.status(400).json({ error: "Operator name is required." });
    }

    const columns = fields.join(", ");
    const placeholders = fields.map(() => "?").join(", ");
    const values = fields.map((f) => data[f]);

    const [result] = await pool.query(
      `INSERT INTO franchises (${columns}) VALUES (${placeholders})`,
      values,
    );

    res.status(201).json({ id: result.insertId, message: "Record saved" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE an existing record: PUT /api/franchises/:id
router.put("/:id", async (req, res) => {
  try {
    const data = readBody(req.body);

    if (!data.operator_name) {
      return res.status(400).json({ error: "Operator name is required." });
    }

    const setClause = fields.map((f) => `${f} = ?`).join(", ");
    const values = fields.map((f) => data[f]);

    const [result] = await pool.query(
      `UPDATE franchises SET ${setClause} WHERE id = ?`,
      [...values, req.params.id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Record not found." });
    }

    res.json({ message: "Record updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
