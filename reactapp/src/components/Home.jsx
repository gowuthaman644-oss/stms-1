import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Home.css";

function Home() {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();

  const getDashboardPath = () => {
    if (!currentUser) return "/login";
    const role = (currentUser.role || "").toUpperCase();
    if (role === "TEACHER") return "/teacher";
    if (role === "STUDENT") return "/student";
    if (role === "PARENT") return "/parent";
    return "/admin";
  };

  return (
    <div className="home-container">
      <div className="home-hero">
        <div className="home-badge">
          <span className="badge-dot"></span>
          <span>Sage + Cream Aesthetic • Timetable Management</span>
        </div>

        <div className="home-icon">🌿</div>

        <h1>School Timetable & Attendance System</h1>

        <p className="hero-desc">
          Calm, minimal & naturally aesthetic schedule coordination. Manage class
          timetables, teacher allocations, and attendance records in one peaceful workspace.
        </p>

        <div className="home-buttons">
          <button
            className="primary-button"
            onClick={() => navigate("/view-schedule")}
          >
            View Schedule
          </button>

          <button
            className="secondary-button"
            onClick={() => navigate("/add-schedule")}
          >
            Add Schedule
          </button>

          {isAuthenticated ? (
            <button
              className="secondary-button"
              onClick={() => navigate(getDashboardPath())}
              style={{ background: "var(--sage-primary)", color: "#ffffff", borderColor: "var(--sage-primary)" }}
            >
              Go to Dashboard &rarr;
            </button>
          ) : (
            <button
              className="secondary-button"
              onClick={() => navigate("/login")}
            >
              Sign In (JWT)
            </button>
          )}
        </div>
      </div>

      <div className="home-features-grid">
        <div className="feature-card" onClick={() => navigate("/view-schedule")}>
          <div className="feature-icon">🗓️</div>
          <h3>Weekly Grid & Table</h3>
          <p>
            Switch dynamically between structured list tables and an interactive day-by-day weekly timetable matrix.
          </p>
          <span className="feature-link">Explore Timetables &rarr;</span>
        </div>

        <div className="feature-card" onClick={() => navigate("/add-schedule")}>
          <div className="feature-icon">📝</div>
          <h3>Attendance Tracking</h3>
          <p>
            Record session attendance notes, special lectures, labs, and substitution reminders with color-coded tags.
          </p>
          <span className="feature-link">Create Schedule Entry &rarr;</span>
        </div>

        <div
          className="feature-card"
          onClick={() => navigate(isAuthenticated ? getDashboardPath() : "/login")}
        >
          <div className="feature-icon">🔐</div>
          <h3>JWT Auth & Role Portals</h3>
          <p>
            Secure multi-role authentication with dedicated portals for Administrators, Teachers, Students, and Parents.
          </p>
          <span className="feature-link">
            {isAuthenticated ? "Access Your Dashboard \u2192" : "Sign In to Access Dashboard \u2192"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Home;