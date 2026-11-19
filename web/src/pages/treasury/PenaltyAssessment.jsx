import { useState } from "react";
import {
  Search,
  TriangleAlert,
  Wallet,
  User,
  Car,
  FileText,
  Save,
} from "lucide-react";
import "./PenaltyAssessment.css";

// The list starts empty. We will load the referred violations from the
// database once the violation table exists.
// To preview the page, paste a record like this between the brackets:
// {
//   id: 1,
//   ticket_no: "TOPS-20261116-5CK",
//   operator_name: "Juan Dela Cruz",
//   violation: "Out of Zone",
//   plate_no: "TGY-1234",
//   body_number: "1001",
//   mtc_number: "2342",
//   reporting_officer: "TOPS Field Officer",
//   fine_amount: 0,
//   notes: "",
// }
const initialViolations = [];

// 1500 -> "₱1,500.00"
const peso = (n) =>
  "₱" +
  Number(n).toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export default function PenaltyAssessment() {
  const [violations, setViolations] = useState(initialViolations);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  // the penalty form
  const [fine, setFine] = useState("");
  const [notes, setNotes] = useState("");

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
    setFine(v.fine_amount ? String(v.fine_amount) : "");
    setNotes(v.notes ?? "");
  };

  const handleSave = () => {
    if (fine === "" || Number(fine) < 0) {
      alert("Please enter a valid fine amount.");
      return;
    }
    setViolations((list) =>
      list.map((v) =>
        v.id === selectedId ? { ...v, fine_amount: Number(fine), notes } : v,
      ),
    );
    alert("Saved on this page only. Not connected to the database yet.");
  };

  return (
    <div className="pa-page">
      <p className="pa-crumb">
        Home <span>/</span> <b>Penalty Assessment</b>
      </p>

      <div>
        <h1 className="pa-title">Penalty Assessment</h1>
        <p className="pa-sub">
          Record fine amounts and assessment details for referred violations.
        </p>
      </div>

      <div className="pa-grid">
        {/* LEFT: FIND VIOLATION */}
        <div className="pa-card">
          <div className="pa-card-head">
            <Search size={16} />
            <p>Find Violation</p>
          </div>

          <div className="pa-card-body">
            <div className="pa-search">
              <Search size={16} />
              <input
                type="text"
                placeholder="Ticket no., plate, body, operator..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="pa-list">
              {filtered.length === 0 && (
                <p className="pa-list-empty">No violations found.</p>
              )}

              {filtered.map((v) => (
                <button
                  key={v.id}
                  className={`pa-item ${v.id === selectedId ? "selected" : ""}`}
                  onClick={() => selectViolation(v)}
                >
                  <TriangleAlert size={16} className="pa-item-icon" />
                  <div>
                    <p className="pa-item-ticket">{v.ticket_no}</p>
                    <p className="pa-item-meta">
                      {v.operator_name} · {v.violation}
                    </p>
                    {v.fine_amount > 0 && (
                      <p className="pa-item-amount">{peso(v.fine_amount)}</p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: RECORD PENALTY */}
        <div className="pa-card">
          <div className="pa-card-head">
            <Wallet size={16} />
            <p>Record Penalty</p>
          </div>

          {!selected ? (
            <div className="pa-empty">
              <div className="pa-empty-icon">
                <TriangleAlert size={26} />
              </div>
              <p className="pa-empty-title">No violation selected</p>
              <p className="pa-empty-text">
                Select a violation from the list to record its penalty.
              </p>
            </div>
          ) : (
            <div className="pa-card-body">
              {/* summary of the selected violation */}
              <div className="pa-summary">
                <div className="pa-summary-top">
                  <p className="pa-summary-ticket">
                    Ticket: {selected.ticket_no}
                  </p>
                  <span className="pa-tag">{selected.violation}</span>
                </div>

                <div className="pa-summary-grid">
                  <Info icon={User} label="OPERATOR" value={selected.operator_name} />
                  <Info
                    icon={Car}
                    label="PLATE / BODY"
                    value={`${selected.plate_no} / ${selected.body_number}`}
                  />
                  <Info icon={FileText} label="MTC NUMBER" value={selected.mtc_number} />
                  <Info
                    icon={TriangleAlert}
                    label="REPORTING OFFICER"
                    value={selected.reporting_officer}
                  />
                </div>
              </div>

              <label htmlFor="pa-fine">Fine Amount (₱)</label>
              <input
                id="pa-fine"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={fine}
                onChange={(e) => setFine(e.target.value)}
              />

              <label htmlFor="pa-notes">Assessment Details / Notes</label>
              <textarea
                id="pa-notes"
                rows={4}
                placeholder="Record assessment details for this referred TOPS ticket..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />

              <button className="pa-save" onClick={handleSave}>
                <Save size={16} />
                Save Penalty Assessment
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// One small icon + label + value in the summary box
function Info({ icon: Icon, label, value }) {
  return (
    <div className="pa-info">
      <Icon size={14} />
      <div>
        <p className="pa-info-label">{label}</p>
        <p className="pa-info-value">{value || "—"}</p>
      </div>
    </div>
  );
}
