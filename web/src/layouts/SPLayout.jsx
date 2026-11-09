import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  FolderOpen,
  ClipboardCheck,
  Printer,
  LogOut,
  Menu,
  Car,
} from "lucide-react";
import "./SPLayout.css";

const menuItems = [
  { to: "/sp/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/sp/franchises", label: "Franchise Records", icon: FolderOpen },
  {
    to: "/sp/evaluations",
    label: "Violation Evaluation",
    icon: ClipboardCheck,
  },
  { to: "/sp/reports", label: "Reports", icon: Printer },
];

export default function SPLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="sp-layout">
      <aside className={`sp-sidebar ${open ? "open" : ""}`}>
        <div className="sp-brand">
          <div className="sp-brand-icon">
            <Car size={22} />
          </div>
          <div>
            <p className="sp-brand-name">Tagaytay City</p>
            <p className="sp-brand-sub">SP Personnel</p>
          </div>
        </div>

        <nav className="sp-nav">
          {menuItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `sp-link ${isActive ? "active" : ""}`
              }
            >
              <Icon size={20} />
              {label}
            </NavLink>
          ))}
        </nav>

        <button className="sp-logout">
          <LogOut size={20} />
          Log out
        </button>
      </aside>

      <div className="sp-main">
        <header className="sp-topbar">
          <button className="sp-menu-btn" onClick={() => setOpen(!open)}>
            <Menu size={24} />
          </button>
          <div className="sp-user">
            <div className="sp-avatar">SP</div>
            <div>
              <p className="sp-user-name">SP Personnel</p>
              <p className="sp-user-role">Sangguniang Panlungsod</p>
            </div>
          </div>
        </header>

        <main className="sp-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
