import { Link } from "react-router-dom";
import {
  Wallet,
  TrendingUp,
  CircleAlert,
  CircleDollarSign,
  CircleCheck,
  Clock,
  UserSearch,
  History,
} from "lucide-react";
import "./Dashboard.css";

// Everything starts at 0. We will load the real numbers from the
// database once the violation and payment tables exist.
const stats = {
  totalFines: 0,
  collected: 0,
  outstanding: 0,
  violations: 0,
  paid: 0,
  unpaid: 0,
  partial: 0,
};

// 1500 -> "₱1,500.00"
const peso = (n) =>
  "₱" +
  n.toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

// The 4 boxes at the top
const topCards = [
  { label: "TOTAL VIOLATION FINES", value: peso(stats.totalFines), icon: Wallet, tone: "blue" },
  { label: "COLLECTED AMOUNT", value: peso(stats.collected), icon: TrendingUp, tone: "green" },
  { label: "OUTSTANDING AMOUNT", value: peso(stats.outstanding), icon: CircleAlert, tone: "red" },
  { label: "TOTAL VIOLATIONS", value: stats.violations, icon: CircleDollarSign, tone: "teal" },
];

// Left card
const statusRows = [
  { label: "Paid", value: stats.paid, icon: CircleCheck, tone: "green" },
  { label: "Unpaid", value: stats.unpaid, icon: Clock, tone: "red" },
  { label: "Partially Paid", value: stats.partial, icon: Wallet, tone: "yellow" },
];

// Right card
const activityRows = [
  { label: "Total Fines Assessed", sub: "Across all violation reports", value: peso(stats.totalFines), icon: Wallet, tone: "blue" },
  { label: "Collected Amount", sub: "Settled fines", value: peso(stats.collected), icon: TrendingUp, tone: "green" },
  { label: "Outstanding Amount", sub: "Unsettled balance", value: peso(stats.outstanding), icon: CircleAlert, tone: "red" },
];

// Bottom card
const actions = [
  { to: "/treasury/assessment", label: "Violation Assessment", icon: UserSearch },
  { to: "/treasury/violations", label: "Violations & History", icon: History },
  { to: "/treasury/penalty", label: "Penalty Assessment", icon: CircleDollarSign },
  { to: "/treasury/payments", label: "Payment Records", icon: Wallet },
];

export default function Dashboard() {
  return (
    <div className="td-page">
      <p className="td-crumb">
        Home <span>/</span> <b>Treasury Dashboard</b>
      </p>

      <div className="td-top">
        <div>
          <h1 className="td-title">Treasury Dashboard</h1>
          <p className="td-sub">Fine settlement management and payment monitoring.</p>
        </div>
        <Link to="/treasury/assessment" className="td-btn">
          <UserSearch size={16} />
          Lookup Violation
        </Link>
      </div>

      {/* 4 TOP BOXES */}
      <div className="td-grid-4">
        {topCards.map(({ label, value, icon: Icon, tone }) => (
          <div key={label} className="td-card td-stat">
            <div>
              <p className="td-stat-label">{label}</p>
              <p className="td-stat-value">{value}</p>
            </div>
            <div className={`td-icon ${tone}`}>
              <Icon size={20} />
            </div>
          </div>
        ))}
      </div>

      {/* TWO BIG CARDS */}
      <div className="td-grid-2">
        <div className="td-card">
          <div className="td-card-head">
            <p className="td-card-title">Payment Status Breakdown</p>
            <p className="td-card-sub">Violation fine settlement status</p>
          </div>
          <div className="td-card-body">
            {statusRows.map(({ label, value, icon: Icon, tone }) => (
              <div key={label} className={`td-row ${tone}`}>
                <Icon size={18} />
                <span className="td-row-label">{label}</span>
                <span className="td-row-value">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="td-card">
          <div className="td-card-head">
            <p className="td-card-title">Payment Activity</p>
            <p className="td-card-sub">Financial summary</p>
          </div>
          <div className="td-card-body">
            {activityRows.map(({ label, sub, value, icon: Icon, tone }) => (
              <div key={label} className={`td-row big ${tone}`}>
                <Icon size={20} />
                <div className="td-row-label">
                  <p className="td-row-main">{label}</p>
                  <p className="td-row-note">{sub}</p>
                </div>
                <span className="td-row-value">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TREASURY ACTIONS */}
      <div className="td-card">
        <div className="td-card-head">
          <p className="td-card-title">Treasury Actions</p>
          <p className="td-card-sub">Quick access to settlement functions</p>
        </div>
        <div className="td-card-body td-actions">
          {actions.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to} className="td-action">
              <Icon size={20} />
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
