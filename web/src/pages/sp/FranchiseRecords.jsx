import { useEffect, useState } from "react";
import { Search, Save, FilePlus, ArrowDownToLine, Wrench } from "lucide-react";
import "./FranchiseRecords.css";

const API_URL = "http://localhost:3000";

const ZONES = ["Zone I-A", "Zone I-B", "Zone II", "Zone III", "Zone IV"];
const STATUSES = ["Registered", "Dropped"];

// Every box in the form. To add a field later, add one line here
// (and the matching column in the database and backend).
const formFields = [
  { name: "sticker_no", label: "Sticker No. (2023)" },
  { name: "operator_name", label: "Operator Name", required: true },
  { name: "new_mtop", label: "New MTOP" },
  { name: "make", label: "Make" },
  { name: "body_number", label: "Body Number" },
  { name: "mtc_number", label: "MTC Number" },
  { name: "motor_no", label: "Motor No." },
  { name: "chassis_no", label: "Chassis No." },
  { name: "plate_no", label: "Plate No." },
  { name: "or_number", label: "OR Number" },
  { name: "cr_number", label: "CR Number" },
  { name: "zone", label: "Zone", type: "select", options: ZONES },
  { name: "prev_operator_name", label: "Prev. Operator Name" },
  {
    name: "vehicle_status",
    label: "Vehicle Status",
    type: "select",
    options: STATUSES,
  },
  { name: "prev_motor_no", label: "Prev. Motor No." },
  { name: "prev_chassis_no", label: "Prev. Chassis No." },
  { name: "date_processed", label: "Date Processed", type: "date" },
  { name: "franchise_date", label: "Franchise Date", type: "date" },
  { name: "expiration_date", label: "Expiration Date", type: "date" },
  { name: "remarks", label: "Remarks", wide: true },
];

const emptyForm = Object.fromEntries(
  formFields.map((f) => [
    f.name,
    f.name === "vehicle_status" ? "Registered" : "",
  ]),
);

// Turns a database record into form values (empty values become "")
const toForm = (record) =>
  Object.fromEntries(formFields.map((f) => [f.name, record[f.name] ?? ""]));

