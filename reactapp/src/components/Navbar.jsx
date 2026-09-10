import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home as HomeIcon,
  Calendar,
  PlusCircle,
  Building2,
  ShieldCheck,
  GraduationCap,
  BookOpen,
  Users,
  LogOut,
  LogIn,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, role, logout, isAuthenticated } = useAuth();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isStaff = role === "SYSTEM_ADMIN" || role === "ADMIN" || role === "TEACHER";

  return (
    <header className="navbar-wrapper">
      <nav className="navbar-container">
        {/* Brand */}
        <Link to="/" className="navbar-brand">
          <span className="brand-leaf">🌿</span>
          <div className="brand-text">
            <span className="brand-title">STMS</span>
            <span className="brand-subtitle">School Timetables</span>
          </div>
        </Link>

        {/* Primary Navigation Links */}
        <div className="navbar-links">
          <Link
            to="/"
            className={`nav-link ${isActive("/") ? "active" : ""}`}
          >
            <HomeIcon size={14} />
            <span>Home</span>
          </Link>

          {isAuthenticated && (
            <Link
              to="/view-schedule"
              className={`nav-link ${isActive("/view-schedule") ? "active" : ""}`}
            >
              <Calendar size={14} />
              <span>Timetable</span>
            </Link>
          )}

          {/* Admin Role Links */}
          {isAuthenticated && (role === "SYSTEM_ADMIN" || role === "ADMIN") && (
            <>
              <Link
                to="/admin"
                className={`nav-link ${isActive("/admin") ? "active" : ""}`}
              >
                <ShieldCheck size={14} />
                <span>Admin Hub</span>
              </Link>
              <Link
                to="/resources"
                className={`nav-link ${isActive("/resources") ? "active" : ""}`}
              >
                <Building2 size={14} />
                <span>Rooms</span>
              </Link>
              <Link
                to="/calendar"
                className={`nav-link ${isActive("/calendar") ? "active" : ""}`}
              >
                <Calendar size={14} />
                <span>Calendar</span>
              </Link>
            </>
          )}

          {/* Teacher Role Links */}
          {isAuthenticated && role === "TEACHER" && (
            <>
              <Link
                to="/teacher"
                className={`nav-link ${isActive("/teacher") ? "active" : ""}`}
              >
                <GraduationCap size={14} />
                <span>My Teaching</span>
              </Link>
              <Link
                to="/resources"
                className={`nav-link ${isActive("/resources") ? "active" : ""}`}
              >
                <Building2 size={14} />
                <span>Rooms</span>
              </Link>
              <Link
                to="/calendar"
                className={`nav-link ${isActive("/calendar") ? "active" : ""}`}
              >
                <Calendar size={14} />
                <span>Calendar</span>
              </Link>
            </>
          )}

          {/* Student Role Links */}
          {isAuthenticated && role === "STUDENT" && (
            <>
              <Link
                to="/student"
                className={`nav-link ${isActive("/student") ? "active" : ""}`}
              >
                <BookOpen size={14} />
                <span>My Schedule</span>
              </Link>
              <Link
                to="/calendar"
                className={`nav-link ${isActive("/calendar") ? "active" : ""}`}
              >
                <Calendar size={14} />
                <span>Calendar</span>
              </Link>
            </>
          )}

          {/* Parent Role Links */}
          {isAuthenticated && role === "PARENT" && (
            <>
              <Link
                to="/parent"
                className={`nav-link ${isActive("/parent") ? "active" : ""}`}
              >
                <Users size={14} />
                <span>Child Portal</span>
              </Link>
              <Link
                to="/calendar"
                className={`nav-link ${isActive("/calendar") ? "active" : ""}`}
              >
                <Calendar size={14} />
                <span>Calendar</span>
              </Link>
            </>
          )}

          {/* Add Schedule Button (Only for Staff: Admin & Teacher) */}
          {isAuthenticated && isStaff && (
            <Link
              to="/add-schedule"
              className={`nav-link nav-link-btn ${
                isActive("/add-schedule") ? "active" : ""
              }`}
            >
              <PlusCircle size={14} />
              <span>+ Entry</span>
            </Link>
          )}
        </div>

        {/* Right Auth User Chip / Sign In Buttons */}
        <div className="role-switcher-widget">
          {isAuthenticated && currentUser ? (
            <>
              <div className="role-user-badge">
                <span className="role-avatar">{currentUser.avatar || "👤"}</span>
                <div className="role-details">
                  <span className="user-name">{currentUser.fullName}</span>
                  <span className="user-role-label">
                    🔒 {currentUser.role} {currentUser.className ? `• ${currentUser.className}` : ""}
                  </span>
                </div>
              </div>

              <span className="role-divider"></span>

              <button
                type="button"
                onClick={handleLogout}
                className="logout-btn"
                title="Sign Out (clears JWT)"
              >
                <LogOut size={13} />
                <span style={{ fontSize: "11px", fontWeight: "600", marginLeft: "4px" }}>Logout</span>
              </button>
            </>
          ) : (
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <Link
                to="/login"
                className="nav-link"
                style={{
                  padding: "5px 14px",
                  fontSize: "12px",
                  fontWeight: "600",
                  borderRadius: "6px",
                  border: "1px solid var(--sage-border)",
                  background: "#ffffff",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <LogIn size={13} />
                <span>Sign In</span>
              </Link>
              <Link
                to="/register"
                className="nav-link"
                style={{
                  padding: "5px 14px",
                  fontSize: "12px",
                  fontWeight: "600",
                  borderRadius: "6px",
                  background: "var(--sage-primary)",
                  color: "#ffffff",
                }}
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
