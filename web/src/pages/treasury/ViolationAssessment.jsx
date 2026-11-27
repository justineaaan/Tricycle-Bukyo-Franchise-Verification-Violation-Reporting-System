import { useState } from "react";
import { Search, FileText, TriangleAlert } from "lucide-react";
import "./ViolationAssessment.css";

const STATUSES = ["Unpaid", "Partially Paid", "Paid"];

// The list starts empty. We will load real violations from the database
// once the violation table exists.
// To preview the page, paste a record like this between the brackets:
// {
//   id: 1,
//   ticket_no: "TOPS-20261116-5CK",
//   operator_name: "Juan Dela Cruz",
//   plate_no: "TGY-1234",
//   body_number: "452",
//   violation: "No franchise sticker",
//   fine_amount: 1500,
//   amount_paid: 0,
//   status: "Unpaid",
// }
const initialViolations = [];

// 1500 -> "₱1,500.00"
const peso = (n) =>
  "₱" +
  Number(n).toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

// "Paid" -> "paid", "Partially Paid" -> "partial", "Unpaid" -> "unpaid"
const badgeClass = (status) =>
  status === "Paid" ? "paid" : status === "Partially Paid" ? "partial" : "unpaid";

export default function ViolationAssessment() {
  const [violations, setViolations] = useState(initialViolations);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  // the settlement form
  const [status, setStatus] = useState("Unpaid");
  const [paid, setPaid] = useState("");

  const selected = violations.find((v) => v.id === selectedId);

  // Search by ticket no., plate, body or operator
  const q = search.trim().toLowerCase();
  const filtered = violations.filter((v) =>
    [v.ticket_no, v.plate_no, v.body_number, v.operator_name].some((value) =>
      String(value ?? "")
        .toLowerCase()
        .includes(q),
    ),
  );

  // When a violation is clicked, show it and fill the form
  const selectViolation = (v) => {
    setSelectedId(v.id);
    setStatus(v.status);
    setPaid(String(v.amount_paid));
  };

  const handleSave = (e) => {
    e.preventDefault();
    const amount = Number(paid) || 0;
    setViolations((list) =>
      list.map((v) =>
        v.id === selectedId ? { ...v, status, amount_paid: amount } : v,
      ),
    );
    alert("Saved on this page only. Not connected to the database yet.");
  };

  return (
    <div className="va-page">
      <p className="va-crumb">
        Home <span>/</span> <b>Violation Assessment</b>
      </p>

      <div>
        <h1 className="va-title">Violation Assessment &amp; Treasury</h1>
        <p className="va-sub">
          Search violations, tag payment status, and manage settlement.
        </p>
      </div>

      <div className="va-grid">
        {/* LEFT: SEARCH + LIST */}
        <div className="va-card">
          <div className="va-card-head">
            <Search size={16} />
            <p>Search Violations</p>
          </div>

          <div className="va-card-body">
            <div className="va-search">
              <Search size={16} />
              <input
                type="text"
                placeholder="Ticket no., plate, body, operator..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="va-list">
              {filtered.length === 0 && (
                <p className="va-list-empty">No violations found.</p>
              )}

              {filtered.map((v) => (
                <button
                  key={v.id}
                  className={`va-item ${v.id === selectedId ? "selected" : ""}`}
                  onClick={() => selectViolation(v)}
                >
                  <FileText size={16} className="va-item-icon" />
                  <div>
                    <p className="va-item-ticket">{v.ticket_no}</p>
                    <p className="va-item-meta">
                      {v.operator_name} · {v.plate_no}
                    </p>
                    <div className="va-item-row">
                      <span className={`va-badge ${badgeClass(v.status)}`}>
                        {v.status}
                      </span>
                      <span className="va-item-amount">
                        {peso(v.amount_paid)}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: DETAILS + SETTLEMENT */}
        <div className="va-card">
          <div className="va-card-head">
            <TriangleAlert size={16} />
            <p>Violation Details &amp; Settlement</p>
          </div>

          {!selected ? (
            <div className="va-empty">
              <div className="va-empty-icon">
                <FileText size={26} />
              </div>
              <p className="va-empty-title">No violation selected</p>
              <p className="va-empty-text">
                Select a violation from the list to view details and manage
                settlement.
              </p>
            </div>
          ) : (
            <div className="va-card-body">
              <div className="va-details">
                <Detail label="Ticket No." value={selected.ticket_no} />
                <Detail label="Operator" value={selected.operator_name} />
                <Detail label="Plate No." value={selected.plate_no} />
                <Detail label="Body No." value={selected.body_number} />
                <Detail label="Violation" value={selected.violation} wide />
                <Detail label="Fine Amount" value={peso(selected.fine_amount)} />
                <Detail
                  label="Balance"
                  value={peso(selected.fine_amount - selected.amount_paid)}
                />
              </div>

              <form className="va-form" onSubmit={handleSave}>
                <p className="va-form-title">Settlement</p>

                <label htmlFor="va-status">Payment Status</label>
                <select
                  id="va-status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>

                <label htmlFor="va-paid">Amount Paid (₱)</label>
                <input
                  id="va-paid"
                  type="number"
                  min="0"
                  step="0.01"
                  value={paid}
                  onChange={(e) => setPaid(e.target.value)}
                />

                <button type="submit" className="va-save">
                  Save Settlement
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// One label + value box in the details section
function Detail({ label, value, wide }) {
  return (
    <div className={`va-detail ${wide ? "wide" : ""}`}>
      <p className="va-detail-label">{label}</p>
      <p className="va-detail-value">{value || "—"}</p>
    </div>
  );
}