export default function FranchiseRecords() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  const [statusTab, setStatusTab] = useState("Registered");
  const [zoneFilter, setZoneFilter] = useState("");
  const [search, setSearch] = useState("");

  const [form, setForm] = useState(emptyForm);
  const [selectedId, setSelectedId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  // Load the list from the database (waits 300ms after typing stops)
  useEffect(() => {
    let ignore = false;

    const timer = setTimeout(() => {
      const params = new URLSearchParams();
      params.set("status", statusTab);
      if (zoneFilter) params.set("zone", zoneFilter);
      if (search.trim()) params.set("search", search.trim());

      fetch(`${API_URL}/api/franchises?${params.toString()}`)
        .then((res) => {
          if (!res.ok) throw new Error("Request failed");
          return res.json();
        })
        .then((data) => {
          if (!ignore) setRecords(data);
        })
        .catch(() => {
          if (!ignore) {
            setMessage({
              type: "error",
              text: "Could not reach the server. Check the backend and MySQL.",
            });
          }
        })
        .finally(() => {
          if (!ignore) setLoading(false);
        });
    }, 300);

    return () => {
      ignore = true;
      clearTimeout(timer);
    };
  }, [statusTab, zoneFilter, search, reloadKey]);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const clearForm = () => {
    setForm(emptyForm);
    setSelectedId(null);
  };

  const selectRecord = (record) => {
    setSelectedId(record.id);
    setForm(toForm(record));
  };

  // Save Record: creates a new record, or updates the selected one
  const saveRecord = async (overrides = {}) => {
    const payload = { ...form, ...overrides };

    if (!payload.operator_name.trim()) {
      showMessage("error", "Operator name is required.");
      return;
    }

    setSaving(true);
    try {
      const url = selectedId
        ? `${API_URL}/api/franchises/${selectedId}`
        : `${API_URL}/api/franchises`;

      const res = await fetch(url, {
        method: selectedId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        showMessage("error", data.error || "Could not save the record.");
        return;
      }

      showMessage("success", selectedId ? "Record updated." : "Record saved.");
      clearForm();
      setReloadKey((k) => k + 1);
    } catch {
      showMessage("error", "Could not reach the server.");
    } finally {
      setSaving(false);
    }
  };

  const handleDropping = () => {
    if (!selectedId) {
      showMessage("error", "Select a record from the list first.");
      return;
    }
    if (!window.confirm("Mark this franchise as Dropped?")) return;
    saveRecord({ vehicle_status: "Dropped" });
  };

  const handleChangeMotor = () => {
    if (!selectedId) {
      showMessage("error", "Select a record from the list first.");
      return;
    }
    setForm({
      ...form,
      prev_motor_no: form.motor_no,
      prev_chassis_no: form.chassis_no,
      motor_no: "",
      chassis_no: "",
    });
    showMessage(
      "success",
      "Type the new motor and chassis numbers, then click Save Record.",
    );
  };

  return (
    <div className="fr-page">
      {/* TOP: title and action buttons */}
      <div className="fr-top">
        <h1 className="fr-title">Franchise Records</h1>
        <div className="fr-buttons">
          <button
            className="fr-btn fr-btn-primary"
            onClick={() => saveRecord()}
            disabled={saving}
          >
            <Save size={18} />
            {saving ? "Saving..." : "Save Record"}
          </button>
          <button className="fr-btn" onClick={clearForm}>
            <FilePlus size={18} />
            New Record
          </button>
          <button className="fr-btn fr-btn-danger" onClick={handleDropping}>
            <ArrowDownToLine size={18} />
            Dropping
          </button>
          <button className="fr-btn" onClick={handleChangeMotor}>
            <Wrench size={18} />
            Change Motor
          </button>
        </div>
      </div>

      {/* MIDDLE: the information form */}
      <div className="fr-form-card">
        <div className="fr-form-grid">
          {formFields.map((f) => (
            <div key={f.name} className={`fr-field ${f.wide ? "fr-wide" : ""}`}>
              <label htmlFor={f.name}>
                {f.label}
                {f.required && <span className="fr-req"> *</span>}
              </label>

              {f.type === "select" ? (
                <select
                  id={f.name}
                  name={f.name}
                  value={form[f.name]}
                  onChange={handleChange}
                >
                  {f.name === "zone" && <option value="">Select zone</option>}
                  {f.options.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id={f.name}
                  name={f.name}
                  type={f.type || "text"}
                  value={form[f.name]}
                  onChange={handleChange}
                  autoComplete="off"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* BOTTOM: the results (only the table scrolls) */}
      <div className="fr-results">
        <div className="fr-results-bar">
          <div className="fr-tabs">
            {STATUSES.map((s) => (
              <button
                key={s}
                className={`fr-tab ${statusTab === s ? "active" : ""}`}
                onClick={() => setStatusTab(s)}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="fr-search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search masterlist..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="fr-select"
            value={zoneFilter}
            onChange={(e) => setZoneFilter(e.target.value)}
          >
            <option value="">All zones</option>
            {ZONES.map((z) => (
              <option key={z} value={z}>
                {z}
              </option>
            ))}
          </select>

          {message && (
            <span className={`fr-msg fr-msg-${message.type}`}>
              {message.text}
            </span>
          )}

          <span className="fr-count">{records.length} record(s)</span>
        </div>

        <div className="fr-scroll">
          <table className="fr-table">
            <thead>
              <tr>
                <th>Sticker No.</th>
                <th>Operator Name</th>
                <th>New MTOP</th>
                <th>Plate No.</th>
                <th>Motor No.</th>
                <th>Chassis No.</th>
                <th>Zone</th>
                <th>Status</th>
                <th>Expiration</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9" className="fr-empty">
                    Loading...
                  </td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan="9" className="fr-empty">
                    No records found.
                  </td>
                </tr>
              ) : (
                records.map((r) => (
                  <tr
                    key={r.id}
                    className={r.id === selectedId ? "fr-row-selected" : ""}
                    onClick={() => selectRecord(r)}
                  >
                    <td>{r.sticker_no || "-"}</td>
                    <td className="fr-strong">{r.operator_name}</td>
                    <td>{r.new_mtop || "-"}</td>
                    <td>{r.plate_no || "-"}</td>
                    <td>{r.motor_no || "-"}</td>
                    <td>{r.chassis_no || "-"}</td>
                    <td>{r.zone || "-"}</td>
                    <td>
                      <span
                        className={`fr-badge fr-badge-${r.vehicle_status.toLowerCase()}`}
                      >
                        {r.vehicle_status}
                      </span>
                    </td>
                    <td>{r.expiration_date || "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
