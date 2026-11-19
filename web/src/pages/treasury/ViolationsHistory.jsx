import { useState } from "react";
import { Search, Funnel, Calendar } from "lucide-react";
import "./ViolationsHistory.css";

const STATUSES = ["Paid", "Unpaid", "Partially Paid"];

// The list starts empty. We will load real violations from the database
// once the violation table exists.
// To preview the page, paste records like this between the brackets:
// {
//   id: 1,
//   ticket_no: "TOPS-20261116-5CK",
//   date: "2026-11-15",
//   operator_name: "Juan Dela Cruz",
//   plate_no: "TGY-1234",
//   body_number: "1001",
//   violation: "Out of Zone",
//   fine_amount: 1000,
//   status: "Unpaid",
// }
const violations = [];

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

export default function ViolationsHistory() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Keep a record only if it matches BOTH the search and the status
  const q = search.trim().toLowerCase();
  const filtered = violations.filter((v) => {
    const matchesSearch = [
      v.ticket_no,
      v.plate_no,
      v.body_number,
      v.operator_name,
    ].some((value) =>
      String(value ?? "")
        .toLowerCase()
        .includes(q),
    );
    const matchesStatus = statusFilter === "" || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="vh-page">
      <p className="vh-crumb">
        Home <span>/</span> <b>Violations &amp; History</b>
      </p>

      <div>
        <h1 className="vh-title">Violations &amp; History</h1>
        <p className="vh-sub">
          Complete violation records and their settlement history.
        </p>
      </div>

      {/* SEARCH + STATUS FILTER */}
      <div className="vh-card vh-filters">
        <div className="vh-field">
          <label htmlFor="vh-search">SEARCH</label>
          <div className="vh-search">
            <Search size={16} />
            <input
              id="vh-search"
              type="text"
              placeholder="Ticket no., plate, body, operator..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="vh-field">
          <label htmlFor="vh-status">STATUS</label>
          <select
            id="vh-status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="vh-card">
        <div className="vh-count">
          <Funnel size={14} />
          <span>{filtered.length} RECORD(S)</span>
        </div>

        <div className="vh-table-wrap">
          <table className="vh-table">
            <thead>
              <tr>
                <th>TICKET NO.</th>
                <th>DATE</th>
                <th>OPERATOR</th>
                <th>PLATE / BODY</th>
                <th>VIOLATION</th>
                <th>FINE AMOUNT</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="vh-empty">
                    No records found.
                  </td>
                </tr>
              )}

              {filtered.map((v) => (
                <tr key={v.id}>
                  <td className="vh-ticket">{v.ticket_no}</td>
                  <td className="vh-muted">
                    <span className="vh-date">
                      <Calendar size={13} />
                      {v.date}
                    </span>
                  </td>
                  <td>{v.operator_name}</td>
                  <td className="vh-muted">
                    {v.plate_no} / {v.body_number}
                  </td>
                  <td>{v.violation}</td>
                  <td className="vh-amount">{peso(v.fine_amount)}</td>
                  <td>
                    <span className={`vh-badge ${badgeClass(v.status)}`}>
                      {v.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
