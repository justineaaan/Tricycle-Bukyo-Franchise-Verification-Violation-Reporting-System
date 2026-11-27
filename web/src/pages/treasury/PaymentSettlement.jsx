import { useState } from "react";
import {
  Search,
  Link2,
  CircleDollarSign,
  FileText,
  User,
  Car,
  Save,
} from "lucide-react";
import "./PaymentSettlement.css";

// The list starts empty. We will load the assessed violations from the
// database once the violation and payment tables exist.
// To preview the page, paste a record like this between the brackets:
// {
//   id: 1,
//   ticket_no: "VR-2026-007",
//   operator_name: "Juan Dela Cruz",
//   franchise_no: "MTC-2023-001",
//   plate_no: "TGY-1234",
//   body_number: "1001",
//   fine_amount: 1000,
//   amount_paid: 0,
// }
const initialViolations = [];

// 1500 -> "₱1,500.00"
const peso = (n) =>
  "₱" +
  Number(n).toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

// The status is worked out from the money, so it is always correct.
const getStatus = (v) => {
  if (v.amount_paid >= v.fine_amount) return "paid";
  if (v.amount_paid > 0) return "partially paid";
  return "unpaid";
};

// Today's date as YYYY-MM-DD (what the date input needs)
const today = () => new Date().toLocaleDateString("en-CA");

export default function PaymentSettlement() {
  const [violations, setViolations] = useState(initialViolations);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  // the payment form
  const [orNumber, setOrNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(today());

  const selected = violations.find((v) => v.id === selectedId);
  const balance = selected ? selected.fine_amount - selected.amount_paid : 0;

  // Search by ticket no., plate, body, operator or franchise
  const q = search.trim().toLowerCase();
  const filtered = violations.filter((v) =>
    [
      v.ticket_no,
      v.plate_no,
      v.body_number,
      v.operator_name,
      v.franchise_no,
    ].some((value) =>
      String(value ?? "")
        .toLowerCase()
        .includes(q),
    ),
  );

  // When a violation is clicked, show it and reset the form
  const selectViolation = (v) => {
    const left = v.fine_amount - v.amount_paid;
    setSelectedId(v.id);
    setOrNumber("");
    setAmount(left > 0 ? String(left) : "");
    setDate(today());
  };

  const handleSave = () => {
    if (orNumber.trim() === "") {
      alert("OR Number is required.");
      return;
    }
    if (!(Number(amount) > 0)) {
      alert("Please enter the amount paid.");
      return;
    }
    // add this payment to what was already paid
    setViolations((list) =>
      list.map((v) =>
        v.id === selectedId
          ? { ...v, amount_paid: v.amount_paid + Number(amount) }
          : v,
      ),
    );
    setOrNumber("");
    setAmount("");
    alert("Saved on this page only. Not connected to the database yet.");
  };

  return (
    <div className="ps-page">
      <p className="ps-crumb">
        Home <span>/</span> <b>Payment Records</b>
      </p>

      <div>
        <h1 className="ps-title">Payment / Settlement Records</h1>
        <p className="ps-sub">
          Link payments to official tickets, violations, franchise profiles, and
          operators.
        </p>
      </div>

      <div className="ps-grid">
        {/* LEFT: FIND ASSESSED VIOLATION */}
        <div className="ps-card">
          <div className="ps-card-head">
            <Search size={16} />
            <p>Find Assessed Violation</p>
          </div>

          <div className="ps-card-body">
            <div className="ps-search">
              <Search size={16} />
              <input
                type="text"
                placeholder="Ticket no., plate, body, operator, OR..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="ps-list">
              {filtered.length === 0 && (
                <p className="ps-list-empty">No assessed violations found.</p>
              )}

              {filtered.map((v) => (
                <button
                  key={v.id}
                  className={`ps-item ${v.id === selectedId ? "selected" : ""}`}
                  onClick={() => selectViolation(v)}
                >
                  <CircleDollarSign size={16} className="ps-item-icon" />
                  <div>
                    <p className="ps-item-ticket">{v.ticket_no}</p>
                    <p className="ps-item-meta">{v.operator_name}</p>
                    <p className="ps-item-row">
                      <span className="ps-item-amount">
                        {peso(v.fine_amount)}
                      </span>
                      <span className="ps-dot">·</span>
                      <span className={`ps-status ${getStatus(v).replace(" ", "-")}`}>
                        {getStatus(v)}
                      </span>
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: LINK PAYMENT */}
        <div className="ps-card">
          <div className="ps-card-head">
            <Link2 size={16} />
            <p>Link Payment</p>
          </div>

          {!selected ? (
            <div className="ps-empty">
              <div className="ps-empty-icon">
                <CircleDollarSign size={26} />
              </div>
              <p className="ps-empty-title">No violation selected</p>
              <p className="ps-empty-text">
                Select an assessed violation from the list to link a payment.
              </p>
            </div>
          ) : (
            <div className="ps-card-body">
              {/* linked records */}
              <div className="ps-linked">
                <p className="ps-linked-title">
                  <Link2 size={14} />
                  LINKED RECORDS
                </p>
                <div className="ps-linked-grid">
                  <Info icon={FileText} label="OFFICIAL TICKET NO." value={selected.ticket_no} />
                  <Info icon={FileText} label="MTC / FRANCHISE" value={selected.franchise_no} />
                  <Info icon={User} label="OPERATOR" value={selected.operator_name} />
                  <Info
                    icon={Car}
                    label="PLATE / BODY"
                    value={`${selected.plate_no} / ${selected.body_number}`}
                  />
                </div>
              </div>

              {/* 3 money boxes */}
              <div className="ps-money">
                <div className="ps-box blue">
                  <p>Fine Amount</p>
                  <b>{peso(selected.fine_amount)}</b>
                </div>
                <div className="ps-box green">
                  <p>Already Paid</p>
                  <b>{peso(selected.amount_paid)}</b>
                </div>
                <div className="ps-box red">
                  <p>Balance</p>
                  <b>{peso(balance)}</b>
                </div>
              </div>

              {/* payment form */}
              <div className="ps-form">
                <div className="ps-field">
                  <label htmlFor="ps-or">OR Number *</label>
                  <input
                    id="ps-or"
                    type="text"
                    placeholder="OR-2026-0001"
                    value={orNumber}
                    onChange={(e) => setOrNumber(e.target.value)}
                  />
                </div>

                <div className="ps-field">
                  <label htmlFor="ps-amount">Amount Paid (₱)</label>
                  <input
                    id="ps-amount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>

                <div className="ps-field wide">
                  <label htmlFor="ps-date">Payment Date</label>
                  <input
                    id="ps-date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
              </div>

              <button className="ps-save" onClick={handleSave}>
                <Save size={16} />
                Link Payment Record
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// One small icon + label + value in the linked records box
function Info({ icon: Icon, label, value }) {
  return (
    <div className="ps-info">
      <Icon size={14} />
      <div>
        <p className="ps-info-label">{label}</p>
        <p className="ps-info-value">{value || "—"}</p>
      </div>
    </div>
  );
}
