import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  Car,
  LayoutDashboard,
  Search,
  History,
  CircleDollarSign,
  Wallet,
  CircleUser,
  Lock,
  Info,
  ChevronDown,
  LogOut,
  Menu,
} from "lucide-react";
import "./TreasuryLayout.css";

const dashboardLink = {
  to: "/treasury/dashboard",
  label: "Dashboard",
  icon: LayoutDashboard,
};

const assessmentLinks = [
  { to: "/treasury/assessment", label: "Violation Assessment", icon: Search },
  { to: "/treasury/violations", label: "Violations & History", icon: History },
  {
    to: "/treasury/penalty",
    label: "Penalty Assessment",
    icon: CircleDollarSign,
  },
  { to: "/treasury/payments", label: "Payment / Settlement", icon: Wallet },
];

const bottomLinks = [
  { to: "/treasury/account", label: "Account / Profile", icon: CircleUser },
  { to: "/treasury/password", label: "Change Password", icon: Lock },
  { to: "/treasury/about", label: "About", icon: Info },
];

// One sidebar link. We use it for every link so we don't repeat code.
function SideLink({ to, label, icon: Icon, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) => `tr-link ${isActive ? "active" : ""}`}
    >
      <Icon size={18} />
      {label}
    </NavLink>
  );
}

// Sample account details shown in the dropdown. Replace with the
// logged-in user once login is connected.
const user = {
  name: "Treasury Personnel",
  email: "treasury@tagaytayfranchise.demo",
};

export default function TreasuryLayout() {
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const close = () => setOpen(false);
  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    closeMenu();
    navigate("/login");
  };

  return (
    <div className="tr-layout">
      {/* TOP BAR */}
      <header className="tr-topbar">
        <div className="tr-topbar-left">
          <button className="tr-menu-btn" onClick={() => setOpen(!open)}>
            <Menu size={24} />
          </button>
          <div className="tr-brand-icon">
            <Car size={20} />
          </div>
          <div>
            <p className="tr-brand-name">Tagaytay City</p>
            <p className="tr-brand-sub">Treasury Office</p>
          </div>
        </div>

        <div className="tr-topbar-right">
          <NavLink to="/treasury/about" className="tr-about">
            <Info size={16} />
            About
          </NavLink>
          <div className="tr-user-wrap">
            <button className="tr-user" onClick={() => setMenuOpen(!menuOpen)}>
              <div className="tr-avatar">T</div>
              <div className="tr-user-text">
                <p className="tr-user-name">{user.name}</p>
                <p className="tr-user-role">Treasury Personnel</p>
              </div>
              <ChevronDown size={16} />
            </button>

            {menuOpen && (
              <>
                <div className="tr-backdrop" onClick={closeMenu} />
                <div className="tr-menu">
                  <div className="tr-menu-head">
                    <p className="tr-menu-name">{user.name}</p>
                    <p className="tr-menu-email">{user.email}</p>
                  </div>
                  <Link
                    to="/treasury/account"
                    className="tr-menu-item"
                    onClick={closeMenu}
                  >
                    <CircleUser size={16} />
                    Account / Profile
                  </Link>
                  <Link
                    to="/treasury/password"
                    className="tr-menu-item"
                    onClick={closeMenu}
                  >
                    <Lock size={16} />
                    Change Password
                  </Link>
                  <button
                    className="tr-menu-item logout"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="tr-body">
        {/* SIDEBAR */}
        <aside className={`tr-sidebar ${open ? "open" : ""}`}>
          <div className="tr-office">
            <Wallet size={14} className="tr-office-icon" />
            <div>
              <p className="tr-office-name">Treasury Office</p>
              <p className="tr-office-sub">
                Provisional module — pending Treasury interview
              </p>
            </div>
          </div>

          <nav className="tr-nav">
            <SideLink {...dashboardLink} onClick={close} />

            <p className="tr-section">VIOLATION ASSESSMENT</p>
            {assessmentLinks.map((link) => (
              <SideLink key={link.to} {...link} onClick={close} />
            ))}
          </nav>

          <div className="tr-bottom">
            {bottomLinks.map((link) => (
              <SideLink key={link.to} {...link} onClick={close} />
            ))}
          </div>
        </aside>

        {/* PAGE CONTENT */}
        <main className="tr-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
