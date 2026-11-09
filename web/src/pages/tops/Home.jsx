import { Link } from "react-router-dom";
import {
  ScanLine,
  TriangleAlert,
  ClipboardList,
  History,
  ChevronRight,
} from "lucide-react";
import "./Home.css";

const actions = [
  {
    to: "/tops/verify",
    title: "Verify Franchise",
    text: "Search or scan a unit's QR code",
    icon: ScanLine,
    primary: true,
  },
  {
    to: "/tops/report",
    title: "Report Violation",
    text: "Record a field violation",
    icon: TriangleAlert,
  },
  {
    to: "/tops/history?tab=verifications",
    title: "Verification History",
    text: "Past field verifications",
    icon: ClipboardList,
  },
  {
    to: "/tops/history?tab=reports",
    title: "Violation Report History",
    text: "Reports submitted from the field",
    icon: History,
  },
  //   {
  //     to: "/tops/account",
  //     title: "Account / Profile",
  //     text: "Your officer account",
  //     icon: CircleUser,
  //   },
];

// These start at 0. We will load the real numbers from the
// database once the violation and verification tables exist.
const stats = { reports: 0, verifications: 0 };

export default function Home() {
  return (
    <div>
      <div className="th-welcome">
        <p className="th-label">WELCOME</p>
        <h1 className="th-name">TOPS Field Officer</h1>
        <p className="th-text">
          Tagaytay Office of Public Safety — field verification and violation
          reporting.
        </p>

        <div className="th-stats">
          <div className="th-stat">
            <p className="th-num">{stats.reports}</p>
            <p className="th-stat-label">Violation reports</p>
          </div>
          <div className="th-stat">
            <p className="th-num">{stats.verifications}</p>
            <p className="th-stat-label">Field verifications</p>
          </div>
        </div>
      </div>

      <div className="th-list">
        {actions.map(({ to, title, text, icon: Icon, primary }) => (
          <Link
            key={title}
            to={to}
            className={`th-card ${primary ? "primary" : ""}`}
          >
            <div className="th-icon">
              <Icon size={24} />
            </div>
            <div className="th-card-text">
              <p className="th-card-title">{title}</p>
              <p className="th-card-sub">{text}</p>
            </div>
            <ChevronRight size={20} className="th-chevron" />
          </Link>
        ))}
      </div>
    </div>
  );
}
