import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { User, KeyRound } from "lucide-react";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const redirectMessage = location.state?.message;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Invalid credentials");
      }

      // Save JWT and user session
      login(data.token, data.user);

      // Redirect according to role
      const role = (data.user.role || "").toUpperCase();
      if (role === "ADMIN" || role === "SYSTEM_ADMIN") {
        navigate("/admin");
      } else if (role === "TEACHER") {
        navigate("/teacher");
      } else if (role === "STUDENT") {
        navigate("/student");
      } else if (role === "PARENT") {
        navigate("/parent");
      } else {
        navigate("/view-schedule");
      }
    } catch (err) {
      setError(err.message || "Login failed. Please verify credentials.");
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (u, p) => {
    setUsername(u);
    setPassword(p);
  };

  return (
    <div className="schedule-container" style={{ maxWidth: 480, margin: "40px auto" }}>
      <div className="page-header" style={{ textAlign: "center", display: "block" }}>
        <div style={{ fontSize: "36px", marginBottom: "8px" }}>🌿</div>
        <h2>Sign In to STMS</h2>
        <p className="header-subtitle">
          Secure JWT Authentication & Role-Based Access Control
        </p>
      </div>

      {redirectMessage && (
        <div
          style={{
            background: "var(--sage-subtle)",
            border: "1px solid var(--sage-border)",
            borderRadius: "var(--radius-sm)",
            padding: "10px 14px",
            marginBottom: "16px",
            fontSize: "13px",
            color: "var(--text-dark)",
            textAlign: "center",
          }}
        >
          🔒 {redirectMessage}
        </div>
      )}

      {error && <p role="alert" style={{ color: "var(--danger)", textAlign: "center" }}>{error}</p>}

      <form onSubmit={handleLogin} style={{ background: "#ffffff", padding: "30px 28px", borderRadius: "var(--radius-md)", border: "1px solid var(--sage-border)", boxShadow: "var(--shadow-sm)" }}>
        <div className="form-group">
          <label className="form-label" style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <User size={14} color="var(--sage-primary)" /> Username
          </label>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <KeyRound size={14} color="var(--sage-primary)" /> Password
          </label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{ width: "100%", marginTop: "12px", padding: "12px" }}
        >
          {loading ? "Authenticating..." : "Sign In with JWT"}
        </button>

        {/* Demo One-Click Fill */}
        <div style={{ marginTop: "24px", paddingTop: "16px", borderTop: "1px solid var(--sage-border)" }}>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "8px", fontWeight: "600", textTransform: "uppercase" }}>
            Quick Demo Accounts (Click to test):
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            <span className="chip" onClick={() => fillDemo("admin", "admin123")}>
              👑 Admin
            </span>
            <span className="chip" onClick={() => fillDemo("teacher", "teacher123")}>
              👩‍🏫 Teacher
            </span>
            <span className="chip" onClick={() => fillDemo("student", "student123")}>
              🎓 Student
            </span>
            <span className="chip" onClick={() => fillDemo("parent", "parent123")}>
              👨‍👩‍👦 Parent
            </span>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: "20px", fontSize: "13px", color: "var(--text-muted)" }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "var(--sage-primary)", fontWeight: "600", textDecoration: "none" }}>
            Register here
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Login;
