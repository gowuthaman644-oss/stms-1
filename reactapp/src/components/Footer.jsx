import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Footer.css";

function Footer() {
  const { isAuthenticated, currentUser } = useAuth();

  const getDashboardPath = () => {
    if (!currentUser) return "/login";
    const role = (currentUser.role || "").toUpperCase();
    if (role === "TEACHER") return "/teacher";
    if (role === "STUDENT") return "/student";
    if (role === "PARENT") return "/parent";
    return "/admin";
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <span className="footer-leaf">🌿</span>
          <span className="footer-brand-name">STMS</span>
        </div>
        <p className="footer-title">School Timetable Management System</p>
        <p className="footer-tagline">Simple. Secure. Organized.</p>

        <div className="footer-links">
          <Link to="/" className="footer-link">Home</Link>
          {isAuthenticated ? (
            <Link to={getDashboardPath()} className="footer-link">Dashboard</Link>
          ) : (
            <>
              <Link to="/login" className="footer-link">Sign In</Link>
              <Link to="/register" className="footer-link">Register</Link>
            </>
          )}
        </div>

        <p className="footer-copy">
          © 2026 STMS • Academic Project Review & Scheduling Platform
        </p>
      </div>
    </footer>
  );
}

export default Footer;