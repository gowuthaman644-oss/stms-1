import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { User, Mail, KeyRound, Shield } from "lucide-react";
import { API_URL } from "../services/scheduleService";

function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "STUDENT",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.fullName.trim() || !formData.username.trim() || !formData.email.trim() || !formData.password.trim() || !formData.confirmPassword.trim()) {
      setError("Please enter all required fields.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName.trim(),
          username: formData.username.trim(),
          email: formData.email.trim(),
          password: formData.password,
          role: formData.role,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
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
      setError(err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="schedule-container" style={{ maxWidth: 500, margin: "30px auto" }}>
      <div className="page-header" style={{ textAlign: "center", display: "block" }}>
        <div style={{ fontSize: "36px", marginBottom: "8px" }}>🌿</div>
        <h2>Create an Account</h2>
        <p className="header-subtitle">
          Join the School Timetable Management System
        </p>
      </div>

      {error && <p role="alert" style={{ color: "var(--danger)", textAlign: "center" }}>{error}</p>}

      <form onSubmit={handleRegister} style={{ background: "#ffffff", padding: "30px 28px", borderRadius: "var(--radius-md)", border: "1px solid var(--sage-border)", boxShadow: "var(--shadow-sm)" }}>
        <div className="form-group">
          <label className="form-label" style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <User size={14} color="var(--sage-primary)" /> Full Name
          </label>
          <input
            type="text"
            name="fullName"
            placeholder="e.g. Eleanor Vance"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <User size={14} color="var(--sage-primary)" /> Username
          </label>
          <input
            type="text"
            name="username"
            placeholder="e.g. evance"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Mail size={14} color="var(--sage-primary)" /> Email Address
          </label>
          <input
            type="email"
            name="email"
            placeholder="e.g. e.vance@stms.edu"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <KeyRound size={14} color="var(--sage-primary)" /> Password
          </label>
          <input
            type="password"
            name="password"
            placeholder="Minimum 6 characters"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
          />
        </div>

        <div className="form-group">
          <label className="form-label" style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <KeyRound size={14} color="var(--sage-primary)" /> Confirm Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Re-enter your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            minLength={6}
          />
        </div>

        <div className="form-group">
          <label className="form-label" style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Shield size={14} color="var(--sage-primary)" /> Select Role
          </label>
          <select
            name="role"
            className="filter-select"
            style={{ width: "100%", height: "42px" }}
            value={formData.role}
            onChange={handleChange}
          >
            <option value="STUDENT">🎓 Student</option>
            <option value="TEACHER">👩‍🏫 Teacher</option>
            <option value="PARENT">👨‍👩‍👦 Parent / Guardian</option>
            <option value="ADMIN">👑 System Administrator</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{ width: "100%", marginTop: "12px", padding: "12px" }}
        >
          {loading ? "Registering..." : "Register & Generate JWT"}
        </button>

        <div style={{ textAlign: "center", marginTop: "20px", fontSize: "13px", color: "var(--text-muted)" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "var(--sage-primary)", fontWeight: "600", textDecoration: "none" }}>
            Sign In here
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Register;
