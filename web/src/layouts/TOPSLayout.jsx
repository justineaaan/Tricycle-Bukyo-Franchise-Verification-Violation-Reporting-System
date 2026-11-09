import { NavLink, Outlet } from "react-router-dom";
import {
  House,
  ScanLine,
  FileWarning,
  History,
  CircleUser,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import "./TOPSLayout.css";

const tabs = [
  { to: "/tops/home", label: "Home", icon: House },
  { to: "/tops/verify", label: "Verify", icon: ScanLine },
  { to: "/tops/report", label: "Report", icon: FileWarning },
  { to: "/tops/history", label: "History", icon: History },
  { to: "/tops/account", label: "Account", icon: CircleUser },
];

export default function TOPSLayout() {
  return (
    <div className="tops-shell">
      <div className="tops-layout">
        <header className="tops-header">
          <div className="tops-header-left">
            <div className="tops-logo">
              <ShieldCheck size={22} />
            </div>
            <div>
              <p className="tops-title">Tagaytay City</p>
              <p className="tops-sub">TOPS Field Officer</p>
            </div>
          </div>
          <button className="tops-logout" title="Log out">
            <LogOut size={20} />
          </button>
        </header>

        <main className="tops-content">
          <Outlet />
        </main>

        <nav className="tops-nav">
          {tabs.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `tops-tab ${isActive ? "active" : ""}`
              }
            >
              <Icon size={22} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}
